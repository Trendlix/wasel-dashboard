import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import clsx from "clsx";
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
            title="About / Stand For"
            subtitle="About Section"
            description="Value cards: one shared image per card with bilingual title and description."
            hint="Cards are paired by index across EN/AR. Removing a card deletes it for both languages."
            onSave={() => savePart("stand_for")}
            saving={savingPart === "stand_for"}
            loading={loading}
            error={error}
        >
            <div className="space-y-4">
                <div className={clsx(sectionCardClass, "space-y-4")}>
                    <div className="space-y-2">
                        <CmsFieldLabel
                            label="Section visibility"
                            hint="Hides the entire Stand For region on the public About page when enabled."
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
                        label="Stand For Titles"
                        hint="Intro lines above the value cards. Keep length similar across locales for layout balance."
                        enValues={standFor.en.titles}
                        arValues={standFor.ar.titles}
                        placeholder="Stand For title"
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
                                Card #{index + 1}
                            </p>
                            <Button
                                type="button"
                                variant="outline"
                                className={destructiveButtonClass}
                                onClick={() => removeStandForCard(index)}
                            >
                                <Trash2 size={14} />
                                Remove Card
                            </Button>
                        </div>

                        {/* Shared image */}
                        <div className="space-y-2">
                            <CmsFieldLabel
                                label="Card Image (shared)"
                                hint="Illustration for this card only. The same file is shown for English and Arabic visitors."
                            />
                            <div className="h-[280px] w-[280px] max-w-full overflow-hidden rounded-xl border border-main-whiteMarble bg-main-titaniumWhite/30">
                                {standForDraftPreviews[index] ? (
                                    <img src={standForDraftPreviews[index]} alt={`Card ${index + 1} preview`} className="h-full w-full object-contain" />
                                ) : standFor.en.cards[index]?.img ? (
                                    <img src={cmsImageUrl(standFor.en.cards[index].img)} alt={`Card ${index + 1}`} className="h-full w-full object-contain" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center px-4 text-center text-sm text-main-coolGray">
                                        No image uploaded yet
                                    </div>
                                )}
                            </div>
                            {standForDraftPreviews[index] && (
                                <p className="text-xs text-main-primary">New image selected. It will upload on Save.</p>
                            )}
                        </div>

                        <div className="rounded-xl border border-main-whiteMarble bg-main-titaniumWhite/30 p-3">
                            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                                <div className="flex-1 space-y-2">
                                    <CmsFieldLabel
                                        label="Upload Card Image"
                                        hint="PNG or JPG recommended. Replaces the current card image after Save."
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
                                        Remove Image
                                    </Button>
                                )}
                            </div>
                        </div>
                        <InputError message={getEnError(`cards.${index}.img`) ?? getArError(`cards.${index}.img`)} />

                        {/* Bilingual text fields */}
                        <BilingualField
                            label="Card Title"
                            hint="Short headline displayed on the card face."
                            en={
                                <Input
                                    placeholder="Card title"
                                    value={standFor.en.cards[index]?.title ?? ""}
                                    onChange={(e) => updateStandForCard("en", index, { title: e.target.value })}
                                />
                            }
                            ar={
                                <Input
                                    placeholder="عنوان البطاقة"
                                    value={standFor.ar.cards[index]?.title ?? ""}
                                    onChange={(e) => updateStandForCard("ar", index, { title: e.target.value })}
                                />
                            }
                            enError={getEnError(`cards.${index}.title`)}
                            arError={getArError(`cards.${index}.title`)}
                        />

                        <BilingualField
                            label="Card Description"
                            hint="Supporting copy under the title. Plain textarea; use line breaks for spacing."
                            en={
                                <textarea
                                    className="w-full min-h-[80px] rounded-lg border border-main-whiteMarble bg-main-white px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-main-primary/40 focus:border-main-primary"
                                    placeholder="Card description"
                                    value={standFor.en.cards[index]?.description ?? ""}
                                    onChange={(e) => updateStandForCard("en", index, { description: e.target.value })}
                                />
                            }
                            ar={
                                <textarea
                                    className="w-full min-h-[80px] rounded-lg border border-main-whiteMarble bg-main-white px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-main-primary/40 focus:border-main-primary"
                                    placeholder="وصف البطاقة"
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
                        No cards yet. Add your first card to describe what the company stands for.
                    </div>
                )}

                <Button
                    type="button"
                    variant="outline"
                    className="border-main-primary/30 text-main-primary hover:bg-main-primary/10"
                    onClick={addStandForCard}
                >
                    Add Card
                </Button>
            </div>
        </PageShell>
    );
};

export default AboutStandForPage;
