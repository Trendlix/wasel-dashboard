import { NavLink } from "react-router-dom";
import { CircleHelp, FileText } from "lucide-react";

/** Policy entries: no tab (hidden from nav); page still lives at /legal-help/policies */
const TABS = [
    { id: "faqs", label: "In-app FAQs", icon: CircleHelp, to: "/legal-help/faqs" },
    { id: "terms", label: "Terms & privacy", icon: FileText, to: "/legal-help/terms" },
];

const baseClass =
    "flex items-center gap-2 py-4 px-4 -mb-px border-b-2 text-sm transition duration-200 ease-linear";

const LegalHelpTabs = () => (
    <nav className="border-b border-main-whiteMarble flex items-center gap-2 px-2 flex-wrap">
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

export default LegalHelpTabs;
