import { create } from "zustand";
import { axiosNormalApiClient, extractErrorMessage } from "@/shared/api";
import {
    cmsContactSchema,
    mapContactZodErrors,
    type CmsContactForm,
} from "@/shared/validation/cms/contact";

const defaultEmails = (): CmsContactForm["emails"] => ({
    general_support: "",
    legal_inquiries: "",
    privacy_concerns: "",
    business_partnerships: "",
});

export const defaultCmsContact = (): CmsContactForm => ({
    mobile: "",
    landline: "",
    email: "",
    address: "",
    business_hours: "",
    emails: defaultEmails(),
});

function normalizeContactPayload(raw: unknown): CmsContactForm {
    const base = defaultCmsContact();
    if (!raw || typeof raw !== "object") return base;
    const r = raw as Record<string, unknown>;
    const rawEmails =
        r.emails && typeof r.emails === "object"
            ? (r.emails as Record<string, unknown>)
            : {};
    return {
        mobile: typeof r.mobile === "string" ? r.mobile : "",
        landline:
            typeof r.landline === "string"
                ? r.landline
                : typeof r.lanline === "string"
                  ? r.lanline
                  : "",
        email: typeof r.email === "string" ? r.email : "",
        address: typeof r.address === "string" ? r.address : "",
        business_hours: typeof r.business_hours === "string" ? r.business_hours : "",
        emails: {
            general_support:
                typeof rawEmails.general_support === "string"
                    ? rawEmails.general_support
                    : "",
            legal_inquiries:
                typeof rawEmails.legal_inquiries === "string"
                    ? rawEmails.legal_inquiries
                    : "",
            privacy_concerns:
                typeof rawEmails.privacy_concerns === "string"
                    ? rawEmails.privacy_concerns
                    : "",
            business_partnerships:
                typeof rawEmails.business_partnerships === "string"
                    ? rawEmails.business_partnerships
                    : "",
        },
    };
}

type ContactPatch = Partial<Omit<CmsContactForm, "emails">> & {
    emails?: Partial<CmsContactForm["emails"]>;
};

interface CmsContactState {
    contact: CmsContactForm;
    loading: boolean;
    saving: boolean;
    error: string | null;
    fieldErrors: Record<string, string>;
    fetchContact: () => Promise<void>;
    setContact: (patch: ContactPatch) => void;
    saveContact: () => Promise<boolean>;
}

export const useCmsContactStore = create<CmsContactState>((set, get) => ({
    contact: defaultCmsContact(),
    loading: false,
    saving: false,
    error: null,
    fieldErrors: {},

    fetchContact: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axiosNormalApiClient.get("/dashboard/cms/contact");
            set({
                contact: normalizeContactPayload(response.data?.data),
                loading: false,
            });
        } catch (error) {
            set({
                loading: false,
                error: extractErrorMessage(error, "Failed to fetch contact section."),
            });
        }
    },

    setContact: (patch) =>
        set((state) => ({
            contact: {
                ...state.contact,
                ...patch,
                emails: {
                    ...state.contact.emails,
                    ...(patch.emails ?? {}),
                },
            },
            fieldErrors: {},
        })),

    saveContact: async () => {
        set({ saving: true, error: null, fieldErrors: {} });
        const body = get().contact;
        const parsed = cmsContactSchema.safeParse(body);
        if (!parsed.success) {
            set({
                saving: false,
                fieldErrors: mapContactZodErrors(parsed.error),
            });
            return false;
        }
        try {
            const response = await axiosNormalApiClient.patch(
                "/dashboard/cms/contact",
                parsed.data,
            );
            set({
                contact: normalizeContactPayload(response.data?.data),
                saving: false,
            });
            return true;
        } catch (error) {
            set({
                saving: false,
                error: extractErrorMessage(error, "Failed to save contact section."),
            });
            return false;
        }
    },
}));
