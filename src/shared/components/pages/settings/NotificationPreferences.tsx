import { Bell } from "lucide-react";
import { useState } from "react";
import { notificationPreferences } from "@/shared/core/pages/settings";
import SettingsSectionHeader from "./SettingsSectionHeader";
import ToggleSwitch from "./ToggleSwitch";

const NotificationPreferences = () => {
    const [prefs, setPrefs] = useState(notificationPreferences);

    const toggle = (id: string) => {
        setPrefs((prev) =>
            prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
        );
    };

    return (
        <div className="bg-main-white border border-main-whiteMarble common-rounded p-6">
            <SettingsSectionHeader
                icon={Bell}
                title="Notification Preferences"
                iconBg="bg-main-ladyBlue/10"
                iconColor="text-main-ladyBlue"
            />

            <div className="flex flex-col gap-3">
                {prefs.map((pref) => (
                    <div
                        key={pref.id}
                        className="flex items-center justify-between py-3.5 px-4 bg-main-luxuryWhite common-rounded"
                    >
                        <span className="text-main-mirage text-sm">{pref.label}</span>
                        <ToggleSwitch enabled={pref.enabled} onChange={() => toggle(pref.id)} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationPreferences;