# Rakshit Thakur — Developer Portfolio

A responsive React portfolio with a photo-led hero, detailed project case studies, a journey page, and a working Express + SQLite contact API.

The visual direction is cinematic and high-contrast: oversized condensed type, a near-black canvas, ember-red accents, atmospheric contour artwork, and Rakshit's portrait. The homepage pairs a parallax hero with drifting particles and a scroll-driven philosophy panel that expands to reveal its copy.

The motion system includes staggered hero lettering, ambient particles and glow, scroll parallax, section reveals, an expanding philosophy panel, a moving marquee, and interactive project previews. Motion effects respect the user's reduced-motion preference.

## Routes

| Route | Page |
| --- | --- |
| `/` | Home: hero portrait, introduction, sticky scroll story, skills, selected work, journey preview, and contact |
| `/about` | About: story, current focus, and full-body portrait |
| `/projects` | Project index |
| `/projects/:slug` | Project case study |
| `/journey` | Learning journey and milestones |
| `/contact` | Contact details and form |
| `*` | Custom not-found page |

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Setup

```powershell
npm install
Copy-Item .env.example .env
npm run db:migrate
npm run dev
```

The Vite frontend is available at <http://localhost:5173>. The API runs at <http://localhost:3001>; Vite proxies `/api` requests to it. SQLite creates its database and tables automatically on first startup.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Runs the Vite client and the Express API together |
| `npm run dev:client` | Runs only the Vite client |
| `npm run dev:api` | Runs only the Express API with Node watch mode |
| `npm run build` | Builds the production frontend into `dist` |
| `npm start` | Starts the Express server and serves `dist` when present |
| `npm run db:migrate` | Runs the idempotent SQLite schema initializer and project seed |
| `npm test` | Runs the Vitest suite |
| `npm run test:watch` | Runs Vitest in watch mode |

## Environment variables

| Variable | Example | Description |
| --- | --- | --- |
| `PORT` | `3001` | Express server port; must be between 1 and 65535 |
| `NODE_ENV` | `development` | Node.js environment |
| `DATABASE_PATH` | `./data/portfolio.sqlite` | SQLite database file path; parent folders are created automatically |
| `FRONTEND_ORIGIN` | `http://localhost:5173` | Single allowed browser origin for API CORS |
| `VITE_API_BASE_URL` | *(empty)* | Frontend build-time API origin. Leave empty to call `/api` on the same origin; set to the backend origin (for example `https://api.example.com`) when deploying the frontend separately. |
| `API_PROXY_TARGET` | `http://localhost:3001` | Vite development proxy target, used when `VITE_API_BASE_URL` is empty. |

No email delivery provider is configured: submitted messages are validated and saved to SQLite. To read messages, open the configured database and query `contact_messages`. Configure and secure a mail/notification service separately if email notifications are desired.

## Content and privacy

- Portfolio copy, project case studies, journey entries, and social links live in `client/src/data/site.js`.
- The public site intentionally omits the school name, class, and address. Only the country (`India`) is shown as location context.
- The school project is presented generically as **School Website Refresh**, with no live URL or repository link.
- CivicGuard is presented with its real scope, stack, live demo, and repository link.
- The contact form posts to `POST /api/contact` and stores messages in SQLite. There is no public route for reading submissions.
- The same optimized transparent portrait (`public/images/rakshit-portrait-cutout.webp`, selected from the 17:11:40 photo) is used in the home hero, About, Contact, and the navigation menu.

## Database initialization

`npm run db:migrate` runs the idempotent SQLite schema initializer and project seed in `server/migrations.js`. The application also runs this initializer automatically at startup, so it is safe to run migrations explicitly during deployment and then start the server. Seed rows use `ON CONFLICT(slug) DO NOTHING`: existing project content and contact messages are never overwritten on restart. Update project content directly in the database or add a controlled migration for intentional changes.

The backend uses `better-sqlite3` 12, which supports the Node.js versions declared in `package.json` (`^20.19.0 || >=22.12.0`). SQLite uses WAL journaling, foreign-key enforcement, a five-second busy timeout, and a transaction for schema setup plus project seeding. Database files and common SQLite sidecar files are ignored by Git.

### Inspecting the local development database

The default database is `data/portfolio.sqlite`. With the SQLite CLI installed:

```powershell
sqlite3 data/portfolio.sqlite ".schema"
sqlite3 data/portfolio.sqlite "SELECT slug, title, technologies, featured FROM projects ORDER BY id;"
sqlite3 data/portfolio.sqlite "SELECT id, name, email, subject, created_at FROM contact_messages ORDER BY created_at DESC;"
```

Contact message bodies are deliberately omitted from the example query because they may contain private information.

## API

All responses are JSON. API errors use `{ "error": "...", "code": "..." }`; validation errors additionally include a `details` array with field names and messages.

| Method and path | Success response | Notes |
| --- | --- | --- |
| `GET /api/health` | `200 { "status": "ok", "database": "connected" }` | Checks SQLite with `SELECT 1`; returns `503` if unavailable. |
| `GET /api/projects` | `200` with an array of projects | Project records are queried from SQLite and seeded from `server/migrations.js`. The React frontend uses the local `site.js` content for its case studies. |
| `GET /api/projects/:slug` | `200` with one project | Unknown slugs return `404 PROJECT_NOT_FOUND`. |
| `POST /api/contact` | `201 { "message": "...", "id": 1 }` | Accepts `name`, `email`, `subject`, and `message`; trims fields and lowercases email before parameterized SQLite insertion. |

