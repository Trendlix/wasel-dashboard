import { z } from "zod";

const requiredText = (label: string, max = 255) =>
    z.string().trim().min(1, `${label} is required`).max(max, `${label} is too long`);

const requiredParagraph = (label: string, max = 3000) =>
    z.string().trim().min(1, `${label} is required`).max(max, `${label} is too long`);

const requiredAssetValue = (label: string) =>
    z
        .string()
        .trim()
        .min(1, `${label} is required`)
        .max(1024, `${label} is too long`)
        .refine((v) => !/\s/.test(v), { message: `${label} must not contain spaces` });

const serviceCardSchema = z.object({
    tag: requiredText("Tag", 100),
    title: requiredText("Card title", 160),
    description: requiredParagraph("Card description", 1500),
    img: requiredAssetValue("Card image URL"),
});

const serviceSectionSchema = z.object({
    title: z
        .array(requiredText("Section title", 160))
        .min(2, "At least 2 title parts are required")
        .max(10, "Maximum 10 title parts are allowed"),
    description: requiredParagraph("Description", 2000),
    cards: z.array(serviceCardSchema).max(20, "Maximum 20 cards allowed"),
});

export const schemaByPart = {
    hero: serviceSectionSchema,
    warehouse: serviceSectionSchema,
    advertising: serviceSectionSchema,
} as const;

const bilingualServicesSectionSchema = z.object({
    en: serviceSectionSchema,
    ar: serviceSectionSchema,
});

export const bilingualSchemaByPart = {
    hero: bilingualServicesSectionSchema,
    warehouse: bilingualServicesSectionSchema,
    advertising: bilingualServicesSectionSchema,
} as const;

/** Produces error keys in the form `${part}.en.field` / `${part}.ar.cards.0.title`. */
export const mapZodErrors = (part: string, error: z.ZodError): Record<string, string> => {
    const next: Record<string, string> = {};
    for (const issue of error.issues) {
        const [locale, ...rest] = issue.path;
        const key = `${part}.${String(locale)}.${rest.map(String).join(".")}`;
        if (!next[key]) next[key] = issue.message;
    }
    return next;
};
