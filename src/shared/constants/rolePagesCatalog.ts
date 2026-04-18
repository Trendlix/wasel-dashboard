/**
 * Canonical list of assignable dashboard page keys + human labels.
 * Order follows the main sidebar where possible; legacy keys stay at the end so existing roles still display correctly.
 */
export const ROLE_PAGE_CATALOG: { id: string; label: string }[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "users", label: "Users" },
    { id: "drivers", label: "Drivers" },
    { id: "verification", label: "Verification" },
    { id: "trips", label: "Trips" },
    { id: "analytics", label: "Analytics" },
    { id: "notifications", label: "Notifications" },
    { id: "settings", label: "Settings" },
    { id: "cms", label: "CMS" },
    { id: "legal-help", label: "Legal Help" },
    { id: "roles-and-permissions", label: "Roles & Permissions" },
    { id: "commission-and-pricing", label: "Commission & Pricing" },
    { id: "voucher-and-promo", label: "Voucher & Promo" },
    { id: "trucks-storages-data", label: "Data Management" },
    { id: "support-tickets", label: "Support Tickets" },
    // Legacy / optional modules (still valid if stored on a role)
    { id: "orders", label: "Orders" },
    { id: "customers", label: "Customers" },
    { id: "blogs", label: "Blogs" },
    { id: "wallet-and-finance", label: "Wallet & Finance" },
    { id: "storage-owners", label: "Storage Owners" },
];
