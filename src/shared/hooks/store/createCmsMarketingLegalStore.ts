import { create } from "zustand";
import axiosNormalApiClient from "@/shared/utils/axios";
import { isAxiosError } from "axios";

const extractErrorMessage = (error: unknown, fallback: string): string => {
    if (!isAxiosError(error)) return fallback;
    return error.response?.data?.message || fallback;
};

export type MarketingLegalAudience = "all" | "user" | "driver";

export interface MarketingLegalItem {
    question: string;
    answer: string;
}

export interface MarketingLegalGroup {
    categoryKey: string;
    category: string;
    audience?: MarketingLegalAudience;
    items: MarketingLegalItem[];
}

export interface MarketingLegalLocale {
    titles: string[];
    description: string;
    items: MarketingLegalGroup[];
}

export interface MarketingLegalAlert {
    en: string;
    ar: string;
}

export interface MarketingLegalPayload {
    alert: MarketingLegalAlert;
    en: MarketingLegalLocale;
    ar: MarketingLegalLocale;
}

export interface CmsMarketingLegalState {
    draft: MarketingLegalPayload;
    loading: boolean;
    saving: boolean;
    categorySaving: boolean;
    error: string | null;

    fetch: () => Promise<void>;
    setDraft: (patch: Partial<MarketingLegalPayload>) => void;
    setAlertField: (lang: "en" | "ar", value: string) => void;
    setLocale: (lang: "en" | "ar", locale: MarketingLegalLocale) => void;
    addTitleLine: (lang: "en" | "ar") => void;
    removeTitleLine: (lang: "en" | "ar", index: number) => void;
    setTitleLine: (lang: "en" | "ar", index: number, value: string) => void;
    addGroup: () => void;
    removeGroup: (index: number) => void;
    setGroupField: (
        index: number,
        field: "categoryKey" | "audience",
        value: string,
    ) => void;
    setGroupCategory: (index: number, lang: "en" | "ar", value: string) => void;
    addPairedItem: (groupIndex: number) => void;
    removePairedItem: (groupIndex: number, itemIndex: number) => void;
    setPairedItem: (
        groupIndex: number,
        itemIndex: number,
        lang: "en" | "ar",
        field: "question" | "answer",
        value: string,
    ) => void;
    uploadRichTextMedia: (file: File, type: "image" | "video") => Promise<string | null>;
    saveHero: () => Promise<boolean>;
    saveAlert: () => Promise<boolean>;
    saveContent: () => Promise<boolean>;
    saveCategoryItems: (categoryKey: string) => Promise<boolean>;
    createCategory: (enName: string, arName: string, audience: MarketingLegalAudience) => Promise<boolean>;
    deleteCategory: (categoryKey: string) => Promise<boolean>;
    save: () => Promise<boolean>;
    clearError: () => void;
}

interface CreateStoreConfig {
    fetchPath: string;
    heroPath: string;
    alertPath: string;
    contentPath: string;
    categoriesPath: string;
    saveErrorPrefix: string;
}

const slugifyCategoryKey = (value: string): string =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

const emptyGroup = (categoryKey: string): MarketingLegalGroup => ({
    categoryKey,
    category: "",
    audience: "all",
    items: [],
});

const defaultPayload = (): MarketingLegalPayload => ({
    alert: {
        en: "",
        ar: "",
    },
    en: {
        titles: ["", ""],
        description: "",
        items: [],
    },
    ar: {
        titles: ["", ""],
        description: "",
        items: [],
    },
});

const syncGroupCount = (draft: MarketingLegalPayload): MarketingLegalPayload => {
    const n = Math.max(draft.en.items.length, draft.ar.items.length);
    const enItems = [...draft.en.items];
    const arItems = [...draft.ar.items];
    while (enItems.length < n) {
        const key = `section-${enItems.length + 1}`;
        enItems.push(emptyGroup(key));
    }
    while (arItems.length < n) {
        const key = enItems[arItems.length]?.categoryKey ?? `section-${arItems.length + 1}`;
        arItems.push(emptyGroup(key));
    }
    for (let i = 0; i < n; i++) {
        const key = enItems[i]?.categoryKey || arItems[i]?.categoryKey || `section-${i + 1}`;
        enItems[i] = { ...enItems[i], categoryKey: key };
        arItems[i] = { ...arItems[i], categoryKey: key };
    }
    return {
        ...draft,
        en: { ...draft.en, items: enItems.slice(0, n) },
        ar: { ...draft.ar, items: arItems.slice(0, n) },
    };
};

