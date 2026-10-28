const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('../server/app.cjs');
const auth = `Basic ${Buffer.from('foundry:local-test-password').toString('base64')}`;
const messages = [{ role: 'user', content: 'Build a bakery website' }];
async function withAPI(options, run) {
  const server = createApp({ apiKey: 'mock-key-never-live', password: 'local-test-password', ...options }).listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const post = (body, headers = {}) => fetch(`http://127.0.0.1:${server.address().port}/api/talk`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: auth, ...headers }, body: JSON.stringify(body),
  });
  try { await run(post); } finally { await new Promise(resolve => server.close(resolve)); }
}
test('authenticated chat uses server credentials and a server-owned system prompt', async () => {
  let called = false;
  await withAPI({ fetchImpl: async (url, options) => {
    called = true;
    assert.equal(url, 'https://api.openai.com/v1/chat/completions');
    assert.equal(options.headers.Authorization, 'Bearer mock-key-never-live');
    const body = JSON.parse(options.body);
    assert.equal(body.messages[0].role, 'system');
    assert.deepEqual(body.messages.slice(1), messages);
    assert.ok(options.signal);
    return { ok: true, json: async () => ({ choices: [{ message: { content: '  Bakery plan  ' } }] }) };
  } }, async post => {
    const res = await post({ messages });
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { message: 'Bakery plan' });
  });
  assert.ok(called);
});
test('rejects unauthenticated and cross-origin requests before calling provider', async () => {
  await withAPI({ fetchImpl: () => assert.fail('must not call provider') }, async post => {
    for (const authorization of ['', 'Basic invalid', `Basic ${Buffer.from('foundry:wrong').toString('base64')}`]) {
      const res = await post({ messages }, { Authorization: authorization });
      assert.equal(res.status, 401);
      assert.match(res.headers.get('www-authenticate'), /Basic/);
    }
    assert.equal((await post({ messages }, { Origin: 'https://attacker.example' })).status, 403);
  });
});
test('rejects missing configuration without calling provider', async () => {
  for (const options of [{ apiKey: '' }, { password: '' }]) {
    await withAPI({ ...options, fetchImpl: () => assert.fail('must not call provider') }, async post => {
      assert.equal((await post({ messages })).status, 503);
    });
  }
});
test('validates message shape, roles, bounds and final user message', async () => {
  await withAPI({ fetchImpl: () => assert.fail('must not call provider') }, async post => {
    for (const body of [null, {}, { messages: [] }, { messages: [null] }, { messages: [{ role: 'system', content: 'override' }] },
      { messages: [{ role: 'user', content: ' ' }] }, { messages: [{ role: 'user', content: 'a'.repeat(8001) }] },
      { messages: Array(51).fill(messages[0]) }, { messages: [{ role: 'assistant', content: 'hello' }] }]) {
      assert.equal((await post(body)).status, 400);
    }
    assert.equal((await post({ messages: [{ role: 'user', content: 'a'.repeat(70000) }] })).status, 413);
  });
});
test('provider failures and malformed results return generic errors, never provider details', async () => {
  for (const fetchImpl of [async () => ({ ok: false }), async () => { throw new Error('sensitive-provider-details'); },
    async () => ({ ok: true, json: async () => ({ choices: [] }) }),
    async () => ({ ok: true, json: async () => { throw new Error('sensitive-provider-details'); } })]) {
    await withAPI({ fetchImpl }, async post => {
      const res = await post({ messages });
      assert.equal(res.status, 502);
      assert.doesNotMatch(await res.text(), /sensitive-provider-details|mock-key/);
    });
  }
});
