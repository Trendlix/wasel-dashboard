import MarketingLegalLayoutShared, {
    MarketingLegalIndexRedirectShared,
} from "../marketing-legal/layout-shared";
import useCmsMarketingTermsStore from "@/shared/hooks/store/useCmsMarketingTermsStore";

const MarketingTermsLayout = () => (
    <MarketingLegalLayoutShared
        useStore={useCmsMarketingTermsStore}
        title="Marketing Terms"
        description="Configure the public terms page with bilingual alert, hero content, and grouped sections."
        heroPath="/cms/legal-help/marketing-terms/hero"
        faqsPath="/cms/legal-help/marketing-terms/faqs"
    />
);

export const MarketingTermsIndexRedirect = () => (
    <MarketingLegalIndexRedirectShared to="hero" />
);

export default MarketingTermsLayout;
