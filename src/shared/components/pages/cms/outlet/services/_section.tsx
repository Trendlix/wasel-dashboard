import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { RichTextEditor } from "@/shared/components/common/FormItems";
import clsx from "clsx";
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

const PART_LABELS: Record<ServicesPart, string> = {
    hero: "Services / Hero",
    warehouse: "Services / Warehouse",
    advertising: "Services / Advertising",
};

const PART_DESCRIPTIONS: Record<ServicesPart, string> = {
    hero: "Intro strip for the services landing page: titles, description, and feature cards.",
    warehouse: "Warehouse and storage offering: section copy plus bilingual cards with rich descriptions.",
    advertising: "Advertising and growth services: same card pattern as other service tabs.",
};

interface ServiceSectionPageProps {
    part: ServicesPart;
}

const ServiceSectionPage = ({ part }: ServiceSectionPageProps) => {
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
            title={PART_LABELS[part]}
            subtitle="Services Section"
            description={PART_DESCRIPTIONS[part]}
            hint="Each tab saves separately. Card images are shared per card; text fields are bilingual."
            onSave={() => savePart(part)}
            saving={savingPart === part}
            loading={loading}
            error={error}
        >
            <div className="space-y-4">
                {/* ── Section header ───────────────────────────────────────── */}
                <div className={clsx(sectionCardClass, "space-y-5")}>
                    <BilingualStringArrayEditor
                        label="Section Titles"
                        hint="Stacked headline fragments for this services block. Align EN/AR count when possible."
                        enValues={sectionByLocale.en.title}
                        arValues={sectionByLocale.ar.title}
                        placeholder="Section title part"
                        onEnChange={(title) => setPart(part, "en", { title })}
                        onArChange={(title) => setPart(part, "ar", { title })}
                        enTopError={getEnError("title")}
                        arTopError={getArError("title")}
                        enItemErrorAt={(i) => getEnError(`title.${i}`)}
                        arItemErrorAt={(i) => getArError(`title.${i}`)}
                    />

                    <BilingualField
                        label="Description"
                        hint="Lead paragraph under the titles. Plain textarea; supports line breaks."
                        en={
                            <Textarea
                                placeholder="Section description"
                                value={sectionByLocale.en.description}
                                onChange={(e) => setPart(part, "en", { description: e.target.value })}
                                rows={3}
                            />
                        }
                        ar={
                            <Textarea
                                placeholder="وصف القسم"
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
                                Card #{index + 1}
                            </p>
                            <Button
                                type="button"
                                variant="outline"
                                className={destructiveButtonClass}
                                onClick={() => removeCard(part, index)}
                            >
                                <Trash2 size={14} />
                                Remove Card
                            </Button>
                        </div>

                        {/* Shared image */}
                        <div className="space-y-2">
                            <CmsFieldLabel
                                label="Card Image (shared)"
                                hint="Illustration for this service card. One image for both locales."
                            />
                            <div className="h-[240px] w-[240px] max-w-full overflow-hidden rounded-xl border border-main-whiteMarble bg-main-titaniumWhite/30">
                                {cardDraftPreviews[index] ? (
                                    <img src={cardDraftPreviews[index]} alt={`Card ${index + 1} preview`} className="h-full w-full object-contain" />
                                ) : sectionByLocale.en.cards[index]?.img ? (
                                    <img src={cmsImageUrl(sectionByLocale.en.cards[index].img)} alt={`Card ${index + 1}`} className="h-full w-full object-contain" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center px-4 text-center text-sm text-main-coolGray">
                                        No image uploaded yet
                                    </div>
                                )}
                            </div>
                            {cardDraftPreviews[index] && (
                                <p className="text-xs text-main-primary">New image selected. It will upload on Save.</p>
                            )}
                        </div>

                        <div className="rounded-xl border border-main-whiteMarble bg-main-titaniumWhite/30 p-3">
                            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                                <div className="flex-1 space-y-2">
                                    <CmsFieldLabel
                                        label="Upload Card Image"
                                        hint="Upload replaces the image for this card after Save."
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
                                        Remove Image
                                    </Button>
                                )}
                            </div>
                        </div>
                        <InputError message={getEnError(`cards.${index}.img`) ?? getArError(`cards.${index}.img`)} />

                        {/* Bilingual text fields */}
                        <BilingualField
                            label="Tag"
                            hint="Small label or badge above the card title (e.g. feature name)."
                            en={
                                <Input
                                    placeholder="e.g. Fast, Reliable"
                                    value={sectionByLocale.en.cards[index]?.tag ?? ""}
                                    onChange={(e) => updateCard(part, "en", index, { tag: e.target.value })}
                                />
                            }
                            ar={
                                <Input
                                    placeholder="مثل: سريع، موثوق"
                                    value={sectionByLocale.ar.cards[index]?.tag ?? ""}
                                    onChange={(e) => updateCard(part, "ar", index, { tag: e.target.value })}
                                />
                            }
                            enError={getEnError(`cards.${index}.tag`)}
                            arError={getArError(`cards.${index}.tag`)}
                        />

                        <BilingualField
                            label="Card Title"
                            hint="Main heading on the card."
                            en={
                                <Input
                                    placeholder="Card title"
                                    value={sectionByLocale.en.cards[index]?.title ?? ""}
                                    onChange={(e) => updateCard(part, "en", index, { title: e.target.value })}
                                />
                            }
                            ar={
                                <Input
                                    placeholder="عنوان البطاقة"
                                    value={sectionByLocale.ar.cards[index]?.title ?? ""}
                                    onChange={(e) => updateCard(part, "ar", index, { title: e.target.value })}
                                />
                            }
                            enError={getEnError(`cards.${index}.title`)}
                            arError={getArError(`cards.${index}.title`)}
                        />

                        <BilingualField
                            label="Card Description"
                            hint="Rich text body: formatting, lists, and embedded media are allowed."
                            en={
                                <RichTextEditor
                                    placeholder="Card description"
                                    value={sectionByLocale.en.cards[index]?.description ?? ""}
                                    onChange={(html) => updateCard(part, "en", index, { description: html })}
                                />
                            }
                            ar={
                                <RichTextEditor
                                    placeholder="وصف البطاقة"
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
                        No cards yet. Add cards to showcase this service.
                    </div>
                )}

                <Button
                    type="button"
                    variant="outline"
                    className="border-main-primary/30 text-main-primary hover:bg-main-primary/10"
                    onClick={() => addCard(part)}
                >
                    Add Card
                </Button>
            </div>
        </PageShell>
    );
};

export default ServiceSectionPage;
