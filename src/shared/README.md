# Shared

The `src/shared/` directory is the central library for everything reused across pages — components, hooks, data, and configuration. Nothing here is page-specific; it is all consumed by `src/pages/`.

```
src/shared/
├── components/
│   ├── common/         # App-wide reusable UI components
│   ├── layout/         # App shell (Layout + Sidebar)
│   └── pages/          # Feature-specific sub-components
├── core/
│   ├── layout/
│   │   └── sidebar.ts  # Sidebar navigation items config
│   └── pages/          # Per-feature interfaces, mock data, analytics definitions
├── data/               # Static datasets (e.g., blog dummy data)
└── hooks/              # Custom React hooks
```

---

## components/common/

App-wide UI building blocks used by most pages.

| Component | Purpose |
|---|---|
| `PageTransition.tsx` | Wraps page content in a Framer Motion fade + slide-up animation |
| `PageHeader.tsx` | Renders the page title and description at the top of each page |
| `AnalyticsCard.tsx` | Metric card with icon, label, value — used in analytics rows |
| `Searchbar.tsx` | Controlled search input wired to `useTableSearch` |
| `TablePagination.tsx` | Pagination controls for all data tables |
| `EmptyRow.tsx` | Empty state row shown when a table has no results |
| `DashboardLayout.tsx` | Layout wrapper for dashboard-specific grid |
| `AnimatedOutlet.tsx` | Animated `<Outlet />` for nested route transitions |
| `FormItems.tsx` | Library of form field components (inputs, rich text, slug, lists) |

### FormItems.tsx

`FormItems.tsx` is the central form-building library. It exports:

- **`CommonLabel`** — styled form label
- **`CommonInput`** — text/number input with label
- **`CommonTextarea`** — textarea with label
- **`TipTapEditor`** — full rich text editor (TipTap) with toolbar
- **`MonacoEditor`** — code editor field
- **`SlugField`** — input that auto-generates URL slugs
- **`ListField`** — dynamic add/remove list input

---

## components/layout/

| File | Purpose |
|---|---|
| `Layout.tsx` | App shell: `<Sidebar />` + `<main><Outlet /></main>` |
| `Sidebar.tsx` | Navigation sidebar — maps over `sidebarItems`, uses `NavLink` for active state, shows user profile footer |

---

## components/pages/

Feature-specific components that are imported by page shells in `src/pages/`. Each sub-folder corresponds to one feature.

```
pages/
├── analytics/
├── blogs/
├── dashboard/
├── drivers/
├── notifications/
├── settings/
├── storage-owners/
├── trips/
├── users/
├── verification/
└── wallet-and-finance/
```

### Typical feature folder contents

| File pattern | Purpose |
|---|---|
| `[Feature]Analytics.tsx` | Row of `AnalyticsCard` components for that feature |
| `[Feature]Table.tsx` | Data table with search + pagination wired together |
| `[Feature]Form.tsx` | Create/edit form using `FormItems` components and React Hook Form |

---

## core/layout/sidebar.ts

Defines the `ISidebarItem` interface and the `sidebarItems` array consumed by `Sidebar.tsx`.

```ts
interface ISidebarItem {
  id: number;
  name: string;
  icon: LucideIcon;
  route: string;
}
```

To add a new nav item, append an entry to the `sidebarItems` array and ensure the route is registered in `src/app/router.tsx`.

---

## core/pages/

One `.ts` file per feature. Each file is the **data and config layer** for that feature.

### Standard exports per file

```ts
// Interfaces
export interface IUser { id: string; name: string; status: TUserStatus; ... }

// Status types
export type TUserStatus = "active" | "inactive" | "blocked";

// Style mappings for status badges
export const statusStyles: Record<TUserStatus, { bg: string; text: string; label: string }> = { ... };

// Analytics card definitions
export const usersAnalytics: IAnalyticsCard[] = [
  { label: "Total Users", value: 120, icon: UsersIcon, color: "blue" },
  ...
];

// Mock data
export const users: IUser[] = [ ... ];
```

### IAnalyticsCard interface

```ts
interface IAnalyticsCard {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
}
```

---

## data/

Static datasets not tied to a specific core config. Currently:

| File | Contents |
|---|---|
| `blogs.ts` | `BlogCardItem` interface + `BLOGS_DUMMY_DATA` array |

---

## hooks/

| Hook | Signature | Purpose |
|---|---|---|
| `useTableSearch` | `(data: T[], keys: (keyof T)[]) => { query, setQuery, filtered }` | Filters any array by a search query against specified keys. Uses `useMemo` for performance. |

### useTableSearch usage

```tsx
const { query, setQuery, filtered } = useTableSearch(users, ["name", "email", "status"]);

// Wire to Searchbar
<Searchbar value={query} onChange={setQuery} />

// Pass filtered data to the table
<UsersTable data={filtered} />
```

---

## Conventions

- Components in `common/` must be feature-agnostic — no feature-specific logic.
- Components in `pages/[feature]/` must only be used by `src/pages/[feature]/`.
- Data interfaces and mock data live in `core/pages/[feature].ts`, not in the component files.
- Hooks are generic — they accept data of type `T` and work for any feature.
