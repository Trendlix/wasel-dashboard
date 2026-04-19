import MarketingLegalLayoutShared, {
    MarketingLegalIndexRedirectShared,
} from "../marketing-legal/layout-shared";
import useCmsMarketingTermsStore from "@/shared/hooks/store/useCmsMarketingTermsStore";

const MarketingTermsLayout = () => (
    <MarketingLegalLayoutShared
        useStore={useCmsMarketingTermsStore}
        variant="terms"
        heroPath="/cms/legal-help/marketing-terms/hero"
        faqsPath="/cms/legal-help/marketing-terms/faqs"
    />
);

export const MarketingTermsIndexRedirect = () => (
    <MarketingLegalIndexRedirectShared to="hero" />
);

export default MarketingTermsLayout;
