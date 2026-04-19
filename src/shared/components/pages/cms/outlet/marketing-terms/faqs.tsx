import MarketingLegalFaqsShared from "../marketing-legal/faqs-shared";
import useCmsMarketingTermsStore from "@/shared/hooks/store/useCmsMarketingTermsStore";
import { useTranslation } from "react-i18next";

const MarketingTermsItemsPage = () => {
    const { t } = useTranslation("cms");
    return (
        <MarketingLegalFaqsShared
            useStore={useCmsMarketingTermsStore}
            alertTitle={t("legalMarketing.terms.alert.title")}
            alertDescription={t("legalMarketing.terms.alert.description")}
        />
    );
};

export default MarketingTermsItemsPage;
