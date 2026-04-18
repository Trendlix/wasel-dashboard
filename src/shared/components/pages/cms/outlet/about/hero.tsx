import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import clsx from "clsx";
import useCmsAboutStore from "@/shared/hooks/store/useCmsAboutStore";
import {
    PageShell,
    BilingualStringArrayEditor,
    InputError,
    destructiveButtonClass,
    sectionCardClass,
    cmsImageUrl,
    CmsFieldLabel,
} from "./_shared";

const AboutHeroPage = () => {
    const {
        hero,
        loading,
        savingPart,
        bgDraftFile,
        error,
        fieldErrors,
        fetchPart,
        setHero,
        setHeroBgFile,
        clearHeroBg,
        savePart,
    } = useCmsAboutStore();

    useEffect(() => { fetchPart("hero"); }, [fetchPart]);

    const bgDraftPreview = useMemo(
        () => (bgDraftFile ? URL.createObjectURL(bgDraftFile) : ""),
        [bgDraftFile],
    );

    useEffect(() => {
        return () => { if (bgDraftPreview) URL.revokeObjectURL(bgDraftPreview); };
    }, [bgDraftPreview]);

    const getEnError = (path: string) => fieldErrors[`hero.en.${path}`];
    const getArError = (path: string) => fieldErrors[`hero.ar.${path}`];

    return (
        <PageShell
            title="About / Hero"
            subtitle="About Section"
            description="Top of the public About page: rotating headline lines and one shared background image for all locales."
            hint="Hero saves independently from other About tabs. Background image is not duplicated per language."
            onSave={() => savePart("hero")}
            saving={savingPart === "hero"}
            loading={loading}
            error={error}
        >
            <div className={clsx(sectionCardClass, "space-y-5")}>
                <BilingualStringArrayEditor
                    label="Hero Titles"
                    hint="Each line is a segment of the animated headline. Keep English and Arabic lines aligned in meaning and count when possible."
                    enValues={hero.en.titles}
                    arValues={hero.ar.titles}
                    placeholder="Hero title"
                    onEnChange={(titles) => setHero("en", { titles })}
                    onArChange={(titles) => setHero("ar", { titles })}
                    enTopError={getEnError("titles")}
                    arTopError={getArError("titles")}
                    enItemErrorAt={(i) => getEnError(`titles.${i}`)}
                    arItemErrorAt={(i) => getArError(`titles.${i}`)}
                />

                {/* Background image — shared across locales */}
                <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-5 items-start">
                    <div className="rounded-2xl border border-main-whiteMarble bg-main-titaniumWhite/30 p-3">
                        <CmsFieldLabel
                            label="Hero Background Preview"
                            hint="Live preview of the image visitors see behind the hero text. One asset is used for EN and AR."
                        />
                        <div className="mt-2 h-[400px] w-[400px] max-w-full overflow-hidden rounded-xl border border-main-whiteMarble bg-main-white">
                            {bgDraftPreview ? (
                                <img src={bgDraftPreview} alt="Hero background preview" className="h-full w-full object-contain" />
                            ) : hero.en.bg ? (
                                <img src={cmsImageUrl(hero.en.bg)} alt="Hero background" className="h-full w-full object-contain" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center px-4 text-center text-sm text-main-coolGray">
                                    No background image uploaded yet
                                </div>
                            )}
                        </div>
                        {bgDraftPreview && (
                            <p className="mt-2 text-xs text-main-primary">
                                New background selected. It will upload on Save.
                            </p>
                        )}
                    </div>

                    <div className="rounded-xl border border-main-whiteMarble bg-main-titaniumWhite/30 p-3">
                        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                            <div className="flex-1 space-y-2">
                                <CmsFieldLabel
                                    label="Hero Background Image (shared)"
                                    hint="Upload a wide, high-resolution image. It is stored once and reused for both languages."
                                />
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        setHeroBgFile(file);
                                    }}
                                    disabled={savingPart === "hero"}
                                />
                            </div>
                            {(hero.en.bg || bgDraftFile) && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className={destructiveButtonClass}
                                    onClick={clearHeroBg}
                                    disabled={savingPart === "hero"}
                                >
                                    <Trash2 size={14} />
                                    Remove Background
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
                <InputError message={getEnError("bg") ?? getArError("bg")} />
            </div>
        </PageShell>
    );
};

export default AboutHeroPage;
