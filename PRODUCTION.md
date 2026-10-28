# Production deployment and recovery

## Hosting

- Vercel serves the React frontend from `frontend/`.
- Render runs FastAPI from `backend/` with `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
- Neon hosts PostgreSQL over TLS. Use a connection string containing `sslmode=require`.
- Set the Render health check to `/health/ready`. `/health/live` checks the process only.

Free hosting has capacity limits and cold starts. Neon's free plan has no fixed trial expiration; usage allowances still apply. The live data has been imported into the separate `ResumeIQ Production` Neon project in Oregon, on its `import` branch, and Render's connection has been switched to it. The original Render database is retained temporarily for rollback and expires November 27, 2026.

## Required configuration

Render: `APP_ENV=production`, a PostgreSQL `DATABASE_URL`, a random `JWT_SECRET_KEY` of at least 32 characters, and `FRONTEND_URL=https://ai-resume-analyzer-one-drab.vercel.app`.

Vercel: `VITE_API_BASE_URL=https://ai-resume-analyzer-5qo2.onrender.com/api`. Rebuild after changing this variable. The build rejects missing, HTTP, and localhost API URLs.

Never place database passwords or API keys in Vite environment variables. All Vite variables are public. Use [the backend environment template](backend/.env.example) for server configuration. Keep local credentials and migration backups out of Git.

## Database migration

1. Back up the source and stop application writes for the entire copy and cutover.
2. Set `MIGRATION_SOURCE_URL` and `MIGRATION_TARGET_URL` in the environment or Git-ignored `backend/.env.migration.local`.
3. Run `python manage_db.py inspect` from `backend/` to inspect table counts without displaying account details.
4. Run `python manage_db.py migrate`. This copies all five application tables to a dedicated `resumeiq_live` database, writes a local backup to Git-ignored `backend/backups/`, verifies every row, and synchronizes ID sequences. It refuses populated targets.
5. Update Render's `DATABASE_URL` to the verified target database and deploy. Resume writes only after `/health/ready`, signup, login, history, and settings succeed.
6. Retain the source database for rollback until the cutover is accepted. After writes begin on Neon, switching back requires copying those new writes first; do not blindly point the app back to stale data.
7. Remove local migration credentials after use. Store encrypted backups outside the hosting account and periodically test restores. A migration JSON snapshot is not a replacement for an ongoing PostgreSQL backup policy.

The Neon Import Data Assistant is an alternative when direct PostgreSQL networking is unavailable. Do not switch the app until its import and row verification succeed.

## Authentication and subscriptions

- User roles come from the server. Registration always creates a job seeker.
- Mock Google credentials are rejected. Real Google login requires `GOOGLE_CLIENT_ID` and verified identity claims.
- Password recovery never returns reset tokens or prints reset links. Configure `RESEND_API_KEY` plus a verified `SMTP_FROM` sender for HTTPS email delivery on Render free hosting. Without delivery, production recovery explicitly returns unavailable.
- Public signup does not verify email ownership yet. Add verified-email enrollment before opening registration to untrusted audiences at scale.
- Subscription tiers cannot be changed through settings, direct upgrades, or a browser callback. Stripe checkout requires `STRIPE_SECRET_KEY`; webhook activation requires a valid signature and a paid checkout status. Confirm product billing terms before enabling charges; the current implementation is a one-time payment, not recurring billing.
- Authentication attempts are throttled per process and client IP. Before scaling horizontally, use a shared rate limiter or an edge policy and verify the proxy's client-IP configuration.

## Release checks

From `backend/`: `python -m pytest tests -q`.

From `frontend/`: `npm test`, `npx tsc --noEmit`, and `npm run build`.

The [CI workflow](.github/workflows/ci.yml) runs these checks. Backend dependencies are pinned to locally tested versions, including SQLModel and Pydantic, to avoid incompatible timestamp behavior in fresh installations. Verify the live deployment after publishing; local passing tests do not prove the deployed service has the new code.

## Remaining launch work

Do not describe this application as fully production ready until migration and deployment are verified, email delivery and recovery are tested, AI credentials are tested with a supported Gemini model, backup/restore and monitoring are configured, and the privacy/support text reflects actual operations. Configure payment credentials only if selling the implemented paid plan. Free infrastructure does not provide an uptime guarantee.
