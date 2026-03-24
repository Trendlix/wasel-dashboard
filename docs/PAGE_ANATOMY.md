# Page Anatomy — How Every Page Is Built

This document explains in full detail how pages in this dashboard are constructed:
the layout shell, the component layers, the styling system, the icon library,
the data/resource layer, and all the shared building blocks.

---

## Table of Contents

1. [App Shell & Layout](#1-app-shell--layout)
2. [Routing](#2-routing)
3. [Page Structure — The Standard Pattern](#3-page-structure--the-standard-pattern)
4. [Component Layers (Top to Bottom)](#4-component-layers-top-to-bottom)
5. [Styling System](#5-styling-system)
6. [Icon Library](#6-icon-library)
7. [Data & Resources Layer](#7-data--resources-layer)
8. [Table Pattern](#8-table-pattern)
9. [Form Pattern](#9-form-pattern)
10. [Nested Routes (Blogs)](#10-nested-routes-blogs)
11. [Sidebar Navigation](#11-sidebar-navigation)
12. [File Map Summary](#12-file-map-summary)

---

## 1. App Shell & Layout

Every page renders inside a fixed shell defined in `src/shared/components/layout/Layout.tsx`:

```
bg-main-titaniumWhite  ← full page background color
px-5 py-7              ← outer padding
flex gap-7             ← sidebar + main side by side
min-h-screen           ← full viewport height
```

```
Layout
├── <Sidebar />         (fixed width: w-64, bg-main-primary / navy blue)
└── <main className="flex-1">
        <Outlet />      (React Router — renders the current page here)
    </main>
```

**File:** [src/shared/components/layout/Layout.tsx](../src/shared/components/layout/Layout.tsx)

---

## 2. Routing

Routes are defined in `src/app/router.tsx` using React Router v7's `createBrowserRouter`.

```
/                   → DashboardPage
/users              → UsersPage
/drivers            → DriversPage
/storage-owners     → StorageOwnersPage
/verification       → VerificationPage
/trips              → TripsPage
/wallet-and-finance → WalletAndFinancePage
/analytics          → AnalyticsPage
/notifications      → NotificationsPage
/settings           → SettingsPage
/blogs              → BlogsPage  (+ nested children below)
  /blogs/add        → AddBlogPage
  /blogs/edit       → EditBlogPage
  /blogs/drafts     → DraftsBlogPage
/roles-and-permissions → RolesAndPermissionsPage
*                   → NotFoundPage
```

All page routes are **children of the root `/` route**, which renders `<App />` → `<Layout />`.
This means the sidebar and shell are always present; only the `<Outlet />` content changes.

**File:** [src/app/router.tsx](../src/app/router.tsx)

---

## 3. Page Structure — The Standard Pattern

Every page shell lives at `src/pages/[feature]/index.tsx` and follows this exact pattern:

```tsx
import PageTransition from "@/shared/components/common/PageTransition";
import PageHeader    from "@/shared/components/common/PageHeader";
import Analytics     from "@/shared/components/pages/[feature]/Analytics";
import FeatureTable  from "@/shared/components/pages/[feature]/FeatureTable";

const FeaturePage = () => {
    return (
        <PageTransition>                         {/* 1. Animation wrapper */}
            <PageHeader
                title="Feature Name"
                description="Short description"
            />                                   {/* 2. Title + subtitle */}
            <Analytics />                        {/* 3. Metric cards row */}
            <FeatureTable />                     {/* 4. Main content */}
        </PageTransition>
    );
};
```

The page shell itself is kept **as thin as possible** — no logic, no data fetching.
All logic and UI detail lives inside the components imported from `src/shared/components/pages/[feature]/`.

---

## 4. Component Layers (Top to Bottom)

### Layer 1 — PageTransition

**File:** [src/shared/components/common/PageTransition.tsx](../src/shared/components/common/PageTransition.tsx)

Wraps all page content in a Framer Motion animation:

```tsx
<motion.div
    initial={{ opacity: 0, y: 16 }}   // starts invisible, 16px below
    animate={{ opacity: 1, y: 0 }}    // fades in, slides up
    exit={{ opacity: 0, y: 8 }}       // fades out on leave
    transition={{ duration: 0.3, ease: "easeOut" }}
    className="flex flex-col gap-8"   // vertical stack with 8-unit gaps
>
    {children}
</motion.div>
```

Every section of a page has `gap-8` (32px) between it automatically.

---

### Layer 2 — PageHeader

**File:** [src/shared/components/common/PageHeader.tsx](../src/shared/components/common/PageHeader.tsx)

```tsx
<div>
    <h1 className="text-3xl leading-[36px] font-bold text-main-black">
        {title}
    </h1>
    <p className="text-main-gunmetalBlue text-base leading-[24px] mt-2">
        {description}
    </p>
</div>
```

| Element | Style |
|---|---|
| Title `<h1>` | `text-3xl`, `font-bold`, `text-main-black` |
| Subtitle `<p>` | `text-base`, `text-main-gunmetalBlue`, `mt-2` |

Props: `title: string`, `description: string`

---

### Layer 3 — Analytics (Metric Cards Row)

**File:** `src/shared/components/pages/[feature]/Analytics.tsx`

Each feature has its own `Analytics.tsx` that maps over its analytics config array and renders `AnalyticsCard` components in a flex row:

```tsx
// Example from users/Analytics.tsx
const Analytics = () => {
    const iconClasses = [
        "bg-main-primary/10! text-main-primary!",
        "bg-main-vividMint/10! text-main-vividMint!",
        "bg-main-mustardGold/10! text-main-mustardGold!",
    ];

    return (
        <div className="flex items-center *:flex-1 gap-6">
            {usersAnalytics.map((card) => (
                <AnalyticsCard
                    key={card.id}
                    {...card}
                    iconClass={iconClasses[card.id - 1]}
                    notColorfull={true}
                />
            ))}
        </div>
    );
};
```

**`AnalyticsCard` component** — [src/shared/components/common/AnalyticsCard.tsx](../src/shared/components/common/AnalyticsCard.tsx)

```tsx
interface IAnalyticsCard {
    id: number;
    title: string;
    value: string;
    description?: string;
    icon: LucideIcon;
    classname?: string;      // card background & border
    iconClass?: string;      // icon container color override
    notColorfull?: boolean;  // when true: uses dark text instead of white
}
```

Card structure:
```
<div className="p-6 common-rounded [classname]">
    ├── Title text (capitalize)
    ├── Value text (text-3xl font-bold)
    └── Icon container (common-rounded p-3)
        └── <Icon className="w-6 h-6" />
```

---

### Layer 4 — Main Content (Table or Custom)

The main content block is the feature-specific table, chart grid, or form content.
See [Table Pattern](#8-table-pattern) and [Form Pattern](#9-form-pattern) below.

---

## 5. Styling System

### Framework

**TailwindCSS v4** with a custom color palette defined as CSS variables,
referenced via `text-main-*`, `bg-main-*`, `border-main-*` classes.

### Custom Color Tokens

| Token | Description | Usage |
|---|---|---|
| `main-primary` | Navy/brand blue | Sidebar bg, active state, primary buttons, CTA |
| `main-white` | Pure white | Cards, table bg, sidebar text |
| `main-titaniumWhite` | Off-white/light gray | Full page background |
| `main-luxuryWhite` | Slightly tinted white | Table header bg, row hover bg |
| `main-whiteMarble` | Light gray | Borders, dividers |
| `main-black` | True black | Page `<h1>` titles |
| `main-mirage` | Dark navy | Body text, table cell values |
| `main-hydrocarbon` | Medium dark | Table header labels |
| `main-gunmetalBlue` | Gray-blue | Page subtitle / description text |
| `main-sharkGray` | Muted gray | Secondary text, timestamps, emails |
| `main-trueBlack` | Deep black | Input placeholders |
| `main-vividMint` | Green | Active / success status |
| `main-mustardGold` | Amber/yellow | Warning, pending status |
| `main-remove` | Red | Blocked / error / delete status |

### Shared Utility Class

```css
common-rounded   /* consistent border-radius used across all cards, buttons, inputs */
```

Applied on: sidebar, cards, table wrapper, search bar, icon containers, buttons.

### Spacing Scale Used

| Use case | Class |
|---|---|
| Gap between page sections | `gap-8` (handled by `PageTransition`) |
| Gap between analytics cards | `gap-6` |
| Table cell padding | `py-4 px-6` |
| Card inner padding | `p-6` |
| Sidebar outer padding | `py-7 px-5` |

### Status Badge Pattern

Status values are mapped to Tailwind class strings using a `statusStyles` record in the feature's data file:

```ts
export const statusStyles: Record<TStatus, { bg: string; text: string; label: string }> = {
    active:   { bg: "bg-main-vividMint/10",  text: "text-main-vividMint",  label: "Active"   },
    inactive: { bg: "bg-main-sharkGray/10",  text: "text-main-sharkGray",  label: "Inactive" },
    blocked:  { bg: "bg-main-remove/10",     text: "text-main-remove",     label: "Blocked"  },
};
```

Rendered as a pill badge:
```tsx
<span className={clsx("px-3 py-1 rounded-full text-xs font-medium", bg, text)}>
    {label}
</span>
```

### `clsx` Usage

`clsx` (from the `clsx` package) is used everywhere to conditionally combine class strings:

```tsx
clsx("base-class", condition && "conditional-class", { "another-class": isActive })
```

---

## 6. Icon Library

All icons come from **Lucide React** (`lucide-react`).

### Icons Used Per Feature

| Feature / Element | Icon | Import name |
|---|---|---|
| Dashboard (sidebar) | Grid/app icon | `LayoutDashboard` |
| Users | Person | `Users` |
| Drivers | Truck | `Truck` |
| Storage Owners | Warehouse | `Warehouse` |
| Verification | Checkmark circle | `CircleCheckBig` |
| Trips | Map pin | `MapPin` |
| Wallet / Finance | Wallet | `Wallet` |
| Analytics | Bar chart | `ChartColumn` |
| Notifications | Bell | `Bell` |
| Settings | Gear | `Settings` |
| Blogs & SEO | Pen tool | `PenTool` |
| Roles & Permissions | Shield | `Shield` |
| Search bar | Magnifier | `Search` |
| Export button | Download arrow | `Download` |
| Blog form — flag | Flag | `Flag` |
| Blog form — save | Floppy disk | `Save` |
| Blog form — preview | Eye | `Eye` |
| Blog form — nav | Chevrons | `ChevronLeft`, `ChevronRight` |
| Blog form — schedule | Clock | `Clock` |
| Blog form — publish | Globe | `Globe` |

### How Icons Are Used

**In sidebar config** — stored as the component reference (not JSX):
```ts
// src/shared/core/layout/sidebar.ts
import { Users, type LucideIcon } from "lucide-react";

interface ISidebarItem {
    icon: LucideIcon;  // stores the component class, not <Users />
}

{ id: 2, name: "users", icon: Users, to: "/users" }
```

Rendered in the sidebar:
```tsx
<item.icon />   // dynamically instantiated from the stored reference
```

**In AnalyticsCard** — same pattern:
```ts
// src/shared/core/pages/users.ts
import { Users } from "lucide-react";

export const usersAnalytics: IAnalyticsCard[] = [
    { id: 1, title: "Total Users", value: "12,345", icon: Users, ... }
]
```

```tsx
// AnalyticsCard.tsx receives icon as a prop named `icon`, aliased to `Icon`
const AnalyticsCard: React.FC<IAnalyticsCard> = ({ icon: Icon }) => (
    <Icon className="w-6 h-6" />
);
```

**In forms** — used directly as JSX:
```tsx
import { Flag, Save, Eye } from "lucide-react";

<Flag className="w-4 h-4" />
<Save className="w-4 h-4" />
```

---

## 7. Data & Resources Layer

### Structure

```
src/shared/core/pages/[feature].ts   ← interfaces, type aliases, mock data, analytics config
src/shared/data/[feature].ts         ← larger static datasets
```

### Standard file shape for a feature

```ts
// 1. Imports
import { Users } from "lucide-react";
import type { IAnalyticsCard } from "../../components/common/AnalyticsCard";

// 2. Status type
export type TUserStatus = "active" | "inactive" | "blocked";

// 3. Data interface
export interface IUser {
    id: number;
    name: string;
    email: string;
    phone: string;
    status: TUserStatus;
    totalTrips: number;
    joinDate: string;
}

// 4. Analytics card definitions (consumed by Analytics.tsx)
export const usersAnalytics: IAnalyticsCard[] = [
    { id: 1, title: "Total Users", value: "12,345", icon: Users,
      classname: "bg-main-white border border-main-whiteMarble" },
    ...
];

// 5. Style map for status badges
export const statusStyles: Record<TUserStatus, { bg: string; text: string; label: string }> = {
    active:   { bg: "bg-main-vividMint/10",  text: "text-main-vividMint",  label: "Active"   },
    inactive: { bg: "bg-main-sharkGray/10",  text: "text-main-sharkGray",  label: "Inactive" },
    blocked:  { bg: "bg-main-remove/10",     text: "text-main-remove",     label: "Blocked"  },
};

// 6. Mock data array
export const users: IUser[] = [
    { id: 1, name: "Mohamed Ahmed", email: "...", status: "active", ... },
    ...
];
```

---

## 8. Table Pattern

All data tables follow an identical pattern. The table component lives at
`src/shared/components/pages/[feature]/[Feature]Table.tsx`.

### Full flow

```
[Feature]Table.tsx
│
├── Import data + types from  src/shared/core/pages/[feature].ts
├── Import useTableSearch     src/shared/hooks/useTableSearch.ts
├── Import Searchbar          src/shared/components/common/Searchbar.tsx
├── Import TablePagination    src/shared/components/common/TablePagination.tsx
├── Import Table components   src/components/ui/table.tsx  (Shadcn)
└── Import EmptyRow           src/shared/components/common/EmptyRow.tsx
```

### Search hook

```ts
// src/shared/hooks/useTableSearch.ts
export const useTableSearch = <T extends object>(data: T[], keys: (keyof T)[]) => {
    const [query, setQuery] = useState("");
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return data;
        return data.filter((item) =>
            keys.some((key) => String(item[key] ?? "").toLowerCase().includes(q))
        );
    }, [data, keys, query]);
    return { query, setQuery, filtered };
};
```

Usage inside a table component:
```tsx
const { query, setQuery, filtered } = useTableSearch(users, ["name", "email", "phone", "status"]);
```

### Pagination logic (inside table component)

```tsx
const PAGE_SIZE = 5;
const [currentPage, setCurrentPage] = useState(1);

const totalPages  = Math.ceil(filtered.length / PAGE_SIZE);
const paginated   = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

// Reset to page 1 on new search
const handleSearch = (q: string) => { setQuery(q); setCurrentPage(1); };
```

### Table DOM structure

```
<div className="space-y-6">
    <Searchbar placeholder="Search..." value={query} onChange={handleSearch} />

    <div className="bg-main-white border border-main-whiteMarble common-rounded overflow-hidden">
        <Table>
            <TableHeader>
                <TableRow className="bg-main-luxuryWhite border-b border-main-whiteMarble hover:bg-main-luxuryWhite">
                    <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">
                        Column Name
                    </TableHead>
                    ...
                </TableRow>
            </TableHeader>
            <TableBody>
                {paginated.length > 0
                    ? paginated.map((item) => <ItemRow key={item.id} item={item} />)
                    : <EmptyRow colSpan={N} />
                }
            </TableBody>
        </Table>

        <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
        />
    </div>
</div>
```

### Row sub-component pattern

Each table file defines a private `[Feature]Row` component that renders one `<TableRow>`:

```tsx
const UserRow = ({ user }: { user: IUser }) => (
    <TableRow className="border-b border-main-whiteMarble hover:bg-main-luxuryWhite/50 transition-colors">
        <TableCell className="py-4 px-6">...</TableCell>
        ...
    </TableRow>
);
```

### Avatar / initials pattern (used in Users, Drivers)

```tsx
const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

// Rendered as:
<div className="w-10 h-10 rounded-full bg-main-primary flex items-center justify-center">
    <span className="text-main-white text-xs font-semibold">{initials}</span>
</div>
```

### Searchbar component

```tsx
// src/shared/components/common/Searchbar.tsx
interface ISearchbar {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
}
```

Visual structure:
```
<div className="bg-main-white border border-main-whiteMarble common-rounded p-6 flex items-center gap-4">
    ├── Search input wrapper (flex, border, h-10, flex-1)
    │   ├── <Search /> icon (lucide, size=16, text-main-trueBlack/50)
    │   └── <Input /> (Shadcn, no border, no shadow)
    ├── "Search" button (border, text-main-trueBlack/50)
    └── "Export" button (bg-main-primary, text-main-white, <Download /> icon)
```

### Pagination component

```tsx
// src/shared/components/common/TablePagination.tsx
interface ITablePagination {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}
```

- Smart windowing: shows at most 5 total page numbers with ellipsis for large sets
- Active page: `bg-main-primary text-main-white`
- Disabled prev/next: `pointer-events-none opacity-50`
- Built on Shadcn's `<Pagination />` components

---

## 9. Form Pattern

Forms are used in the Blogs feature and Settings. The form system is built on:

- **React Hook Form** for form state and validation
- **Zod** for schema definition and type inference
- **FormItems.tsx** for the field components

### Zod Schema → TypeScript Types

```ts
const blogFormSchema = z.object({
    title:           z.string().min(1, "Title is required"),
    slug:            z.string().min(1, "Slug is required"),
    keywords:        z.array(z.string()).default([]),
    paragraph:       z.string().min(1, "Content is required"),
    coverImg:        z.any().optional(),
    isDraft:         z.boolean().optional().default(false),
    schedule:        scheduleSchema.optional(),
    // ... more fields
});

// Infer the TypeScript type from the schema — no duplication
export type IBlogFormData = z.infer<typeof blogFormSchema>;
```

### React Hook Form setup

```tsx
const form = useForm<IBlogFormData>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: { ... },
});
```

### FormItems.tsx — Field Component Library

**File:** [src/shared/components/common/FormItems.tsx](../src/shared/components/common/FormItems.tsx)

Key components exported:

| Component | Purpose |
|---|---|
| `CommonInput` | Labeled text / number input |
| `CommonTextarea` | Labeled multiline textarea |
| `CommonFileInput` | File/image upload input |
| `TagsInput` | Dynamic add/remove tag chips |
| `RichEditorField` | TipTap WYSIWYG rich text editor |

All are integrated with React Hook Form via `<Controller />` or `<FormField />`.

### Icon usage in forms

Icons from `lucide-react` used directly as JSX in form buttons and UI:

```tsx
import { Flag, Save, Eye, Clock, Globe, ChevronLeft, ChevronRight } from "lucide-react";

<Button><Save className="w-4 h-4" /> Save Draft</Button>
<Button><Globe className="w-4 h-4" /> Publish</Button>
```

---

## 10. Nested Routes (Blogs)

The `blogs` page is the only feature with child routes. The parent `BlogsPage`
renders a tab bar + `<Outlet />`:

```tsx
// src/pages/blogs/index.tsx
<PageTransition>
    <PageHeader title="Blog & SEO Management" description="..." />
    <div className="rounded-lg bg-white border border-main-whiteMarble">
        <BlogTabs />        {/* Tab navigation: Add / Edit / Drafts */}
        <div className="p-4 md:p-6">
            <Outlet />      {/* Child route renders here */}
        </div>
    </div>
</PageTransition>
```

Router config:
```ts
{
    path: "blogs",
    element: <BlogsPage />,
    children: [
        { index: true, element: <Navigate to="add" replace /> },  // default tab
        { path: "add",    element: <AddBlogPage />    },
        { path: "edit",   element: <EditBlogPage />   },
        { path: "drafts", element: <DraftsBlogPage /> },
    ],
}
```

---

## 11. Sidebar Navigation

**Files:**
- Config: [src/shared/core/layout/sidebar.ts](../src/shared/core/layout/sidebar.ts)
- Component: [src/shared/components/layout/Sidebar.tsx](../src/shared/components/layout/Sidebar.tsx)

### Config shape

```ts
interface ISidebarItem {
    id: number;
    name: string;       // display label (auto-capitalized in sidebar)
    icon: LucideIcon;   // component reference, not JSX
    to: string;         // React Router path
}
```

### Active state

Uses React Router's `<NavLink>` which provides an `isActive` boolean:

```tsx
<NavLink
    to={item.to}
    className={({ isActive }) =>
        clsx(baseClass, {
            "bg-main-white text-main-primary font-bold": isActive,
            "bg-transparent text-main-white font-medium": !isActive,
        })
    }
>
```

| State | Background | Text color |
|---|---|---|
| Active | `bg-main-white` | `text-main-primary` (navy) |
| Inactive | `bg-transparent` | `text-main-white` (white) |

### Sidebar structure

```
<aside className="w-64 bg-main-primary common-rounded sticky top-7 h-max">
    <Header>                          ← Logo + "Management Panel" label + divider
    <Nav>                             ← Mapped NavLink items
    <Footer>                          ← Avatar initials + name + email
```

---

## 12. File Map Summary

```
src/
├── app/router.tsx                              → Route definitions
├── shared/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.tsx                     → App shell (sidebar + main)
│   │   │   └── Sidebar.tsx                    → Nav sidebar
│   │   ├── common/
│   │   │   ├── PageTransition.tsx             → Framer Motion wrapper
│   │   │   ├── PageHeader.tsx                 → Title + description
│   │   │   ├── AnalyticsCard.tsx              → Metric card component
│   │   │   ├── Searchbar.tsx                  → Search + export bar
│   │   │   ├── TablePagination.tsx            → Pagination controls
│   │   │   ├── EmptyRow.tsx                   → Empty table state
│   │   │   └── FormItems.tsx                  → Form field components
│   │   └── pages/
│   │       └── [feature]/
│   │           ├── Analytics.tsx              → Metrics row for this feature
│   │           ├── [Feature]Table.tsx         → Searchable, paginated table
│   │           └── [Feature]Form.tsx          → Create/edit form
│   ├── core/
│   │   ├── layout/sidebar.ts                  → ISidebarItem + sidebarItems[]
│   │   └── pages/[feature].ts                 → IFeature, TStatus, statusStyles, mock data, analyticsConfig
│   ├── data/
│   │   └── blogs.ts                           → Blog dummy data + BlogCardItem interface
│   └── hooks/
│       └── useTableSearch.ts                  → Generic search + filter hook
└── pages/
    └── [feature]/
        └── index.tsx                          → Page shell (thin, composition only)
```
