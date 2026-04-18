import { create } from "zustand";
import { axiosNormalApiClient, extractErrorMessage } from "@/shared/api";

export type BlogStatus = "draft" | "scheduled" | "published";
export type CmsLocale = "en" | "ar";
type Localized<T> = { en: T; ar: T };

export interface BlogSeoData {
    title: string;
    description: string;
    keyword: string[];
    schema: Record<string, unknown>[];
}

export interface BlogInfoCard {
    id: string;
    tag: string;
    title: string;
    description: string;
    created_at: string;
    time_to_read: string;
}

export interface BlogInfoSection {
    title: string;
    description: string;
    cards: BlogInfoCard[];
}

export interface BlogItem {
    id: string;
    locale: CmsLocale;
    category: string;
    title: string;
    description: string;
    time_to_read: string;
    created_at: string;
    cover_img: string;
    is_schedualed: boolean;
    release_date: string | null;
    status: BlogStatus;
    published_at?: string | null;
    created_by?: string | null;
    updated_at?: string;
    seo: BlogSeoData;
}

export interface BlogFormPayload {
    locale: CmsLocale;
    category: string;
    title: string;
    description: string;
    time_to_read: string;
    cover_img: string;
    is_schedualed: boolean;
    release_date: string | null;
    seo: BlogSeoData;
    status?: BlogStatus;
}

export interface BlogItemsMeta {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
    current_page: number;
    next_page: number | null;
    previous_page: number | null;
    has_next_page: boolean;
    has_previous_page: boolean;
    is_first_page: boolean;
    is_last_page: boolean;
}

export interface BlogItemsQuery {
    status?: BlogStatus;
    locale?: CmsLocale;
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
}

const DEFAULT_INFO: BlogInfoSection = { title: "", description: "", cards: [] };
const DEFAULT_SEO: BlogSeoData = { title: "", description: "", keyword: [], schema: [] };

const asLocalizedInfo = (value: unknown): Localized<BlogInfoSection> => {
    if (value && typeof value === "object" && ("en" in (value as Record<string, unknown>) || "ar" in (value as Record<string, unknown>))) {
        return {
            en: ((value as Record<string, BlogInfoSection>).en ?? DEFAULT_INFO) as BlogInfoSection,
            ar: ((value as Record<string, BlogInfoSection>).ar ?? DEFAULT_INFO) as BlogInfoSection,
        };
    }
    return { en: (value as BlogInfoSection) ?? DEFAULT_INFO, ar: DEFAULT_INFO };
};

export const createEmptyBlogForm = (): BlogFormPayload => ({
    locale: "en",
    category: "",
    title: "",
    description: "",
    time_to_read: "",
    cover_img: "",
    is_schedualed: false,
    release_date: null,
    seo: { ...DEFAULT_SEO },
    status: "draft",
});

interface CmsBlogsState {
    info: Localized<BlogInfoSection>;
    items: BlogItem[];
    itemsMeta: BlogItemsMeta | null;
    itemsQuery: BlogItemsQuery;
    categories: string[];
    loadingInfo: boolean;
    loadingItems: boolean;
    loadingCategories: boolean;
    savingInfo: boolean;
    savingItem: boolean;
    error: string | null;

    fetchInfo: () => Promise<void>;
    saveInfo: (payload: Localized<BlogInfoSection>) => Promise<boolean>;
    fetchItems: (query?: BlogItemsQuery) => Promise<void>;
    fetchCategories: () => Promise<void>;
    fetchItemById: (id: string) => Promise<BlogItem | null>;
    createItem: (payload: BlogFormPayload, coverFile?: File | null) => Promise<BlogItem | null>;
    updateItem: (id: string, payload: Partial<BlogFormPayload>, coverFile?: File | null) => Promise<BlogItem | null>;
    deleteItem: (id: string) => Promise<boolean>;
    publishItem: (id: string) => Promise<boolean>;
    unpublishItem: (id: string) => Promise<boolean>;
    draftItem: (id: string) => Promise<boolean>;
    uploadCover: (file: File) => Promise<string | null>;
    uploadRichTextMedia: (file: File, type: "image" | "video") => Promise<string | null>;
}

