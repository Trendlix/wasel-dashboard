import { useTranslation } from "react-i18next";
import PageHeader from "@/shared/components/common/PageHeader";
import PageTransition from "@/shared/components/common/PageTransition";
import ContactMessagesTable from "@/shared/components/pages/contact-messages/ContactMessagesTable";

const ContactMessagesPage = () => {
    const { t } = useTranslation("contactMessages");
    return (
        <PageTransition>
            <PageHeader title={t("pageTitle")} description={t("pageDescription")} />
            <div className="mt-6">
                <ContactMessagesTable />
            </div>
        </PageTransition>
    );
};

export default ContactMessagesPage;
