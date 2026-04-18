import { z } from "zod";

// Mirrors the Egyptian phone regex from the backend DTOs
const EG_PHONE_REGEX = /^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/;
const phoneMsg = "Must be a valid Egyptian number (e.g. +201XXXXXXXXX)";

// ─── Platform Settings ── mirrors SyncSettingsDto ─────────────────────────────

export const platformSettingsSchema = z.object({
    platform_name: z.string().min(1, "Platform name is required"),
    support_email: z
        .string()
        .min(1, "Support email is required")
        .email("Must be a valid email address"),
    support_phone: z
        .string()
        .min(1, "Support phone is required")
        .regex(EG_PHONE_REGEX, phoneMsg),
    hotline_number: z
        .string()
        .min(1, "Hotline number is required")
        .regex(EG_PHONE_REGEX, phoneMsg),
    whatsapp_chatbot_number: z
        .string()
        .min(1, "WhatsApp number is required")
        .regex(EG_PHONE_REGEX, phoneMsg),
    default_language: z.enum(["en", "ar"], {
        message: "Please select a language",
    }),
});

// ─── Notification Preferences ── mirrors SyncAdminNotificationPreferencesDto ──

export const notificationPreferencesSchema = z.object({
    email_notifications_for_users: z.boolean().optional(),
    email_notifications_for_drivers: z.boolean().optional(),
    email_notifications_for_drivers_Pending_verifications: z.boolean().optional(),
    daily_revenue_reports: z.boolean().optional(),
    weekly_analytics_summary: z.boolean().optional(),
});

// ─── Combined ── mirrors SyncAllSettingsDto ───────────────────────────────────

export const syncAllSettingsSchema = z.object({
    settings: platformSettingsSchema,
    notificationPreferences: notificationPreferencesSchema,
});

export type PlatformSettingsFormData = z.infer<typeof platformSettingsSchema>;
export type SyncAllSettingsFormData = z.infer<typeof syncAllSettingsSchema>;
