# Dixit’s Portfolio and AI Chatbot

A React portfolio website with a chatbot that answers questions about Dixit’s profile, education, skills, and projects.

## Run locally

You need Node.js 20 or newer. Open the project folder in VS Code and use two terminals.

**Terminal 1 — website**

```powershell
npm run dev
```

Open the local address Vite prints, usually `http://localhost:5173`. Vite forwards `/api` requests to the local API server.

**Terminal 2 — chatbot API**

```powershell
node server.js
```

Keep both terminals running. Without an AI key, the chatbot uses profile-based demo answers. With a configured key, it uses live AI. The API also supports `GET http://localhost:3001/api/health`.

## Connect Gemini

1. Revoke any API key previously shared in a chat, screenshot, or public repository, then create a new Gemini key.
2. Create `.env` in the project root (beside `server.js`).
3. Add the following, replacing the placeholder with your new key:

   ```dotenv
   GEMINI_API_KEY=your_new_key_here
   GEMINI_MODEL=gemini-2.5-flash
   ```

4. Save the file and restart `node server.js`.
5. Visit `http://localhost:3001/api/health`. Check `keyConfigured` without sharing or printing the key.

The key is read by the Node server and must never be placed in React/browser code, a `VITE_` variable, or a public file. Gemini calls use Google’s modern generateContent API. If the model is unavailable to your account, set `GEMINI_MODEL` to one your account supports, such as `gemini-2.0-flash` or `gemini-2.5-flash`.

OpenAI is also supported through `OPENAI_API_KEY` and optional `OPENAI_MODEL` entries in `.env`. Gemini is selected first if both keys are present.

## Deploy to Vercel

The project includes Vercel serverless functions in `api/`, so Vercel serves the Vite website and `/api/chat` and `/api/health` from the same deployment. The standalone `server.js` remains for local development; Vercel does not run it as a persistent server.

1. Import the project’s Git repository into Vercel and leave the project root set to the repository root.
2. In **Project Settings → Environment Variables**, add:
   - `GEMINI_API_KEY` — your Gemini API key
   - `GEMINI_MODEL` — optional; defaults to `gemini-2.5-flash`
3. Add the variables to the **Production** environment (and Preview/Development if needed), then redeploy.
4. Keep Vercel’s Vite defaults: build command `npm run build`, output directory `dist`, install command `npm install`. No custom Vercel build configuration is required.

The frontend calls the relative URL `/api/chat`, which resolves to the same Vercel deployment in production and is forwarded by Vite to `localhost:3001` locally. Never add the Gemini key as a `VITE_` variable or commit it to the repository. Check `https://<your-domain>/api/health`; it reports whether a provider key was detected but never exposes the key. If no valid key is configured, chat uses the existing profile-demo mode.

## Update portfolio details

Edit `profile.js`. The website and AI profile context use the facts in this file. Do not put keys or secrets there.

## Main files

- `src/App.jsx` and `src/App.css` — portfolio and chatbot interface
- `profile.js` — shared portfolio data
- `server.js` — local API server and private provider key loading
- `api/` and `lib/chat.js` — Vercel API functions and shared chat logic
- `public/PORTFOLIO-CHATBOT.txt` — plain-text setup and integration guide

## Build and lint

```powershell
npm run build
npm run lint
```

The build is written to `dist/`. To use chat with the built website, keep `node server.js` running.
