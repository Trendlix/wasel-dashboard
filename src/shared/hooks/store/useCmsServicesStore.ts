import { create } from "zustand";
import { axiosNormalApiClient, extractErrorMessage } from "@/shared/api";
import { mapZodErrors, bilingualSchemaByPart } from "@/shared/validation/cms/services";

export type CmsLocale = "en" | "ar";
type Localized<T> = { en: T; ar: T };

export interface ServiceCard { tag: string; title: string; description: string; img: string; }
export interface ServiceSection { title: string[]; description: string; cards: ServiceCard[]; }
export type ServicesPart = "hero" | "warehouse" | "advertising";

const DEFAULT_SERVICE_SECTION: ServiceSection = { title: ["", ""], description: "", cards: [] };

const asLocalized = <T>(value: unknown, fallback: T): Localized<T> => {
    if (value && typeof value === "object" && ("en" in (value as Record<string, unknown>) || "ar" in (value as Record<string, unknown>))) {
        return {
            en: ((value as Record<string, T>).en ?? fallback) as T,
            ar: ((value as Record<string, T>).ar ?? fallback) as T,
        };
    }
    return { en: (value as T) ?? fallback, ar: fallback };
};

interface CmsServicesState {
    hero: Localized<ServiceSection>;
    warehouse: Localized<ServiceSection>;
    advertising: Localized<ServiceSection>;
    loading: boolean;
    savingPart: ServicesPart | null;
    error: string | null;
    fieldErrors: Record<string, string>;
    cardDraftImages: Record<ServicesPart, (File | null)[]>;
    fetchPart: (part: ServicesPart) => Promise<void>;
    setPart: (part: ServicesPart, lang: CmsLocale, patch: Partial<ServiceSection>) => void;
    addCard: (part: ServicesPart) => void;
    updateCard: (part: ServicesPart, lang: CmsLocale, index: number, patch: Partial<ServiceCard>) => void;
    removeCard: (part: ServicesPart, index: number) => void;
    setCardImage: (part: ServicesPart, index: number, file: File | null) => void;
    clearCardImage: (part: ServicesPart, index: number) => void;
    savePart: (part: ServicesPart) => Promise<boolean>;
}

