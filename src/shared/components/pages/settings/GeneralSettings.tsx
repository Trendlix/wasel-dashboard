import { Settings, Globe, Phone, Mail } from "lucide-react";
import useSettingsStore from "@/shared/hooks/store/useSettingsStore";
import SettingsSectionHeader from "./SettingsSectionHeader";
import SettingsField from "./SettingsField";
import SettingsInput from "./SettingsInput";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const GeneralSettingsSkeleton = () => (
    <div className="bg-main-white border border-main-whiteMarble common-rounded p-6 animate-pulse">
        <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-main-whiteMarble" />
            <div className="h-5 w-36 rounded bg-main-whiteMarble" />
        </div>
        <div className="flex flex-col gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                    <div className="h-4 w-28 rounded bg-main-whiteMarble" />
                    <div className="h-11 w-full rounded-lg bg-main-whiteMarble" />
                </div>
            ))}
        </div>
    </div>
);

// ─── Field error helper ───────────────────────────────────────────────────────

const FieldError = ({ msg }: { msg?: string }) =>
    msg ? <p className="text-xs text-red-500 mt-1">{msg}</p> : null;

// ─── Component ────────────────────────────────────────────────────────────────

const GeneralSettings = () => {
    const { settings, loading, setSettings, fieldErrors } = useSettingsStore();

    if (loading || !settings) return <GeneralSettingsSkeleton />;

    const set =
        (key: keyof typeof settings) =>
        (e: React.ChangeEvent<HTMLInputElement>) =>
            setSettings({ [key]: e.target.value });

    const e = (key: string) => fieldErrors[`settings.${key}`];

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
                    <SettingsInput
                        value={settings.platform_name}
                        onChange={set("platform_name")}
                        placeholder="e.g. Wasel"
                        className={e("platform_name") ? "border-red-400 focus:border-red-400" : ""}
                    />
                    <FieldError msg={e("platform_name")} />
                </SettingsField>

                <SettingsField label="Support Email" prefix={<Mail size={15} className="text-main-sharkGray" />}>
                    <SettingsInput
                        type="email"
                        value={settings.support_email}
                        onChange={set("support_email")}
                        placeholder="support@example.com"
                        className={e("support_email") ? "border-red-400 focus:border-red-400" : ""}
                    />
                    <FieldError msg={e("support_email")} />
                </SettingsField>

                <SettingsField label="Support Phone" prefix={<Phone size={15} className="text-main-sharkGray" />}>
                    <SettingsInput
                        type="tel"
                        value={settings.support_phone}
                        onChange={set("support_phone")}
                        placeholder="+201XXXXXXXXX"
                        className={e("support_phone") ? "border-red-400 focus:border-red-400" : ""}
                    />
                    <FieldError msg={e("support_phone")} />
                </SettingsField>

                <SettingsField label="Hotline Number" prefix={<Phone size={15} className="text-main-sharkGray" />}>
                    <SettingsInput
                        type="tel"
                        value={settings.hotline_number}
                        onChange={set("hotline_number")}
                        placeholder="+201XXXXXXXXX"
                        className={e("hotline_number") ? "border-red-400 focus:border-red-400" : ""}
                    />
                    <FieldError msg={e("hotline_number")} />
                </SettingsField>

                <SettingsField label="WhatsApp Chatbot Number" prefix={<Phone size={15} className="text-main-sharkGray" />}>
                    <SettingsInput
                        type="tel"
                        value={settings.whatsapp_chatbot_number}
                        onChange={set("whatsapp_chatbot_number")}
                        placeholder="+201XXXXXXXXX"
                        className={e("whatsapp_chatbot_number") ? "border-red-400 focus:border-red-400" : ""}
                    />
                    <FieldError msg={e("whatsapp_chatbot_number")} />
                </SettingsField>

                <SettingsField label="Default Language" prefix={<Globe size={15} className="text-main-sharkGray" />}>
                    <Select
                        value={settings.default_language}
                        onValueChange={(val) => setSettings({ default_language: val as "en" | "ar" })}
                    >
                        <SelectTrigger className={`w-full h-11 border common-rounded px-4 text-sm text-main-mirage bg-main-white focus:ring-0 focus:border-main-primary ${e("default_language") ? "border-red-400" : "border-main-whiteMarble"}`}>
                            <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="ar">Arabic</SelectItem>
                        </SelectContent>
                    </Select>
                    <FieldError msg={e("default_language")} />
                </SettingsField>
            </div>
        </div>
    );
};

export default GeneralSettings;
