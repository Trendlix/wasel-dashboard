import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from "@/locales/en/common.json";
import arCommon from "@/locales/ar/common.json";
import enSidebar from "@/locales/en/sidebar.json";
import arSidebar from "@/locales/ar/sidebar.json";
import enLayout from "@/locales/en/layout.json";
import arLayout from "@/locales/ar/layout.json";
import enSettings from "@/locales/en/settings.json";
import arSettings from "@/locales/ar/settings.json";
import enNotifications from "@/locales/en/notifications.json";
import arNotifications from "@/locales/ar/notifications.json";
import enDrivers from "@/locales/en/drivers.json";
import arDrivers from "@/locales/ar/drivers.json";
import enUsers from "@/locales/en/users.json";
import arUsers from "@/locales/ar/users.json";
import enTrips from "@/locales/en/trips.json";
import arTrips from "@/locales/ar/trips.json";
import enAuth from "@/locales/en/auth.json";
import arAuth from "@/locales/ar/auth.json";
import enCommission from "@/locales/en/commission.json";
import arCommission from "@/locales/ar/commission.json";
import enVoucher from "@/locales/en/voucher.json";
import arVoucher from "@/locales/ar/voucher.json";
import enCms from "@/locales/en/cms.json";
import arCms from "@/locales/ar/cms.json";
import enDataManagement from "@/locales/en/dataManagement.json";
import arDataManagement from "@/locales/ar/dataManagement.json";
import enRoles from "@/locales/en/roles.json";
import arRoles from "@/locales/ar/roles.json";
import enVerification from "@/locales/en/verification.json";
import arVerification from "@/locales/ar/verification.json";
import enSupport from "@/locales/en/support.json";
import arSupport from "@/locales/ar/support.json";
import enAnalytics from "@/locales/en/analytics.json";
import arAnalytics from "@/locales/ar/analytics.json";
import enDashboard from "@/locales/en/dashboard.json";
import arDashboard from "@/locales/ar/dashboard.json";
import enLegalHelp from "@/locales/en/legalHelp.json";
import arLegalHelp from "@/locales/ar/legalHelp.json";
import enBlogs from "@/locales/en/blogs.json";
import arBlogs from "@/locales/ar/blogs.json";
import enWallet from "@/locales/en/wallet.json";
import arWallet from "@/locales/ar/wallet.json";
import enStorageOwners from "@/locales/en/storageOwners.json";
import arStorageOwners from "@/locales/ar/storageOwners.json";
import enOrders from "@/locales/en/orders.json";
import arOrders from "@/locales/ar/orders.json";
import enCustomers from "@/locales/en/customers.json";
import arCustomers from "@/locales/ar/customers.json";

const resources = {
    en: {
        common: enCommon,
        sidebar: enSidebar,
        layout: enLayout,
        settings: enSettings,
        notifications: enNotifications,
        drivers: enDrivers,
        users: enUsers,
        trips: enTrips,
        auth: enAuth,
        commission: enCommission,
        voucher: enVoucher,
        cms: enCms,
        dataManagement: enDataManagement,
        roles: enRoles,
        verification: enVerification,
        support: enSupport,
        analytics: enAnalytics,
        dashboard: enDashboard,
        legalHelp: enLegalHelp,
        blogs: enBlogs,
        wallet: enWallet,
        storageOwners: enStorageOwners,
        orders: enOrders,
        customers: enCustomers,
    },
    ar: {
        common: arCommon,
        sidebar: arSidebar,
        layout: arLayout,
        settings: arSettings,
        notifications: arNotifications,
        drivers: arDrivers,
        users: arUsers,
        trips: arTrips,
        auth: arAuth,
        commission: arCommission,
        voucher: arVoucher,
        cms: arCms,
        dataManagement: arDataManagement,
        roles: arRoles,
        verification: arVerification,
        support: arSupport,
        analytics: arAnalytics,
        dashboard: arDashboard,
        legalHelp: arLegalHelp,
        blogs: arBlogs,
        wallet: arWallet,
        storageOwners: arStorageOwners,
        orders: arOrders,
        customers: arCustomers,
    },
} as const;

/** Resolves when i18n is ready — call `useLanguageStore.getState().init()` after this. */
export const i18nInitPromise = i18n.use(initReactI18next).init({
    resources,
    fallbackLng: "en",
    lng: "en",
    defaultNS: "common",
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
});

export default i18n;
