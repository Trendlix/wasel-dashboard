import MarketingLegalLayoutShared, {
    MarketingLegalIndexRedirectShared,
} from "../marketing-legal/layout-shared";
import useCmsMarketingPrivacyStore from "@/shared/hooks/store/useCmsMarketingPrivacyStore";

const MarketingPrivacyLayout = () => (
    <MarketingLegalLayoutShared
        useStore={useCmsMarketingPrivacyStore}
        variant="privacy"
        heroPath="/cms/legal-help/marketing-privacy/hero"
        faqsPath="/cms/legal-help/marketing-privacy/faqs"
    />
);

export const MarketingPrivacyIndexRedirect = () => (
    <MarketingLegalIndexRedirectShared to="hero" />
);

export default MarketingPrivacyLayout;
