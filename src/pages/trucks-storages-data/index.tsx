import { Outlet } from "react-router-dom";
import PageHeader from "@/shared/components/common/PageHeader";
import PageTransition from "@/shared/components/common/PageTransition";
import TrucksStoragesAnalytics from "@/shared/components/pages/trucks-storages-data/TrucksStoragesAnalytics";
import TrucksStoragesTabs from "@/shared/components/pages/trucks-storages-data/TrucksStoragesTabs";

const TrucksStoragesLayout = () => (
    <PageTransition>
        <PageHeader
            title="Trucks / Storages Data"
            description="Manage truck types and storage types used across the platform"
        />

        <TrucksStoragesAnalytics />

        <div className="bg-main-white border border-main-whiteMarble common-rounded overflow-hidden">
            <TrucksStoragesTabs />
            <div className="p-6">
                <Outlet />
            </div>
        </div>
    </PageTransition>
);

export default TrucksStoragesLayout;
