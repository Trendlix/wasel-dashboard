import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useCmsMarketingFaqStore from "@/shared/hooks/store/useCmsMarketingFaqStore";
import { formInputClass } from "@/shared/components/common/formStyles";
import { BilingualField, BilingualStringArrayEditor } from "../about/_shared";
import SectionCard from "./SectionCard";

const MarketingFaqHeroPage = () => {
    const { draft, saving, saveHero, setDraft } = useCmsMarketingFaqStore();

    return (
        <SectionCard
            title="Hero"
            description="This controls the top section of the public /faqs page."
            hint="Update the hero title and introduction in both languages before publishing."
            actions={
                <Button
                    type="button"
                    className="bg-main-primary text-main-white"
                    onClick={() => void saveHero()}
                    disabled={saving}
                >
                    {saving ? "Saving..." : "Save hero"}
                </Button>
            }
        >
            <div className="space-y-5">
                <BilingualStringArrayEditor
                    label="Hero title lines"
                    hint="At least two lines are required because the public hero uses a split headline style."
                    placeholder="Title line"
                    minRows={2}
                    itemClassName={formInputClass}
                    enValues={draft.en.titles}
                    arValues={draft.ar.titles}
                    onEnChange={(titles) => setDraft({ en: { ...draft.en, titles } })}
                    onArChange={(titles) => setDraft({ ar: { ...draft.ar, titles } })}
                />

                <BilingualField
                    label="Intro description"
                    hint="This short intro appears under the hero title on the public page."
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
                            placeholder="English introduction"
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
                            placeholder="المقدمة بالعربية"
                        />
                    }
                />
            </div>
        </SectionCard>
    );
};

export default MarketingFaqHeroPage;
