import { create } from "zustand";
import { axiosNormalApiClient, extractErrorMessage } from "@/shared/api";
import {
    bilingualSchemaByPart,
    mapZodErrors,
    type HomePart,
    type HomeHeroLocale,
    type HomePlatformLocale,
    type HomeTransportLocale,
    type HomeMaximizingLocale,
} from "@/shared/validation/cms/home";

type Localized<T> = { en: T; ar: T };

const DEFAULT_HERO: HomeHeroLocale = {
    screen_1: ["", "", "", "", ""],
    screen_2: "",
    screen_3: "",
    screen_4: "",
    screen_5: "",
    screen_6: "",
};

const DEFAULT_PLATFORM: HomePlatformLocale = {
    title: "",
    card_1_title: "",
    card_2_title: "",
    card_3_title: "",
    card_4: { title: "", description: "" },
};

const DEFAULT_TRANSPORT: HomeTransportLocale = {
    card_1: { title: "", description: "" },
    card_2: { title: "", description: "" },
    card_3: { title: "", description: "" },
};

const DEFAULT_MAXIMIZING: HomeMaximizingLocale = {
    title: "",
    description: "",
    cards: {
        card_1: { title: "", description: "" },
        card_2: { title: "", description: "" },
        card_3: { title: "", description: "" },
    },
};

const asLocalized = <T>(value: unknown, fallback: T): Localized<T> => {
    if (
        value &&
        typeof value === "object" &&
        ("en" in (value as Record<string, unknown>) || "ar" in (value as Record<string, unknown>))
    ) {
        const v = value as Record<string, T>;
        return { en: v.en ?? fallback, ar: v.ar ?? fallback };
    }
    return { en: (value as T) ?? fallback, ar: fallback };
};

interface CmsHomeState {
    hero: Localized<HomeHeroLocale>;
    platform: Localized<HomePlatformLocale>;
    transport: Localized<HomeTransportLocale>;
    maximizing: Localized<HomeMaximizingLocale>;
    loading: boolean;
    savingPart: HomePart | null;
    error: string | null;
    fieldErrors: Record<string, string>;

    fetchPart: (part: HomePart) => Promise<void>;
    savePart: (part: HomePart) => Promise<boolean>;

    setHero: (lang: "en" | "ar", patch: Partial<HomeHeroLocale>) => void;
    setHeroScreen1Line: (lang: "en" | "ar", index: number, value: string) => void;
    setPlatform: (lang: "en" | "ar", patch: Partial<HomePlatformLocale>) => void;
    setPlatformCard4: (lang: "en" | "ar", patch: Partial<{ title: string; description: string }>) => void;
    setTransportCard: (lang: "en" | "ar", card: "card_1" | "card_2" | "card_3", patch: Partial<{ title: string; description: string }>) => void;
    setMaximizing: (lang: "en" | "ar", patch: Partial<Omit<HomeMaximizingLocale, "cards">>) => void;
    setMaximizingCard: (lang: "en" | "ar", card: "card_1" | "card_2" | "card_3", patch: Partial<{ title: string; description: string }>) => void;
}

