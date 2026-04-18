type RawRolePage = string | { key?: unknown; enabled?: unknown } | null | undefined;

const PAGE_KEY_TO_PATH: Record<string, string> = {
    dashboard: "/",
    orders: "/orders",
    customers: "/customers",
    users: "/users",
    drivers: "/drivers",
    verification: "/verification",
    trips: "/trips",
    analytics: "/analytics",
    "wallet-and-finance": "/wallet-and-finance",
    "storage-owners": "/storage-owners",
    notifications: "/notifications",
    settings: "/settings",
    "commission-and-pricing": "/commission-and-pricing",
    "voucher-and-promo": "/voucher-and-promo",
    "trucks-storages-data": "/data-management",
    cms: "/cms",
    "roles-and-permissions": "/roles-and-permissions",
    "support-tickets": "/support-tickets",
    "legal-help": "/cms/legal-help",
    seo: "/cms/seo",
};

const PAGE_KEY_ALIASES: Record<string, string> = {
    "roles & permissions": "roles-and-permissions",
    "commission & pricing": "commission-and-pricing",
    "voucher & promo": "voucher-and-promo",
    "data management": "trucks-storages-data",
    "support tickets": "support-tickets",
    "legal & help": "legal-help",
    "legal help": "legal-help",
    "cms": "cms",
    "wallet/finance": "wallet-and-finance",
    verfication: "verification",
};

const normalizePageKey = (key: string): string => {
    const normalized = key.trim().toLowerCase();
    return PAGE_KEY_ALIASES[normalized] ?? normalized;
};

export const extractEnabledPageKeys = (pages: unknown): string[] => {
    if (!Array.isArray(pages)) return [];

    return pages
        .map((page): string | null => {
            const rawPage = page as RawRolePage;

            if (typeof rawPage === "string") {
                return normalizePageKey(rawPage);
            }

            if (rawPage && typeof rawPage === "object") {
                if (rawPage.enabled === false) return null;
                if (typeof rawPage.key === "string") {
                    return normalizePageKey(rawPage.key);
                }
            }

            return null;
        })
        .filter((value): value is string => Boolean(value));
};

export const resolveFirstAccessiblePath = (role: { slug?: string; pages?: unknown } | null | undefined): string => {
    if (role?.slug === "super-admin" || role?.slug === "super_admin") {
        return "/";
    }

    const pageKeys = extractEnabledPageKeys(role?.pages);
    const firstMatchedPath = pageKeys.find((key) => PAGE_KEY_TO_PATH[key]) ?? null;

    if (!firstMatchedPath) return "/";
    return PAGE_KEY_TO_PATH[firstMatchedPath];
};

export const canAccessPath = (
    role: { slug?: string; pages?: unknown } | null | undefined,
    path: string
): boolean => {
    if (role?.slug === "super-admin" || role?.slug === "super_admin") {
        return true;
    }

    const pageKeys = extractEnabledPageKeys(role?.pages);

    return pageKeys.some((key) => {
        const allowedPath = PAGE_KEY_TO_PATH[key];
        if (!allowedPath) return false;
        if (allowedPath === "/") return path === "/";
        return path === allowedPath || path.startsWith(`${allowedPath}/`);
    });
};