export const useCmsServicesStore = create<CmsServicesState>((set, get) => ({
    hero: { en: { ...DEFAULT_SERVICE_SECTION }, ar: { ...DEFAULT_SERVICE_SECTION } },
    warehouse: { en: { ...DEFAULT_SERVICE_SECTION }, ar: { ...DEFAULT_SERVICE_SECTION } },
    advertising: { en: { ...DEFAULT_SERVICE_SECTION }, ar: { ...DEFAULT_SERVICE_SECTION } },
    loading: false,
    savingPart: null,
    error: null,
    fieldErrors: {},
    cardDraftImages: { hero: [], warehouse: [], advertising: [] },

    fetchPart: async (part) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosNormalApiClient.get(`/dashboard/cms/services/${part}`);
            const data = asLocalized(response.data?.data, { ...DEFAULT_SERVICE_SECTION });
            set((state) => ({
                [part]: data,
                loading: false,
                cardDraftImages: { ...state.cardDraftImages, [part]: [] },
            }));
        } catch (error) {
            set({ loading: false, error: extractErrorMessage(error, `Failed to fetch services ${part} section.`) });
        }
    },

    setPart: (part, lang, patch) =>
        set((state) => ({
            [part]: { ...state[part], [lang]: { ...state[part][lang], ...patch } },
            fieldErrors: Object.fromEntries(Object.entries(state.fieldErrors).filter(([key]) => !key.startsWith(`${part}.`))),
        })),

    addCard: (part) =>
        set((state) => ({
            [part]: {
                en: { ...state[part].en, cards: [...state[part].en.cards, { tag: "", title: "", description: "", img: "" }] },
                ar: { ...state[part].ar, cards: [...state[part].ar.cards, { tag: "", title: "", description: "", img: "" }] },
            },
            cardDraftImages: { ...state.cardDraftImages, [part]: [...state.cardDraftImages[part], null] },
            fieldErrors: Object.fromEntries(Object.entries(state.fieldErrors).filter(([key]) => !key.startsWith(`${part}.cards`))),
        })),

    updateCard: (part, lang, index, patch) =>
        set((state) => ({
            [part]: {
                ...state[part],
                [lang]: {
                    ...state[part][lang],
                    cards: state[part][lang].cards.map((card, i) => (i === index ? { ...card, ...patch } : card)),
                },
            },
            fieldErrors: Object.fromEntries(Object.entries(state.fieldErrors).filter(([key]) => !key.startsWith(`${part}.cards`))),
        })),

    removeCard: (part, index) =>
        set((state) => ({
            [part]: {
                en: { ...state[part].en, cards: state[part].en.cards.filter((_, i) => i !== index) },
                ar: { ...state[part].ar, cards: state[part].ar.cards.filter((_, i) => i !== index) },
            },
            cardDraftImages: { ...state.cardDraftImages, [part]: state.cardDraftImages[part].filter((_, i) => i !== index) },
            fieldErrors: Object.fromEntries(Object.entries(state.fieldErrors).filter(([key]) => !key.startsWith(`${part}.cards`))),
        })),

    setCardImage: (part, index, file) =>
        set((state) => {
            const nextDrafts = [...state.cardDraftImages[part]];
            nextDrafts[index] = file;
            return {
                cardDraftImages: { ...state.cardDraftImages, [part]: nextDrafts },
                fieldErrors: Object.fromEntries(Object.entries(state.fieldErrors).filter(([key]) => !key.startsWith(`${part}.cards`))),
            };
        }),

    clearCardImage: (part, index) =>
        set((state) => {
            const clearCards = (locale: CmsLocale) => state[part][locale].cards.map((card, i) => (i === index ? { ...card, img: "" } : card));
            const nextDrafts = [...state.cardDraftImages[part]];
            nextDrafts[index] = null;
            return {
                [part]: {
                    en: { ...state[part].en, cards: clearCards("en") },
                    ar: { ...state[part].ar, cards: clearCards("ar") },
                },
                cardDraftImages: { ...state.cardDraftImages, [part]: nextDrafts },
            };
        }),

    savePart: async (part) => {
        const partPayload = get()[part];
        const draftImages = get().cardDraftImages[part];

        const payloadForValidation: Localized<ServiceSection> = {
            en: {
                ...partPayload.en,
                cards: partPayload.en.cards.map((card, index) => ({
                    ...card,
                    img: card.img || (draftImages[index] ? "__draft__" : ""),
                })),
            },
            ar: {
                ...partPayload.ar,
                cards: partPayload.ar.cards.map((card, index) => ({
                    ...card,
                    img: card.img || (draftImages[index] ? "__draft__" : ""),
                })),
            },
        };

        const parsed = bilingualSchemaByPart[part].safeParse(payloadForValidation);
        if (!parsed.success) {
            set({
                error: "Please fix validation errors before saving.",
                fieldErrors: mapZodErrors(part, parsed.error),
            });
            return false;
        }

        set({ savingPart: part, error: null, fieldErrors: {} });
        try {
            const formData = new FormData();
            formData.append("payload", JSON.stringify(payloadForValidation));
            draftImages.forEach((file, index) => {
                if (file && payloadForValidation.en.cards[index]?.img === "__draft__") {
                    formData.append("card_images", file);
                }
            });

            const response = await axiosNormalApiClient.patch(
                `/dashboard/cms/services/${part}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } },
            );

            set((state) => ({
                [part]: asLocalized(response.data?.data, state[part].en),
                savingPart: null,
                cardDraftImages: { ...state.cardDraftImages, [part]: [] },
            }));
            return true;
        } catch (error) {
            set({ savingPart: null, error: extractErrorMessage(error, `Failed to save services ${part} section.`) });
            return false;
        }
    },
}));
