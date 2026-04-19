import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import useCmsAboutStore from "@/shared/hooks/store/useCmsAboutStore";
import {
    PageShell,
    BilingualField,
    BilingualStringArrayEditor,
    SectionVisibilityToggle,
    InputError,
    destructiveButtonClass,
    sectionCardClass,
    cmsImageUrl,
    CmsFieldLabel,
} from "./_shared";

const AboutStandForPage = () => {
    const { t } = useTranslation("cms");
    const {
        standFor,
        loading,
        savingPart,
        standForDraftImages,
        error,
        fieldErrors,
        fetchPart,
        setStandFor,
        addStandForCard,
        updateStandForCard,
        removeStandForCard,
        setStandForCardImage,
        clearStandForCardImage,
        savePart,
    } = useCmsAboutStore();

    useEffect(() => { fetchPart("stand_for"); }, [fetchPart]);

    const standForDraftPreviews = useMemo(
        () => standForDraftImages.map((file) => (file ? URL.createObjectURL(file) : "")),
        [standForDraftImages],
    );

    useEffect(() => {
        return () => { standForDraftPreviews.forEach((p) => { if (p) URL.revokeObjectURL(p); }); };
    }, [standForDraftPreviews]);

    const getEnError = (path: string) => fieldErrors[`stand_for.en.${path}`];
    const getArError = (path: string) => fieldErrors[`stand_for.ar.${path}`];

    return (
        <PageShell
            title={t("aboutEditor.standFor.pageTitle")}
            subtitle={t("aboutEditor.standFor.subtitle")}
            description={t("aboutEditor.standFor.description")}
            hint={t("aboutEditor.standFor.hint")}
            onSave={() => savePart("stand_for")}
            saving={savingPart === "stand_for"}
            loading={loading}
            error={error}
        >
            <div className="space-y-4">
                <div className={clsx(sectionCardClass, "space-y-4")}>
                    <div className="space-y-2">
                        <CmsFieldLabel
                            label={t("aboutEditor.standFor.visibility")}
                            hint={t("aboutEditor.standFor.visibilityHint")}
                        />
                        <SectionVisibilityToggle
                            checked={standFor.en.hide}
                            onCheckedChange={(checked) => {
                                setStandFor("en", { hide: checked });
                                setStandFor("ar", { hide: checked });
                            }}
                        />
                    </div>

                    <BilingualStringArrayEditor
                        label={t("aboutEditor.standFor.titles")}
                        hint={t("aboutEditor.standFor.titlesHint")}
                        enValues={standFor.en.titles}
                        arValues={standFor.ar.titles}
                        placeholder={t("aboutEditor.standFor.cardTitlePlaceholderEn")}
                        onEnChange={(titles) => setStandFor("en", { titles })}
                        onArChange={(titles) => setStandFor("ar", { titles })}
                        enTopError={getEnError("titles")}
                        arTopError={getArError("titles")}
                        enItemErrorAt={(i) => getEnError(`titles.${i}`)}
                        arItemErrorAt={(i) => getArError(`titles.${i}`)}
                    />
                </div>

                {/* Cards — image is shared; text fields are bilingual */}
                {standFor.en.cards.map((_, index) => (
                    <div key={`stand-card-${index}`} className={clsx(sectionCardClass, "space-y-4")}>
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-main-lightSlate">
                                {t("aboutEditor.standFor.cardLabel", { n: index + 1 })}
                            </p>
                            <Button
                                type="button"
                                variant="outline"
                                className={destructiveButtonClass}
                                onClick={() => removeStandForCard(index)}
                            >
                                <Trash2 size={14} />
                                {t("aboutEditor.standFor.removeCard")}
                            </Button>
                        </div>

                        {/* Shared image */}
                        <div className="space-y-2">
                            <CmsFieldLabel
                                label={t("aboutEditor.standFor.cardImage")}
                                hint={t("aboutEditor.standFor.cardImageHint")}
                            />
                            <div className="h-[280px] w-[280px] max-w-full overflow-hidden rounded-xl border border-main-whiteMarble bg-main-titaniumWhite/30">
                                {standForDraftPreviews[index] ? (
                                    <img src={standForDraftPreviews[index]} alt={t("aboutEditor.standFor.cardImage")} className="h-full w-full object-contain" />
                                ) : standFor.en.cards[index]?.img ? (
                                    <img src={cmsImageUrl(standFor.en.cards[index].img)} alt={t("aboutEditor.standFor.cardImage")} className="h-full w-full object-contain" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center px-4 text-center text-sm text-main-coolGray">
                                        {t("aboutEditor.standFor.cardImageEmpty")}
                                    </div>
                                )}
                            </div>
                            {standForDraftPreviews[index] && (
                                <p className="text-xs text-main-primary">{t("aboutEditor.standFor.cardImageSelected")}</p>
                            )}
                        </div>

                        <div className="rounded-xl border border-main-whiteMarble bg-main-titaniumWhite/30 p-3">
                            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                                <div className="flex-1 space-y-2">
                                    <CmsFieldLabel
                                        label={t("aboutEditor.standFor.uploadCardImage")}
                                        hint={t("aboutEditor.standFor.uploadCardImageHint")}
                                    />
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            setStandForCardImage(index, file);
                                        }}
                                        disabled={savingPart === "stand_for"}
                                    />
                                </div>
                                {(standFor.en.cards[index]?.img || standForDraftImages[index]) && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className={destructiveButtonClass}
                                        onClick={() => clearStandForCardImage(index)}
                                        disabled={savingPart === "stand_for"}
                                    >
                                        <Trash2 size={14} />
                                        {t("aboutEditor.standFor.removeImage")}
                                    </Button>
                                )}
                            </div>
                        </div>
                        <InputError message={getEnError(`cards.${index}.img`) ?? getArError(`cards.${index}.img`)} />

                        {/* Bilingual text fields */}
                        <BilingualField
                            label={t("aboutEditor.standFor.cardTitle")}
                            hint={t("aboutEditor.standFor.cardTitleHint")}
                            en={
                                <Input
                                    placeholder={t("aboutEditor.standFor.cardTitlePlaceholderEn")}
                                    value={standFor.en.cards[index]?.title ?? ""}
                                    onChange={(e) => updateStandForCard("en", index, { title: e.target.value })}
                                />
                            }
                            ar={
                                <Input
                                    placeholder={t("aboutEditor.standFor.cardTitlePlaceholderAr")}
                                    value={standFor.ar.cards[index]?.title ?? ""}
                                    onChange={(e) => updateStandForCard("ar", index, { title: e.target.value })}
                                />
                            }
                            enError={getEnError(`cards.${index}.title`)}
                            arError={getArError(`cards.${index}.title`)}
                        />

                        <BilingualField
                            label={t("aboutEditor.standFor.cardDescription")}
                            hint={t("aboutEditor.standFor.cardDescriptionHint")}
                            en={
                                <textarea
                                    className="w-full min-h-[80px] rounded-lg border border-main-whiteMarble bg-main-white px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-main-primary/40 focus:border-main-primary"
                                    placeholder={t("aboutEditor.standFor.cardDescriptionPlaceholderEn")}
                                    value={standFor.en.cards[index]?.description ?? ""}
                                    onChange={(e) => updateStandForCard("en", index, { description: e.target.value })}
                                />
                            }
                            ar={
                                <textarea
                                    className="w-full min-h-[80px] rounded-lg border border-main-whiteMarble bg-main-white px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-main-primary/40 focus:border-main-primary"
                                    placeholder={t("aboutEditor.standFor.cardDescriptionPlaceholderAr")}
                                    value={standFor.ar.cards[index]?.description ?? ""}
                                    onChange={(e) => updateStandForCard("ar", index, { description: e.target.value })}
                                />
                            }
                            enError={getEnError(`cards.${index}.description`)}
                            arError={getArError(`cards.${index}.description`)}
                        />
                    </div>
                ))}

                {standFor.en.cards.length === 0 && (
                    <div className="rounded-xl border border-dashed border-main-whiteMarble bg-main-titaniumWhite/25 px-4 py-5 text-sm text-main-coolGray">
                        {t("aboutEditor.standFor.emptyCards")}
                    </div>
                )}

                <Button
                    type="button"
                    variant="outline"
                    className="border-main-primary/30 text-main-primary hover:bg-main-primary/10"
                    onClick={addStandForCard}
                >
                    {t("aboutEditor.standFor.addCard")}
                </Button>
            </div>
        </PageShell>
    );
};

export default AboutStandForPage;
