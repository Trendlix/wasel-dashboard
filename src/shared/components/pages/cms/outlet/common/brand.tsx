import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import useCmsCommonStore from "@/shared/hooks/store/useCmsCommonStore";
import {
    BilingualField,
    InputError,
    sectionCardClass,
    CmsFieldLabel,
} from "../about/_shared";
import CmsHelpHint from "../../cms-help-hint";

const BrandPage = () => {
    const { t } = useTranslation("cms");
    const { common, loading, error, savingPart, fetchPart, setBrand, savePart, fieldErrors } = useCmsCommonStore();

    useEffect(() => {
        fetchPart("brand");
    }, [fetchPart]);

    const getEnError = (path: string) => fieldErrors[`brand.en.${path}`];
    const getArError = (path: string) => fieldErrors[`brand.ar.${path}`];

    return (
        <div className="rounded-2xl border border-main-whiteMarble bg-main-white p-6 space-y-5 shadow-[0_16px_40px_rgba(17,24,39,0.04)]">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-main-lightSlate">{t("commonEditor.layout")}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold text-main-mirage">{t("commonEditor.brand.title")}</h3>
                        <CmsHelpHint text={t("commonEditor.brand.hint")} />
                    </div>
                    <p className="mt-1 max-w-3xl text-sm text-main-coolGray">
                        {t("commonEditor.brand.description")}
                    </p>
                </div>
                <Button
                    type="button"
                    onClick={() => savePart("brand")}
                    disabled={savingPart === "brand" || loading}
                    className="bg-main-primary hover:bg-main-primary/90 text-main-white min-w-[140px]"
                >
                    {savingPart === "brand" ? t("commonEditor.saving") : t("commonEditor.saveSection")}
                </Button>
            </div>

            {error && <div className="text-sm text-main-remove bg-main-remove/10 rounded-lg px-3 py-2">{error}</div>}

            {loading ? (
                <div className="space-y-4 animate-pulse">
                    <div className="h-5 bg-main-titaniumWhite rounded-md w-40" />
                    <div className="h-48 bg-main-titaniumWhite rounded-xl" />
                </div>
            ) : (
                <div className={clsx(sectionCardClass, "space-y-5")}>
                    <BilingualField
                        label={t("commonEditor.brand.brandTitle")}
                        hint={t("commonEditor.brand.brandTitleHint")}
                        en={
                            <Input
                                placeholder={t("commonEditor.brand.brandTitlePlaceholderEn")}
                                value={common.en.brand.title}
                                onChange={(e) => setBrand("en", { title: e.target.value })}
                            />
                        }
                        ar={
                            <Input
                                placeholder={t("commonEditor.brand.brandTitlePlaceholderAr")}
                                value={common.ar.brand.title}
                                onChange={(e) => setBrand("ar", { title: e.target.value })}
                            />
                        }
                        enError={getEnError("title")}
                        arError={getArError("title")}
                    />

                    <BilingualField
                        label={t("commonEditor.brand.brandDescription")}
                        hint={t("commonEditor.brand.brandDescriptionHint")}
                        en={
                            <Textarea
                                placeholder={t("commonEditor.brand.brandDescriptionPlaceholderEn")}
                                value={common.en.brand.description}
                                onChange={(e) => setBrand("en", { description: e.target.value })}
                                rows={4}
                            />
                        }
                        ar={
                            <Textarea
                                placeholder={t("commonEditor.brand.brandDescriptionPlaceholderAr")}
                                value={common.ar.brand.description}
                                onChange={(e) => setBrand("ar", { description: e.target.value })}
                                rows={4}
                            />
                        }
                        enError={getEnError("description")}
                        arError={getArError("description")}
                    />

                    <BilingualField
                        label={t("commonEditor.brand.ctaText")}
                        hint={t("commonEditor.brand.ctaTextHint")}
                        en={
                            <Input
                                placeholder={t("commonEditor.brand.ctaTextPlaceholderEn")}
                                value={common.en.brand.cta.text}
                                onChange={(e) => setBrand("en", { cta: { ...common.en.brand.cta, text: e.target.value } })}
                            />
                        }
                        ar={
                            <Input
                                placeholder={t("commonEditor.brand.ctaTextPlaceholderAr")}
                                value={common.ar.brand.cta.text}
                                onChange={(e) => setBrand("ar", { cta: { ...common.ar.brand.cta, text: e.target.value } })}
                            />
                        }
                        enError={getEnError("cta.text")}
                        arError={getArError("cta.text")}
                    />

                    {/* CTA link is shared (same URL for both locales) */}
                    <div className="space-y-1.5">
                        <CmsFieldLabel
                            label={t("commonEditor.brand.ctaLink")}
                            hint={t("commonEditor.brand.ctaLinkHint")}
                        />
                        <Input
                            placeholder={t("commonEditor.brand.ctaLinkPlaceholder")}
                            value={common.en.brand.cta.link}
                            onChange={(e) => {
                                setBrand("en", { cta: { ...common.en.brand.cta, link: e.target.value } });
                                setBrand("ar", { cta: { ...common.ar.brand.cta, link: e.target.value } });
                            }}
                        />
                        <InputError message={fieldErrors["brand.en.cta.link"] ?? fieldErrors["brand.ar.cta.link"]} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default BrandPage;
