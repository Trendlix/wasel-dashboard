import { useTranslation } from "react-i18next";
import PageHeader from "@/shared/components/common/PageHeader";
import PageTransition from "@/shared/components/common/PageTransition";
import Analytics from "@/shared/components/pages/storage-owners/Analytics";
import StorageOwnersTable from "@/shared/components/pages/storage-owners/StorageOwnersTable";

const StorageOwnersPage = () => {
    const { t } = useTranslation("storageOwners");
    return (
        <PageTransition>
            <PageHeader title={t("pageTitle")} description={t("pageDescription")} />
            <Analytics />
            <StorageOwnersTable />
        </PageTransition>
    );
};

export default StorageOwnersPage;