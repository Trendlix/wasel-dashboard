import { Settings, Globe } from "lucide-react";
import { useState } from "react";
import SettingsSectionHeader from "./SettingsSectionHeader";
import SettingsField from "./SettingsField";
import SettingsInput from "./SettingsInput";

const GeneralSettings = () => {
    const [form, setForm] = useState({
        platformName: "Wasel",
        supportEmail: "support@wasel.com",
        supportPhone: "+966 800 123 4567",
        language: "",
    });

    const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((prev) => ({ ...prev, [key]: e.target.value }));

    return (
        <div className="bg-main-white border border-main-whiteMarble common-rounded p-6">
            <SettingsSectionHeader
                icon={Settings}
                title="General Settings"
                iconBg="bg-main-primary/10"
                iconColor="text-main-primary"
            />

            <div className="flex flex-col gap-5">
                <SettingsField label="Platform Name">
                    <SettingsInput value={form.platformName} onChange={set("platformName")} />
                </SettingsField>

                <SettingsField label="Support Email">
                    <SettingsInput type="email" value={form.supportEmail} onChange={set("supportEmail")} />
                </SettingsField>

                <SettingsField label="Support Phone">
                    <SettingsInput type="tel" value={form.supportPhone} onChange={set("supportPhone")} />
                </SettingsField>

                <SettingsField label="Default Language" prefix={<Globe size={15} className="text-main-sharkGray" />}>
                    <SettingsInput value={form.language} onChange={set("language")} placeholder="e.g. English" />
                </SettingsField>
            </div>
        </div>
    );
};

export default GeneralSettings;