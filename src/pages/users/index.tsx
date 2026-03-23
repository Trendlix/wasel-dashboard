import PageHeader from "@/shared/components/common/PageHeader";
import PageTransition from "@/shared/components/common/PageTransition";
import Analytics from "@/shared/components/pages/users/Analytics";
import UsersTable from "@/shared/components/pages/users/UsersTable";

const UsersPage = () => {
    return (
        <PageTransition>
            <PageHeader title="Users" description="Manage all registered users" />
            <Analytics />
            <UsersTable />
        </PageTransition>
    );
};

export default UsersPage;