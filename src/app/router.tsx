import { Suspense, lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import AuthPage from "../pages/auth";
import Protect from "./protect";
import Guest from "./guest";
import OrdersPage from "../pages/orders";
import CustomersPage from "../pages/customers";
import SettingsPage from "../pages/settings";
import NotFoundPage from "../pages/not-found";
import VerificationPage from "../pages/verification";
import TripsPage from "../pages/trips";
import NotificationsPage from "../pages/notifications";
const AnalyticsPage = lazy(() => import("../pages/analytics"));
import UsersPage from "../pages/users";
// import WalletAndFinancePage from "../pages/wallet-and-finance";
// import StorageOwnersPage from "../pages/storage-owners";
import DriversPage from "../pages/drivers";
import DriverFullViewPage from "../pages/drivers/detail";
// import BlogsPage from "@/pages/blogs";
// import AddBlogPage from "@/pages/blogs/AddBlogPage";
// import EditBlogPage from "@/pages/blogs/EditBlogPage";
// import DraftsBlogPage from "@/pages/blogs/DraftsBlogPage";
import DataManagementLayout from "@/pages/data-management";
import TruckTypesPage from "@/pages/data-management/TruckTypesPage";
import StorageTypesPage from "@/pages/data-management/StorageTypesPage";
import GoodsTypesPage from "@/pages/data-management/GoodsTypesPage";
import RolesAndPermissionsLayout from "@/pages/roles-and-permissions";
import RolesPage from "@/pages/roles-and-permissions/RolesPage";
import UserManagementPage from "@/pages/roles-and-permissions/UserManagementPage";
import CommissionAndPricingPage from "@/pages/commission-and-pricing";
import VoucherAndPromoPage from "@/pages/voucher-and-promo";
import AcceptInvitationPage from "@/pages/accept-invitation";
import SupportTicketsPage from "@/pages/support-tickets";
import TicketReplyPage from "@/pages/support-tickets/TicketReplyPage";
import NotificationsDriverTab from "@/pages/notifications/driver";
import NotificationsUserTab from "@/pages/notifications/user";
import NotificationsTripTab from "@/pages/notifications/trip";
import NotificationsOffersUpdatesTab from "@/pages/notifications/offers-updates";
import NotificationsOffersUpdatesDetail from "@/pages/notifications/detail/offers-updates";
import NotificationsUserDetail from "@/pages/notifications/detail/user";
import NotificationsDriverDetail from "@/pages/notifications/detail/driver";
import NotificationsTripDetail from "@/pages/notifications/detail/trip";
import HomeIndexRedirect from "./HomeIndexRedirect";
import { lazyRouteFallback } from "./lazy-route-fallback";
import {
    AboutFoundedPage,
    AboutFuturePage,
    AboutHeroPage,
    AboutPage,
    AboutStandForPage,
    CmsBlogsIndexRedirect,
    CmsBlogsInfoPage,
    CmsBlogsItemsAllPage,
    CmsBlogsItemsEditPage,
    CmsBlogsItemsLayout,
    CmsBlogsItemsNewPage,
    CmsBlogsLayout,
    CmsLegalHelpIndexRedirect,
    CmsLegalHelpLayout,
    CmsPage,
    CommonAppPage,
    CommonBrandPage,
    CommonFaqsPage,
    CommonPage,
    ContactPage,
    MarketingFaqHeroPage,
    MarketingFaqIndexRedirect,
    MarketingFaqItemsPage,
    MarketingFaqLayout,
    MarketingPrivacyHeroPage,
    MarketingPrivacyIndexRedirect,
    MarketingPrivacyItemsPage,
    MarketingPrivacyLayout,
    MarketingTermsHeroPage,
    MarketingTermsIndexRedirect,
    MarketingTermsItemsPage,
    MarketingTermsLayout,
    SeoAboutPage,
    SeoBlogsPage,
    SeoContactPage,
    SeoFaqsPage,
    SeoHomePage,
    SeoOrderTrackingPage,
    SeoPage,
    SeoPrivacyPage,
    SeoServicesPage,
    SeoTermsPage,
    ServicesAdvertisingPage,
    ServicesHeroPage,
    ServicesPage,
    ServicesWarehousePage,
    HomePageCms,
    HomeHeroPage,
    HomePlatformPage,
    HomeTransportPage,
    HomeMaximizingPage,
} from "./cms-lazy";

export const router = createBrowserRouter([
    { path: "account", element: <Guest><AuthPage /></Guest> },
    { path: "accept-invitation", element: <Guest><AcceptInvitationPage /></Guest> },
    {
        path: "/",
        element: <Protect><App /></Protect>,
        children: [
            { index: true, element: <HomeIndexRedirect /> },
            { path: "orders", element: <OrdersPage /> },
            { path: "customers", element: <CustomersPage /> },
            { path: "settings", element: <SettingsPage /> },
            { path: "verification", element: <VerificationPage /> },
            { path: "trips", element: <TripsPage /> },
            { path: "analytics", element: <Suspense fallback={lazyRouteFallback}><AnalyticsPage /></Suspense> },
            { path: "users", element: <UsersPage /> },
            { path: "drivers", element: <DriversPage /> },
            { path: "drivers/:id", element: <DriverFullViewPage /> },
            // { path: "wallet-and-finance", element: <WalletAndFinancePage /> },
            // { path: "storage-owners", element: <StorageOwnersPage /> },

            {
                path: "notifications",
                element: <NotificationsPage />,
                handle: { transitionGroup: "notifications" },
                children: [
                    { index: true, element: <Navigate to="driver" replace /> },
                    { path: "driver", element: <NotificationsDriverTab /> },
                    { path: "user",   element: <NotificationsUserTab /> },
                    { path: "trip",   element: <NotificationsTripTab /> },
                    { path: "offers-updates", element: <NotificationsOffersUpdatesTab /> },
                    { path: "offers-updates/:source/:campaignId", element: <NotificationsOffersUpdatesDetail /> },
                    { path: "users/:notificationId",   element: <NotificationsUserDetail /> },
                    { path: "drivers/:notificationId", element: <NotificationsDriverDetail /> },
                    { path: "trips/:notificationId",   element: <NotificationsTripDetail /> },
                ]
            },

            {
                path: "cms",
                element: <Suspense fallback={lazyRouteFallback}><CmsPage /></Suspense>,
                handle: { transitionGroup: "cms" },
                children: [
                    { index: true, element: <Navigate to="home/hero" replace /> },
                    {
                        path: "home",
                        element: <HomePageCms />,
                        children: [
                            { index: true, element: <Navigate to="hero" replace /> },
                            { path: "hero",       element: <HomeHeroPage /> },
                            { path: "platform",   element: <HomePlatformPage /> },
                            { path: "transport",  element: <HomeTransportPage /> },
                            { path: "maximizing", element: <HomeMaximizingPage /> },
                        ],
                    },
                    {
                        path: "common",
                        element: <CommonPage />,
                        children: [
                            { index: true, element: <Navigate to="app" replace /> },
                            { path: "app", element: <CommonAppPage /> },
                            { path: "brand", element: <CommonBrandPage /> },
                            { path: "faqs", element: <CommonFaqsPage /> },
                        ],
                    },
                    {
                        path: "about",
                        element: <AboutPage />,
                        children: [
                            { index: true, element: <Navigate to="hero" replace /> },
                            { path: "hero",      element: <AboutHeroPage /> },
                            { path: "founded",   element: <AboutFoundedPage /> },
                            { path: "stand-for", element: <AboutStandForPage /> },
                            { path: "future",    element: <AboutFuturePage /> },
                        ],
                    },
                    {
                        path: "services",
                        element: <ServicesPage />,
                        children: [
                            { index: true, element: <Navigate to="hero" replace /> },
                            { path: "hero",        element: <ServicesHeroPage /> },
                            { path: "warehouse",   element: <ServicesWarehousePage /> },
                            { path: "advertising", element: <ServicesAdvertisingPage /> },
                        ],
                    },
                    { path: "contact", element: <ContactPage /> },
                    {
                        path: "seo",
                        element: <SeoPage />,
                        children: [
                            { index: true, element: <Navigate to="home" replace /> },
                            { path: "home",           element: <SeoHomePage /> },
                            { path: "about",          element: <SeoAboutPage /> },
                            { path: "contact",        element: <SeoContactPage /> },
                            { path: "services",       element: <SeoServicesPage /> },
                            { path: "blogs",          element: <SeoBlogsPage /> },
                            { path: "order-tracking", element: <SeoOrderTrackingPage /> },
                            { path: "faqs",    element: <SeoFaqsPage /> },
                            { path: "terms",   element: <SeoTermsPage /> },
                            { path: "privacy", element: <SeoPrivacyPage /> },
                        ],
                    },
                    {
                        path: "blogs",
                        element: <CmsBlogsLayout />,
                        children: [
                            { index: true, element: <CmsBlogsIndexRedirect /> },
                            { path: "info", element: <CmsBlogsInfoPage /> },
                            {
                                path: "blog-items",
                                element: <CmsBlogsItemsLayout />,
                                children: [
                                    { index: true, element: <CmsBlogsItemsAllPage /> },
                                    { path: "new", element: <CmsBlogsItemsNewPage /> },
                                    { path: ":id/edit", element: <CmsBlogsItemsEditPage /> },
                                    { path: "drafts", element: <Navigate to="/cms/blogs/blog-items" replace /> },
                                    { path: "scheduled", element: <Navigate to="/cms/blogs/blog-items" replace /> },
                                    { path: "published", element: <Navigate to="/cms/blogs/blog-items" replace /> },
                                ],
                            },
                        ],
                    },
                    {
                        path: "legal-help",
                        element: <CmsLegalHelpLayout />,
                        children: [
                            { index: true, element: <CmsLegalHelpIndexRedirect /> },
                            {
                                path: "marketing-faq",
                                element: <MarketingFaqLayout />,
                                children: [
                                    { index: true, element: <MarketingFaqIndexRedirect /> },
                                    { path: "hero", element: <MarketingFaqHeroPage /> },
                                    { path: "faqs", element: <MarketingFaqItemsPage /> },
                                ],
                            },
                            {
                                path: "marketing-terms",
                                element: <MarketingTermsLayout />,
                                children: [
                                    { index: true, element: <MarketingTermsIndexRedirect /> },
                                    { path: "hero", element: <MarketingTermsHeroPage /> },
                                    { path: "faqs", element: <MarketingTermsItemsPage /> },
                                ],
                            },
                            {
                                path: "marketing-privacy",
                                element: <MarketingPrivacyLayout />,
                                children: [
                                    { index: true, element: <MarketingPrivacyIndexRedirect /> },
                                    { path: "hero", element: <MarketingPrivacyHeroPage /> },
                                    { path: "faqs", element: <MarketingPrivacyItemsPage /> },
                                ],
                            },
                        ],
                    },
                    // { path: "add", element: <AddBlogPage /> },
                    // { path: "edit", element: <EditBlogPage /> },
                    // { path: "drafts", element: <DraftsBlogPage /> },
                ],
            },

            { path: "support-tickets", element: <SupportTicketsPage /> },
            { path: "support-tickets/:ticketId/reply", element: <TicketReplyPage /> },
            { path: "commission-and-pricing", element: <CommissionAndPricingPage /> },
            { path: "voucher-and-promo", element: <VoucherAndPromoPage /> },

            {
                path: "data-management",
                element: <DataManagementLayout />,
                handle: { transitionGroup: "data-management" },
                children: [
                    { index: true, element: <Navigate to="trucks" replace /> },
                    { path: "trucks", element: <TruckTypesPage /> },
                    { path: "storage", element: <StorageTypesPage /> },
                    { path: "goods", element: <GoodsTypesPage /> },
                ],
            },

            { path: "legal-help", element: <Navigate to="/cms/legal-help" replace /> },

            {
                path: "roles-and-permissions",
                element: <RolesAndPermissionsLayout />,
                handle: { transitionGroup: "roles-and-permissions" },
                children: [
                    { index: true, element: <Navigate to="roles" replace /> },
                    { path: "roles", element: <RolesPage /> },
                    { path: "users", element: <UserManagementPage /> },
                ],
            },
        ],
    },
    { path: "*", element: <NotFoundPage /> },
]);
