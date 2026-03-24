import { NavLink } from "react-router-dom";
import { Archive, Truck } from "lucide-react";

const TABS = [
    { id: "trucks",  label: "Truck Types",   icon: Truck,   to: "/trucks-storages-data/trucks"  },
    { id: "storage", label: "Storage Types", icon: Archive, to: "/trucks-storages-data/storage" },
];

const baseClass =
    "flex items-center gap-2 py-4 px-4 -mb-px border-b-2 text-sm transition duration-200 ease-linear";

const TrucksStoragesTabs = () => (
    <nav className="border-b border-main-whiteMarble flex items-center gap-2 px-2">
        {TABS.map((tab) => (
            <NavLink
                key={tab.id}
                to={tab.to}
                end
                className={({ isActive }) =>
                    `${baseClass} ${
                        isActive
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

export default TrucksStoragesTabs;
