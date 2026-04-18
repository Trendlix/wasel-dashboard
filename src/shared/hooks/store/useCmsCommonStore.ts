import { create } from "zustand";
import axiosNormalApiClient from "@/shared/utils/axios";
import { isAxiosError } from "axios";
import {
    bilingualCommonAppSchema,
    bilingualCommonBrandSchema,
    bilingualCommonFaqsSchema,
    mapBilingualZodErrors,
} from "@/shared/schemas/cms.schema";

export type CmsLocale = "en" | "ar";
type Localized<T> = { en: T; ar: T };

export interface CmsAppLinks { app_store: string; play_store: string; }
export interface CmsAppItem { img: string; title: string; links: CmsAppLinks; }
export interface CmsAppSection { user: CmsAppItem; driver: CmsAppItem; }
export interface CmsBrandSection { title: string; description: string; cta: { text: string; link: string; }; }
export interface CmsFaqItem { question: string; answer: string; }
export interface CmsFaqSection { title: string; description: string; items: CmsFaqItem[]; }
export interface CmsCommonSection { app: CmsAppSection; brand: CmsBrandSection; faqs: CmsFaqSection; }

const DEFAULT_COMMON: CmsCommonSection = {
    app: {
        user: { img: "", title: "", links: { app_store: "", play_store: "" } },
        driver: { img: "", title: "", links: { app_store: "", play_store: "" } },
    },
    brand: { title: "", description: "", cta: { text: "", link: "" } },
    faqs: { title: "", description: "", items: [] },
};

const emptyFaqItem = (): CmsFaqItem => ({ question: "", answer: "" });

/** Keep EN/AR FAQ rows aligned so AR inputs stay editable when the API returns fewer `ar.items`. */
const padFaqItems = (items: CmsFaqItem[], length: number): CmsFaqItem[] => {
    const next = [...items];
    while (next.length < length) next.push(emptyFaqItem());
    return next;
};

const pairFaqsSections = (en: CmsFaqSection, ar: CmsFaqSection): { en: CmsFaqSection; ar: CmsFaqSection } => {
    const n = Math.max(en.items.length, ar.items.length);
    return {
        en: { ...en, items: padFaqItems(en.items, n) },
        ar: { ...ar, items: padFaqItems(ar.items, n) },
    };
};

const asLocalized = <T>(value: unknown, fallback: T): Localized<T> => {
    if (value && typeof value === "object" && ("en" in (value as Record<string, unknown>) || "ar" in (value as Record<string, unknown>))) {
        return {
            en: ((value as Record<string, T>).en ?? fallback) as T,
            ar: ((value as Record<string, T>).ar ?? fallback) as T,
        };
    }
    return { en: (value as T) ?? fallback, ar: fallback };
};

const extractErrorMessage = (error: unknown, fallback: string) => {
    if (!isAxiosError(error)) return fallback;
    return error.response?.data?.message || fallback;
};

type CommonPart = "app" | "brand" | "faqs";
const schemaByPart = { app: bilingualCommonAppSchema, brand: bilingualCommonBrandSchema, faqs: bilingualCommonFaqsSchema } as const;

interface CmsCommonState {
    common: Localized<CmsCommonSection>;
    loading: boolean;
    savingPart: CommonPart | null;
    error: string | null;
    fieldErrors: Record<string, string>;
    appDraftImages: { user: File | null; driver: File | null; };
    fetchPart: (part: CommonPart) => Promise<void>;
    setApp: (lang: CmsLocale, patch: Partial<CmsAppSection>) => void;
    setBrand: (lang: CmsLocale, patch: Partial<CmsBrandSection>) => void;
    setFaqs: (lang: CmsLocale, patch: Partial<CmsFaqSection>) => void;
    addFaqItem: () => void;
    updateFaqItem: (lang: CmsLocale, index: number, patch: Partial<CmsFaqItem>) => void;
    removeFaqItem: (index: number) => void;
    setAppDraftImage: (target: "user" | "driver", file: File | null) => void;
    clearAppImage: (target: "user" | "driver") => void;
    savePart: (part: CommonPart) => Promise<boolean>;
}

