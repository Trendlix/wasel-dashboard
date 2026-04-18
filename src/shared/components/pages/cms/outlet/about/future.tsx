import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import clsx from "clsx";
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
            title="About / Future"
            subtitle="About Section"
            description="Future-focused cards: image plus bilingual title lines and description lines per card."
            hint="Each card owns its own image. Title/description are string lists so you can match multi-line layouts."
            onSave={() => savePart("future")}
            saving={savingPart === "future"}
            loading={loading}
            error={error}
        >
            <div className="space-y-4">
                <div className={clsx(sectionCardClass, "space-y-3")}>
                    <div className="space-y-2">
                        <CmsFieldLabel
                            label="Section visibility"
                            hint="When hidden, Future cards are not shown on the live About page."
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
                                Future Card #{index + 1}
                            </p>
                            <Button
                                type="button"
                                variant="outline"
                                className={destructiveButtonClass}
                                onClick={() => removeFutureCard(index)}
                            >
                                <Trash2 size={14} />
                                Remove Card
                            </Button>
                        </div>

                        {/* Shared image */}
                        <div className="space-y-2">
                            <CmsFieldLabel
                                label="Future Card Image (shared)"
                                hint="Visual for this future pillar. Shared across EN/AR like other About cards."
                            />
                            <div className="h-[280px] w-[280px] max-w-full overflow-hidden rounded-xl border border-main-whiteMarble bg-main-titaniumWhite/30">
                                {futureDraftPreviews[index] ? (
                                    <img src={futureDraftPreviews[index]} alt={`Future card ${index + 1} preview`} className="h-full w-full object-contain" />
                                ) : future.en.cards[index]?.img ? (
                                    <img src={cmsImageUrl(future.en.cards[index].img)} alt={`Future card ${index + 1}`} className="h-full w-full object-contain" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center px-4 text-center text-sm text-main-coolGray">
                                        No image uploaded yet
                                    </div>
                                )}
                            </div>
                            {futureDraftPreviews[index] && (
                                <p className="text-xs text-main-primary">New image selected. It will upload on Save.</p>
                            )}
                        </div>

                        <div className="rounded-xl border border-main-whiteMarble bg-main-titaniumWhite/30 p-3">
                            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                                <div className="flex-1 space-y-2">
                                    <CmsFieldLabel
                                        label="Upload Card Image"
                                        hint="Upload replaces the stored image for this card index after Save."
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
                                        Remove Image
                                    </Button>
                                )}
                            </div>
                        </div>
                        <InputError message={getEnError(`cards.${index}.img`) ?? getArError(`cards.${index}.img`)} />

                        {/* Bilingual text arrays */}
                        <BilingualStringArrayEditor
                            label="Card Titles"
                            hint="Stacked headline fragments for this card. Add rows to match the design."
                            enValues={future.en.cards[index]?.titles ?? []}
                            arValues={future.ar.cards[index]?.titles ?? []}
                            placeholder="Card title"
                            onEnChange={(titles) => updateFutureCard("en", index, { titles })}
                            onArChange={(titles) => updateFutureCard("ar", index, { titles })}
                            enTopError={getEnError(`cards.${index}.titles`)}
                            arTopError={getArError(`cards.${index}.titles`)}
                            enItemErrorAt={(i) => getEnError(`cards.${index}.titles.${i}`)}
                            arItemErrorAt={(i) => getArError(`cards.${index}.titles.${i}`)}
                        />

                        <BilingualStringArrayEditor
                            label="Card Descriptions"
                            hint="Body copy lines under the titles. Use one row per paragraph if needed."
                            enValues={future.en.cards[index]?.descriptions ?? []}
                            arValues={future.ar.cards[index]?.descriptions ?? []}
                            placeholder="Card description"
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
                        No future cards yet. Add cards to highlight future goals and benefits.
                    </div>
                )}

                <Button
                    type="button"
                    variant="outline"
                    className="border-main-primary/30 text-main-primary hover:bg-main-primary/10"
                    onClick={addFutureCard}
                >
                    Add Future Card
                </Button>
            </div>
        </PageShell>
    );
};

export default AboutFuturePage;
