import { create } from "zustand";
import axiosNormalApiClient from "@/shared/utils/axios";
import { isAxiosError } from "axios";
import { syncAllSettingsSchema } from "@/shared/schemas/settings.schema";

// ─── Server-side shapes ────────────────────────────────────────────────────────

export interface PlatformSettings {
    id: number;
    platform_name: string;
    support_email: string;
    support_phone: string;
    hotline_number: string;
    whatsapp_chatbot_number: string;
    default_language: "en" | "ar";
    created_at?: string;
    updated_at?: string;
    updated_by_id?: number;
}

export interface AdminNotificationPreferences {
    id: number;
    email_notifications_for_users: boolean;
    email_notifications_for_drivers: boolean;
    email_notifications_for_drivers_Pending_verifications: boolean;
    daily_revenue_reports: boolean;
    weekly_analytics_summary: boolean;
    created_at?: string;
    updated_at?: string;
    updated_by_id?: number;
}

export interface SettingsRole {
    id: number;
    name: string;
    slug: string;
    description?: string;
    role: string;
    created_at: string;
    updated_at: string;
    _count?: { admin: number };
}

// ─── Defaults (used when no record exists yet — first-time upsert) ────────────

const DEFAULT_SETTINGS: PlatformSettings = {
    id: 0,
    platform_name: "",
    support_email: "",
    support_phone: "",
    hotline_number: "",
    whatsapp_chatbot_number: "",
    default_language: "en",
    updated_at: "",
};

const DEFAULT_NOTIFICATION_PREFS: AdminNotificationPreferences = {
    id: 0,
    email_notifications_for_users: false,
    email_notifications_for_drivers: false,
    email_notifications_for_drivers_Pending_verifications: false,
    daily_revenue_reports: false,
    weekly_analytics_summary: false,
};

// ─── Store shape ───────────────────────────────────────────────────────────────

// Keys follow "section.field" format matching Zod error paths, e.g. "settings.support_email"
export type FieldErrors = Record<string, string>;

interface SettingsState {
    settings: PlatformSettings | null;
    notificationPreferences: AdminNotificationPreferences | null;
    roles: SettingsRole[];
    loading: boolean;
    saving: boolean;
    error: string | null;
    fieldErrors: FieldErrors;

    fetchAll: () => Promise<void>;
    setSettings: (patch: Partial<PlatformSettings>) => void;
    setNotificationPref: (key: keyof Omit<AdminNotificationPreferences, "id">, value: boolean) => void;
    saveAll: () => Promise<boolean>;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

const extractErrorMessage = (error: unknown, fallback: string) => {
    if (!isAxiosError(error)) return fallback;
    return error.response?.data?.message || fallback;
};

// ─── Store ─────────────────────────────────────────────────────────────────────

const useSettingsStore = create<SettingsState>((set, get) => ({
    settings: null,
    notificationPreferences: null,
    roles: [],
    loading: false,
    saving: false,
    error: null,
    fieldErrors: {},

    fetchAll: async () => {
        set({ loading: true, error: null, fieldErrors: {} });
        try {
            const response = await axiosNormalApiClient.get("/dashboard/settings/all");
            const { settings, notificationPreferences, last3Roles } = response.data.data.data;
            set({
                settings: settings ?? DEFAULT_SETTINGS,
                notificationPreferences: notificationPreferences ?? DEFAULT_NOTIFICATION_PREFS,
                roles: last3Roles ?? [],
                loading: false,
            });
        } catch (error) {
            set({
                error: extractErrorMessage(error, "Failed to fetch settings"),
                loading: false,
            });
        }
    },

    setSettings: (patch) => {
        // Clear field errors for any key being updated
        const changedKeys = Object.keys(patch).map((k) => `settings.${k}`);
        set((state) => {
            const next = { ...state.fieldErrors };
            changedKeys.forEach((k) => delete next[k]);
            return {
                settings: state.settings ? { ...state.settings, ...patch } : null,
                fieldErrors: next,
            };
        });
    },

    setNotificationPref: (key, value) => {
        set((state) => {
            const next = { ...state.fieldErrors };
            delete next[`notificationPreferences.${key}`];
            return {
                notificationPreferences: state.notificationPreferences
                    ? { ...state.notificationPreferences, [key]: value }
                    : null,
                fieldErrors: next,
            };
        });
    },

    saveAll: async () => {
        const { settings, notificationPreferences } = get();
        if (!settings || !notificationPreferences) return false;

        // ── Client-side Zod validation ─────────────────────────────────────────
        const result = syncAllSettingsSchema.safeParse({ settings, notificationPreferences });

        if (!result.success) {
            const fieldErrors: FieldErrors = {};
            for (const issue of result.error.issues) {
                const key = issue.path.map(String).join(".");
                if (!fieldErrors[key]) fieldErrors[key] = issue.message;
            }
            set({ fieldErrors });
            return false;
        }

        // ── Send to backend ────────────────────────────────────────────────────
        set({ saving: true, error: null, fieldErrors: {} });
        try {
            // Strip all server-managed fields not present in the DTOs
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id: _sid, created_at: _sca, updated_at: _uat, updated_by_id: _subid, ...settingsPayload } = settings;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id: _nid, created_at: _nca, updated_at: _nuat, updated_by_id: _nubid, ...notifPayload } = notificationPreferences;

            await axiosNormalApiClient.patch("/dashboard/settings/sync-all", {
                settings: settingsPayload,
                notificationPreferences: notifPayload,
            });

            set({ saving: false });
            return true;
        } catch (error) {
            set({
                error: extractErrorMessage(error, "Failed to save settings"),
                saving: false,
            });
            return false;
        }
    },
}));

export default useSettingsStore;
