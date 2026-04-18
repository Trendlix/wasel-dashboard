import { create } from "zustand";
import axiosNormalApiClient from "@/shared/utils/axios";
import { isAxiosError } from "axios";

const extractErrorMessage = (error: unknown, fallback: string): string => {
    if (!isAxiosError(error)) return fallback;
    return error.response?.data?.message || fallback;
};

export interface ILegalHelpAnalytics {
    faqs: number;
    faq_types: number;
    policies: number;
    terms_documents: number;
}

export interface IContentPoint {
    title: string;
    description: string;
    sort_order: number;
}

export interface IIntroduction {
    title: string;
    description: string;
}

export interface ISection {
    introduction: IIntroduction;
    points: IContentPoint[];
}

export interface ITermsDocument {
    id: number;
    terms: ISection;
    privacy_policy: ISection;
    updated_at: string;
}

export type TPolicyType = "terms" | "privacy";

export interface IPolicyRow {
    id: number;
    type: TPolicyType;
    key: string;
    answer: string;
    create_at: string;
    updates_at: string;
}

const emptySection = (): ISection => ({
    introduction: { title: "", description: "" },
    points: [],
});

interface LegalHelpState {
    analytics: ILegalHelpAnalytics | null;
    analyticsLoading: boolean;

    termsDoc: ITermsDocument | null;
    termsLoading: boolean;
    termsSaving: boolean;
    termsDraft: { terms: ISection; privacy: ISection } | null;

    policies: IPolicyRow[];
    policiesLoading: boolean;
    policySubmitting: boolean;
    policyTypeFilter: string;

    error: string | null;
    clearError: () => void;
    setPolicyTypeFilter: (t: string) => void;

    fetchAnalytics: () => Promise<void>;

    fetchTerms: () => Promise<void>;
    setTermsDraft: (draft: { terms: ISection; privacy: ISection } | null) => void;
    initTermsDraftFromDoc: () => void;
    createTerms: (data: { terms: ISection; privacy_and_policy: ISection }) => Promise<boolean>;
    updateTerms: (data: { terms: ISection; privacy_and_policy: ISection }) => Promise<boolean>;

    fetchPolicies: () => Promise<void>;
    createPolicy: (data: { type: TPolicyType; key: string; answer: string }) => Promise<boolean>;
    updatePolicy: (
        id: number,
        data: Partial<{ type: TPolicyType; key: string; answer: string }>,
    ) => Promise<boolean>;
    deletePolicy: (id: number) => Promise<boolean>;
}

const useLegalHelpStore = create<LegalHelpState>((set, get) => ({
    analytics: null,
    analyticsLoading: false,

    termsDoc: null,
    termsLoading: false,
    termsSaving: false,
    termsDraft: null,

    policies: [],
    policiesLoading: false,
    policySubmitting: false,
    policyTypeFilter: "",

    error: null,

    clearError: () => set({ error: null }),

    setPolicyTypeFilter: (t) => set({ policyTypeFilter: t }),

    fetchAnalytics: async () => {
        set({ analyticsLoading: true, error: null });
        try {
            const res = await axiosNormalApiClient.get("/dashboard/legal-help/analytics");
            set({ analytics: res.data.data, analyticsLoading: false });
        } catch (error) {
            set({
                error: extractErrorMessage(error, "Failed to load analytics"),
                analyticsLoading: false,
            });
        }
    },

    fetchTerms: async () => {
        set({ termsLoading: true, error: null });
        try {
            const res = await axiosNormalApiClient.get("/dashboard/legal-help/terms-conditions");
            const data = res.data.data;
            if (!data) {
                set({ termsDoc: null, termsDraft: null, termsLoading: false });
                return;
            }
            const doc: ITermsDocument = {
                id: data.id,
                terms: data.terms as ISection,
                privacy_policy: data.privacy_policy as ISection,
                updated_at: data.updated_at,
            };
            set({
                termsDoc: doc,
                termsDraft: {
                    terms: doc.terms,
                    privacy: doc.privacy_policy,
                },
                termsLoading: false,
            });
        } catch (error) {
            set({
                error: extractErrorMessage(error, "Failed to load terms"),
                termsLoading: false,
            });
        }
    },

    setTermsDraft: (draft) => set({ termsDraft: draft }),

    initTermsDraftFromDoc: () => {
        const doc = get().termsDoc;
        if (!doc) {
            set({
                termsDraft: { terms: emptySection(), privacy: emptySection() },
            });
            return;
        }
        set({
            termsDraft: {
                terms: JSON.parse(JSON.stringify(doc.terms)),
                privacy: JSON.parse(JSON.stringify(doc.privacy_policy)),
            },
        });
    },

    createTerms: async (data) => {
        set({ termsSaving: true, error: null });
        try {
            await axiosNormalApiClient.post("/dashboard/legal-help/terms-conditions", {
                terms: data.terms,
                privacy_and_policy: data.privacy_and_policy,
            });
            await get().fetchTerms();
            await get().fetchAnalytics();
            set({ termsSaving: false });
            return true;
        } catch (error) {
            set({
                error: extractErrorMessage(error, "Failed to create terms document"),
                termsSaving: false,
            });
            return false;
        }
    },

    updateTerms: async (data) => {
        const id = get().termsDoc?.id;
        if (!id) return false;
        set({ termsSaving: true, error: null });
        try {
            await axiosNormalApiClient.patch(`/dashboard/legal-help/terms-conditions/${id}`, {
                terms: data.terms,
                privacy_and_policy: data.privacy_and_policy,
            });
            await get().fetchTerms();
            set({ termsSaving: false });
            return true;
        } catch (error) {
            set({
                error: extractErrorMessage(error, "Failed to update terms"),
                termsSaving: false,
            });
            return false;
        }
    },

    fetchPolicies: async () => {
        set({ policiesLoading: true, error: null });
        const { policyTypeFilter } = get();
        try {
            const params: Record<string, string> = {};
            if (policyTypeFilter) params.type = policyTypeFilter;
            const res = await axiosNormalApiClient.get("/dashboard/legal-help/policies", { params });
            set({ policies: res.data.data ?? [], policiesLoading: false });
        } catch (error) {
            set({
                error: extractErrorMessage(error, "Failed to load policies"),
                policiesLoading: false,
            });
        }
    },

    createPolicy: async (data) => {
        set({ policySubmitting: true, error: null });
        try {
            await axiosNormalApiClient.post("/dashboard/legal-help/policies", data);
            await get().fetchPolicies();
            await get().fetchAnalytics();
            set({ policySubmitting: false });
            return true;
        } catch (error) {
            set({
                error: extractErrorMessage(error, "Failed to create policy"),
                policySubmitting: false,
            });
            return false;
        }
    },

    updatePolicy: async (id, data) => {
        set({ policySubmitting: true, error: null });
        try {
            await axiosNormalApiClient.patch(`/dashboard/legal-help/policies/${id}`, data);
            await get().fetchPolicies();
            set({ policySubmitting: false });
            return true;
        } catch (error) {
            set({
                error: extractErrorMessage(error, "Failed to update policy"),
                policySubmitting: false,
            });
            return false;
        }
    },

    deletePolicy: async (id) => {
        set({ policySubmitting: true, error: null });
        try {
            await axiosNormalApiClient.delete(`/dashboard/legal-help/policies/${id}`);
            await get().fetchPolicies();
            await get().fetchAnalytics();
            set({ policySubmitting: false });
            return true;
        } catch (error) {
            set({
                error: extractErrorMessage(error, "Failed to delete policy"),
                policySubmitting: false,
            });
            return false;
        }
    },
}));

export default useLegalHelpStore;
