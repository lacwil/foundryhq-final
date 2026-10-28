const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

test('chat renderer escapes hostile user/AI HTML and preserves text', async () => {
  const { createServer } = await import('vite');
  const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const { ChatText } = await vite.ssrLoadModule('/src/components/ChatText.jsx');
    const hostile = '<img src=x onerror=alert(1)><script>alert(1)</script>\nBusiness idea';
    const html = renderToStaticMarkup(React.createElement(ChatText, { text: hostile }));
    assert.ok(html.includes('&lt;img'));
    assert.ok(html.includes('&lt;script&gt;'));
    assert.ok(html.includes('\nBusiness idea'));
    assert.doesNotMatch(html, /<img|<script/);
    const { default: App } = await vite.ssrLoadModule('/src/App.jsx');
    const page = renderToStaticMarkup(React.createElement(App));
    assert.match(page, /Ask FoundryBot/);
    assert.match(page, /Canvas Output/);
  } finally { await vite.close(); }
});
test('browser helper calls same-origin API and handles errors without exposing provider details', async () => {
  const { createServer } = await import('vite');
  const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  const original = global.fetch;
  try {
    const { askFoundryBot } = await vite.ssrLoadModule('/src/utils/openai.js');
    global.fetch = async (url, options) => {
      assert.equal(url, '/api/talk');
      assert.deepEqual(JSON.parse(options.body), { messages: [{ role: 'user', content: 'hello' }] });
      assert.equal(options.headers.Authorization, undefined);
      return { ok: true, json: async () => ({ message: 'Hello founder' }) };
    };
    assert.equal(await askFoundryBot('hello'), 'Hello founder');
    global.fetch = async () => ({ ok: false, json: async () => ({ error: 'sensitive upstream error' }) });
    await assert.rejects(askFoundryBot('hello'), /local API/);
  } finally { global.fetch = original; await vite.close(); }
});
test('client sources have no provider keys, direct provider calls or HTML injection sinks', () => {
  function check(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) check(file);
      else if (/\.(jsx?|tsx?)$/.test(file)) {
        assert.doesNotMatch(fs.readFileSync(file, 'utf8'), /VITE_OPENAI|api\.openai\.com|dangerouslySetInnerHTML|\.innerHTML\s*=/, file);
      }
    }
  }
  check('src');
});
test('public AI and deploy handlers fail closed without triggering services', async () => {
  const { createServer } = await import('vite');
  const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    for (const file of ['/api/talk.js', '/api/deploy.js']) {
      const { default: handler } = await vite.ssrLoadModule(file);
      let status, body;
      handler({ method: 'POST', body: {} }, {
        status(value) { status = value; return this; },
        json(value) { body = value; return this; },
      });
      assert.equal(status, 503);
      assert.match(body.error, /disabled/);
    }
  } finally { await vite.close(); }
});
test('manual deployment requires an environment token and never logs CLI secrets', () => {
  const vm = require('node:vm');
  const source = fs.readFileSync('deploy.js', 'utf8');
  for (const token of [undefined, 'mock-token-with-shell-characters;$(no)']) {
    let called = false;
    const logs = [];
    const fakeProcess = { env: { VERCEL_TOKEN: token } };
    vm.runInNewContext(source, {
      process: fakeProcess,
      console: { log: msg => logs.push(msg), error: msg => logs.push(msg) },
      require(name) {
        if (name === 'dotenv') return { config() {} };
        assert.equal(name, 'node:child_process');
        return { execFile(command, args, callback) {
          called = true;
          assert.equal(command, 'vercel');
          assert.equal(args[1], token);
          callback(new Error(`CLI failure containing ${token}`));
        } };
      },
    });
    assert.equal(called, Boolean(token));
    assert.equal(fakeProcess.exitCode, 1);
    if (token) assert.ok(logs.every(msg => !msg.includes(token)));
  }
  assert.doesNotMatch(source, /process\.env\.VERCEL_TOKEN\s*\|\|/);
  assert.doesNotMatch(fs.readFileSync('api/deploy.js', 'utf8'), /https:\/\/api\.vercel\.com\/.*integrations\/deploy/);
});
