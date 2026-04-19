import { z } from "zod";

const str = (label: string, max = 500) =>
    z.string().max(max, `${label} is too long`);

const requiredStr = (label: string, max = 255) =>
    z.string().trim().min(1, `${label} is required`).max(max, `${label} is too long`);

// ─── Hero ─────────────────────────────────────────────────────────────────────

const homeHeroLocaleSchema = z.object({
    screen_1: z
        .array(z.string().max(500, "Screen 1 line is too long"))
        .length(5, "screen_1 must have exactly 5 lines"),
    screen_2: str("Screen 2"),
    screen_3: str("Screen 3"),
    screen_4: str("Screen 4"),
    screen_5: str("Screen 5"),
    screen_6: str("Screen 6"),
});

const homeHeroBilingualSchema = z.object({
    en: homeHeroLocaleSchema,
    ar: homeHeroLocaleSchema,
});

// ─── Platform ─────────────────────────────────────────────────────────────────

const homePlatformLocaleSchema = z.object({
    title: str("Title"),
    card_1_title: str("Card 1 title"),
    card_2_title: str("Card 2 title"),
    card_3_title: str("Card 3 title"),
    card_4: z.object({
        title: str("Card 4 title"),
        description: str("Card 4 description", 2000),
    }),
});

const homePlatformBilingualSchema = z.object({
    en: homePlatformLocaleSchema,
    ar: homePlatformLocaleSchema,
});

// ─── Transport ────────────────────────────────────────────────────────────────

const transportCardSchema = z.object({
    title: str("Card title"),
    description: str("Card description", 2000),
});

const homeTransportLocaleSchema = z.object({
    card_1: transportCardSchema,
    card_2: transportCardSchema,
    card_3: transportCardSchema,
});

const homeTransportBilingualSchema = z.object({
    en: homeTransportLocaleSchema,
    ar: homeTransportLocaleSchema,
});

// ─── Maximizing ───────────────────────────────────────────────────────────────

const maximizingCardSchema = z.object({
    title: str("Card title"),
    description: str("Card description", 2000),
});

const homeMaximizingLocaleSchema = z.object({
    title: str("Title"),
    description: str("Description", 2000),
    cards: z.object({
        card_1: maximizingCardSchema,
        card_2: maximizingCardSchema,
        card_3: maximizingCardSchema,
    }),
});

const homeMaximizingBilingualSchema = z.object({
    en: homeMaximizingLocaleSchema,
    ar: homeMaximizingLocaleSchema,
});

// ─── Exports ──────────────────────────────────────────────────────────────────

export const bilingualSchemaByPart = {
    hero: homeHeroBilingualSchema,
    platform: homePlatformBilingualSchema,
    transport: homeTransportBilingualSchema,
    maximizing: homeMaximizingBilingualSchema,
} as const;

export type HomePart = keyof typeof bilingualSchemaByPart;

export type HomeHeroLocale = z.infer<typeof homeHeroLocaleSchema>;
export type HomePlatformLocale = z.infer<typeof homePlatformLocaleSchema>;
export type HomeTransportLocale = z.infer<typeof homeTransportLocaleSchema>;
export type HomeMaximizingLocale = z.infer<typeof homeMaximizingLocaleSchema>;

export const mapZodErrors = (part: string, error: z.ZodError): Record<string, string> => {
    const next: Record<string, string> = {};
    for (const issue of error.issues) {
        const [locale, ...rest] = issue.path;
        const key = `${part}.${String(locale)}.${rest.map(String).join(".")}`;
        if (!next[key]) next[key] = issue.message;
    }
    return next;
};

export { requiredStr };
