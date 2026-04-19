import { useTranslation } from "react-i18next";
import PageHeader from "@/shared/components/common/PageHeader";
import PageTransition from "@/shared/components/common/PageTransition";
import Analytics from "@/shared/components/pages/users/Analytics";
import UsersTable from "@/shared/components/pages/users/UsersTable";

const UsersPage = () => {
    const { t } = useTranslation("users");
    return (
        <PageTransition>
            <PageHeader title={t("pageTitle")} description={t("pageDescription")} />
            <Analytics />
            <UsersTable />
        </PageTransition>
    );
};

export default UsersPage;