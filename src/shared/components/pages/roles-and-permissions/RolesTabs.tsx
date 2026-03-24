import { NavLink } from "react-router-dom";
import { Shield, Users } from "lucide-react";

const TABS = [
    { id: "roles", label: "Roles & Permissions", icon: Shield, to: "/roles-and-permissions/roles" },
    { id: "users", label: "User Management", icon: Users, to: "/roles-and-permissions/users" },
];

const baseClass =
    "flex items-center gap-2 py-4 px-4 -mb-px border-b-2 text-sm transition duration-200 ease-linear";

const RolesTabs = () => (
    <nav className="border-b border-main-whiteMarble flex items-center gap-2 px-2">
        {TABS.map((tab) => (
            <NavLink
                key={tab.id}
                to={tab.to}
                end
                className={({ isActive }) =>
                    `${baseClass} ${isActive
                        ? "text-main-primary border-main-primary font-bold"
                        : "text-main-sharkGray border-transparent hover:text-main-primary font-medium"
                    }`
                }
            >
                <tab.icon className="w-4 h-4" />
                {tab.label}
            </NavLink>
        ))}
    </nav>
);

export default RolesTabs;
