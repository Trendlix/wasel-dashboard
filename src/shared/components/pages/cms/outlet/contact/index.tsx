import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useCmsContactStore } from "@/shared/hooks/store/useCmsContactStore";
import {
    PageShell,
    InputError,
    sectionCardClass,
    CmsFieldLabel,
} from "../about/_shared";

const ContactPage = () => {
    const { t } = useTranslation("cms");
    const {
        contact,
        loading,
        saving,
        error,
        fieldErrors,
        fetchContact,
        setContact,
        saveContact,
    } = useCmsContactStore();

    useEffect(() => { fetchContact(); }, [fetchContact]);

    const getError = (field: string) => fieldErrors[field];

    return (
        <PageShell
            title={t("contactEditor.pageTitle")}
            subtitle={t("contactEditor.subtitle")}
            description={t("contactEditor.description")}
            hint={t("contactEditor.hint")}
            onSave={saveContact}
            saving={saving}
            loading={loading}
            error={error}
        >
            <div className={clsx(sectionCardClass, "space-y-4")}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <CmsFieldLabel
                            label={t("contactEditor.mobile")}
                            hint={t("contactEditor.mobileHint")}
                        />
                        <Input
                            placeholder={t("contactEditor.mobilePlaceholder")}
                            value={contact.mobile}
                            onChange={(e) => setContact({ mobile: e.target.value })}
                            disabled={saving}
                        />
                        <InputError message={getError("mobile")} />
                    </div>

                    <div className="space-y-1.5">
                        <CmsFieldLabel
                            label={t("contactEditor.landline")}
                            hint={t("contactEditor.landlineHint")}
                        />
                        <Input
                            placeholder={t("contactEditor.landlinePlaceholder")}
                            value={contact.landline}
                            onChange={(e) => setContact({ landline: e.target.value })}
                            disabled={saving}
                        />
                        <InputError message={getError("landline")} />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <CmsFieldLabel
                        label={t("contactEditor.primaryEmail")}
                        hint={t("contactEditor.primaryEmailHint")}
                    />
                    <Input
                        type="email"
                        placeholder={t("contactEditor.primaryEmailPlaceholder")}
                        value={contact.email}
                        onChange={(e) => setContact({ email: e.target.value })}
                        disabled={saving}
                    />
                    <InputError message={getError("email")} />
                </div>

                <div className="space-y-1.5">
                    <CmsFieldLabel
                        label={t("contactEditor.departments")}
                        hint={t("contactEditor.departmentsHint")}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-main-mirage">
                                {t("contactEditor.generalSupport")}
                            </label>
                            <Input
                                type="email"
                                placeholder="support@example.com"
                                value={contact.emails.general_support}
                                onChange={(e) =>
                                    setContact({
                                        emails: {
                                            general_support: e.target.value,
                                        },
                                    })
                                }
                                disabled={saving}
                            />
                            <InputError message={getError("emails.general_support")} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-main-mirage">
                                {t("contactEditor.legalInquiries")}
                            </label>
                            <Input
                                type="email"
                                placeholder="legal@example.com"
                                value={contact.emails.legal_inquiries}
                                onChange={(e) =>
                                    setContact({
                                        emails: { legal_inquiries: e.target.value },
                                    })
                                }
                                disabled={saving}
                            />
                            <InputError message={getError("emails.legal_inquiries")} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-main-mirage">
                                {t("contactEditor.privacyConcerns")}
                            </label>
                            <Input
                                type="email"
                                placeholder="privacy@example.com"
                                value={contact.emails.privacy_concerns}
                                onChange={(e) =>
                                    setContact({
                                        emails: { privacy_concerns: e.target.value },
                                    })
                                }
                                disabled={saving}
                            />
                            <InputError message={getError("emails.privacy_concerns")} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-main-mirage">
                                {t("contactEditor.businessPartnerships")}
                            </label>
                            <Input
                                type="email"
                                placeholder="partners@example.com"
                                value={contact.emails.business_partnerships}
                                onChange={(e) =>
                                    setContact({
                                        emails: {
                                            business_partnerships: e.target.value,
                                        },
                                    })
                                }
                                disabled={saving}
                            />
                            <InputError
                                message={getError("emails.business_partnerships")}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <CmsFieldLabel
                        label={t("contactEditor.address")}
                        hint={t("contactEditor.addressHint")}
                    />
                    <Input
                        placeholder={t("contactEditor.addressPlaceholder")}
                        value={contact.address}
                        onChange={(e) => setContact({ address: e.target.value })}
                        disabled={saving}
                    />
                    <InputError message={getError("address")} />
                </div>

                <div className="space-y-1.5">
                    <CmsFieldLabel
                        label={t("contactEditor.businessHours")}
                        hint={t("contactEditor.businessHoursHint")}
                    />
                    <Input
                        placeholder={t("contactEditor.businessHoursPlaceholder")}
                        value={contact.business_hours}
                        onChange={(e) => setContact({ business_hours: e.target.value })}
                        disabled={saving}
                    />
                    <InputError message={getError("business_hours")} />
                </div>
            </div>
        </PageShell>
    );
};

export default ContactPage;
