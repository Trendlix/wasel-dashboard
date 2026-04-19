import MarketingLegalHeroShared from "../marketing-legal/hero-shared";
import useCmsMarketingPrivacyStore from "@/shared/hooks/store/useCmsMarketingPrivacyStore";
import { useTranslation } from "react-i18next";

const MarketingPrivacyHeroPage = () => {
    const { t } = useTranslation("cms");
    return (
        <MarketingLegalHeroShared
            useStore={useCmsMarketingPrivacyStore}
            title={t("legalMarketing.privacy.hero.title")}
            description={t("legalMarketing.privacy.hero.description")}
            hint={t("legalMarketing.privacy.hero.hint")}
            saveButtonLabel={t("legalMarketing.privacy.hero.saveButton")}
        />
    );
};

export default MarketingPrivacyHeroPage;