export const useCmsBlogsStore = create<CmsBlogsState>((set, get) => ({
    info: { en: DEFAULT_INFO, ar: DEFAULT_INFO },
    items: [],
    itemsMeta: null,
    itemsQuery: { page: 1, limit: 10 },
    categories: [],
    loadingInfo: false,
    loadingItems: false,
    loadingCategories: false,
    savingInfo: false,
    savingItem: false,
    error: null,

    fetchInfo: async () => {
        set({ loadingInfo: true, error: null });
        try {
            const response = await axiosNormalApiClient.get("/dashboard/cms/blogs/info");
            set({ info: asLocalizedInfo(response.data?.data), loadingInfo: false });
        } catch (error) {
            set({ loadingInfo: false, error: extractErrorMessage(error, "Failed to fetch blogs info.") });
        }
    },

    saveInfo: async (payload) => {
        set({ savingInfo: true, error: null });
        try {
            const response = await axiosNormalApiClient.patch("/dashboard/cms/blogs/info", payload);
            set({ info: asLocalizedInfo(response.data?.data ?? payload), savingInfo: false });
            return true;
        } catch (error) {
            set({ savingInfo: false, error: extractErrorMessage(error, "Failed to save blogs info.") });
            return false;
        }
    },

    fetchItems: async (query) => {
        const params = { ...get().itemsQuery, ...(query ?? {}) };
        set({ loadingItems: true, error: null });
        try {
            const response = await axiosNormalApiClient.get("/dashboard/cms/blogs/items", { params });
            set({
                items: response.data?.data ?? [],
                itemsMeta: response.data?.meta ?? null,
                itemsQuery: params,
                loadingItems: false,
            });
        } catch (error) {
            set({ loadingItems: false, error: extractErrorMessage(error, "Failed to fetch blog items.") });
        }
    },

    fetchCategories: async () => {
        set({ loadingCategories: true, error: null });
        try {
            const response = await axiosNormalApiClient.get("/dashboard/cms/blogs/categories");
            set({ categories: response.data?.data ?? [], loadingCategories: false });
        } catch (error) {
            set({ loadingCategories: false, error: extractErrorMessage(error, "Failed to fetch blog categories.") });
        }
    },

    fetchItemById: async (id) => {
        set({ error: null });
        try {
            const response = await axiosNormalApiClient.get(`/dashboard/cms/blogs/items/${id}`);
            return (response.data?.data ?? null) as BlogItem | null;
        } catch (error) {
            set({ error: extractErrorMessage(error, "Failed to fetch blog item.") });
            return null;
        }
    },

    createItem: async (payload, coverFile) => {
        set({ savingItem: true, error: null });
        try {
            const response = coverFile
                ? await axiosNormalApiClient.post(
                    "/dashboard/cms/blogs/items",
                    (() => {
                        const formData = new FormData();
                        formData.append("payload", JSON.stringify(payload));
                        formData.append("cover", coverFile);
                        return formData;
                    })(),
                    { headers: { "Content-Type": "multipart/form-data" } },
                )
                : await axiosNormalApiClient.post("/dashboard/cms/blogs/items", payload);
            const created = (response.data?.data ?? null) as BlogItem | null;
            set({ savingItem: false });
            await get().fetchItems(get().itemsQuery);
            return created;
        } catch (error) {
            set({ savingItem: false, error: extractErrorMessage(error, "Failed to create blog item.") });
            return null;
        }
    },

    updateItem: async (id, payload, coverFile) => {
        set({ savingItem: true, error: null });
        try {
            const response = coverFile
                ? await axiosNormalApiClient.patch(
                    `/dashboard/cms/blogs/items/${id}`,
                    (() => {
                        const formData = new FormData();
                        formData.append("payload", JSON.stringify(payload));
                        formData.append("cover", coverFile);
                        return formData;
                    })(),
                    { headers: { "Content-Type": "multipart/form-data" } },
                )
                : await axiosNormalApiClient.patch(`/dashboard/cms/blogs/items/${id}`, payload);
            const updated = (response.data?.data ?? null) as BlogItem | null;
            set({ savingItem: false });
            await get().fetchItems(get().itemsQuery);
            return updated;
        } catch (error) {
            set({ savingItem: false, error: extractErrorMessage(error, "Failed to update blog item.") });
            return null;
        }
    },

    deleteItem: async (id) => {
        set({ error: null });
        try {
            await axiosNormalApiClient.delete(`/dashboard/cms/blogs/items/${id}`);
            await get().fetchItems(get().itemsQuery);
            return true;
        } catch (error) {
            set({ error: extractErrorMessage(error, "Failed to delete blog item.") });
            return false;
        }
    },

    publishItem: async (id) => Boolean(await get().updateItem(id, { status: "published", is_schedualed: false, release_date: null })),
    unpublishItem: async (id) => Boolean(await get().updateItem(id, { status: "draft", is_schedualed: false, release_date: null })),
    draftItem: async (id) => Boolean(await get().updateItem(id, { status: "draft" })),

    uploadCover: async (file) => {
        set({ error: null });
        try {
            const formData = new FormData();
            formData.append("file", file);
            const response = await axiosNormalApiClient.post("/dashboard/cms/blogs/cover/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return (response.data?.data?.url ?? null) as string | null;
        } catch (error) {
            set({ error: extractErrorMessage(error, "Failed to upload cover image.") });
            return null;
        }
    },

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
            set({ error: extractErrorMessage(error, "Failed to upload rich-text media.") });
            return null;
        }
    },
}));
