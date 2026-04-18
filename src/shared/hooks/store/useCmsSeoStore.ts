import { create } from "zustand";
import { axiosNormalApiClient, extractErrorMessage } from "@/shared/api";
import {
    bilingualSeoPageSchema,
    mapSeoZodErrors,
    parseSchemaScriptsForApi,
    schemaValueToScripts,
    type JsonLdScript,
} from "@/shared/validation/cms/seo";

export type CmsLocale = "en" | "ar";
type Localized<T> = { en: T; ar: T };

export interface SeoFormat {
    title: string;
    description: string;
    keywords: string[];
    alt_img: string;
    schema_scripts: string[];
}

export const SEO_PAGES = [
    "home",
    "about",
    "contact",
    "services",
    "blogs",
    "order_tracking",
    "faqs",
    "terms",
    "privacy",
] as const;
export type SeoPage = (typeof SEO_PAGES)[number];

const DEFAULT_SEO: SeoFormat = { title: "", description: "", keywords: [], alt_img: "", schema_scripts: [""] };
const defaultLocalizedSeo = (): Localized<SeoFormat> => ({ en: { ...DEFAULT_SEO }, ar: { ...DEFAULT_SEO } });
const defaultPages = (): Record<SeoPage, Localized<SeoFormat>> =>
    Object.fromEntries(SEO_PAGES.map((p) => [p, defaultLocalizedSeo()])) as Record<SeoPage, Localized<SeoFormat>>;

const mapApiSeo = (data: unknown): Localized<SeoFormat> => {
    const mapOne = (value: any): SeoFormat => ({
        title: value?.title ?? "",
        description: value?.description ?? "",
        keywords: Array.isArray(value?.keywords) ? value.keywords : [],
        alt_img: value?.alt_img ?? "",
        schema_scripts: schemaValueToScripts(value?.schema),
    });
    if (data && typeof data === "object" && ("en" in (data as Record<string, unknown>) || "ar" in (data as Record<string, unknown>))) {
        return {
            en: mapOne((data as any).en),
            ar: mapOne((data as any).ar),
        };
    }
    return { en: mapOne(data), ar: mapOne(undefined) };
};

type SeoState = Record<SeoPage, Localized<SeoFormat>> & {
    loading: boolean;
    savingPage: SeoPage | null;
    error: string | null;
    fieldErrors: Record<string, string>;
    fetchPage: (page: SeoPage) => Promise<void>;
    setPage: (page: SeoPage, locale: CmsLocale, patch: Partial<SeoFormat>) => void;
    setKeywords: (page: SeoPage, locale: CmsLocale, keywords: string[]) => void;
    savePage: (page: SeoPage) => Promise<boolean>;
};

export const useCmsSeoStore = create<SeoState>((set, get) => ({
    ...defaultPages(),
    loading: false,
    savingPage: null,
    error: null,
    fieldErrors: {},

    fetchPage: async (page) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosNormalApiClient.get(`/dashboard/seo/${page}`);
            set({ [page]: mapApiSeo(response.data?.data), loading: false });
        } catch (error) {
            set({ loading: false, error: extractErrorMessage(error, `Failed to fetch SEO for "${page}".`) });
        }
    },

    setPage: (page, locale, patch) =>
        set((state) => ({
            [page]: { ...state[page], [locale]: { ...state[page][locale], ...patch } },
            fieldErrors: {},
        })),

    setKeywords: (page, locale, keywords) =>
        set((state) => ({
            [page]: { ...state[page], [locale]: { ...state[page][locale], keywords } },
            fieldErrors: {},
        })),

    savePage: async (page) => {
        const pageState = get()[page];
        const parsed = bilingualSeoPageSchema.safeParse(pageState);
        if (!parsed.success) {
            set({
                error: "Please fix validation errors before saving.",
                fieldErrors: mapSeoZodErrors(page, parsed.error),
            });
            return false;
        }

        set({ savingPage: page, error: null, fieldErrors: {} });
        try {
            const buildPayload = (value: SeoFormat) => ({
                title: value.title,
                description: value.description,
                keywords: value.keywords,
                alt_img: value.alt_img,
                schema: parseSchemaScriptsForApi(value.schema_scripts) as JsonLdScript[],
            });
            const payload = { en: buildPayload(pageState.en), ar: buildPayload(pageState.ar) };
            const response = await axiosNormalApiClient.patch(`/dashboard/seo/${page}`, payload);
            set({ [page]: mapApiSeo(response.data?.data), savingPage: null });
            return true;
        } catch (error) {
            set({ savingPage: null, error: extractErrorMessage(error, `Failed to save SEO for "${page}".`) });
            return false;
        }
    },
}));
