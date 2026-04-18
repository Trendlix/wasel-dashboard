import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import clsx from "clsx";
import { useCmsContactStore } from "@/shared/hooks/store/useCmsContactStore";
import {
    PageShell,
    InputError,
    sectionCardClass,
    CmsFieldLabel,
} from "../about/_shared";

const ContactPage = () => {
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
            title="Contact"
            subtitle="Contact Section"
            description="Public contact page: phones, primary inbox, department routing, address, and hours."
            hint="Values are validated (E.164-style phone, emails). Shown on the marketing contact page and may feed apps."
            onSave={saveContact}
            saving={saving}
            loading={loading}
            error={error}
        >
            <div className={clsx(sectionCardClass, "space-y-4")}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <CmsFieldLabel
                            label="Mobile"
                            hint="Primary mobile line in international format (e.g. +20 1xx xxx xxxx)."
                        />
                        <Input
                            placeholder="+20 100 000 0000"
                            value={contact.mobile}
                            onChange={(e) => setContact({ mobile: e.target.value })}
                            disabled={saving}
                        />
                        <InputError message={getError("mobile")} />
                    </div>

                    <div className="space-y-1.5">
                        <CmsFieldLabel
                            label="Landline"
                            hint="Office landline; include country and area code. National leading 0 may be required by validation."
                        />
                        <Input
                            placeholder="+20 2 0000 0000"
                            value={contact.landline}
                            onChange={(e) => setContact({ landline: e.target.value })}
                            disabled={saving}
                        />
                        <InputError message={getError("landline")} />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <CmsFieldLabel
                        label="Primary email"
                        hint="Main contact address shown prominently (e.g. hello@domain)."
                    />
                    <Input
                        type="email"
                        placeholder="contact@example.com"
                        value={contact.email}
                        onChange={(e) => setContact({ email: e.target.value })}
                        disabled={saving}
                    />
                    <InputError message={getError("email")} />
                </div>

                <div className="space-y-1.5">
                    <CmsFieldLabel
                        label="Department emails"
                        hint="Optional routed inboxes for support, legal, privacy, and partnerships. Each must be a valid email."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-main-mirage">
                                General support
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
                                Legal inquiries
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
                                Privacy concerns
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
                                Business partnerships
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
                        label="Address"
                        hint="Single-line postal address as displayed to visitors (street, city, country)."
                    />
                    <Input
                        placeholder="123 Main St, City, Country"
                        value={contact.address}
                        onChange={(e) => setContact({ address: e.target.value })}
                        disabled={saving}
                    />
                    <InputError message={getError("address")} />
                </div>

                <div className="space-y-1.5">
                    <CmsFieldLabel
                        label="Business Hours"
                        hint="Human-readable hours string (e.g. Sun–Thu 9:00–17:00). No structured format required."
                    />
                    <Input
                        placeholder="Sun – Thu, 9 AM – 5 PM"
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
