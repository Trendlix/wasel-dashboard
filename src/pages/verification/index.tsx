import PageHeader from "@/shared/components/common/PageHeader";
import PageTransition from "@/shared/components/common/PageTransition";
import Analytics from "@/shared/components/pages/verification/Analytics";
import VerificationList from "@/shared/components/pages/verification/VerificationList";

const VerificationPage = () => {
    return (
        <PageTransition>
            <PageHeader title="Verification Center" description="Review and approve driver and storage owner verification" />
            <Analytics />
            <VerificationList />
        </PageTransition>
    );
};

export default VerificationPage;