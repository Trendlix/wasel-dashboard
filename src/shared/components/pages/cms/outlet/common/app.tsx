import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import clsx from "clsx";
import { Trash2 } from "lucide-react";
import useCmsCommonStore from "@/shared/hooks/store/useCmsCommonStore";
import { useTranslation } from "react-i18next";
import {
    BilingualField,
    InputError,
    destructiveButtonClass,
    sectionCardClass,
    cmsImageUrl,
    CmsFieldLabel,
} from "../about/_shared";
import CmsHelpHint from "../../cms-help-hint";

const AppPage = () => {
    const { t } = useTranslation("cms");
    const {
        common,
        loading,
        error,
        savingPart,
        appDraftImages,
        fetchPart,
        setApp,
        setAppDraftImage,
        clearAppImage,
        savePart,
        fieldErrors,
    } = useCmsCommonStore();

    useEffect(() => {
        fetchPart("app");
    }, [fetchPart]);

    const getEnError = (path: string) => fieldErrors[`app.en.${path}`];
    const getArError = (path: string) => fieldErrors[`app.ar.${path}`];

    const userDraftPreview = useMemo(
        () => (appDraftImages.user ? URL.createObjectURL(appDraftImages.user) : ""),
        [appDraftImages.user],
    );
    const driverDraftPreview = useMemo(
        () => (appDraftImages.driver ? URL.createObjectURL(appDraftImages.driver) : ""),
        [appDraftImages.driver],
    );

    useEffect(() => {
        return () => {
            if (userDraftPreview) URL.revokeObjectURL(userDraftPreview);
            if (driverDraftPreview) URL.revokeObjectURL(driverDraftPreview);
        };
    }, [userDraftPreview, driverDraftPreview]);

    return (
        <div className="rounded-2xl border border-main-whiteMarble bg-main-white p-6 space-y-5 shadow-[0_16px_40px_rgba(17,24,39,0.04)]">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-main-lightSlate">{t("commonEditor.layout")}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold text-main-mirage">{t("commonEditor.app.title")}</h3>
                        <CmsHelpHint text={t("commonEditor.app.hint")} />
                    </div>
                    <p className="mt-1 max-w-3xl text-sm text-main-coolGray">
                        {t("commonEditor.app.description")}
                    </p>
                </div>
                <Button
                    type="button"
                    onClick={() => savePart("app")}
                    disabled={savingPart === "app" || loading}
                    className="bg-main-primary hover:bg-main-primary/90 text-main-white min-w-[140px]"
                >
                    {savingPart === "app" ? t("commonEditor.saving") : t("commonEditor.saveSection")}
                </Button>
            </div>

            {error && <div className="text-sm text-main-remove bg-main-remove/10 rounded-lg px-3 py-2">{error}</div>}

            {loading ? (
                <div className="space-y-4 animate-pulse">
                    <div className="h-5 bg-main-titaniumWhite rounded-md w-40" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="h-48 bg-main-titaniumWhite rounded-xl" />
                        <div className="h-48 bg-main-titaniumWhite rounded-xl" />
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* ── User App ── */}
                    <div className={clsx(sectionCardClass, "space-y-4")}>
                        <p className="font-semibold text-main-mirage">{t("commonEditor.app.userApp")}</p>

                        {/* Image preview (shared) */}
                        <div className="space-y-2">
                            <CmsFieldLabel
                                label={t("commonEditor.app.imageShared")}
                                hint={t("commonEditor.app.hint")}
                            />
                            <div className="h-[320px] w-[320px] max-w-full overflow-hidden rounded-xl border border-main-whiteMarble bg-main-titaniumWhite/30">
                                {userDraftPreview ? (
                                    <img src={userDraftPreview} alt="User app preview" className="h-full w-full object-contain" />
                                ) : common.en.app.user.img ? (
                                    <img src={cmsImageUrl(common.en.app.user.img)} alt="User app" className="h-full w-full object-contain" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center px-4 text-center text-sm text-main-coolGray">
                                        {t("commonEditor.app.imageEmpty")}
                                    </div>
                                )}
                            </div>
                            {userDraftPreview && (
                                <p className="text-xs text-main-primary">{t("commonEditor.app.imageSelected")}</p>
                            )}
                        </div>
                        <div className="rounded-xl border border-main-whiteMarble bg-main-titaniumWhite/30 p-3">
                            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                                <div className="flex-1 space-y-2">
                                    <CmsFieldLabel
                                        label={t("commonEditor.app.uploadImage")}
                                        hint={t("commonEditor.app.hint")}
                                    />
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const f = e.target.files?.[0];
                                            if (f) setAppDraftImage("user", f);
                                        }}
                                        disabled={savingPart === "app"}
                                    />
                                </div>
                                {(common.en.app.user.img || appDraftImages.user) && (
                                    <Button type="button" variant="outline" className={destructiveButtonClass} onClick={() => clearAppImage("user")} disabled={savingPart === "app"}>
                                        <Trash2 size={14} /> {t("commonEditor.app.removeImage")}
                                    </Button>
                                )}
                            </div>
                        </div>
                        <InputError message={getEnError("user.img") ?? getArError("user.img")} />

                        {/* Bilingual title */}
                        <BilingualField
                            label={t("commonEditor.app.appTitle")}
                            hint={t("commonEditor.app.hint")}
                            en={
                                <Input
                                    placeholder={t("commonEditor.app.appTitlePlaceholderEn")}
                                    value={common.en.app.user.title}
                                    onChange={(e) => setApp("en", { user: { ...common.en.app.user, title: e.target.value } })}
                                />
                            }
                            ar={
                                <Input
                                    placeholder={t("commonEditor.app.appTitlePlaceholderAr")}
                                    value={common.ar.app.user.title}
                                    onChange={(e) => setApp("ar", { user: { ...common.ar.app.user, title: e.target.value } })}
                                />
                            }
                            enError={getEnError("user.title")}
                            arError={getArError("user.title")}
                        />

                        {/* Store links (shared) */}
                        <div className="space-y-3 pt-1">
                            <CmsFieldLabel
                                label={t("commonEditor.app.storeLinks")}
                                hint={t("commonEditor.app.hint")}
                            />
                            <div className="space-y-2">
                                <label className="text-xs text-main-sharkGray">{t("commonEditor.app.appStore")}</label>
                                <Input
                                    placeholder={t("commonEditor.app.appStorePlaceholder")}
                                    value={common.en.app.user.links.app_store}
                                    onChange={(e) => {
                                        setApp("en", { user: { ...common.en.app.user, links: { ...common.en.app.user.links, app_store: e.target.value } } });
                                        setApp("ar", { user: { ...common.ar.app.user, links: { ...common.ar.app.user.links, app_store: e.target.value } } });
                                    }}
                                />
                                <InputError message={getEnError("user.links.app_store")} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-main-sharkGray">{t("commonEditor.app.playStore")}</label>
                                <Input
                                    placeholder={t("commonEditor.app.playStorePlaceholder")}
                                    value={common.en.app.user.links.play_store}
                                    onChange={(e) => {
                                        setApp("en", { user: { ...common.en.app.user, links: { ...common.en.app.user.links, play_store: e.target.value } } });
                                        setApp("ar", { user: { ...common.ar.app.user, links: { ...common.ar.app.user.links, play_store: e.target.value } } });
                                    }}
                                />
                                <InputError message={getEnError("user.links.play_store")} />
                            </div>
                        </div>
                    </div>

                    {/* ── Driver App ── */}
                    <div className={clsx(sectionCardClass, "space-y-4")}>
                        <p className="font-semibold text-main-mirage">{t("commonEditor.app.driverApp")}</p>

                        {/* Image preview (shared) */}
                        <div className="space-y-2">
                            <CmsFieldLabel
                                label={t("commonEditor.app.imageShared")}
                                hint={t("commonEditor.app.hint")}
                            />
                            <div className="h-[320px] w-[320px] max-w-full overflow-hidden rounded-xl border border-main-whiteMarble bg-main-titaniumWhite/30">
                                {driverDraftPreview ? (
                                    <img src={driverDraftPreview} alt="Driver app preview" className="h-full w-full object-contain" />
                                ) : common.en.app.driver.img ? (
                                    <img src={cmsImageUrl(common.en.app.driver.img)} alt="Driver app" className="h-full w-full object-contain" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center px-4 text-center text-sm text-main-coolGray">
                                        {t("commonEditor.app.imageEmpty")}
                                    </div>
                                )}
                            </div>
                            {driverDraftPreview && (
                                <p className="text-xs text-main-primary">{t("commonEditor.app.imageSelected")}</p>
                            )}
                        </div>
                        <div className="rounded-xl border border-main-whiteMarble bg-main-titaniumWhite/30 p-3">
                            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                                <div className="flex-1 space-y-2">
                                    <CmsFieldLabel
                                        label={t("commonEditor.app.uploadImage")}
                                        hint={t("commonEditor.app.hint")}
                                    />
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const f = e.target.files?.[0];
                                            if (f) setAppDraftImage("driver", f);
                                        }}
                                        disabled={savingPart === "app"}
                                    />
                                </div>
                                {(common.en.app.driver.img || appDraftImages.driver) && (
                                    <Button type="button" variant="outline" className={destructiveButtonClass} onClick={() => clearAppImage("driver")} disabled={savingPart === "app"}>
                                        <Trash2 size={14} /> {t("commonEditor.app.removeImage")}
                                    </Button>
                                )}
                            </div>
                        </div>
                        <InputError message={getEnError("driver.img") ?? getArError("driver.img")} />

                        {/* Bilingual title */}
                        <BilingualField
                            label={t("commonEditor.app.appTitle")}
                            hint={t("commonEditor.app.hint")}
                            en={
                                <Input
                                    placeholder={t("commonEditor.app.appTitlePlaceholderEn")}
                                    value={common.en.app.driver.title}
                                    onChange={(e) => setApp("en", { driver: { ...common.en.app.driver, title: e.target.value } })}
                                />
                            }
                            ar={
                                <Input
                                    placeholder={t("commonEditor.app.appTitlePlaceholderAr")}
                                    value={common.ar.app.driver.title}
                                    onChange={(e) => setApp("ar", { driver: { ...common.ar.app.driver, title: e.target.value } })}
                                />
                            }
                            enError={getEnError("driver.title")}
                            arError={getArError("driver.title")}
                        />

                        {/* Store links (shared) */}
                        <div className="space-y-3 pt-1">
                            <CmsFieldLabel
                                label={t("commonEditor.app.storeLinks")}
                                hint={t("commonEditor.app.hint")}
                            />
                            <div className="space-y-2">
                                <label className="text-xs text-main-sharkGray">{t("commonEditor.app.appStore")}</label>
                                <Input
                                    placeholder={t("commonEditor.app.appStorePlaceholder")}
                                    value={common.en.app.driver.links.app_store}
                                    onChange={(e) => {
                                        setApp("en", { driver: { ...common.en.app.driver, links: { ...common.en.app.driver.links, app_store: e.target.value } } });
                                        setApp("ar", { driver: { ...common.ar.app.driver, links: { ...common.ar.app.driver.links, app_store: e.target.value } } });
                                    }}
                                />
                                <InputError message={getEnError("driver.links.app_store")} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-main-sharkGray">{t("commonEditor.app.playStore")}</label>
                                <Input
                                    placeholder={t("commonEditor.app.playStorePlaceholder")}
                                    value={common.en.app.driver.links.play_store}
                                    onChange={(e) => {
                                        setApp("en", { driver: { ...common.en.app.driver, links: { ...common.en.app.driver.links, play_store: e.target.value } } });
                                        setApp("ar", { driver: { ...common.ar.app.driver, links: { ...common.ar.app.driver.links, play_store: e.target.value } } });
                                    }}
                                />
                                <InputError message={getEnError("driver.links.play_store")} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppPage;
