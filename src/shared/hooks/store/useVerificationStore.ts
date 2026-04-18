import { create } from "zustand";
import axiosNormalApiClient from "@/shared/utils/axios";
import { isAxiosError } from "axios";
import type { TVerificationStatus } from "@/shared/core/pages/verification";

export interface IAppVerificationItem {
  id: number;
  name: string | null;
  email: string | null;
  phone: string;
  status: TVerificationStatus;
  reason_for_rejection: string | null;
  created_at: string;
  updated_at: string;
  profile: {
    profile_image: string | null;
    verified: boolean;
    national_id_front?: string | null;
    license_front?: string | null;
    criminal_record?: string | null;
  } | null;
}

export interface IVerificationPaginationMeta {
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

export interface IVerificationQuery {
  page?: number;
  limit?: number;
  search?: string;
  order?: "asc" | "desc";
  sort_by?: "created_at" | "name" | "email" | "phone" | "status";
  status?: TVerificationStatus;
}

export interface IVerificationCounts {
  pending: number;
  approved: number;
  rejected: number;
}

export interface IVerificationDetails {
  driver: {
    id: number;
    name: string | null;
    email: string | null;
    phone: string;
    created_at: string;
    updated_at: string;
  };
  verification: {
    status: TVerificationStatus;
    rejected_reason: string | null;
    is_profile_verified: boolean;
    notes: string | null;
  };
  documents: {
    profile_image: string | null;
    national_id_front: string | null;
    national_id_back: string | null;
    national_id_expiry: string | null;
    license_front: string | null;
    license_back: string | null;
    license_expiry: string | null;
    criminal_record: string | null;
    address: string | null;
    additional_phone: string | null;
  };
}

interface IUpdateVerificationPayload {
  status: TVerificationStatus;
  reason_for_rejection?: string;
  verification_notes?: string;
}

interface VerificationState {
  verifications: IAppVerificationItem[];
  meta: IVerificationPaginationMeta | null;
  counts: IVerificationCounts;
  details: IVerificationDetails | null;
  detailsId: number | null;
  loading: boolean;
  countsLoading: boolean;
  detailsLoading: boolean;
  updating: boolean;
  error: string | null;
  query: IVerificationQuery;

  fetchVerifications: (query?: IVerificationQuery) => Promise<void>;
  fetchVerificationCounts: () => Promise<void>;
  fetchVerificationDetails: (id: number) => Promise<void>;
  clearVerificationDetails: () => void;
  setPage: (page: number) => void;
  setQuery: (query: Partial<IVerificationQuery>) => void;
  resetQuery: () => void;
  updateVerificationStatus: (id: number, payload: IUpdateVerificationPayload) => Promise<void>;
}

const extractErrorMessage = (error: unknown, fallback: string): string => {
  if (!isAxiosError(error)) return fallback;
  return error.response?.data?.message || fallback;
};

const defaultQuery: IVerificationQuery = {
  page: 1,
  limit: 10,
  order: "desc",
  status: "pending",
};

const useVerificationStore = create<VerificationState>((set, get) => ({
  verifications: [],
  meta: null,
  counts: { pending: 0, approved: 0, rejected: 0 },
  details: null,
  detailsId: null,
  loading: false,
  countsLoading: false,
  detailsLoading: false,
  updating: false,
  error: null,
  query: defaultQuery,

  fetchVerifications: async (query) => {
    const params = query ?? get().query;
    set({ loading: true, error: null });
    try {
      const response = await axiosNormalApiClient.get("/dashboard/verifications", { params });
      set({
        verifications: response.data.data,
        meta: response.data.meta,
        loading: false,
      });
    } catch (error) {
      set({
        error: extractErrorMessage(error, "Failed to fetch verifications"),
        loading: false,
      });
    }
  },

  fetchVerificationCounts: async () => {
    set({ countsLoading: true, error: null });
    try {
      const base = { page: 1, limit: 1, order: "desc" as const };
      const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
        axiosNormalApiClient.get("/dashboard/verifications", { params: { ...base, status: "pending" } }),
        axiosNormalApiClient.get("/dashboard/verifications", { params: { ...base, status: "approved" } }),
        axiosNormalApiClient.get("/dashboard/verifications", { params: { ...base, status: "rejected" } }),
      ]);

      set({
        counts: {
          pending: pendingRes.data?.meta?.total ?? 0,
          approved: approvedRes.data?.meta?.total ?? 0,
          rejected: rejectedRes.data?.meta?.total ?? 0,
        },
        countsLoading: false,
      });
    } catch (error) {
      set({
        error: extractErrorMessage(error, "Failed to fetch verification counts"),
        countsLoading: false,
      });
    }
  },

  fetchVerificationDetails: async (id) => {
    set({ detailsLoading: true, error: null, detailsId: id });
    try {
      const response = await axiosNormalApiClient.get(`/dashboard/verifications/${id}`);
      set({
        details: response.data.data,
        detailsLoading: false,
      });
    } catch (error) {
      set({
        error: extractErrorMessage(error, "Failed to fetch verification details"),
        detailsLoading: false,
        details: null,
      });
    }
  },

  clearVerificationDetails: () => {
    set({ details: null, detailsId: null, detailsLoading: false });
  },

  setPage: (page) => {
    const next = { ...get().query, page };
    set({ query: next });
    get().fetchVerifications(next);
  },

  setQuery: (partial) => {
    const next = { ...get().query, ...partial, page: 1 };
    set({ query: next });
    get().fetchVerifications(next);
  },

  resetQuery: () => {
    set({ query: defaultQuery });
    get().fetchVerifications(defaultQuery);
  },

  updateVerificationStatus: async (id, payload) => {
    set({ updating: true, error: null });
    try {
      await axiosNormalApiClient.patch(`/dashboard/verifications/${id}/status`, payload);

      set((state) => ({
        verifications: state.verifications.map((item) =>
          item.id === id
            ? {
                ...item,
                status: payload.status,
                reason_for_rejection:
                  payload.status === "rejected" ? payload.reason_for_rejection ?? null : null,
              }
            : item,
        ),
        details:
          state.detailsId === id && state.details
            ? {
                ...state.details,
                verification: {
                  ...state.details.verification,
                  status: payload.status,
                  rejected_reason:
                    payload.status === "rejected" ? payload.reason_for_rejection ?? null : null,
                  notes: payload.verification_notes ?? null,
                  is_profile_verified: payload.status === "approved",
                },
              }
            : state.details,
        updating: false,
      }));

      await Promise.all([get().fetchVerifications(), get().fetchVerificationCounts()]);
    } catch (error) {
      set({
        error: extractErrorMessage(error, "Failed to update verification status"),
        updating: false,
      });
      throw error;
    }
  },
}));

export default useVerificationStore;
