import MarketingLegalFaqsShared from "../marketing-legal/faqs-shared";
import useCmsMarketingTermsStore from "@/shared/hooks/store/useCmsMarketingTermsStore";

const MarketingTermsItemsPage = () => (
    <MarketingLegalFaqsShared
        useStore={useCmsMarketingTermsStore}
        alertTitle="Alert banner (optional)"
        alertDescription="Optional highlighted notice displayed above the public terms content."
    />
);

export default MarketingTermsItemsPage;
