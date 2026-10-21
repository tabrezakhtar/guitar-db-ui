# Rifftales

Rifftales is a React frontend for sharing and exploring musical equipment. Users can browse the equipment gallery, view and manage equipment, maintain profiles, follow other users, and manage livestream schedules. The app uses React Context for shared state, Tailwind CSS for styling, and Vite for development and builds.

## Requirements

- The Rifftales API for data-backed features

## Local Development

1. Install dependencies:

   ```sh
   npm install
   ```

2. Start the API separately. The development environment is configured in `.env.development` to use `http://localhost:5000`, the API's default local address. See the API project's README for its setup requirements.

3. Start the frontend:

   ```sh
   npm run dev
   ```

Vite prints the local frontend URL when the server starts.

## Configuration

The frontend reads `VITE_API_BASE_URL` to locate the API. `.env.development` points to the local API at `http://localhost:5000`. `.env.production` leaves the value empty so API requests use the same origin; the Netlify configuration forwards `/api/*` requests to the production API. For other hosting providers, set `VITE_API_BASE_URL` to the API origin at build time.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server, listening on network interfaces. |
| `npm run lint` | Run ESLint. |
| `npm run build` | Build the production site and prerender the landing page. The post-build step installs Chrome through Puppeteer. |
| `npm run preview` | Serve the production build locally. |

The production build is written to `dist/`. Static pages for contact, privacy, and terms are copied into the build output by Vite.
