import { useTranslation } from "react-i18next";
import PageHeader from "@/shared/components/common/PageHeader";
import PageTransition from "@/shared/components/common/PageTransition";
import Analytics from "@/shared/components/pages/verification/Analytics";
import VerificationList from "@/shared/components/pages/verification/VerificationList";

const VerificationPage = () => {
    const { t } = useTranslation("verification");
    return (
        <PageTransition>
            <PageHeader title={t("pageTitle")} description={t("pageDescription")} />
            <Analytics />
            <VerificationList />
        </PageTransition>
    );
};

export default VerificationPage;
