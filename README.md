
  # YourHelpa (WORKFLOWS ADDED)

  This is a code bundle for YourHelpa (WORKFLOWS ADDED). The original project is available at https://www.figma.com/design/C2iWHieqAUrf1wdKKYmBuu/YourHelpa--WORKFLOWS-ADDED-.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  

## Deploying to Vercel — environment variables

This site requires two Supabase environment variables to be set in your Vercel project so the frontend can initialize the Supabase client at runtime:

- `SUPABASE_URL` — your Supabase project URL (e.g. `https://<project>.supabase.co`)
- `SUPABASE_ANON_KEY` — your Supabase public (anon) key

How it works on Vercel
- The repository contains `scripts/generate-config.js` which is run automatically before the build (`prebuild`). It generates `js/config.js` from the environment variables and that file is served as a static asset.
- Make sure both env vars are set in the Vercel dashboard (Project → Settings → Environment Variables) for the environment you deploy (Production).

Security notes
- Do NOT commit secret or private keys to the repository. The generator writes `js/config.js` at build time using env vars configured in Vercel.

Quick verification after deploy
1. Visit your site and open DevTools → Network. Request `/js/config.js` — it should return JavaScript (200) and contain `window.SUPABASE_URL` (not HTML).
2. Check the Console for: `Supabase config presence: { SUPABASE_URL: true, SUPABASE_ANON_KEY: true }` and `Supabase client initialized.`

If you see `false` for either value, ensure the environment variables are set in Vercel and redeploy.

## Email (SMTP) and server function configuration

We added a serverless function at `api/send-welcome.js` that sends a welcome email using Nodemailer. Set these additional environment variables in Vercel for the function to work:

- `SUPABASE_SERVICE_ROLE_KEY` — your Supabase service role (server) key (keep this secret)
- `SMTP_HOST` — your SMTP host (e.g., smtp.sendgrid.net, smtp.gmail.com)
- `SMTP_PORT` — SMTP port (465 for SMTPS, 587 for STARTTLS)
- `SMTP_USER` — SMTP username
- `SMTP_PASS` — SMTP password
- `FROM_EMAIL` — (optional) the From address used in outgoing emails (e.g., no-reply@yourhelpa.com.ng)

Important: `SUPABASE_SERVICE_ROLE_KEY` is sensitive and must only be set in the server environment (Vercel project settings). Do not expose it to client-side code.

After setting these env vars, redeploy. The signup flow will call `/api/send-welcome` (server-side) after a user signs up and the server will verify the user's session before sending email.
