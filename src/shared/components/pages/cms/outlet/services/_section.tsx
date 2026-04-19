import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { RichTextEditor } from "@/shared/components/common/FormItems";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import {
    useCmsServicesStore,
    type ServicesPart,
} from "@/shared/hooks/store/useCmsServicesStore";
import {
    PageShell,
    BilingualField,
    BilingualStringArrayEditor,
    InputError,
    destructiveButtonClass,
    sectionCardClass,
    cmsImageUrl,
    CmsFieldLabel,
} from "../about/_shared";

interface ServiceSectionPageProps {
    part: ServicesPart;
}

const ServiceSectionPage = ({ part }: ServiceSectionPageProps) => {
    const { t } = useTranslation("cms");
    const {
        [part]: sectionByLocale,
        cardDraftImages,
        loading,
        savingPart,
        error,
        fieldErrors,
        fetchPart,
        setPart,
        addCard,
        updateCard,
        removeCard,
        setCardImage,
        clearCardImage,
        savePart,
    } = useCmsServicesStore();

    const draftImages = cardDraftImages[part];

    useEffect(() => { fetchPart(part); }, [fetchPart, part]);

    const cardDraftPreviews = useMemo(
        () => draftImages.map((file) => (file ? URL.createObjectURL(file) : "")),
        [draftImages],
    );

    useEffect(() => {
        return () => {
            cardDraftPreviews.forEach((p) => { if (p) URL.revokeObjectURL(p); });
        };
    }, [cardDraftPreviews]);

    const getEnError = (path: string) => fieldErrors[`${part}.en.${path}`];
    const getArError = (path: string) => fieldErrors[`${part}.ar.${path}`];

    return (
        <PageShell
            title={t(`servicesEditor.partTitle.${part}`)}
            subtitle={t("servicesEditor.subtitle")}
            description={t(`servicesEditor.partDescription.${part}`)}
            hint={t("servicesEditor.hint")}
            onSave={() => savePart(part)}
            saving={savingPart === part}
            loading={loading}
            error={error}
        >
            <div className="space-y-4">
                {/* ── Section header ───────────────────────────────────────── */}
                <div className={clsx(sectionCardClass, "space-y-5")}>
                    <BilingualStringArrayEditor
                        label={t("servicesEditor.sectionTitles")}
                        hint={t("servicesEditor.sectionTitlesHint")}
                        enValues={sectionByLocale.en.title}
                        arValues={sectionByLocale.ar.title}
                        placeholder={t("servicesEditor.sectionTitlePlaceholder")}
                        onEnChange={(title) => setPart(part, "en", { title })}
                        onArChange={(title) => setPart(part, "ar", { title })}
                        enTopError={getEnError("title")}
                        arTopError={getArError("title")}
                        enItemErrorAt={(i) => getEnError(`title.${i}`)}
                        arItemErrorAt={(i) => getArError(`title.${i}`)}
                    />

                    <BilingualField
                        label={t("servicesEditor.description")}
                        hint={t("servicesEditor.descriptionHint")}
                        en={
                            <Textarea
                                placeholder={t("servicesEditor.descriptionPlaceholderEn")}
                                value={sectionByLocale.en.description}
                                onChange={(e) => setPart(part, "en", { description: e.target.value })}
                                rows={3}
                            />
                        }
                        ar={
                            <Textarea
                                placeholder={t("servicesEditor.descriptionPlaceholderAr")}
                                value={sectionByLocale.ar.description}
                                onChange={(e) => setPart(part, "ar", { description: e.target.value })}
                                rows={3}
                            />
                        }
                        enError={getEnError("description")}
                        arError={getArError("description")}
                    />
                </div>

                {/* ── Cards — image shared; text fields bilingual ─────────── */}
                {sectionByLocale.en.cards.map((_, index) => (
                    <div key={`${part}-card-${index}`} className={clsx(sectionCardClass, "space-y-4")}>
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-main-lightSlate">
                                {t("servicesEditor.cardLabel", { n: index + 1 })}
                            </p>
                            <Button
                                type="button"
                                variant="outline"
                                className={destructiveButtonClass}
                                onClick={() => removeCard(part, index)}
                            >
                                <Trash2 size={14} />
                                {t("servicesEditor.removeCard")}
                            </Button>
                        </div>

                        {/* Shared image */}
                        <div className="space-y-2">
                            <CmsFieldLabel
                                label={t("servicesEditor.cardImage")}
                                hint={t("servicesEditor.cardImageHint")}
                            />
                            <div className="h-[240px] w-[240px] max-w-full overflow-hidden rounded-xl border border-main-whiteMarble bg-main-titaniumWhite/30">
                                {cardDraftPreviews[index] ? (
                                    <img src={cardDraftPreviews[index]} alt={t("servicesEditor.cardImage")} className="h-full w-full object-contain" />
                                ) : sectionByLocale.en.cards[index]?.img ? (
                                    <img src={cmsImageUrl(sectionByLocale.en.cards[index].img)} alt={t("servicesEditor.cardImage")} className="h-full w-full object-contain" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center px-4 text-center text-sm text-main-coolGray">
                                        {t("servicesEditor.cardImageEmpty")}
                                    </div>
                                )}
                            </div>
                            {cardDraftPreviews[index] && (
                                <p className="text-xs text-main-primary">{t("servicesEditor.cardImageSelected")}</p>
                            )}
                        </div>

                        <div className="rounded-xl border border-main-whiteMarble bg-main-titaniumWhite/30 p-3">
                            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                                <div className="flex-1 space-y-2">
                                    <CmsFieldLabel
                                        label={t("servicesEditor.uploadCardImage")}
                                        hint={t("servicesEditor.uploadCardImageHint")}
                                    />
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            setCardImage(part, index, file);
                                        }}
                                        disabled={savingPart === part}
                                    />
                                </div>
                                {(sectionByLocale.en.cards[index]?.img || draftImages[index]) && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className={destructiveButtonClass}
                                        onClick={() => clearCardImage(part, index)}
                                        disabled={savingPart === part}
                                    >
                                        <Trash2 size={14} />
                                        {t("servicesEditor.removeImage")}
                                    </Button>
                                )}
                            </div>
                        </div>
                        <InputError message={getEnError(`cards.${index}.img`) ?? getArError(`cards.${index}.img`)} />

                        {/* Bilingual text fields */}
                        <BilingualField
                            label={t("servicesEditor.tag")}
                            hint={t("servicesEditor.tagHint")}
                            en={
                                <Input
                                    placeholder={t("servicesEditor.tagPlaceholderEn")}
                                    value={sectionByLocale.en.cards[index]?.tag ?? ""}
                                    onChange={(e) => updateCard(part, "en", index, { tag: e.target.value })}
                                />
                            }
                            ar={
                                <Input
                                    placeholder={t("servicesEditor.tagPlaceholderAr")}
                                    value={sectionByLocale.ar.cards[index]?.tag ?? ""}
                                    onChange={(e) => updateCard(part, "ar", index, { tag: e.target.value })}
                                />
                            }
                            enError={getEnError(`cards.${index}.tag`)}
                            arError={getArError(`cards.${index}.tag`)}
                        />

                        <BilingualField
                            label={t("servicesEditor.cardTitle")}
                            hint={t("servicesEditor.cardTitleHint")}
                            en={
                                <Input
                                    placeholder={t("servicesEditor.cardTitlePlaceholderEn")}
                                    value={sectionByLocale.en.cards[index]?.title ?? ""}
                                    onChange={(e) => updateCard(part, "en", index, { title: e.target.value })}
                                />
                            }
                            ar={
                                <Input
                                    placeholder={t("servicesEditor.cardTitlePlaceholderAr")}
                                    value={sectionByLocale.ar.cards[index]?.title ?? ""}
                                    onChange={(e) => updateCard(part, "ar", index, { title: e.target.value })}
                                />
                            }
                            enError={getEnError(`cards.${index}.title`)}
                            arError={getArError(`cards.${index}.title`)}
                        />

                        <BilingualField
                            label={t("servicesEditor.cardDescription")}
                            hint={t("servicesEditor.cardDescriptionHint")}
                            en={
                                <RichTextEditor
                                    placeholder={t("servicesEditor.cardDescriptionPlaceholderEn")}
                                    value={sectionByLocale.en.cards[index]?.description ?? ""}
                                    onChange={(html) => updateCard(part, "en", index, { description: html })}
                                />
                            }
                            ar={
                                <RichTextEditor
                                    placeholder={t("servicesEditor.cardDescriptionPlaceholderAr")}
                                    value={sectionByLocale.ar.cards[index]?.description ?? ""}
                                    onChange={(html) => updateCard(part, "ar", index, { description: html })}
                                />
                            }
                            enError={getEnError(`cards.${index}.description`)}
                            arError={getArError(`cards.${index}.description`)}
                        />
                    </div>
                ))}

                {sectionByLocale.en.cards.length === 0 && (
                    <div className="rounded-xl border border-dashed border-main-whiteMarble bg-main-titaniumWhite/25 px-4 py-5 text-sm text-main-coolGray">
                        {t("servicesEditor.emptyCards")}
                    </div>
                )}

                <Button
                    type="button"
                    variant="outline"
                    className="border-main-primary/30 text-main-primary hover:bg-main-primary/10"
                    onClick={() => addCard(part)}
                >
                    {t("servicesEditor.addCard")}
                </Button>
            </div>
        </PageShell>
    );
};

export default ServiceSectionPage;
