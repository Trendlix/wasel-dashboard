import PageHeader from "@/shared/components/common/PageHeader";
import PageTransition from "@/shared/components/common/PageTransition";
import Analytics from "@/shared/components/pages/storage-owners/Analytics";
import StorageOwnersTable from "@/shared/components/pages/storage-owners/StorageOwnersTable";

const StorageOwnersPage = () => {
    return (
        <PageTransition>
            <PageHeader title="Storage Owners" description="Manage storage facilities and owners" />
            <Analytics />
            <StorageOwnersTable />
        </PageTransition>
    );
};

export default StorageOwnersPage;