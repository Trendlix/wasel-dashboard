import { useTranslation } from "react-i18next";
import PageHeader from "@/shared/components/common/PageHeader";
import PageTransition from "@/shared/components/common/PageTransition";
import TicketAnalytics from "@/shared/components/pages/support-tickets/TicketAnalytics";
import TicketsTable from "@/shared/components/pages/support-tickets/TicketsTable";

const SupportTicketsPage = () => {
    const { t } = useTranslation("support");
    return (
        <PageTransition>
            <PageHeader title={t("pageTitle")} description={t("pageDescription")} />
            <TicketAnalytics />
            <TicketsTable />
        </PageTransition>
    );
};

export default SupportTicketsPage;
