import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import useCmsAboutStore from "@/shared/hooks/store/useCmsAboutStore";
import {
    PageShell,
    BilingualStringArrayEditor,
    SectionVisibilityToggle,
    InputError,
    destructiveButtonClass,
    sectionCardClass,
    cmsImageUrl,
    CmsFieldLabel,
} from "./_shared";

const AboutFuturePage = () => {
    const { t } = useTranslation("cms");
    const {
        future,
        loading,
        savingPart,
        futureDraftImages,
        error,
        fieldErrors,
        fetchPart,
        setFuture,
        addFutureCard,
        updateFutureCard,
        removeFutureCard,
        setFutureCardImage,
        clearFutureCardImage,
        savePart,
    } = useCmsAboutStore();

    useEffect(() => { fetchPart("future"); }, [fetchPart]);

    const futureDraftPreviews = useMemo(
        () => futureDraftImages.map((file) => (file ? URL.createObjectURL(file) : "")),
        [futureDraftImages],
    );

    useEffect(() => {
        return () => { futureDraftPreviews.forEach((p) => { if (p) URL.revokeObjectURL(p); }); };
    }, [futureDraftPreviews]);

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

                {/* Cards — image is shared; text arrays are bilingual */}
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

                        {/* Shared image */}
                        <div className="space-y-2">
                            <CmsFieldLabel
                                label={t("aboutEditor.future.cardImage")}
                                hint={t("aboutEditor.future.cardImageHint")}
                            />
                            <div className="h-[280px] w-[280px] max-w-full overflow-hidden rounded-xl border border-main-whiteMarble bg-main-titaniumWhite/30">
                                {futureDraftPreviews[index] ? (
                                    <img src={futureDraftPreviews[index]} alt={t("aboutEditor.future.cardImage")} className="h-full w-full object-contain" />
                                ) : future.en.cards[index]?.img ? (
                                    <img src={cmsImageUrl(future.en.cards[index].img)} alt={t("aboutEditor.future.cardImage")} className="h-full w-full object-contain" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center px-4 text-center text-sm text-main-coolGray">
                                        {t("aboutEditor.future.cardImageEmpty")}
                                    </div>
                                )}
                            </div>
                            {futureDraftPreviews[index] && (
                                <p className="text-xs text-main-primary">{t("aboutEditor.future.cardImageSelected")}</p>
                            )}
                        </div>

                        <div className="rounded-xl border border-main-whiteMarble bg-main-titaniumWhite/30 p-3">
                            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                                <div className="flex-1 space-y-2">
                                    <CmsFieldLabel
                                        label={t("aboutEditor.future.uploadCardImage")}
                                        hint={t("aboutEditor.future.uploadCardImageHint")}
                                    />
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            setFutureCardImage(index, file);
                                        }}
                                        disabled={savingPart === "future"}
                                    />
                                </div>
                                {(future.en.cards[index]?.img || futureDraftImages[index]) && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className={destructiveButtonClass}
                                        onClick={() => clearFutureCardImage(index)}
                                        disabled={savingPart === "future"}
                                    >
                                        <Trash2 size={14} />
                                        {t("aboutEditor.future.removeImage")}
                                    </Button>
                                )}
                            </div>
                        </div>
                        <InputError message={getEnError(`cards.${index}.img`) ?? getArError(`cards.${index}.img`)} />

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
