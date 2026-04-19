import { Bell } from "lucide-react";
import { useTranslation } from "react-i18next";
import useSettingsStore from "@/shared/hooks/store/useSettingsStore";
import SettingsSectionHeader from "./SettingsSectionHeader";
import ToggleSwitch from "./ToggleSwitch";

// ─── Static label map (toggle keys only — matches notification DTO) ───────────

const NOTIFICATION_PREF_TOGGLE_KEYS = [
    "email_notifications_for_users",
    "email_notifications_for_drivers",
    "email_notifications_for_drivers_Pending_verifications",
    "daily_revenue_reports",
    "weekly_analytics_summary",
] as const;

type NotificationPrefToggleKey = (typeof NOTIFICATION_PREF_TOGGLE_KEYS)[number];

type SettingsPrefLabelKey =
    | "pref_email_notifications_for_users"
    | "pref_email_notifications_for_drivers"
    | "pref_email_notifications_for_drivers_Pending_verifications"
    | "pref_daily_revenue_reports"
    | "pref_weekly_analytics_summary";

const PREF_LABEL_KEYS: Record<NotificationPrefToggleKey, SettingsPrefLabelKey> = {
    email_notifications_for_users: "pref_email_notifications_for_users",
    email_notifications_for_drivers: "pref_email_notifications_for_drivers",
    email_notifications_for_drivers_Pending_verifications:
        "pref_email_notifications_for_drivers_Pending_verifications",
    daily_revenue_reports: "pref_daily_revenue_reports",
    weekly_analytics_summary: "pref_weekly_analytics_summary",
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const NotificationPreferencesSkeleton = () => (
    <div className="bg-main-white border border-main-whiteMarble common-rounded p-6 animate-pulse">
        <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-main-whiteMarble" />
            <div className="h-5 w-44 rounded bg-main-whiteMarble" />
        </div>
        <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between py-3.5 px-4 bg-main-luxuryWhite common-rounded">
                    <div className="h-4 w-56 rounded bg-main-whiteMarble" />
                    <div className="w-12 h-6 rounded-full bg-main-whiteMarble" />
                </div>
            ))}
        </div>
    </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

const NotificationPreferences = () => {
    const { t } = useTranslation("settings");
    const { notificationPreferences, loading, setNotificationPref } = useSettingsStore();

    if (loading || !notificationPreferences) return <NotificationPreferencesSkeleton />;

    return (
        <div className="bg-main-white border border-main-whiteMarble common-rounded p-6">
            <SettingsSectionHeader
                icon={Bell}
                title={t("notificationPreferencesHeader")}
                iconBg="bg-main-ladyBlue/10"
                iconColor="text-main-ladyBlue"
            />

            <div className="flex flex-col gap-3">
                {NOTIFICATION_PREF_TOGGLE_KEYS.map((key) => (
                    <div
                        key={key}
                        className="flex items-center justify-between gap-3 py-3.5 px-4 bg-main-luxuryWhite common-rounded rtl:flex-row-reverse"
                    >
                        <span className="text-main-mirage text-sm flex-1 min-w-0">{t(PREF_LABEL_KEYS[key])}</span>
                        <ToggleSwitch
                            enabled={Boolean(notificationPreferences[key])}
                            onChange={(val) => setNotificationPref(key, val)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationPreferences;
