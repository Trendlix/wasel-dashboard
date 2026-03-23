# Wasel Dashboard

Admin dashboard for managing the Wasel logistics platform (users, drivers, trips, storage owners, finance, verification, notifications, analytics, and settings).

---

## Overview

Wasel Dashboard is a React + TypeScript admin panel focused on operational workflows:

- User management
- Driver management
- Storage owner management
- Trip monitoring
- Wallet & finance tracking
- Verification center
- Notifications center
- Analytics (with Recharts)
- Platform settings

The UI follows a reusable component architecture with shared table/search/pagination patterns.

---

## Tech Stack

- **React**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **shadcn/ui**
- **Recharts** (charts)
- **Framer Motion** (page transitions)
- **Lucide React** (icons)

---

## Project Structure

```text
src/
  pages/
    analytics/
    drivers/
    notifications/
    settings/
    storage-owners/
    trips/
    users/
    verification/
    wallet-and-finance/
  shared/
    components/
      common/
      pages/
    core/
      pages/
    hooks/
```

---

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Run development server

```bash
npm run dev
```

### 3) Build for production

```bash
npm run build
```

### 4) Preview production build

```bash
npm run preview
```

---

## Available Scripts

Depending on your `package.json`, commonly used scripts are:

- `npm run dev` — start local development server
- `npm run build` — production build
- `npm run preview` — preview built app
- `npm run lint` — run lint checks (if configured)

---

## Core UI Patterns

### Tables
All major modules use a consistent table system:
- reusable row styles
- status badges
- shared pagination
- searchable datasets

### Search
Search is implemented with reusable behavior (`useTableSearch`) and supports module-specific keys.

### Pagination
Tables use shared pagination controls and reset to page 1 when search query changes.

### Animation
Page content is wrapped with `PageTransition` and rendered through animated outlet transitions.

---

## Main Pages

- `/users`
- `/drivers`
- `/storage-owners`
- `/trips`
- `/wallet-and-finance`
- `/verification`
- `/analytics`
- `/notifications`
- `/settings`

---

## Design Notes

- Consistent card layout and spacing
- Unified typography scale across tables/forms
- Status color system for badges and indicators
- Form and settings sections built from reusable field/header/input components

---

## Environment

If environment variables are needed, create:

```bash
cp .env.example .env
```

Then update values as required by your API/backend setup.

---

## Contributing

1. Create a feature branch
2. Keep components reusable
3. Reuse existing shared styles/components before adding new ones
4. Run lint/build before opening PR

---

## License

Internal project. Add your organization license policy here.

## Deploy on Vercel

1. Push repository to GitHub.
2. Import project in Vercel.
3. Confirm:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Deploy.

`vercel.json` already includes SPA fallback so direct links like `/users`, `/trips`, `/settings` work.
