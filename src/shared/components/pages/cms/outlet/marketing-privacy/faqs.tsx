import MarketingLegalFaqsShared from "../marketing-legal/faqs-shared";
import useCmsMarketingPrivacyStore from "@/shared/hooks/store/useCmsMarketingPrivacyStore";
import { useTranslation } from "react-i18next";

const MarketingPrivacyItemsPage = () => {
    const { t } = useTranslation("cms");
    return (
        <MarketingLegalFaqsShared
            useStore={useCmsMarketingPrivacyStore}
            alertTitle={t("legalMarketing.privacy.alert.title")}
            alertDescription={t("legalMarketing.privacy.alert.description")}
        />
    );
};

export default MarketingPrivacyItemsPage;
