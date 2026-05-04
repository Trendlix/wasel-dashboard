import { z } from "zod";

/** Keep in sync with wasel-backend `FOOTER_LUCIDE_ICON_ALLOWLIST` and wasel-fe footer icons map. */
export const FOOTER_LUCIDE_ICONS = [
    "Facebook",
    "Globe",
    "Linkedin",
    "Instagram",
    "Youtube",
    "Github",
    "Mail",
    "MessageCircle",
    "Send",
    "ExternalLink",
] as const;

const footerIconEnum = z.enum(FOOTER_LUCIDE_ICONS);

function isAllowedFooterUrl(value: string): boolean {
    const t = value.trim();
    if (!t) return true;
    if (t.startsWith("/")) return true;
    if (t === "#" || t.startsWith("mailto:")) return true;
    try {
        const u = new URL(t);
        return u.protocol === "http:" || u.protocol === "https:";
    } catch {
        return false;
    }
}

const footerSocialItemSchema = z.object({
    icon: footerIconEnum,
    link: z.string().trim().max(2000, "Link is too long"),
});

export const cmsFooterSchema = z
    .object({
        social_links: z.array(footerSocialItemSchema).max(10, "At most 10 social links"),
        app_links: z.object({
            android_app_cta: z.string().trim().max(2000),
            ios_app_cta: z.string().trim().max(2000),
        }),
    })
    .superRefine((data, ctx) => {
        data.social_links.forEach((row, i) => {
            if (!isAllowedFooterUrl(row.link)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Use http(s)://, a path starting with /, mailto:, or leave empty",
                    path: ["social_links", i, "link"],
                });
            }
        });
        if (!isAllowedFooterUrl(data.app_links.android_app_cta)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Invalid URL (http(s)://, /path, or empty)",
                path: ["app_links", "android_app_cta"],
            });
        }
        if (!isAllowedFooterUrl(data.app_links.ios_app_cta)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Invalid URL (http(s)://, /path, or empty)",
                path: ["app_links", "ios_app_cta"],
            });
        }
    });

export type CmsFooterForm = z.infer<typeof cmsFooterSchema>;

export const defaultCmsFooter = (): CmsFooterForm => ({
    social_links: [],
    app_links: {
        android_app_cta: "",
        ios_app_cta: "",
    },
});

export function normalizeFooterPayload(raw: unknown): CmsFooterForm {
    const base = defaultCmsFooter();
    if (!raw || typeof raw !== "object") return base;
    const r = raw as Record<string, unknown>;
    const rawSocial = Array.isArray(r.social_links) ? r.social_links : [];
    const social_links = rawSocial
        .slice(0, 10)
        .map((item) => {
            if (!item || typeof item !== "object") return null;
            const x = item as Record<string, unknown>;
            const iconRaw = typeof x.icon === "string" ? x.icon.trim() : "";
            const iconParsed = footerIconEnum.safeParse(iconRaw);
            if (!iconParsed.success) return null;
            return {
                icon: iconParsed.data,
                link: typeof x.link === "string" ? x.link : "",
            };
        })
        .filter((x): x is CmsFooterForm["social_links"][number] => x !== null);

    const appRaw =
        r.app_links && typeof r.app_links === "object"
            ? (r.app_links as Record<string, unknown>)
            : {};
    return {
        social_links,
        app_links: {
            android_app_cta:
                typeof appRaw.android_app_cta === "string" ? appRaw.android_app_cta : "",
            ios_app_cta: typeof appRaw.ios_app_cta === "string" ? appRaw.ios_app_cta : "",
        },
    };
}

export const mapFooterZodErrors = (error: z.ZodError): Record<string, string> => {
    const next: Record<string, string> = {};
    for (const issue of error.issues) {
        const path = issue.path.join(".");
        if (!next[path]) next[path] = issue.message;
    }
    return next;
};
