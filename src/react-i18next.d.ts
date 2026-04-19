import "react-i18next";
import type common from "@/locales/en/common.json";
import type sidebar from "@/locales/en/sidebar.json";
import type layout from "@/locales/en/layout.json";
import type settings from "@/locales/en/settings.json";
import type notifications from "@/locales/en/notifications.json";
import type drivers from "@/locales/en/drivers.json";
import type users from "@/locales/en/users.json";
import type trips from "@/locales/en/trips.json";
import type auth from "@/locales/en/auth.json";
import type commission from "@/locales/en/commission.json";
import type voucher from "@/locales/en/voucher.json";
import type cms from "@/locales/en/cms.json";
import type dataManagement from "@/locales/en/dataManagement.json";
import type roles from "@/locales/en/roles.json";
import type verification from "@/locales/en/verification.json";
import type support from "@/locales/en/support.json";
import type analytics from "@/locales/en/analytics.json";
import type dashboard from "@/locales/en/dashboard.json";
import type legalHelp from "@/locales/en/legalHelp.json";
import type blogs from "@/locales/en/blogs.json";
import type wallet from "@/locales/en/wallet.json";
import type storageOwners from "@/locales/en/storageOwners.json";
import type orders from "@/locales/en/orders.json";
import type customers from "@/locales/en/customers.json";

declare module "react-i18next" {
    interface CustomTypeOptions {
        defaultNS: "common";
        resources: {
            common: typeof common;
            sidebar: typeof sidebar;
            layout: typeof layout;
            settings: typeof settings;
            notifications: typeof notifications;
            drivers: typeof drivers;
            users: typeof users;
            trips: typeof trips;
            auth: typeof auth;
            commission: typeof commission;
            voucher: typeof voucher;
            cms: typeof cms;
            dataManagement: typeof dataManagement;
            roles: typeof roles;
            verification: typeof verification;
            support: typeof support;
            analytics: typeof analytics;
            dashboard: typeof dashboard;
            legalHelp: typeof legalHelp;
            blogs: typeof blogs;
            wallet: typeof wallet;
            storageOwners: typeof storageOwners;
            orders: typeof orders;
            customers: typeof customers;
        };
    }
}
