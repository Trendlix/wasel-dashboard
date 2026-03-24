# Pages

Each folder in `src/pages/` maps to a route and contains a single `index.tsx` that acts as the **page shell** — it composes the layout and imports feature-specific components from `src/shared/components/pages/`.

## Route Map

| Route | Page Folder | Notes |
|---|---|---|
| `/` | `dashboard/` | Default landing page |
| `/users` | `users/` | |
| `/drivers` | `drivers/` | |
| `/storage-owners` | `storage-owners/` | |
| `/verification` | `verification/` | |
| `/trips` | `trips/` | |
| `/wallet-and-finance` | `wallet-and-finance/` | |
| `/analytics` | `analytics/` | |
| `/notifications` | `notifications/` | |
| `/blogs` | `blogs/` | Nested routes (see below) |
| `/roles-and-permissions` | `roles-and-permissions/` | |
| `/settings` | `settings/` | |
| `*` | `not-found/` | 404 fallback |

Routes are defined in `src/app/router.tsx` using React Router's `createBrowserRouter`.

## Standard Page Pattern

Every page follows this structure:

```tsx
// src/pages/[feature]/index.tsx

export default function FeaturePage() {
  return (
    <PageTransition>                    {/* Framer Motion fade-in wrapper */}
      <PageHeader
        title="Feature Name"
        description="Short description"
      />
      <FeatureAnalytics />             {/* Stat cards row */}
      <FeatureTable />                 {/* Searchable, paginated table */}
    </PageTransition>
  );
}
```

### Layers in order

1. **`PageTransition`** — wraps everything, provides the fade + slide-up entrance animation.
2. **`PageHeader`** — displays the page title and subtitle.
3. **Analytics row** — a row of `AnalyticsCard` components with key metrics.
4. **Main content** — table, form, or custom UI imported from `src/shared/components/pages/[feature]/`.

## Blogs — Nested Routes

`blogs/` is the only page with child routes:

```
/blogs              →  BlogsPage (index)
/blogs/add          →  AddBlogPage
/blogs/edit         →  EditBlogPage
/blogs/drafts       →  DraftsBlogPage
```

The `blogs/index.tsx` renders `<BlogTabs />` and an `<Outlet />` so child routes render inside the same tab layout.

## How to Add a New Page

1. **Create the folder and shell:**

```
src/pages/my-feature/
└── index.tsx
```

2. **Add page-specific components** (table, form, analytics) in:

```
src/shared/components/pages/my-feature/
```

3. **Add mock data and interfaces** in:

```
src/shared/core/pages/my-feature.ts
```

4. **Register the route** in `src/app/router.tsx`:

```tsx
{
  path: "my-feature",
  element: <MyFeaturePage />,
},
```

5. **Add the sidebar entry** in `src/shared/core/layout/sidebar.ts`:

```ts
{
  id: 13,
  name: "My Feature",
  icon: SomeIcon,
  route: "/my-feature",
}
```

## File Naming Conventions

- Page shells → `index.tsx` (always, inside a named folder)
- Sub-pages with their own route → `FeatureNamePage.tsx` (e.g. `AddBlogPage.tsx`)
- Feature sub-components → `PascalCase.tsx` inside `src/shared/components/pages/[feature]/`
