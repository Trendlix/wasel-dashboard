import { z } from "zod";

/** Maps errors from a bilingual z.object({ en: schema, ar: schema }) parse result.
 *  Path looks like ["en","field"] or ["ar","cards",0,"title"].
 *  Produces keys in the form `${section}.en.field` and `${section}.ar.cards.0.title`.
 */
export const mapBilingualZodErrors = (section: string, error: z.ZodError): Record<string, string> => {
    const next: Record<string, string> = {};
    for (const issue of error.issues) {
        const [locale, ...rest] = issue.path;
        const key = `${section}.${String(locale)}.${rest.map(String).join(".")}`;
        if (!next[key]) next[key] = issue.message;
    }
    return next;
};

const requiredText = (label: string, max = 255) =>
    z
        .string()
        .trim()
        .min(1, `${label} is required`)
        .max(max, `${label} is too long`);

const requiredParagraph = (label: string, max = 3000) =>
    z
        .string()
        .trim()
        .min(1, `${label} is required`)
        .max(max, `${label} is too long`);

const requiredHttpUrl = (label: string) =>
    z
        .string()
        .trim()
        .min(1, `${label} is required`)
        .url(`${label} must be a valid URL`)
        .refine((value) => /^https?:\/\//i.test(value), {
            message: `${label} must start with http:// or https://`,
        });

const requiredAssetValue = (label: string) =>
    z
        .string()
        .trim()
        .min(1, `${label} is required`)
        .max(1024, `${label} is too long`)
        .refine((value) => !/\s/.test(value), {
            message: `${label} must not contain spaces`,
        });

const appItemSchema = z.object({
    img: requiredAssetValue("Image URL"),
    title: requiredText("Title", 120),
    links: z.object({
        app_store: requiredHttpUrl("App Store link"),
        play_store: requiredHttpUrl("Play Store link"),
    }),
});

export const cmsCommonAppSchema = z.object({
    user: appItemSchema,
    driver: appItemSchema,
});

export const cmsCommonBrandSchema = z.object({
    title: requiredText("Brand title", 160),
    description: requiredParagraph("Brand description", 2000),
    cta: z.object({
        text: requiredText("CTA text", 80),
        link: requiredHttpUrl("CTA link"),
    }),
});

export const cmsCommonFaqItemSchema = z.object({
    question: requiredText("Question", 200),
    answer: requiredParagraph("Answer", 3000),
});

export const cmsCommonFaqsSchema = z.object({
    title: requiredText("FAQs title", 160),
    description: requiredParagraph("FAQs description", 2000),
    items: z.array(cmsCommonFaqItemSchema).max(50, "Maximum 50 FAQ items are allowed"),
});

export const cmsAboutHeroSchema = z.object({
    bg: requiredAssetValue("Hero background image URL"),
    titles: z
        .array(requiredText("Hero title", 160))
        .min(1, "At least one hero title is required")
        .max(10, "Maximum 10 hero titles are allowed"),
});

export const cmsAboutFoundedSchema = z.object({
    hide: z.boolean(),
    titles: z
        .array(requiredText("Founded title", 160))
        .min(1, "At least one founded title is required")
        .max(20, "Maximum 20 founded titles are allowed"),
    descriptions: z
        .array(requiredParagraph("Founded description", 1000))
        .min(1, "At least one founded description is required")
        .max(20, "Maximum 20 founded descriptions are allowed"),
});

export const cmsAboutStandForCardSchema = z.object({
    img: requiredAssetValue("Stand for card image URL"),
    title: requiredText("Card title", 160),
    description: requiredParagraph("Card description", 1500),
});

export const cmsAboutStandForSchema = z.object({
    hide: z.boolean(),
    titles: z
        .array(requiredText("Stand For title", 160))
        .min(1, "At least one stand for title is required")
        .max(20, "Maximum 20 stand for titles are allowed"),
    cards: z
        .array(cmsAboutStandForCardSchema)
        .min(1, "At least one stand for card is required")
        .max(20, "Maximum 20 stand for cards are allowed"),
});

export const cmsAboutFutureCardSchema = z.object({
    img: requiredAssetValue("Future card image URL"),
    titles: z
        .array(requiredText("Future card title", 160))
        .min(1, "At least one future card title is required")
        .max(10, "Maximum 10 future card titles are allowed"),
    descriptions: z
        .array(requiredParagraph("Future card description", 1200))
        .min(1, "At least one future card description is required")
        .max(10, "Maximum 10 future card descriptions are allowed"),
});

export const cmsAboutFutureSchema = z.object({
    hide: z.boolean(),
    cards: z
        .array(cmsAboutFutureCardSchema)
        .min(1, "At least one future card is required")
        .max(20, "Maximum 20 future cards are allowed"),
});

// ─── Bilingual wrapper schemas ────────────────────────────────────────────────
// These wrap each per-locale schema in { en, ar } so the whole payload is
// validated in one pass, producing path prefixes like "en.field" / "ar.field".

export const bilingualAboutHeroSchema = z.object({ en: cmsAboutHeroSchema, ar: cmsAboutHeroSchema });
export const bilingualAboutFoundedSchema = z.object({ en: cmsAboutFoundedSchema, ar: cmsAboutFoundedSchema });
export const bilingualAboutStandForSchema = z.object({ en: cmsAboutStandForSchema, ar: cmsAboutStandForSchema });
export const bilingualAboutFutureSchema = z.object({ en: cmsAboutFutureSchema, ar: cmsAboutFutureSchema });

export const bilingualCommonAppSchema = z.object({ en: cmsCommonAppSchema, ar: cmsCommonAppSchema });
export const bilingualCommonBrandSchema = z.object({ en: cmsCommonBrandSchema, ar: cmsCommonBrandSchema });
export const bilingualCommonFaqsSchema = z.object({ en: cmsCommonFaqsSchema, ar: cmsCommonFaqsSchema });
