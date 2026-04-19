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
    InputError,
    destructiveButtonClass,
    sectionCardClass,
    cmsImageUrl,
    CmsFieldLabel,
} from "./_shared";

const AboutHeroPage = () => {
    const { t } = useTranslation("cms");
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
            title={t("aboutEditor.hero.pageTitle")}
            subtitle={t("aboutEditor.hero.subtitle")}
            description={t("aboutEditor.hero.description")}
            hint={t("aboutEditor.hero.hint")}
            onSave={() => savePart("hero")}
            saving={savingPart === "hero"}
            loading={loading}
            error={error}
        >
            <div className={clsx(sectionCardClass, "space-y-5")}>
                <BilingualStringArrayEditor
                    label={t("aboutEditor.hero.heroTitles")}
                    hint={t("aboutEditor.hero.heroTitlesHint")}
                    enValues={hero.en.titles}
                    arValues={hero.ar.titles}
                    placeholder={t("aboutEditor.hero.heroTitlePlaceholder")}
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
                            label={t("aboutEditor.hero.bgPreview")}
                            hint={t("aboutEditor.hero.bgPreviewHint")}
                        />
                        <div className="mt-2 h-[400px] w-[400px] max-w-full overflow-hidden rounded-xl border border-main-whiteMarble bg-main-white">
                            {bgDraftPreview ? (
                                    <img src={bgDraftPreview} alt={t("aboutEditor.hero.previewAlt")} className="h-full w-full object-contain" />
                            ) : hero.en.bg ? (
                                    <img src={cmsImageUrl(hero.en.bg)} alt={t("aboutEditor.hero.imageAlt")} className="h-full w-full object-contain" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center px-4 text-center text-sm text-main-coolGray">
                                        {t("aboutEditor.hero.bgEmpty")}
                                </div>
                            )}
                        </div>
                        {bgDraftPreview && (
                            <p className="mt-2 text-xs text-main-primary">
                                {t("aboutEditor.hero.bgSelected")}
                            </p>
                        )}
                    </div>

                    <div className="rounded-xl border border-main-whiteMarble bg-main-titaniumWhite/30 p-3">
                        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                            <div className="flex-1 space-y-2">
                                <CmsFieldLabel
                                    label={t("aboutEditor.hero.bgUpload")}
                                    hint={t("aboutEditor.hero.bgUploadHint")}
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
                                        {t("aboutEditor.hero.removeBg")}
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
