import PageHeader from "@/shared/components/common/PageHeader";
import PageTransition from "@/shared/components/common/PageTransition";
import Analytics from "@/shared/components/pages/trips/Analytics";
import TripsTable from "@/shared/components/pages/trips/TripsTable";

const TripsPage = () => {
    return (
        <PageTransition>
            <PageHeader title="Trips Management" description="Monitor and manage all platform trips" />
            <Analytics />
            <TripsTable />
        </PageTransition>
    );
};

export default TripsPage;