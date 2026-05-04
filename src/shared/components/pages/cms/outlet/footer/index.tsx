import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import clsx from "clsx";
import { Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCmsFooterStore } from "@/shared/hooks/store/useCmsFooterStore";
import {
    PageShell,
    InputError,
    sectionCardClass,
    CmsFieldLabel,
} from "../about/_shared";
import { formInputClass } from "@/shared/components/common/formStyles";
import { FOOTER_LUCIDE_ICONS } from "@/shared/validation/cms/footer";

const FooterPage = () => {
    const { t } = useTranslation("cms");
    const {
        footer,
        loading,
        saving,
        error,
        fieldErrors,
        fetchFooter,
        setFooter,
        setSocialRow,
        addSocialRow,
        removeSocialRow,
        saveFooter,
    } = useCmsFooterStore();

    useEffect(() => {
        void fetchFooter();
    }, [fetchFooter]);

    const getError = (field: string) => fieldErrors[field];

    return (
        <PageShell
            title={t("footerEditor.pageTitle")}
            subtitle={t("footerEditor.subtitle")}
            description={t("footerEditor.description")}
            hint={t("footerEditor.hint")}
            onSave={() => void saveFooter()}
            saving={saving}
            loading={loading}
            error={error}
        >
            <div className={clsx(sectionCardClass, "space-y-4")}>
                <p className="text-sm font-semibold text-main-mirage">{t("footerEditor.socialSectionTitle")}</p>
                <p className="text-xs text-main-coolGray">{t("footerEditor.socialSectionHint")}</p>

                {footer.social_links.length === 0 ? (
                    <p className="text-sm text-main-coolGray">{t("footerEditor.socialEmpty")}</p>
                ) : (
                    <div className="space-y-3">
                        {footer.social_links.map((row, index) => (
                            <div
                                key={`${row.icon}-${index}`}
                                className="flex flex-col gap-3 rounded-xl border border-main-whiteMarble bg-main-titaniumWhite/40 p-3 md:flex-row md:items-end"
                            >
                                <div className="min-w-0 flex-1 space-y-1.5">
                                    <CmsFieldLabel label={t("footerEditor.iconLabel")} />
                                    <select
                                        className={clsx(formInputClass, "w-full")}
                                        value={row.icon}
                                        onChange={(e) =>
                                            setSocialRow(index, {
                                                icon: e.target.value as (typeof FOOTER_LUCIDE_ICONS)[number],
                                            })
                                        }
                                        disabled={saving}
                                    >
                                        {FOOTER_LUCIDE_ICONS.map((name) => (
                                            <option key={name} value={name}>
                                                {name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={getError(`social_links.${index}.icon`)} />
                                </div>
                                <div className="min-w-0 flex-[2] space-y-1.5">
                                    <CmsFieldLabel
                                        label={t("footerEditor.linkLabel")}
                                        hint={t("footerEditor.linkHint")}
                                    />
                                    <Input
                                        placeholder="https://"
                                        value={row.link}
                                        onChange={(e) => setSocialRow(index, { link: e.target.value })}
                                        disabled={saving}
                                    />
                                    <InputError message={getError(`social_links.${index}.link`)} />
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="shrink-0 border-main-remove/30 text-main-remove hover:bg-main-remove/10"
                                    onClick={() => removeSocialRow(index)}
                                    disabled={saving}
                                    aria-label={t("footerEditor.removeRow")}
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}

                <Button
                    type="button"
                    variant="outline"
                    className="border-main-primary/40 text-main-primary"
                    onClick={addSocialRow}
                    disabled={saving || footer.social_links.length >= 10}
                >
                    <Plus className="mr-2 size-4" />
                    {t("footerEditor.addSocial")}
                </Button>
            </div>

            <div className={clsx(sectionCardClass, "space-y-4")}>
                <p className="text-sm font-semibold text-main-mirage">{t("footerEditor.appSectionTitle")}</p>
                <p className="text-xs text-main-coolGray">{t("footerEditor.appSectionHint")}</p>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                        <CmsFieldLabel
                            label={t("footerEditor.iosCta")}
                            hint={t("footerEditor.iosCtaHint")}
                        />
                        <Input
                            placeholder="https://apps.apple.com/..."
                            value={footer.app_links.ios_app_cta}
                            onChange={(e) =>
                                setFooter({ app_links: { ios_app_cta: e.target.value } })
                            }
                            disabled={saving}
                        />
                        <InputError message={getError("app_links.ios_app_cta")} />
                    </div>
                    <div className="space-y-1.5">
                        <CmsFieldLabel
                            label={t("footerEditor.androidCta")}
                            hint={t("footerEditor.androidCtaHint")}
                        />
                        <Input
                            placeholder="https://play.google.com/..."
                            value={footer.app_links.android_app_cta}
                            onChange={(e) =>
                                setFooter({ app_links: { android_app_cta: e.target.value } })
                            }
                            disabled={saving}
                        />
                        <InputError message={getError("app_links.android_app_cta")} />
                    </div>
                </div>
            </div>
        </PageShell>
    );
};

export default FooterPage;
