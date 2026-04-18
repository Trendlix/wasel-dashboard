import MarketingLegalHeroShared from "../marketing-legal/hero-shared";
import useCmsMarketingTermsStore from "@/shared/hooks/store/useCmsMarketingTermsStore";

const MarketingTermsHeroPage = () => (
    <MarketingLegalHeroShared
        useStore={useCmsMarketingTermsStore}
        title="Hero"
        description="This controls the top section of the public /terms page."
        hint="Update the hero title and introduction in both languages before publishing."
        saveButtonLabel="Save hero"
    />
);

export default MarketingTermsHeroPage;
