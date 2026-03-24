import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import DashboardPage from "../pages/dashboard";
import OrdersPage from "../pages/orders";
import CustomersPage from "../pages/customers";
import SettingsPage from "../pages/settings";
import NotFoundPage from "../pages/not-found";
import VerificationPage from "../pages/verification";
import TripsPage from "../pages/trips";
import NotificationsPage from "../pages/notifications";
import AnalyticsPage from "../pages/analytics";
import UsersPage from "../pages/users";
import WalletAndFinancePage from "../pages/wallet-and-finance";
import StorageOwnersPage from "../pages/storage-owners";
import DriversPage from "../pages/drivers";
import BlogsPage from "@/pages/blogs";
import AddBlogPage from "@/pages/blogs/AddBlogPage";
import EditBlogPage from "@/pages/blogs/EditBlogPage";
import DraftsBlogPage from "@/pages/blogs/DraftsBlogPage";
import TrucksStoragesLayout from "@/pages/trucks-storages-data";
import TruckTypesPage from "@/pages/trucks-storages-data/TruckTypesPage";
import StorageTypesPage from "@/pages/trucks-storages-data/StorageTypesPage";
import RolesAndPermissionsLayout from "@/pages/roles-and-permissions";
import RolesPage from "@/pages/roles-and-permissions/RolesPage";
import UserManagementPage from "@/pages/roles-and-permissions/UserManagementPage";
import CommissionAndPricingPage from "@/pages/commission-and-pricing";
import VoucherAndPromoPage from "@/pages/voucher-and-promo";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <DashboardPage /> },
            { path: "orders", element: <OrdersPage /> },
            { path: "customers", element: <CustomersPage /> },
            { path: "settings", element: <SettingsPage /> },
            { path: "verification", element: <VerificationPage /> },
            { path: "trips", element: <TripsPage /> },
            { path: "notifications", element: <NotificationsPage /> },
            { path: "analytics", element: <AnalyticsPage /> },
            { path: "users", element: <UsersPage /> },
            { path: "drivers", element: <DriversPage /> },
            { path: "wallet-and-finance", element: <WalletAndFinancePage /> },
            { path: "storage-owners", element: <StorageOwnersPage /> },

            {
                path: "blogs",
                element: <BlogsPage />,
                children: [
                    { index: true, element: <Navigate to="add" replace /> },
                    { path: "add", element: <AddBlogPage /> },
                    { path: "edit", element: <EditBlogPage /> },
                    { path: "drafts", element: <DraftsBlogPage /> },
                ],
            },

            { path: "commission-and-pricing", element: <CommissionAndPricingPage /> },
            { path: "voucher-and-promo", element: <VoucherAndPromoPage /> },

            {
                path: "trucks-storages-data",
                element: <TrucksStoragesLayout />,
                children: [
                    { index: true, element: <Navigate to="trucks" replace /> },
                    { path: "trucks",  element: <TruckTypesPage />   },
                    { path: "storage", element: <StorageTypesPage /> },
                ],
            },

            {
                path: "roles-and-permissions",
                element: <RolesAndPermissionsLayout />,
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