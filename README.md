# Forge · PC Build Optimizer

Forge is an early-stage web prototype for creating example PC builds in euros. Its interface, product catalog, compatibility rules, build generator, and export features are kept separate so the local catalog can later be replaced with a database and authorized data sources.

## Getting started

Requirements: Node.js 20 or newer and npm.

```powershell
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tests and production build

```powershell
npm test
npm run build
```

## Features

- A step-by-step questionnaire for budget, use case, resolution, and preferences.
- A manual mode based on an editable starting build.
- A structured local catalog with CPU, GPU, motherboard, RAM, SSD, PSU, case, and cooler categories.
- Clearly labeled example prices and availability; no fabricated store links.
- Compatibility checks for CPU sockets, memory, GPU length, cooler height, and PSU capacity.
- A deterministic generator with gaming, productivity, and editing profiles, budget handling, and GPU fallbacks.
- Up to three build strategies when the catalog supports them: best performance, best balance, and lowest cost.
- A `POST /api/build` endpoint with server-side Zod validation; builds are calculated for each request.
- Component replacement with immediate total and warning recalculation.
- Local persistence of the latest generated build and edits with `localStorage`; no account is required.
- Build duplication, deletion of local saves, printing, and CSV import for unverified offers.
- A configurable catalog source: the local fallback catalog or an owner-controlled remote API configured with `CATALOG_API_URL`.
- A public, read-only `GET /api/catalog?category=gpu` endpoint.
- JSON and CSV export in the browser.
- Vitest coverage for compatibility, missing data, incompatibilities, and budget limits.

## Current limitations

This is a prototype, and its default catalog contains sample data. The application can use an owner-controlled remote catalog by setting `CATALOG_API_URL`; both `GET /api/catalog` and the build generator then use products from that source. `database/schema.sql` contains a PostgreSQL schema for a separate catalog service. Builds are still stored in the browser. CSV import does not verify sources: imported offers remain `verified: false` until an authorized adapter validates them. Real commercial data requires authorized API, feed, or other data-source access and compliance with the relevant terms.
