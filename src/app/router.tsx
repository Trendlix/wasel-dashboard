import { createBrowserRouter } from "react-router-dom";
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
        ],
    },
    { path: "*", element: <NotFoundPage /> },
]);