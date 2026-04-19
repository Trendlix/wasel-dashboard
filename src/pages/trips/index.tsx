import { useTranslation } from "react-i18next";
import PageHeader from "@/shared/components/common/PageHeader";
import PageTransition from "@/shared/components/common/PageTransition";
import Analytics from "@/shared/components/pages/trips/Analytics";
import TripsTable from "@/shared/components/pages/trips/TripsTable";

const TripsPage = () => {
    const { t } = useTranslation("trips");
    return (
        <PageTransition>
            <PageHeader title={t("pageTitle")} description={t("pageDescription")} />
            <Analytics />
            <TripsTable />
        </PageTransition>
    );
};

export default TripsPage;