import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PageHeader from "@/shared/components/common/PageHeader";
import PageTransition from "@/shared/components/common/PageTransition";
import LegalHelpAnalytics from "@/shared/components/pages/legal-help/LegalHelpAnalytics";
import LegalHelpTabs from "@/shared/components/pages/legal-help/LegalHelpTabs";

const LegalHelpLayout = () => {
    const { t } = useTranslation("legalHelp");
    return (
    <PageTransition>
        <PageHeader title={t("pageTitle")} description={t("pageDescription")} />

        <LegalHelpAnalytics />

        <div className="bg-main-white border border-main-whiteMarble common-rounded overflow-hidden">
            <LegalHelpTabs />
            <div>
                <Outlet />
            </div>
        </div>
    </PageTransition>
    );
};

export default LegalHelpLayout;