export const useCmsHomeStore = create<CmsHomeState>((set, get) => ({
    hero: { en: { ...DEFAULT_HERO, screen_1: [...DEFAULT_HERO.screen_1] }, ar: { ...DEFAULT_HERO, screen_1: [...DEFAULT_HERO.screen_1] } },
    platform: { en: { ...DEFAULT_PLATFORM, card_4: { ...DEFAULT_PLATFORM.card_4 } }, ar: { ...DEFAULT_PLATFORM, card_4: { ...DEFAULT_PLATFORM.card_4 } } },
    transport: {
        en: { card_1: { ...DEFAULT_TRANSPORT.card_1 }, card_2: { ...DEFAULT_TRANSPORT.card_2 }, card_3: { ...DEFAULT_TRANSPORT.card_3 } },
        ar: { card_1: { ...DEFAULT_TRANSPORT.card_1 }, card_2: { ...DEFAULT_TRANSPORT.card_2 }, card_3: { ...DEFAULT_TRANSPORT.card_3 } },
    },
    maximizing: {
        en: { ...DEFAULT_MAXIMIZING, cards: { card_1: { ...DEFAULT_MAXIMIZING.cards.card_1 }, card_2: { ...DEFAULT_MAXIMIZING.cards.card_2 }, card_3: { ...DEFAULT_MAXIMIZING.cards.card_3 } } },
        ar: { ...DEFAULT_MAXIMIZING, cards: { card_1: { ...DEFAULT_MAXIMIZING.cards.card_1 }, card_2: { ...DEFAULT_MAXIMIZING.cards.card_2 }, card_3: { ...DEFAULT_MAXIMIZING.cards.card_3 } } },
    },
    loading: false,
    savingPart: null,
    error: null,
    fieldErrors: {},

    fetchPart: async (part) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosNormalApiClient.get(`/dashboard/cms/home/${part}`);
            const data = response.data?.data;
            if (part === "hero") {
                set({ hero: asLocalized(data, DEFAULT_HERO), loading: false });
            } else if (part === "platform") {
                set({ platform: asLocalized(data, DEFAULT_PLATFORM), loading: false });
            } else if (part === "transport") {
                set({ transport: asLocalized(data, DEFAULT_TRANSPORT), loading: false });
            } else if (part === "maximizing") {
                set({ maximizing: asLocalized(data, DEFAULT_MAXIMIZING), loading: false });
            } else {
                set({ loading: false });
            }
        } catch (error) {
            set({ loading: false, error: extractErrorMessage(error, `Failed to fetch home ${part} section.`) });
        }
    },

    savePart: async (part) => {
        const state = get();
        const payload = {
            en: state[part].en,
            ar: state[part].ar,
        };

        const schema = bilingualSchemaByPart[part];
        const parsed = (schema as any).safeParse(payload);
        if (!parsed.success) {
            set({
                error: "Please fix validation errors before saving.",
                fieldErrors: mapZodErrors(part, parsed.error),
            });
            return false;
        }

        set({ savingPart: part, error: null, fieldErrors: {} });
        try {
            const response = await axiosNormalApiClient.patch(`/dashboard/cms/home/${part}`, payload);
            const data = response.data?.data;
            if (part === "hero") {
                set({ hero: asLocalized(data, state.hero.en), savingPart: null });
            } else if (part === "platform") {
                set({ platform: asLocalized(data, state.platform.en), savingPart: null });
            } else if (part === "transport") {
                set({ transport: asLocalized(data, state.transport.en), savingPart: null });
            } else if (part === "maximizing") {
                set({ maximizing: asLocalized(data, state.maximizing.en), savingPart: null });
            } else {
                set({ savingPart: null });
            }
            return true;
        } catch (error) {
            set({ savingPart: null, error: extractErrorMessage(error, `Failed to save home ${part} section.`) });
            return false;
        }
    },

    setHero: (lang, patch) =>
        set((state) => ({
            hero: { ...state.hero, [lang]: { ...state.hero[lang], ...patch } },
            fieldErrors: Object.fromEntries(Object.entries(state.fieldErrors).filter(([k]) => !k.startsWith("hero."))),
        })),

    setHeroScreen1Line: (lang, index, value) =>
        set((state) => {
            const next = [...state.hero[lang].screen_1];
            next[index] = value;
            return {
                hero: { ...state.hero, [lang]: { ...state.hero[lang], screen_1: next } },
                fieldErrors: Object.fromEntries(Object.entries(state.fieldErrors).filter(([k]) => !k.startsWith("hero."))),
            };
        }),

    setPlatform: (lang, patch) =>
        set((state) => ({
            platform: { ...state.platform, [lang]: { ...state.platform[lang], ...patch } },
            fieldErrors: Object.fromEntries(Object.entries(state.fieldErrors).filter(([k]) => !k.startsWith("platform."))),
        })),

    setPlatformCard4: (lang, patch) =>
        set((state) => ({
            platform: {
                ...state.platform,
                [lang]: { ...state.platform[lang], card_4: { ...state.platform[lang].card_4, ...patch } },
            },
            fieldErrors: Object.fromEntries(Object.entries(state.fieldErrors).filter(([k]) => !k.startsWith("platform."))),
        })),

    setTransportCard: (lang, card, patch) =>
        set((state) => ({
            transport: {
                ...state.transport,
                [lang]: { ...state.transport[lang], [card]: { ...state.transport[lang][card], ...patch } },
            },
            fieldErrors: Object.fromEntries(Object.entries(state.fieldErrors).filter(([k]) => !k.startsWith("transport."))),
        })),

    setMaximizing: (lang, patch) =>
        set((state) => ({
            maximizing: { ...state.maximizing, [lang]: { ...state.maximizing[lang], ...patch } },
            fieldErrors: Object.fromEntries(Object.entries(state.fieldErrors).filter(([k]) => !k.startsWith("maximizing."))),
        })),

    setMaximizingCard: (lang, card, patch) =>
        set((state) => ({
            maximizing: {
                ...state.maximizing,
                [lang]: {
                    ...state.maximizing[lang],
                    cards: { ...state.maximizing[lang].cards, [card]: { ...state.maximizing[lang].cards[card], ...patch } },
                },
            },
            fieldErrors: Object.fromEntries(Object.entries(state.fieldErrors).filter(([k]) => !k.startsWith("maximizing."))),
        })),
}));
