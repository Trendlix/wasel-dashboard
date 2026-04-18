import { create } from "zustand";
import { isAxiosError } from "axios";
import axiosNormalApiClient from "@/shared/utils/axios";
import {
    bilingualAboutFutureSchema,
    bilingualAboutFoundedSchema,
    bilingualAboutHeroSchema,
    bilingualAboutStandForSchema,
    mapBilingualZodErrors,
} from "@/shared/schemas/cms.schema";

export type CmsLocale = "en" | "ar";
type Localized<T> = { en: T; ar: T };

export interface CmsAboutHeroSection {
    bg: string;
    titles: string[];
}

export interface CmsAboutFoundedSection {
    hide: boolean;
    titles: string[];
    descriptions: string[];
}

export interface CmsAboutStandForCard {
    img: string;
    title: string;
    description: string;
}

export interface CmsAboutStandForSection {
    hide: boolean;
    titles: string[];
    cards: CmsAboutStandForCard[];
}

export interface CmsAboutFutureCard {
    img: string;
    titles: string[];
    descriptions: string[];
}

export interface CmsAboutFutureSection {
    hide: boolean;
    cards: CmsAboutFutureCard[];
}

type AboutPart = "hero" | "founded" | "stand_for" | "future";

const DEFAULT_HERO: CmsAboutHeroSection = { bg: "", titles: [] };
const DEFAULT_FOUNDED: CmsAboutFoundedSection = { hide: false, titles: [], descriptions: [] };
const DEFAULT_STAND_FOR: CmsAboutStandForSection = { hide: false, titles: [], cards: [] };
const DEFAULT_FUTURE: CmsAboutFutureSection = { hide: false, cards: [] };

const asLocalized = <T>(value: unknown, fallback: T): Localized<T> => {
    if (value && typeof value === "object" && ("en" in (value as Record<string, unknown>) || "ar" in (value as Record<string, unknown>))) {
        return {
            en: ((value as Record<string, T>).en ?? fallback) as T,
            ar: ((value as Record<string, T>).ar ?? fallback) as T,
        };
    }
    return { en: (value as T) ?? fallback, ar: fallback };
};

const schemaByPart = {
    hero: bilingualAboutHeroSchema,
    founded: bilingualAboutFoundedSchema,
    stand_for: bilingualAboutStandForSchema,
    future: bilingualAboutFutureSchema,
} as const;

const extractErrorMessage = (error: unknown, fallback: string) => {
    if (!isAxiosError(error)) return fallback;
    return error.response?.data?.message || fallback;
};

interface CmsAboutState {
    hero: Localized<CmsAboutHeroSection>;
    founded: Localized<CmsAboutFoundedSection>;
    standFor: Localized<CmsAboutStandForSection>;
    future: Localized<CmsAboutFutureSection>;
    loading: boolean;
    savingPart: AboutPart | null;
    bgDraftFile: File | null;
    standForDraftImages: (File | null)[];
    futureDraftImages: (File | null)[];
    error: string | null;
    fieldErrors: Record<string, string>;
    fetchPart: (part: AboutPart) => Promise<void>;
    setHero: (lang: CmsLocale, patch: Partial<CmsAboutHeroSection>) => void;
    setFounded: (lang: CmsLocale, patch: Partial<CmsAboutFoundedSection>) => void;
    setStandFor: (lang: CmsLocale, patch: Partial<CmsAboutStandForSection>) => void;
    setFuture: (lang: CmsLocale, patch: Partial<CmsAboutFutureSection>) => void;
    addStandForCard: () => void;
    updateStandForCard: (lang: CmsLocale, index: number, patch: Partial<CmsAboutStandForCard>) => void;
    removeStandForCard: (index: number) => void;
    setStandForCardImage: (index: number, file: File | null) => void;
    clearStandForCardImage: (index: number) => void;
    addFutureCard: () => void;
    updateFutureCard: (lang: CmsLocale, index: number, patch: Partial<CmsAboutFutureCard>) => void;
    removeFutureCard: (index: number) => void;
    setFutureCardImage: (index: number, file: File | null) => void;
    clearFutureCardImage: (index: number) => void;
    setHeroBgFile: (file: File | null) => void;
    clearHeroBg: () => void;
    savePart: (part: AboutPart) => Promise<boolean>;
}

