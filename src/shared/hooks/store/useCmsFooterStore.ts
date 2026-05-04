import { create } from "zustand";
import { axiosNormalApiClient, extractErrorMessage } from "@/shared/api";
import {
    cmsFooterSchema,
    defaultCmsFooter,
    mapFooterZodErrors,
    normalizeFooterPayload,
    type CmsFooterForm,
} from "@/shared/validation/cms/footer";

type FooterPatch = Partial<{
    social_links: CmsFooterForm["social_links"];
    app_links: Partial<CmsFooterForm["app_links"]>;
}>;

interface CmsFooterState {
    footer: CmsFooterForm;
    loading: boolean;
    saving: boolean;
    error: string | null;
    fieldErrors: Record<string, string>;
    fetchFooter: () => Promise<void>;
    setFooter: (patch: FooterPatch) => void;
    setSocialRow: (index: number, patch: Partial<CmsFooterForm["social_links"][number]>) => void;
    addSocialRow: () => void;
    removeSocialRow: (index: number) => void;
    saveFooter: () => Promise<boolean>;
}

export const useCmsFooterStore = create<CmsFooterState>((set, get) => ({
    footer: defaultCmsFooter(),
    loading: false,
    saving: false,
    error: null,
    fieldErrors: {},

    fetchFooter: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axiosNormalApiClient.get("/dashboard/cms/footer");
            set({
                footer: normalizeFooterPayload(response.data?.data),
                loading: false,
            });
        } catch (error) {
            set({
                loading: false,
                error: extractErrorMessage(error, "Failed to fetch footer content."),
            });
        }
    },

    setFooter: (patch) =>
        set((state) => ({
            footer: {
                ...state.footer,
                ...patch,
                app_links: {
                    ...state.footer.app_links,
                    ...(patch.app_links ?? {}),
                },
                social_links: patch.social_links ?? state.footer.social_links,
            },
            fieldErrors: {},
        })),

    setSocialRow: (index, patch) =>
        set((state) => {
            const social_links = [...state.footer.social_links];
            const row = social_links[index];
            if (!row) return state;
            social_links[index] = { ...row, ...patch };
            return { footer: { ...state.footer, social_links }, fieldErrors: {} };
        }),

    addSocialRow: () =>
        set((state) => {
            if (state.footer.social_links.length >= 10) return state;
            return {
                footer: {
                    ...state.footer,
                    social_links: [
                        ...state.footer.social_links,
                        { icon: "Globe", link: "" },
                    ],
                },
                fieldErrors: {},
            };
        }),

    removeSocialRow: (index) =>
        set((state) => ({
            footer: {
                ...state.footer,
                social_links: state.footer.social_links.filter((_, i) => i !== index),
            },
            fieldErrors: {},
        })),

    saveFooter: async () => {
        set({ saving: true, error: null, fieldErrors: {} });
        const body = get().footer;
        const parsed = cmsFooterSchema.safeParse(body);
        if (!parsed.success) {
            set({
                saving: false,
                fieldErrors: mapFooterZodErrors(parsed.error),
            });
            return false;
        }
        try {
            const response = await axiosNormalApiClient.patch(
                "/dashboard/cms/footer",
                parsed.data,
            );
            set({
                footer: normalizeFooterPayload(response.data?.data),
                saving: false,
            });
            return true;
        } catch (error) {
            set({
                saving: false,
                error: extractErrorMessage(error, "Failed to save footer content."),
            });
            return false;
        }
    },
}));
