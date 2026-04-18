import MarketingLegalHeroShared from "../marketing-legal/hero-shared";
import useCmsMarketingPrivacyStore from "@/shared/hooks/store/useCmsMarketingPrivacyStore";

const MarketingPrivacyHeroPage = () => (
    <MarketingLegalHeroShared
        useStore={useCmsMarketingPrivacyStore}
        title="Hero"
        description="This controls the top section of the public /policy page."
        hint="Update the hero title and introduction in both languages before publishing."
        saveButtonLabel="Save hero"
    />
);

export default MarketingPrivacyHeroPage;