const useCmsAboutStore = create<CmsAboutState>((set, get) => ({
    hero: { en: DEFAULT_HERO, ar: DEFAULT_HERO },
    founded: { en: DEFAULT_FOUNDED, ar: DEFAULT_FOUNDED },
    standFor: { en: DEFAULT_STAND_FOR, ar: DEFAULT_STAND_FOR },
    future: { en: DEFAULT_FUTURE, ar: DEFAULT_FUTURE },
    loading: false,
    savingPart: null,
    bgDraftFile: null,
    standForDraftImages: [],
    futureDraftImages: [],
    error: null,
    fieldErrors: {},

    fetchPart: async (part) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosNormalApiClient.get(`/dashboard/cms/sections/about/${part}`);
            const data = response.data?.data;
            const localized = asLocalized(data, part === "hero" ? DEFAULT_HERO : part === "founded" ? DEFAULT_FOUNDED : part === "stand_for" ? DEFAULT_STAND_FOR : DEFAULT_FUTURE);
            set((state) => ({
                hero: part === "hero" ? (localized as Localized<CmsAboutHeroSection>) : state.hero,
                founded: part === "founded" ? (localized as Localized<CmsAboutFoundedSection>) : state.founded,
                standFor: part === "stand_for" ? (localized as Localized<CmsAboutStandForSection>) : state.standFor,
                future: part === "future" ? (localized as Localized<CmsAboutFutureSection>) : state.future,
                loading: false,
                bgDraftFile: part === "hero" ? null : state.bgDraftFile,
                standForDraftImages: part === "stand_for" ? [] : state.standForDraftImages,
                futureDraftImages: part === "future" ? [] : state.futureDraftImages,
            }));
        } catch (error) {
            set({ loading: false, error: extractErrorMessage(error, `Failed to fetch about ${part} section.`) });
        }
    },

    setHero: (lang, patch) =>
        set((state) => ({
            hero: { ...state.hero, [lang]: { ...state.hero[lang], ...patch } },
            fieldErrors: Object.fromEntries(Object.entries(state.fieldErrors).filter(([key]) => !key.startsWith("hero."))),
        })),

    setFounded: (lang, patch) =>
        set((state) => ({
            founded: { ...state.founded, [lang]: { ...state.founded[lang], ...patch } },
            fieldErrors: Object.fromEntries(Object.entries(state.fieldErrors).filter(([key]) => !key.startsWith("founded."))),
        })),

    setStandFor: (lang, patch) =>
        set((state) => ({
            standFor: { ...state.standFor, [lang]: { ...state.standFor[lang], ...patch } },
            fieldErrors: Object.fromEntries(Object.entries(state.fieldErrors).filter(([key]) => !key.startsWith("stand_for."))),
        })),

    setFuture: (lang, patch) =>
        set((state) => ({
            future: { ...state.future, [lang]: { ...state.future[lang], ...patch } },
            fieldErrors: Object.fromEntries(Object.entries(state.fieldErrors).filter(([key]) => !key.startsWith("future."))),
        })),

    addStandForCard: () =>
        set((state) => ({
            standFor: {
                en: { ...state.standFor.en, cards: [...state.standFor.en.cards, { img: "", title: "", description: "" }] },
                ar: { ...state.standFor.ar, cards: [...state.standFor.ar.cards, { img: "", title: "", description: "" }] },
            },
            standForDraftImages: [...state.standForDraftImages, null],
            fieldErrors: Object.fromEntries(Object.entries(state.fieldErrors).filter(([key]) => !key.startsWith("stand_for."))),
        })),

    updateStandForCard: (lang, index, patch) =>
        set((state) => ({
            standFor: {
                ...state.standFor,
                [lang]: {
                    ...state.standFor[lang],
                    cards: state.standFor[lang].cards.map((card, i) => (i === index ? { ...card, ...patch } : card)),
                },
            },
            fieldErrors: Object.fromEntries(Object.entries(state.fieldErrors).filter(([key]) => !key.startsWith("stand_for."))),
        })),

    removeStandForCard: (index) =>
        set((state) => ({
            standFor: {
                en: { ...state.standFor.en, cards: state.standFor.en.cards.filter((_, i) => i !== index) },
                ar: { ...state.standFor.ar, cards: state.standFor.ar.cards.filter((_, i) => i !== index) },
            },
            standForDraftImages: state.standForDraftImages.filter((_, i) => i !== index),
            fieldErrors: Object.fromEntries(Object.entries(state.fieldErrors).filter(([key]) => !key.startsWith("stand_for."))),
        })),

    setStandForCardImage: (index, file) =>
        set((state) => {
            const nextDrafts = [...state.standForDraftImages];
            nextDrafts[index] = file;
            return {
                standForDraftImages: nextDrafts,
                fieldErrors: Object.fromEntries(Object.entries(state.fieldErrors).filter(([key]) => !key.startsWith("stand_for."))),
            };
        }),

    clearStandForCardImage: (index) =>
        set((state) => {
            const clearCards = (locale: CmsLocale) =>
                state.standFor[locale].cards.map((card, i) => (i === index ? { ...card, img: "" } : card));
            const nextDrafts = [...state.standForDraftImages];
            nextDrafts[index] = null;
            return {
                standFor: {
                    en: { ...state.standFor.en, cards: clearCards("en") },
                    ar: { ...state.standFor.ar, cards: clearCards("ar") },
                },
                standForDraftImages: nextDrafts,
                fieldErrors: Object.fromEntries(Object.entries(state.fieldErrors).filter(([key]) => !key.startsWith("stand_for."))),
            };
        }),

    addFutureCard: () =>
        set((state) => ({
            future: {
                en: { ...state.future.en, cards: [...state.future.en.cards, { img: "", titles: [], descriptions: [] }] },
                ar: { ...state.future.ar, cards: [...state.future.ar.cards, { img: "", titles: [], descriptions: [] }] },
            },
            futureDraftImages: [...state.futureDraftImages, null],
            fieldErrors: Object.fromEntries(Object.entries(state.fieldErrors).filter(([key]) => !key.startsWith("future."))),
        })),

    updateFutureCard: (lang, index, patch) =>
        set((state) => ({
            future: {
                ...state.future,
                [lang]: {
                    ...state.future[lang],
                    cards: state.future[lang].cards.map((card, i) => (i === index ? { ...card, ...patch } : card)),
                },
            },
            fieldErrors: Object.fromEntries(Object.entries(state.fieldErrors).filter(([key]) => !key.startsWith("future."))),
        })),

    removeFutureCard: (index) =>
        set((state) => ({
            future: {
                en: { ...state.future.en, cards: state.future.en.cards.filter((_, i) => i !== index) },
                ar: { ...state.future.ar, cards: state.future.ar.cards.filter((_, i) => i !== index) },
            },
            futureDraftImages: state.futureDraftImages.filter((_, i) => i !== index),
            fieldErrors: Object.fromEntries(Object.entries(state.fieldErrors).filter(([key]) => !key.startsWith("future."))),
        })),

    setFutureCardImage: (index, file) =>
        set((state) => {
            const nextDrafts = [...state.futureDraftImages];
            nextDrafts[index] = file;
            return {
                futureDraftImages: nextDrafts,
                fieldErrors: Object.fromEntries(Object.entries(state.fieldErrors).filter(([key]) => !key.startsWith("future."))),
            };
        }),

    clearFutureCardImage: (index) =>
        set((state) => {
            const clearCards = (locale: CmsLocale) =>
                state.future[locale].cards.map((card, i) => (i === index ? { ...card, img: "" } : card));
            const nextDrafts = [...state.futureDraftImages];
            nextDrafts[index] = null;
            return {
                future: {
                    en: { ...state.future.en, cards: clearCards("en") },
                    ar: { ...state.future.ar, cards: clearCards("ar") },
                },
                futureDraftImages: nextDrafts,
                fieldErrors: Object.fromEntries(Object.entries(state.fieldErrors).filter(([key]) => !key.startsWith("future."))),
            };
        }),

    setHeroBgFile: (file) => set({ bgDraftFile: file }),

    clearHeroBg: () =>
        set((state) => ({
            hero: {
                en: { ...state.hero.en, bg: "" },
                ar: { ...state.hero.ar, bg: "" },
            },
            bgDraftFile: null,
        })),

    savePart: async (part) => {
        const state = get();
        const partPayload =
            part === "hero" ? state.hero :
                part === "founded" ? state.founded :
                    part === "stand_for" ? state.standFor :
                        state.future;

        const withDrafts = (() => {
            if (part === "hero") {
                const next = partPayload as Localized<CmsAboutHeroSection>;
                if (!state.bgDraftFile) return next;
                return {
                    en: { ...next.en, bg: next.en.bg || "__draft__" },
                    ar: { ...next.ar, bg: next.ar.bg || "__draft__" },
                };
            }
            if (part === "stand_for") {
                const next = partPayload as Localized<CmsAboutStandForSection>;
                return {
                    en: {
                        ...next.en,
                        cards: next.en.cards.map((card, index) => ({ ...card, img: card.img || (state.standForDraftImages[index] ? "__draft__" : "") })),
                    },
                    ar: {
                        ...next.ar,
                        cards: next.ar.cards.map((card, index) => ({ ...card, img: card.img || (state.standForDraftImages[index] ? "__draft__" : "") })),
                    },
                };
            }
            if (part === "future") {
                const next = partPayload as Localized<CmsAboutFutureSection>;
                return {
                    en: {
                        ...next.en,
                        cards: next.en.cards.map((card, index) => ({ ...card, img: card.img || (state.futureDraftImages[index] ? "__draft__" : "") })),
                    },
                    ar: {
                        ...next.ar,
                        cards: next.ar.cards.map((card, index) => ({ ...card, img: card.img || (state.futureDraftImages[index] ? "__draft__" : "") })),
                    },
                };
            }
            return partPayload;
        })();

        const parsed = schemaByPart[part].safeParse(withDrafts);
        if (!parsed.success) {
            set({
                error: "Please fix validation errors before saving.",
                fieldErrors: mapBilingualZodErrors(part, parsed.error),
            });
            return false;
        }

        set({ savingPart: part, error: null });

        try {
            if (part === "hero") {
                const formData = new FormData();
                formData.append("payload", JSON.stringify(withDrafts));
                if (state.bgDraftFile) formData.append("bg", state.bgDraftFile);
                const response = await axiosNormalApiClient.patch("/dashboard/cms/sections/about/hero", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                set((s) => ({ hero: asLocalized(response.data?.data, s.hero.en), savingPart: null, bgDraftFile: null }));
                return true;
            }

            if (part === "stand_for") {
                const formData = new FormData();
                formData.append("payload", JSON.stringify(withDrafts));
                state.standForDraftImages.forEach((file, index) => {
                    if (file && (withDrafts as Localized<CmsAboutStandForSection>).en.cards[index]?.img === "__draft__") {
                        formData.append("stand_for_card_images", file);
                    }
                });
                const response = await axiosNormalApiClient.patch("/dashboard/cms/sections/about/stand_for", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                set((s) => ({ standFor: asLocalized(response.data?.data, s.standFor.en), savingPart: null, standForDraftImages: [] }));
                return true;
            }

            if (part === "future") {
                const formData = new FormData();
                formData.append("payload", JSON.stringify(withDrafts));
                state.futureDraftImages.forEach((file, index) => {
                    if (file && (withDrafts as Localized<CmsAboutFutureSection>).en.cards[index]?.img === "__draft__") {
                        formData.append("future_card_images", file);
                    }
                });
                const response = await axiosNormalApiClient.patch("/dashboard/cms/sections/about/future", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                set((s) => ({ future: asLocalized(response.data?.data, s.future.en), savingPart: null, futureDraftImages: [] }));
                return true;
            }

            const response = await axiosNormalApiClient.patch(`/dashboard/cms/sections/about/${part}`, withDrafts);
            set((s) => ({
                founded: part === "founded" ? asLocalized(response.data?.data, s.founded.en) : s.founded,
                savingPart: null,
            }));
            return true;
        } catch (error) {
            set({ savingPart: null, error: extractErrorMessage(error, `Failed to save about ${part} section.`) });
            return false;
        }
    },
}));

export default useCmsAboutStore;
