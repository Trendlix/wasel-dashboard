import MarketingLegalHeroShared from "../marketing-legal/hero-shared";
import useCmsMarketingTermsStore from "@/shared/hooks/store/useCmsMarketingTermsStore";
import { useTranslation } from "react-i18next";

const MarketingTermsHeroPage = () => {
    const { t } = useTranslation("cms");
    return (
        <MarketingLegalHeroShared
            useStore={useCmsMarketingTermsStore}
            title={t("legalMarketing.terms.hero.title")}
            description={t("legalMarketing.terms.hero.description")}
            hint={t("legalMarketing.terms.hero.hint")}
            saveButtonLabel={t("legalMarketing.terms.hero.saveButton")}
        />
    );
};

export default MarketingTermsHeroPage;
