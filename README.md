# FoundryHQ

React 18 / Vite frontend with a local Express chat API. Node 24 and npm 11 were used for validation.

## Local development

```sh
npm ci
npm run check
```

Configure `OPENAI_API_KEY` (server only) and a strong `LOCAL_API_PASSWORD` in the process environment or an ignored `.env`. Never put provider credentials in a `VITE_` variable: those values are bundled into browser code. No live credentials are required for tests.

Run `npm start` in the repository root for the API (bound to 127.0.0.1:3000), and `npm run dev -- --host 127.0.0.1 --port 5173 --strictPort` in another terminal. Vite forwards `/api` to the local API. In your browser, open `/api/health` on the Vite development origin and sign in using HTTP Basic username `foundry` and your `LOCAL_API_PASSWORD`, then return to `/` for chat. The browser reuses these credentials for same-origin chat requests. Keep both servers on loopback; Basic authentication over local HTTP is strictly for local development.

`npm test` runs mocked API integration tests, client request tests and safe-rendering tests. `npm run build` builds the frontend. `npm run check` runs both. Tests never call OpenAI or deployment services.

## Security boundaries and remaining verification

Chat sends conversation messages to `/api/talk`; only the server adds provider credentials and the system prompt. The local API requires authentication, limits input and provider response tokens, uses a provider timeout, rejects foreign browser origins and returns generic provider errors. Chat and canvas display plain text. Logo generation and executable HTML previews are temporarily disabled until secure rendering exists.

The serverless `api/talk.js` and `api/deploy.js` endpoints fail closed. Public hosting needs proper user/project authentication, authorization, rate limiting and HTTPS before AI/deployment access can be enabled. This PR does not establish production readiness. Other legacy routers are not mounted by the supported local server; do not expose them independently.

`VERCEL_TOKEN` is required only for the manually invoked `node deploy.js` helper. There is no token fallback. The old `VERCEL_DEPLOY_HOOK_URL` mechanism is disabled and no hook value belongs in source. Setup, build and tests do not deploy. Owner approval is required before any manual deployment.

**Owner action:** revoke/rotate the previously embedded deployment token and deployment hook, and any real OpenAI key ever exposed via a frontend build. Removing source values does not revoke credentials or remove them from Git history. Review historical exposure separately; do not paste credentials into issues or PRs.

Manual live-service verification remains outstanding: real authenticated chat/model access and the browser's Basic-auth sign-in flow with the owner's environment. No live AI generation or deployment was performed. Login/database and unrelated onboarding defects are outside this security PR.
