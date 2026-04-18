import PageHeader from "@/shared/components/common/PageHeader";
import PageTransition from "@/shared/components/common/PageTransition";
import TicketAnalytics from "@/shared/components/pages/support-tickets/TicketAnalytics";
import TicketsTable from "@/shared/components/pages/support-tickets/TicketsTable";

const SupportTicketsPage = () => {
    return (
        <PageTransition>
            <PageHeader
                title="Support Tickets"
                description="Manage customer support tickets and inquiries"
            />
            <TicketAnalytics />
            <TicketsTable />
        </PageTransition>
    );
};

export default SupportTicketsPage;
