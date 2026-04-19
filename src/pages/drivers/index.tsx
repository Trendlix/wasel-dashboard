import { useTranslation } from "react-i18next";
import PageHeader from "@/shared/components/common/PageHeader";
import PageTransition from "@/shared/components/common/PageTransition";
import Analytics from "@/shared/components/pages/drivers/Analytics";
import DriversTable from "@/shared/components/pages/drivers/DriversTable";

const DriversPage = () => {
    const { t } = useTranslation("drivers");
    return (
        <PageTransition>
            <PageHeader title={t("pageTitle")} description={t("pageDescription")} />
            <Analytics />
            <DriversTable />
        </PageTransition>
    );
};

export default DriversPage;