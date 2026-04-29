import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import useCmsAboutStore from "@/shared/hooks/store/useCmsAboutStore";
import {
    PageShell,
    BilingualStringArrayEditor,
    SectionVisibilityToggle,
    destructiveButtonClass,
    sectionCardClass,
    CmsFieldLabel,
} from "./_shared";

const AboutFuturePage = () => {
    const { t } = useTranslation("cms");
    const {
        future,
        loading,
        savingPart,
        error,
        fieldErrors,
        fetchPart,
        setFuture,
        addFutureCard,
        updateFutureCard,
        removeFutureCard,
        savePart,
    } = useCmsAboutStore();

    useEffect(() => { fetchPart("future"); }, [fetchPart]);

    const getEnError = (path: string) => fieldErrors[`future.en.${path}`];
    const getArError = (path: string) => fieldErrors[`future.ar.${path}`];

    return (
        <PageShell
            title={t("aboutEditor.future.pageTitle")}
            subtitle={t("aboutEditor.future.subtitle")}
            description={t("aboutEditor.future.description")}
            hint={t("aboutEditor.future.hint")}
            onSave={() => savePart("future")}
            saving={savingPart === "future"}
            loading={loading}
            error={error}
        >
            <div className="space-y-4">
                <div className={clsx(sectionCardClass, "space-y-3")}>
                    <div className="space-y-2">
                        <CmsFieldLabel
                            label={t("aboutEditor.future.visibility")}
                            hint={t("aboutEditor.future.visibilityHint")}
                        />
                        <SectionVisibilityToggle
                            checked={future.en.hide}
                            onCheckedChange={(checked) => {
                                setFuture("en", { hide: checked });
                                setFuture("ar", { hide: checked });
                            }}
                        />
                    </div>
                </div>

                {/* Cards — text arrays are bilingual */}
                {future.en.cards.map((_, index) => (
                    <div key={`future-card-${index}`} className={clsx(sectionCardClass, "space-y-4")}>
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-main-lightSlate">
                                {t("aboutEditor.future.cardLabel", { n: index + 1 })}
                            </p>
                            <Button
                                type="button"
                                variant="outline"
                                className={destructiveButtonClass}
                                onClick={() => removeFutureCard(index)}
                            >
                                <Trash2 size={14} />
                                {t("aboutEditor.future.removeCard")}
                            </Button>
                        </div>

                        {/* Bilingual text arrays */}
                        <BilingualStringArrayEditor
                            label={t("aboutEditor.future.cardTitles")}
                            hint={t("aboutEditor.future.cardTitlesHint")}
                            enValues={future.en.cards[index]?.titles ?? []}
                            arValues={future.ar.cards[index]?.titles ?? []}
                            placeholder={t("aboutEditor.future.titlePlaceholder")}
                            onEnChange={(titles) => updateFutureCard("en", index, { titles })}
                            onArChange={(titles) => updateFutureCard("ar", index, { titles })}
                            enTopError={getEnError(`cards.${index}.titles`)}
                            arTopError={getArError(`cards.${index}.titles`)}
                            enItemErrorAt={(i) => getEnError(`cards.${index}.titles.${i}`)}
                            arItemErrorAt={(i) => getArError(`cards.${index}.titles.${i}`)}
                        />

                        <BilingualStringArrayEditor
                            label={t("aboutEditor.future.cardDescriptions")}
                            hint={t("aboutEditor.future.cardDescriptionsHint")}
                            enValues={future.en.cards[index]?.descriptions ?? []}
                            arValues={future.ar.cards[index]?.descriptions ?? []}
                            placeholder={t("aboutEditor.future.descriptionPlaceholder")}
                            multiline
                            onEnChange={(descriptions) => updateFutureCard("en", index, { descriptions })}
                            onArChange={(descriptions) => updateFutureCard("ar", index, { descriptions })}
                            enTopError={getEnError(`cards.${index}.descriptions`)}
                            arTopError={getArError(`cards.${index}.descriptions`)}
                            enItemErrorAt={(i) => getEnError(`cards.${index}.descriptions.${i}`)}
                            arItemErrorAt={(i) => getArError(`cards.${index}.descriptions.${i}`)}
                        />
                    </div>
                ))}

                {future.en.cards.length === 0 && (
                    <div className="rounded-xl border border-dashed border-main-whiteMarble bg-main-titaniumWhite/25 px-4 py-5 text-sm text-main-coolGray">
                        {t("aboutEditor.future.emptyCards")}
                    </div>
                )}

                <Button
                    type="button"
                    variant="outline"
                    className="border-main-primary/30 text-main-primary hover:bg-main-primary/10"
                    onClick={addFutureCard}
                >
                    {t("aboutEditor.future.addCard")}
                </Button>
            </div>
        </PageShell>
    );
};

export default AboutFuturePage;
