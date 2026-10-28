# FoundryHQ — Initial Code Audit (29 October 2026)

Scope: GitHub `main` static source inspection only. No runtime execution, production deployment, database inspection or live integration verification. Findings below distinguish **observed code** from **unverified functionality**.

## Summary
**Status: prototype, not launch ready.** Preserve existing business ideas, chat UI, branding and onboarding code; do not assume any existing endpoint works in production.

## Architecture
- Actual frontend: React 18, Vite 5, JavaScript JSX. The stated Next.js/TypeScript/Supabase/Stripe architecture is **not implemented on main** (see `package.json`).
- Multiple competing server patterns: `api/*.js` Express routers and a serverless-style handler; `server/*.js` Express; `server.cjs` with ESM imports and a missing `./routes/auth.js` reference. No clear unified entrypoint.
- `src/App.jsx` is the active entrypoint via `src/main.jsx`; other components and pages may be unused.
- `src/pages/Dashboard.jsx` and `src/pages/Homepage.jsx` are placeholders; `src/pages/FoundryBuilder.jsx` appears incomplete.
- README remains the Vite starter template. No GitHub Actions runs were returned during audit.

## Security — address before any public deployment
1. **Potential exposed AI key**: `src/App.jsx` and `src/utils/openai.js` use `import.meta.env.VITE_OPENAI_API_KEY`. Vite's VITE_ values are client-exposed. Remove browser AI calls, use authenticated server-side proxy, and rotate any real key ever configured here.
2. **Hardcoded Vercel token fallback** in `deploy.js` and **deploy-hook URL** in `api/deploy.js`. Treat both as compromised until revoked/rotated; remove from code/history as appropriate. Do not reproduce secrets in PRs or logs.
3. **Unsafe HTML rendering**: `src/App.jsx` renders AI/user-derived strings using `dangerouslySetInnerHTML`; sanitize or render as safe text/controlled components.
4. **Shared customer session**: `server/ask.js` uses one global mutable `session` object. This risks cross-customer data leakage. Replace with authenticated per-user/per-project persistent state.
5. **No verified authentication/authorization**: login/register components POST to `/login` and `/register`, but `server.cjs` references a missing routes module. Establish secure auth, project ownership, and row-level access policies.
6. **Repository is public**. Review access and historical secrets. Changing visibility alone does not revoke leaked credentials.

## Functional issues and incomplete work
- `src/components/promptFlow.jsx` expects `type`/`prompt`/conditional structures, but `src/data/promptFlow.js` exports a named array of `message`/`next` nodes; component imports a default export. It also mutates the shared array with `splice`.
- `src/components/FoundryBotCanvas.jsx` imports `./PromptFlow`, but tracked filename is `promptFlow.jsx`; case-sensitive systems may fail.
- `src/components/ChatCanvas.jsx` calls localhost with `{prompt}`, whereas `api/generate.js` expects `{messages}` and returns `{reply,canvas}`, not `result`.
- `src/App.jsx` logo generation uses localhost:3001, unsuitable for deployed browsers.
- `src/utils/openai.js` uses older SDK constructor names incompatible with the declared OpenAI v4 SDK.
- `server.cjs` uses import syntax despite `.cjs` extension and no matching module setup; verify start command.
- No demonstrated functional project persistence, specialist orchestration, customer approvals, Stripe subscriptions, Supabase schema, or automated tests.
- Existing logo generation, domain checking, deploy endpoints, home page and onboarding are **code present, not verified working**.

## Proposed controlled delivery order
P0: Revoke/rotate any exposed keys and hooks; stop unsafe browser requests and HTML injection; ensure no production deployment is triggered.
P1: Add a repeatable build/lint/test pipeline and a single supported server/API architecture. Confirm actual runtime behaviour in isolated development environment.
P2: Establish project-aware authentication and durable isolated Project Brain storage with access tests.
P3: Implement Sally's conversational idea evaluation, cited research, and explicit approval gates.
P4: Build deliverables, specialist handoffs, website publication workflow, and Stripe test-mode subscription flow.
P5: End-to-end security, billing and onboarding tests; private beta before paid launch.

## Suggested Codex first implementation assignment (requires approval)
On a separate branch: replace direct browser OpenAI calls with an authenticated server-side endpoint, eliminate unsafe HTML rendering, and add automated regression tests. Preserve current UI and local uncommitted changes; do not touch production credentials, deploy, or merge without approval.

## Validation outstanding
- Run npm ci, npm run build and lint/tests in a clean checkout.
- Inspect Vercel deployment logs/configuration; inspect Supabase and Stripe only after account connections.
- Confirm any local uncommitted changes before Codex edits, particularly `src/components/promptFlow.jsx` and `src/data/promptFlow.js`.
- Inventory current environment variables without disclosing values.
