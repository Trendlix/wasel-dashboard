import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Box, Truck } from "lucide-react";

const TABS = [
    { id: "trucks", labelKey: "tabs.trucks" as const, icon: Truck, to: "/data-management/trucks" },
    { id: "goods", labelKey: "tabs.goods" as const, icon: Box, to: "/data-management/goods" },
];

const baseClass =
    "flex items-center gap-2 py-4 px-4 -mb-px border-b-2 text-sm transition duration-200 ease-linear";

const DataManagementTabs = () => {
    const { t } = useTranslation("dataManagement");
    return (
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
                    <tab.icon className="w-4 h-4 shrink-0" />
                    {t(tab.labelKey)}
                </NavLink>
            ))}
        </nav>
    );
};

export default DataManagementTabs;
