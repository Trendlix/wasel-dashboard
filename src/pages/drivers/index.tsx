import PageHeader from "@/shared/components/common/PageHeader";
import PageTransition from "@/shared/components/common/PageTransition";
import Analytics from "@/shared/components/pages/drivers/Analytics";
import DriversTable from "@/shared/components/pages/drivers/DriversTable";

const DriversPage = () => {
    return (
        <PageTransition>
            <PageHeader title="Drivers" description="Manage all registered drivers" />
            <Analytics />
            <DriversTable />
        </PageTransition>
    );
};

export default DriversPage;