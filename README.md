## Fantasy Football Assistant – Web UI

This project is the front‑end for the Fantasy Football Assistant, built with **Next.js 14**, **TypeScript**, and **Tailwind CSS** using the App Router. It serves as the user interface layer for connecting to ESPN Fantasy Football data and AI‑powered advice.

### Local Development

1. Install dependencies:

   ```bash
   npm install
   # or
   pnpm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

3. Open `http://localhost:3000` in your browser. You should see the home page and can hit `/api/health` for a JSON health check.

### Project Structure

- **app/** – Next.js App Router directory. Contains pages, layouts, and API routes.
- **app/api/** – Contains API route handlers. A `/health` route is provided for basic health checks.
- **components/** – Place your React components here.
- **lib/** – Server‑only modules (e.g. ESPN fetch helpers, to be implemented in later steps).
- **styles/** – Global CSS and Tailwind directives.

### Tailwind CSS

Tailwind is configured via `tailwind.config.js` and used globally in `styles/globals.css`. You can customize the theme in the configuration as needed.

### Next Steps
This initial scaffolding has been expanded to include:

* **ESPN fetch helpers** in `lib/espn.ts` for retrieving league and scoreboard data using the unofficial ESPN API.
* **API routes** under `app/api/espn/` for `league` and `scoreboard`, which proxy ESPN data. These routes support query parameters and cache responses for 60 seconds.
* **AI advice endpoint** under `app/api/lineup/advice` that calls the Gemini 1.5 model via `@google/generative-ai`. You must set a `GEMINI_API_KEY` in your environment for this to work.
* **Interactive dashboard** in `app/page.tsx` that lets you input a league ID, team ID, week, and risk profile; it fetches league summaries, weekly scoreboards, and AI lineup advice.

### Environment Variables

Create a `.env.local` file at the project root (or set these on Vercel) with the following keys:

```
GEMINI_API_KEY=<your Google Gemini API key>
ESPN_LEAGUE_ID=<default league id (optional)>
ESPN_SEASON=2025
ESPN_S2=<your espn_s2 cookie>
ESPN_SWID=<your swid cookie>
```

These variables allow the server to authenticate to ESPN and call the Gemini API. Never commit real secrets to version control.

### Testing API Routes

You can test the API routes with `curl`:

```bash
# Health check
curl http://localhost:3000/api/health

# League summary (replace leagueId)
curl "http://localhost:3000/api/espn/league?leagueId=123456"

# Scoreboard for week 1
curl "http://localhost:3000/api/espn/scoreboard?leagueId=123456&week=1"

# Lineup advice (POST JSON with roster array)
curl -X POST http://localhost:3000/api/lineup/advice \
  -H "Content-Type: application/json" \
  -d '{"roster": [{"id":123,"name":"Player Name","position":"WR","projected_points":12.3}], "scoring": {"ppr": true}}'
```

### Deployment

To deploy on Vercel:

1. Push this repository to GitHub or another Git provider.
2. In Vercel, import the repository and set the environment variables listed above.
3. Vercel will automatically detect the Next.js app and deploy it. The API routes and UI will be available on your Vercel domain.

When you visit the site, enter your league and team IDs, and optionally the week and risk profile. The dashboard will display your league summary, current week matchups, and AI‑generated lineup advice.