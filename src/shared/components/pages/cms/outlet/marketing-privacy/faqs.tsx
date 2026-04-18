import MarketingLegalFaqsShared from "../marketing-legal/faqs-shared";
import useCmsMarketingPrivacyStore from "@/shared/hooks/store/useCmsMarketingPrivacyStore";

const MarketingPrivacyItemsPage = () => (
    <MarketingLegalFaqsShared
        useStore={useCmsMarketingPrivacyStore}
        alertTitle="Alert banner (optional)"
        alertDescription="Optional highlighted notice displayed above the public privacy content."
    />
);

export default MarketingPrivacyItemsPage;