Contact submissions are limited to 5 requests per client IP per 15-minute window. Responses include standard rate-limit headers and return `429 RATE_LIMITED` when exceeded. JSON request bodies are limited to 10 KB. Helmet security headers are enabled, CORS permits only `FRONTEND_ORIGIN`, and there is no public route for reading contact submissions. SQLite errors are logged without message contents, and internal errors/details are never included in client responses.

## Production

```powershell
npm run build
npm run db:migrate
npm start
```

The Express server serves `dist` when it exists and exposes the API routes above. Set all environment variables for the deployment environment, use a persistent disk for `DATABASE_PATH`, and set `FRONTEND_ORIGIN` to the deployed site origin. Use HTTPS at the hosting/reverse-proxy layer. The SQLite database is local to the running instance, so deployments that require multiple server instances should replace it with a shared database. If running behind a reverse proxy, configure Express trusted proxies for the specific deployment before relying on IP-based rate limits.

### Deploying frontend and backend separately

The app can also be hosted as a static frontend plus a separate Node.js API service:

1. Deploy the API service from this repository with Node.js 20.19+ or 22.12+, build/install dependencies, then run `npm run db:migrate` and `npm start`. Configure `PORT`, `NODE_ENV=production`, `DATABASE_PATH`, and `FRONTEND_ORIGIN` with the exact HTTPS origin of the deployed frontend.
2. Deploy the frontend as a static Vite build (`npm ci` then `npm run build`) and publish `dist`. Set `VITE_API_BASE_URL` to the API service origin, with no trailing slash or `/api` suffix (for example `https://portfolio-api.example.com`), at build time. Vite embeds this value into the generated client bundle; it is not a secret. Rebuild the frontend after changing it. `API_PROXY_TARGET` is only for local Vite development.
3. Configure the API host's HTTPS, health check path (`/api/health`), and persistent disk/storage according to that provider. The API CORS policy permits the configured `FRONTEND_ORIGIN`.

SQLite persistence depends on the hosting provider and the configured storage mount. Do not assume a free/ephemeral instance preserves local files across restarts, redeploys, or instance replacement. Mount a persistent volume and place `DATABASE_PATH` on it when the host supports durable storage. If durable local storage is unavailable or the service will scale to multiple instances, use a managed persistent database such as PostgreSQL instead of local SQLite.

## Tests

```powershell
npm test
```

The Vitest suite covers portfolio rendering, case studies, not-found routing, contact form submission, API validation and normalization, SQLite schema initialization, idempotent non-destructive seeding, project and contact repository queries, database path creation and initialization failures, rate limits, database failure behavior, health checks, and unknown routes. It also checks that the About page does not expose school, class, or address details.

## Motion and performance

- `client/src/effects.css` contains the scroll, reveal, cursor, magnetic, `RT`, and reduced-motion rules. It is imported after `styles.css` so the newer effects layer overrides the original editorial base.
- `ScrollFX` writes `--page-progress`, `--hero-progress`, and per-section `--fx` values from a single throttled scroll listener. The visual work stays in CSS `transform`, `translate`, and `opacity`, which the browser can composite.
- `ScrollStory` uses one sticky viewport and two absolutely positioned type rows. The rows, frame, copy, and signature are driven by the same `--fx` value, so scrolling stays smooth without React re-renders.
- `CursorFX` and `MagneticFX` only mount for fine pointers and are skipped when reduced motion is requested. The trailing cursor loop stops when the pointer is still.
- All new motion has a `prefers-reduced-motion: reduce` fallback: the story becomes a static stacked section, the hero and media stop transforming, the custom cursor is removed, and reveal masks are shown open.

## Features

- Responsive home page with a full-colour portrait, introduction, sticky scroll story, skills, selected work, journey preview, and contact section.
- Hero portrait: an optimized personal photo in a framed, responsive crop; the former stippled cutout is no longer used.
- Sticky scroll story: giant `BUILD / LEARN` rows move in opposite directions, with the copy and lime `RT` signature revealing around the frame.
- Reusable motion layer: `ScrollFX` sets CSS custom properties for scroll-linked transforms, `Signature` draws the lime `RT`, `CursorFX` adds a trailing cursor on fine pointers, and `MagneticFX` pulls primary controls toward the pointer.
- Clip, mask, scale, and vertical reveal variants for page media, panels, statements, and story copy; the clip is applied to the media child so the observed element still reports a real intersection.
- Dedicated About, Projects, case-study, Journey, Contact, and 404 routes.
- Case studies for CivicGuard and a generic School Website Refresh, with scope, stack, and highlights.
- Accessible contact form with inline validation and a live API-backed submission flow.
- Keyboard focus styling, skip link, semantic form labels, reduced-motion support, and a custom 404 route.
- SEO title and description metadata, Open Graph metadata, and a custom favicon.
- Server-side Zod validation and parameterized SQLite inserts for contact submissions.
- Health, project list/detail, and contact endpoints; consistent API errors, CORS, security headers, rate limiting, and JSON request-size limits.

The project pages describe known scope and technologies only; they do not invent performance statistics, testimonials, awards, or experience history.
