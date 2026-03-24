# Wasel Dashboard

Admin management panel for the Wasel Fleet platform — managing users, drivers, trips, storage owners, finance, verification, blogs, analytics, and settings.

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19.2.4 | UI framework |
| TypeScript | 5.9.3 | Type safety |
| Vite | 8.0.1 | Build tool & dev server |
| React Router | 7.13.1 | Client-side routing |
| TailwindCSS | 4.2.2 | Utility-first styling |
| React Hook Form | 7.72.0 | Form state management |
| Zod | 4.3.6 | Schema validation |
| Framer Motion | 12.38.0 | Page transition animations |
| Recharts | 3.8.0 | Data visualization |
| TipTap | 3.20.4 | Rich text editing |
| Monaco Editor | 0.55.1 | Code editing |
| Lucide React | 0.577.0 | Icon library |

## Getting Started

```bash
npm install
npm run dev       # development server
npm run build     # production build
npm run preview   # preview production build
```

## Documentation

- [docs/PAGE_ANATOMY.md](docs/PAGE_ANATOMY.md) — Deep dive: how every page is built (styles, icons, data layer, table & form patterns)
- [src/pages/README.md](src/pages/README.md) — Pages structure, routing, and page-level patterns
- [src/shared/README.md](src/shared/README.md) — Shared components, hooks, data layer, and conventions

## Project Structure

```
src/
├── app/
│   └── router.tsx              # createBrowserRouter — all route definitions
├── components/
│   └── ui/                     # Shadcn base UI components (Button, Input, Badge, etc.)
├── pages/                      # Route-level page components (one folder per feature)
│   ├── dashboard/
│   ├── users/
│   ├── drivers/
│   ├── storage-owners/
│   ├── verification/
│   ├── trips/
│   ├── wallet-and-finance/
│   ├── analytics/
│   ├── notifications/
│   ├── blogs/                  # Has nested child routes (add / edit / drafts)
│   ├── roles-and-permissions/
│   ├── settings/
│   └── not-found/
├── shared/
│   ├── components/
│   │   ├── common/             # App-wide reusable components (PageHeader, Searchbar, etc.)
│   │   ├── layout/             # Layout and Sidebar
│   │   └── pages/              # Feature-specific sub-components (tables, forms, analytics)
│   ├── core/
│   │   ├── layout/
│   │   │   └── sidebar.ts      # Sidebar nav items config
│   │   └── pages/              # Per-feature TypeScript interfaces, mock data, analytics config
│   ├── data/                   # Static/mock datasets
│   └── hooks/
│       └── useTableSearch.ts   # Generic table search & filter hook
├── data/                       # Additional static data
├── lib/
│   └── utils.ts
├── App.tsx                     # Root component — wraps <Layout />
└── main.tsx                    # ReactDOM entry point
```

## Deploy on Vercel

1. Push repository to GitHub.
2. Import project in Vercel — Framework Preset: `Vite`, Output Directory: `dist`.
3. Deploy.

`vercel.json` includes a SPA fallback so direct URLs like `/users`, `/trips`, `/settings` work correctly.
