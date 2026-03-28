# PulseGrid Mobile

A mobile-first web application designed to help patients find hospitals with available medical resources and emergency services.

## Features
- **Hospital Directory & Resource Tracking**: Real-time mock data for ICU beds, ventilators, specialists, and blood availability.
- **Ambulance Tracking**: GPS progress simulation and ETA tracking for emergency dispatch.
- **Mock Authentication**: Client-side simulated login for hospital administration.
- **Fully Responsive**: Designed with mobile compatibility at its core.

## Tech Stack
- Next.js 16 (App Router)
- React 19
- Tailwind CSS
- Mapbox GL
- Zustand (State Management)
- Radix UI & Lucide Icons

## Local Development

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Generate your Mapbox access token and set it in `.env.local`:
   ```env
   NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
   ```
   *(If you do not configure an access token, the map interface may show errors.)*

3. Standard Development Server:
   ```bash
   pnpm run dev
   ```
   *Your app will be available at `http://localhost:3000`.*

## Deployment

The repository is configured to deploy as a static site to GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`).

Because GitHub Pages serves your application under a repository folder subpath (`you.github.io/pulsegrid/`), the `next.config.mjs` is configured to dynamically apply the `/pulsegrid` base path during CI production builds.

To trigger a deployment, push to the `main` branch.