const syncGroupItemPairs = (draft: MarketingLegalPayload): MarketingLegalPayload => {
    const enItems = draft.en.items.map((group, groupIndex) => {
        const arGroup = draft.ar.items[groupIndex];
        const arLen = arGroup?.items.length ?? 0;
        const target = Math.max(group.items.length, arLen);
        const items = [...group.items];
        while (items.length < target) items.push({ question: "", answer: "" });
        return { ...group, items };
    });

    const arItems = draft.ar.items.map((group, groupIndex) => {
        const enGroup = enItems[groupIndex];
        const enLen = enGroup?.items.length ?? 0;
        const target = Math.max(group.items.length, enLen);
        const items = [...group.items];
        while (items.length < target) items.push({ question: "", answer: "" });
        return { ...group, items };
    });

    return {
        ...draft,
        en: { ...draft.en, items: enItems },
        ar: { ...draft.ar, items: arItems },
    };
};

const normalizePayload = (raw: unknown): MarketingLegalPayload => {
    if (!raw || typeof raw !== "object") return defaultPayload();
    const data = raw as Record<string, unknown>;
    const alertRaw = data.alert as Record<string, unknown> | undefined;
    return {
        alert: {
            en: typeof alertRaw?.en === "string" ? alertRaw.en : "",
            ar: typeof alertRaw?.ar === "string" ? alertRaw.ar : "",
        },
        en: normalizeLocale(data.en),
        ar: normalizeLocale(data.ar),
    };
};

const normalizeLocale = (raw: unknown): MarketingLegalLocale => {
    const d = defaultPayload().en;
    if (!raw || typeof raw !== "object") return d;
    const L = raw as Record<string, unknown>;
    const titles = Array.isArray(L.titles)
        ? (L.titles as unknown[]).map((t) => (typeof t === "string" ? t : ""))
        : [];
    while (titles.length < 2) titles.push("");
    const description = typeof L.description === "string" ? L.description : "";
    const items = Array.isArray(L.items)
        ? (L.items as unknown[]).map((g) => normalizeGroup(g))
        : [];
    return { titles, description, items };
};

const normalizeGroup = (g: unknown): MarketingLegalGroup => {
    const empty = emptyGroup("");
    if (!g || typeof g !== "object") return empty;
    const x = g as Record<string, unknown>;
    const audience = x.audience === "user" || x.audience === "driver" || x.audience === "all"
        ? x.audience
        : "all";
    const rawItems = Array.isArray(x.items) ? x.items : x.points;
    const items = Array.isArray(rawItems)
        ? (rawItems as unknown[]).map((p) => {
            if (!p || typeof p !== "object") return { question: "", answer: "" };
            const pt = p as Record<string, unknown>;
            return {
                question: typeof pt.question === "string" ? pt.question : "",
                answer: typeof pt.answer === "string" ? pt.answer : "",
            };
        })
        : [];
    return {
        categoryKey: typeof x.categoryKey === "string" ? x.categoryKey : "",
        category: typeof x.category === "string"
            ? x.category
            : typeof x.label === "string"
                ? x.label
                : "",
        audience,
        items,
    };
};