const useCmsCommonStore = create<CmsCommonState>((set, get) => ({
    common: { en: DEFAULT_COMMON, ar: DEFAULT_COMMON },
    loading: false,
    savingPart: null,
    error: null,
    fieldErrors: {},
    appDraftImages: { user: null, driver: null },

    fetchPart: async (part) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosNormalApiClient.get(`/dashboard/cms/sections/common/${part}`);
            const data = asLocalized(response.data?.data, DEFAULT_COMMON[part]);
            const merged =
                part === "faqs"
                    ? pairFaqsSections(data.en as CmsFaqSection, data.ar as CmsFaqSection)
                    : { en: data.en, ar: data.ar };
            set((state) => ({
                common: {
                    en: { ...state.common.en, [part]: merged.en },
                    ar: { ...state.common.ar, [part]: merged.ar },
                },
                loading: false,
                appDraftImages: part === "app" ? { user: null, driver: null } : state.appDraftImages,
            }));
        } catch (error) {
            set({ error: extractErrorMessage(error, `Failed to fetch common ${part} section.`), loading: false });
        }
    },

    setApp: (lang, patch) =>
        set((state) => ({
            common: {
                ...state.common,
                [lang]: {
                    ...state.common[lang],
                    app: {
                        ...state.common[lang].app,
                        ...patch,
                        user: { ...state.common[lang].app.user, ...(patch.user ?? {}) },
                        driver: { ...state.common[lang].app.driver, ...(patch.driver ?? {}) },
                    },
                },
            },
        })),

    setBrand: (lang, patch) =>
        set((state) => ({
            common: {
                ...state.common,
                [lang]: {
                    ...state.common[lang],
                    brand: {
                        ...state.common[lang].brand,
                        ...patch,
                        cta: { ...state.common[lang].brand.cta, ...(patch.cta ?? {}) },
                    },
                },
            },
        })),

    setFaqs: (lang, patch) =>
        set((state) => ({
            common: {
                ...state.common,
                [lang]: {
                    ...state.common[lang],
                    faqs: { ...state.common[lang].faqs, ...patch },
                },
            },
        })),

    addFaqItem: () =>
        set((state) => ({
            common: {
                en: { ...state.common.en, faqs: { ...state.common.en.faqs, items: [...state.common.en.faqs.items, { question: "", answer: "" }] } },
                ar: { ...state.common.ar, faqs: { ...state.common.ar.faqs, items: [...state.common.ar.faqs.items, { question: "", answer: "" }] } },
            },
        })),

    updateFaqItem: (lang, index, patch) =>
        set((state) => {
            const enLen = state.common.en.faqs.items.length;
            const arLen = state.common.ar.faqs.items.length;
            const pairCount = Math.max(enLen, arLen, index + 1);
            const base = padFaqItems(state.common[lang].faqs.items, pairCount);
            return {
                common: {
                    ...state.common,
                    [lang]: {
                        ...state.common[lang],
                        faqs: {
                            ...state.common[lang].faqs,
                            items: base.map((item, i) => (i === index ? { ...item, ...patch } : item)),
                        },
                    },
                },
            };
        }),

    removeFaqItem: (index) =>
        set((state) => ({
            common: {
                en: { ...state.common.en, faqs: { ...state.common.en.faqs, items: state.common.en.faqs.items.filter((_, i) => i !== index) } },
                ar: { ...state.common.ar, faqs: { ...state.common.ar.faqs, items: state.common.ar.faqs.items.filter((_, i) => i !== index) } },
            },
        })),

    setAppDraftImage: (target, file) => set((state) => ({ appDraftImages: { ...state.appDraftImages, [target]: file } })),

    clearAppImage: (target) =>
        set((state) => ({
            common: {
                en: { ...state.common.en, app: { ...state.common.en.app, [target]: { ...state.common.en.app[target], img: "" } } },
                ar: { ...state.common.ar, app: { ...state.common.ar.app, [target]: { ...state.common.ar.app[target], img: "" } } },
            },
            appDraftImages: { ...state.appDraftImages, [target]: null },
        })),

    savePart: async (part) => {
        const state = get();
        const payload: Localized<any> = {
            en: state.common.en[part],
            ar: state.common.ar[part],
        };

        const payloadWithDraft = part === "app"
            ? {
                en: {
                    ...payload.en,
                    user: { ...payload.en.user, img: payload.en.user.img || (state.appDraftImages.user ? "__draft__" : "") },
                    driver: { ...payload.en.driver, img: payload.en.driver.img || (state.appDraftImages.driver ? "__draft__" : "") },
                },
                ar: {
                    ...payload.ar,
                    user: { ...payload.ar.user, img: payload.ar.user.img || (state.appDraftImages.user ? "__draft__" : "") },
                    driver: { ...payload.ar.driver, img: payload.ar.driver.img || (state.appDraftImages.driver ? "__draft__" : "") },
                },
            }
            : payload;

        const parsed = schemaByPart[part].safeParse(payloadWithDraft);
        if (!parsed.success) {
            set({
                error: "Please fix validation errors before saving.",
                fieldErrors: mapBilingualZodErrors(part, parsed.error),
            });
            return false;
        }

        set({ savingPart: part, error: null });
        try {
            if (part === "app") {
                const formData = new FormData();
                formData.append("payload", JSON.stringify(payloadWithDraft));
                if (state.appDraftImages.user) formData.append("user_img", state.appDraftImages.user);
                if (state.appDraftImages.driver) formData.append("driver_img", state.appDraftImages.driver);
                const response = await axiosNormalApiClient.patch(`/dashboard/cms/sections/common/${part}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                const partData = asLocalized(response.data?.data, DEFAULT_COMMON.app);
                set((s) => ({
                    common: {
                        en: { ...s.common.en, app: partData.en },
                        ar: { ...s.common.ar, app: partData.ar },
                    },
                    savingPart: null,
                    appDraftImages: { user: null, driver: null },
                }));
                return true;
            }

            const response = await axiosNormalApiClient.patch(`/dashboard/cms/sections/common/${part}`, payloadWithDraft);
            const partData = asLocalized(response.data?.data, DEFAULT_COMMON[part]);
            const merged =
                part === "faqs"
                    ? pairFaqsSections(partData.en as CmsFaqSection, partData.ar as CmsFaqSection)
                    : { en: partData.en, ar: partData.ar };
            set((s) => ({
                common: {
                    en: { ...s.common.en, [part]: merged.en },
                    ar: { ...s.common.ar, [part]: merged.ar },
                },
                savingPart: null,
            }));
            return true;
        } catch (error) {
            set({ savingPart: null, error: extractErrorMessage(error, `Failed to save common ${part} section.`) });
            return false;
        }
    },
}));

export default useCmsCommonStore;
