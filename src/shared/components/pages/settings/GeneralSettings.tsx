import { Settings, Globe, Phone, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import useSettingsStore from "@/shared/hooks/store/useSettingsStore";
import useLanguageStore from "@/shared/hooks/store/useLanguageStore";
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
            {Array.from({ length: 7 }).map((_, i) => (
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
    msg ? <p className="text-xs font-medium text-main-red mt-1">{msg}</p> : null;

// ─── Component ────────────────────────────────────────────────────────────────

const GeneralSettings = () => {
    const { t } = useTranslation("settings");
    const { t: tc } = useTranslation("common");
    const { settings, loading, setSettings, fieldErrors } = useSettingsStore();
    const { lang, setLang } = useLanguageStore();

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
                title={t("generalSettings")}
                iconBg="bg-main-primary/10"
                iconColor="text-main-primary"
            />

            <div className="flex flex-col gap-5">
                <SettingsField label={t("platformName")}>
                    <SettingsInput
                        value={settings.platform_name}
                        onChange={set("platform_name")}
                        placeholder={t("platformNamePlaceholder")}
                        className={e("platform_name") ? "border-red-400 focus:border-red-400" : ""}
                    />
                    <FieldError msg={e("platform_name")} />
                </SettingsField>

                <SettingsField label={t("supportEmail")} prefix={<Mail size={15} className="text-main-sharkGray" />}>
                    <SettingsInput
                        type="email"
                        value={settings.support_email}
                        onChange={set("support_email")}
                        placeholder="support@example.com"
                        className={e("support_email") ? "border-red-400 focus:border-red-400" : ""}
                    />
                    <FieldError msg={e("support_email")} />
                </SettingsField>

                <SettingsField label={t("supportPhone")} prefix={<Phone size={15} className="text-main-sharkGray" />}>
                    <SettingsInput
                        type="tel"
                        value={settings.support_phone}
                        onChange={set("support_phone")}
                        placeholder="+201XXXXXXXXX"
                        className={e("support_phone") ? "border-red-400 focus:border-red-400" : ""}
                    />
                    <FieldError msg={e("support_phone")} />
                </SettingsField>

                <SettingsField label={t("hotlineNumber")} prefix={<Phone size={15} className="text-main-sharkGray" />}>
                    <SettingsInput
                        type="tel"
                        value={settings.hotline_number}
                        onChange={set("hotline_number")}
                        placeholder="+201XXXXXXXXX"
                        className={e("hotline_number") ? "border-red-400 focus:border-red-400" : ""}
                    />
                    <FieldError msg={e("hotline_number")} />
                </SettingsField>

                <SettingsField label={t("whatsappChatbot")} prefix={<Phone size={15} className="text-main-sharkGray" />}>
                    <SettingsInput
                        type="tel"
                        value={settings.whatsapp_chatbot_number}
                        onChange={set("whatsapp_chatbot_number")}
                        placeholder="+201XXXXXXXXX"
                        className={e("whatsapp_chatbot_number") ? "border-red-400 focus:border-red-400" : ""}
                    />
                    <FieldError msg={e("whatsapp_chatbot_number")} />
                </SettingsField>

                <SettingsField label={tc("dashboardLanguage")} prefix={<Globe size={15} className="text-main-sharkGray" />}>
                    <Select value={lang} onValueChange={(val) => setLang(val as "en" | "ar")}>
                        <SelectTrigger className="w-full h-11 border common-rounded px-4 text-sm text-main-mirage bg-main-white focus:ring-0 focus:border-main-primary border-main-whiteMarble">
                            <SelectValue placeholder={tc("selectLanguage")} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="en">{tc("english")}</SelectItem>
                            <SelectItem value="ar">{tc("arabic")}</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-main-sharkGray mt-1.5 leading-relaxed">{tc("dashboardLanguageHint")}</p>
                </SettingsField>
            </div>
        </div>
    );
};

export default GeneralSettings;
