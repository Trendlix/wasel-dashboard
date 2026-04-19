import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useCmsMarketingFaqStore from "@/shared/hooks/store/useCmsMarketingFaqStore";
import { formInputClass } from "@/shared/components/common/formStyles";
import { BilingualField, BilingualStringArrayEditor } from "../about/_shared";
import SectionCard from "./SectionCard";
import { useTranslation } from "react-i18next";

const MarketingFaqHeroPage = () => {
    const { t } = useTranslation("cms");
    const { draft, saving, saveHero, setDraft } = useCmsMarketingFaqStore();

    return (
        <SectionCard
            title={t("marketingNested.heroTitle")}
            description={t("marketingNested.heroDescription")}
            hint={t("marketingNested.heroHint")}
            actions={
                <Button
                    type="button"
                    className="bg-main-primary text-main-white"
                    onClick={() => void saveHero()}
                    disabled={saving}
                >
                    {saving ? t("marketingNested.saving") : t("marketingNested.saveHero")}
                </Button>
            }
        >
            <div className="space-y-5">
                <BilingualStringArrayEditor
                    label={t("marketingNested.heroTitleLines")}
                    hint={t("marketingNested.heroTitleLinesHint")}
                    placeholder={t("marketingNested.heroTitlePlaceholder")}
                    minRows={2}
                    itemClassName={formInputClass}
                    enValues={draft.en.titles}
                    arValues={draft.ar.titles}
                    onEnChange={(titles) => setDraft({ en: { ...draft.en, titles } })}
                    onArChange={(titles) => setDraft({ ar: { ...draft.ar, titles } })}
                />

                <BilingualField
                    label={t("marketingNested.introDescription")}
                    hint={t("marketingNested.introDescriptionHint")}
                    required
                    en={
                        <Textarea
                            className={`${formInputClass} min-h-[110px] py-2`}
                            value={draft.en.description}
                            onChange={(e) =>
                                setDraft({
                                    en: { ...draft.en, description: e.target.value },
                                })
                            }
                            placeholder={t("marketingNested.introDescriptionPlaceholderEn")}
                        />
                    }
                    ar={
                        <Textarea
                            className={`${formInputClass} min-h-[110px] py-2`}
                            value={draft.ar.description}
                            onChange={(e) =>
                                setDraft({
                                    ar: { ...draft.ar, description: e.target.value },
                                })
                            }
                            placeholder={t("marketingNested.introDescriptionPlaceholderAr")}
                        />
                    }
                />
            </div>
        </SectionCard>
    );
};

export default MarketingFaqHeroPage;