export const createCmsMarketingLegalStore = (config: CreateStoreConfig) =>
    create<CmsMarketingLegalState>((set, get) => ({
        draft: defaultPayload(),
        loading: false,
        saving: false,
        categorySaving: false,
        error: null,

        clearError: () => set({ error: null }),

        fetch: async () => {
            set({ loading: true, error: null });
            try {
                const res = await axiosNormalApiClient.get(config.fetchPath);
                const data = res.data?.data;
                if (data && typeof data === "object") {
                    set({
                        draft: normalizePayload(data),
                        loading: false,
                    });
                } else {
                    set({ draft: defaultPayload(), loading: false });
                }
            } catch (error) {
                set({
                    error: extractErrorMessage(error, `Failed to load ${config.saveErrorPrefix}`),
                    loading: false,
                });
            }
        },

        setDraft: (patch: Partial<MarketingLegalPayload>) =>
            set((s) => ({
                draft: {
                    ...s.draft,
                    ...patch,
                    alert: patch.alert
                        ? {
                            ...s.draft.alert,
                            ...patch.alert,
                        }
                        : s.draft.alert,
                    en: patch.en ?? s.draft.en,
                    ar: patch.ar ?? s.draft.ar,
                },
            })),

        setAlertField: (lang, value) =>
            set((s) => ({
                draft: {
                    ...s.draft,
                    alert: {
                        ...s.draft.alert,
                        [lang]: value,
                    },
                },
            })),

        setLocale: (lang, locale) =>
            set((s) => ({
                draft: {
                    ...s.draft,
                    [lang]: locale,
                },
            })),

        addTitleLine: (lang) =>
            set((s) => ({
                draft: {
                    ...s.draft,
                    [lang]: {
                        ...s.draft[lang],
                        titles: [...s.draft[lang].titles, ""],
                    },
                },
            })),

        removeTitleLine: (lang, index) =>
            set((s) => {
                const titles = [...s.draft[lang].titles];
                if (titles.length <= 2) return s;
                titles.splice(index, 1);
                return {
                    draft: {
                        ...s.draft,
                        [lang]: { ...s.draft[lang], titles },
                    },
                };
            }),

        setTitleLine: (lang, index, value) =>
            set((s) => {
                const titles = [...s.draft[lang].titles];
                titles[index] = value;
                return {
                    draft: {
                        ...s.draft,
                        [lang]: { ...s.draft[lang], titles },
                    },
                };
            }),

        addGroup: () =>
            set((s) => {
                const id = `category-${Date.now()}`;
                const next: MarketingLegalPayload = {
                    ...s.draft,
                    en: {
                        ...s.draft.en,
                        items: [...s.draft.en.items, emptyGroup(id)],
                    },
                    ar: {
                        ...s.draft.ar,
                        items: [...s.draft.ar.items, emptyGroup(id)],
                    },
                };
                return { draft: syncGroupCount(next) };
            }),

        removeGroup: (index) =>
            set((s) => {
                const enItems = s.draft.en.items.filter((_, i) => i !== index);
                const arItems = s.draft.ar.items.filter((_, i) => i !== index);
                return {
                    draft: {
                        ...s.draft,
                        en: { ...s.draft.en, items: enItems },
                        ar: { ...s.draft.ar, items: arItems },
                    },
                };
            }),

        setGroupField: (index, field, value) =>
            set((s) => {
                const enItems = s.draft.en.items.map((g, i) =>
                    i === index ? { ...g, [field]: value } : g,
                );
                const arItems = s.draft.ar.items.map((g, i) =>
                    i === index ? { ...g, [field]: value } : g,
                );
                return {
                    draft: {
                        ...s.draft,
                        en: { ...s.draft.en, items: enItems },
                        ar: { ...s.draft.ar, items: arItems },
                    },
                };
            }),

        setGroupCategory: (index, lang, value) =>
            set((s) => {
                if (lang === "en") {
                    const enItems = s.draft.en.items.map((g, i) => {
                        if (i !== index) return g;
                        const nextKey = slugifyCategoryKey(value) || g.categoryKey;
                        return { ...g, category: value, categoryKey: nextKey };
                    });
                    const arItems = s.draft.ar.items.map((g, i) =>
                        i === index ? { ...g, categoryKey: enItems[i]?.categoryKey ?? g.categoryKey } : g,
                    );
                    return {
                        draft: {
                            ...s.draft,
                            en: { ...s.draft.en, items: enItems },
                            ar: { ...s.draft.ar, items: arItems },
                        },
                    };
                }

                const arItems = s.draft.ar.items.map((g, i) =>
                    i === index ? { ...g, category: value } : g,
                );
                return {
                    draft: {
                        ...s.draft,
                        ar: { ...s.draft.ar, items: arItems },
                    },
                };
            }),

        addPairedItem: (groupIndex) =>
            set((s) => {
                const enItems = s.draft.en.items.map((group, i) =>
                    i === groupIndex
                        ? { ...group, items: [...group.items, { question: "", answer: "" }] }
                        : group,
                );
                const arItems = s.draft.ar.items.map((group, i) =>
                    i === groupIndex
                        ? { ...group, items: [...group.items, { question: "", answer: "" }] }
                        : group,
                );
                const synced = syncGroupItemPairs({
                    ...s.draft,
                    en: { ...s.draft.en, items: enItems },
                    ar: { ...s.draft.ar, items: arItems },
                });
                return { draft: synced };
            }),

        removePairedItem: (groupIndex, itemIndex) =>
            set((s) => {
                const enItems = s.draft.en.items.map((group, i) =>
                    i === groupIndex
                        ? { ...group, items: group.items.filter((_, idx) => idx !== itemIndex) }
                        : group,
                );
                const arItems = s.draft.ar.items.map((group, i) =>
                    i === groupIndex
                        ? { ...group, items: group.items.filter((_, idx) => idx !== itemIndex) }
                        : group,
                );
                const synced = syncGroupItemPairs({
                    ...s.draft,
                    en: { ...s.draft.en, items: enItems },
                    ar: { ...s.draft.ar, items: arItems },
                });
                return { draft: synced };
            }),

        setPairedItem: (groupIndex, itemIndex, lang, field, value) =>
            set((s) => {
                const localeItems = s.draft[lang].items.map((group, i) => {
                    if (i !== groupIndex) return group;
                    return {
                        ...group,
                        items: group.items.map((item, idx) =>
                            idx === itemIndex ? { ...item, [field]: value } : item,
                        ),
                    };
                });
                const nextDraft: MarketingLegalPayload =
                    lang === "en"
                        ? { ...s.draft, en: { ...s.draft.en, items: localeItems } }
                        : { ...s.draft, ar: { ...s.draft.ar, items: localeItems } };
                return { draft: syncGroupItemPairs(nextDraft) };
            }),

        uploadRichTextMedia: async (file, type) => {
            set({ error: null });
            try {
                const formData = new FormData();
                formData.append("file", file);
                const response = await axiosNormalApiClient.post(
                    `/dashboard/cms/blogs/richtext/upload?type=${type}`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } },
                );
                return (response.data?.data?.url ?? null) as string | null;
            } catch (error) {
                set({
                    error: extractErrorMessage(error, "Failed to upload rich-text media."),
                });
                return null;
            }
        },

        saveHero: async () => {
            const { draft } = get();
            set({ saving: true, error: null });
            try {
                const payload = {
                    en: { titles: draft.en.titles, description: draft.en.description },
                    ar: { titles: draft.ar.titles, description: draft.ar.description },
                };
                const response = await axiosNormalApiClient.patch(config.heroPath, payload);
                const data = response.data?.data;
                set({
                    saving: false,
                    draft: data && typeof data === "object" ? normalizePayload(data) : draft,
                });
                return true;
            } catch (error) {
                set({
                    error: extractErrorMessage(error, `Failed to save ${config.saveErrorPrefix} hero`),
                    saving: false,
                });
                return false;
            }
        },

        saveAlert: async () => {
            const { draft } = get();
            set({ saving: true, error: null });
            try {
                const response = await axiosNormalApiClient.patch(config.alertPath, {
                    alert: draft.alert,
                });
                const data = response.data?.data;
                set({
                    saving: false,
                    draft: data && typeof data === "object" ? normalizePayload(data) : draft,
                });
                return true;
            } catch (error) {
                set({
                    error: extractErrorMessage(error, `Failed to save ${config.saveErrorPrefix} alert`),
                    saving: false,
                });
                return false;
            }
        },

        saveContent: async () => {
            const { draft } = get();
            set({ saving: true, error: null });
            try {
                const response = await axiosNormalApiClient.patch(config.contentPath, {
                    alert: draft.alert,
                    en: { items: draft.en.items },
                    ar: { items: draft.ar.items },
                });
                const data = response.data?.data;
                set({
                    saving: false,
                    draft: data && typeof data === "object" ? normalizePayload(data) : draft,
                });
                return true;
            } catch (error) {
                set({
                    error: extractErrorMessage(error, `Failed to save ${config.saveErrorPrefix} content`),
                    saving: false,
                });
                return false;
            }
        },

        saveCategoryItems: async (categoryKey: string) => {
            const { draft } = get();
            set({ saving: true, error: null });
            try {
                const normalizedCategoryKey = categoryKey.trim();
                const enGroup = draft.en.items.find((item) => item.categoryKey === normalizedCategoryKey);
                const arGroup = draft.ar.items.find((item) => item.categoryKey === normalizedCategoryKey);

                if (!enGroup || !arGroup) {
                    set({
                        saving: false,
                        error: "Selected category was not found in one of the locales.",
                    });
                    return false;
                }

                const response = await axiosNormalApiClient.patch(
                    `${config.categoriesPath}/${encodeURIComponent(normalizedCategoryKey)}/items`,
                    { enItems: enGroup.items, arItems: arGroup.items },
                );
                const data = response.data?.data;
                set({
                    saving: false,
                    draft: data && typeof data === "object" ? normalizePayload(data) : draft,
                });
                return true;
            } catch (error) {
                set({
                    error: extractErrorMessage(error, `Failed to save ${config.saveErrorPrefix} category items`),
                    saving: false,
                });
                return false;
            }
        },

        createCategory: async (enName, arName, audience) => {
            set({ categorySaving: true, error: null });
            try {
                const response = await axiosNormalApiClient.post(config.categoriesPath, {
                    enName,
                    arName,
                    audience,
                });
                const data = response.data?.data;
                set({
                    categorySaving: false,
                    draft: data && typeof data === "object" ? normalizePayload(data) : get().draft,
                });
                return true;
            } catch (error) {
                set({
                    error: extractErrorMessage(error, `Failed to create ${config.saveErrorPrefix} category`),
                    categorySaving: false,
                });
                return false;
            }
        },

        deleteCategory: async (categoryKey: string) => {
            set({ categorySaving: true, error: null });
            try {
                await axiosNormalApiClient.delete(`${config.categoriesPath}/${encodeURIComponent(categoryKey)}`);
                const response = await axiosNormalApiClient.get(config.fetchPath);
                const data = response.data?.data;
                set({
                    categorySaving: false,
                    draft: data && typeof data === "object" ? normalizePayload(data) : defaultPayload(),
                });
                return true;
            } catch (error) {
                set({
                    error: extractErrorMessage(error, `Failed to delete ${config.saveErrorPrefix} category`),
                    categorySaving: false,
                });
                return false;
            }
        },

        save: async () => {
            return get().saveContent();
        },
    }));
