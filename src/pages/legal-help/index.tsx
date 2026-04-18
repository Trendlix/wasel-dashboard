import { Outlet } from "react-router-dom";
import PageHeader from "@/shared/components/common/PageHeader";
import PageTransition from "@/shared/components/common/PageTransition";
import LegalHelpAnalytics from "@/shared/components/pages/legal-help/LegalHelpAnalytics";
import LegalHelpTabs from "@/shared/components/pages/legal-help/LegalHelpTabs";

const LegalHelpLayout = () => (
    <PageTransition>
        <PageHeader
            title="Legal & help"
            description="Manage in-app FAQs and terms & privacy for mobile apps. Policy entries (not shown in tabs) are available at /legal-help/policies."
        />

        <LegalHelpAnalytics />

        <div className="bg-main-white border border-main-whiteMarble common-rounded overflow-hidden">
            <LegalHelpTabs />
            <div>
                <Outlet />
            </div>
        </div>
    </PageTransition>
);

export default LegalHelpLayout;
