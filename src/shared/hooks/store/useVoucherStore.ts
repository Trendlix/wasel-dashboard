import { create } from "zustand";
import axiosNormalApiClient from "@/shared/utils/axios";
import { isAxiosError } from "axios";

export type TVoucherStatus = "active" | "inactive" | "expired" | "suspended";
export type TVoucherDiscountType = "fixed" | "percentage";

export interface IVoucher {
  id: number;
  code: string;
  description: string | null;
  discount_type: TVoucherDiscountType;
  discount_value: number;
  min_order: number | null;
  max_discount: number | null;
  usage_limit: number | null;
  usage_per_user: number;
  total_used: number;
  valid_from: string;
  valid_to: string;
  status: TVoucherStatus;
  created_at: string;
  updated_at: string;
}

export interface IVoucherPayload {
  code?: string;
  description?: string;
  discount_type: TVoucherDiscountType;
  discount_value: number;
  min_order?: number;
  max_discount?: number;
  usage_limit?: number;
  usage_per_user: number;
  valid_from: string;
  valid_to: string;
  status: TVoucherStatus;
}

export interface IVoucherUpdatePayload extends Partial<IVoucherPayload> {}

export interface IVoucherPaginationMeta {
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

export interface IVouchersQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: TVoucherStatus;
  order?: "asc" | "desc";
  sort_by?: "created_at" | "valid_to" | "total_used" | "code" | "status";
  date_from?: string;
  date_to?: string;
}

export interface IVoucherAnalytics {
  total_vouchers: number;
  active_vouchers: number;
  expiring_soon: number;
  total_redemptions: number;
}

interface VoucherState {
  vouchers: IVoucher[];
  meta: IVoucherPaginationMeta | null;
  analytics: IVoucherAnalytics | null;
  loading: boolean;
  analyticsLoading: boolean;
  submitting: boolean;
  exporting: boolean;
  error: string | null;
  query: IVouchersQuery;

  fetchVouchers: (query?: IVouchersQuery) => Promise<void>;
  fetchVouchersAnalytics: () => Promise<void>;
  createVoucher: (payload: IVoucherPayload) => Promise<void>;
  updateVoucher: (id: number, payload: IVoucherUpdatePayload) => Promise<void>;
  updateVoucherStatus: (id: number, status: TVoucherStatus) => Promise<void>;
  deleteVoucher: (id: number) => Promise<void>;
  exportVouchers: (payload?: Pick<IVouchersQuery, "date_from" | "date_to">) => Promise<void>;
  generateVoucherCode: () => Promise<string>;
  setQuery: (query: Partial<IVouchersQuery>) => void;
  setPage: (page: number) => void;
  resetQuery: () => void;
}

const extractErrorMessage = (error: unknown, fallback: string): string => {
  if (!isAxiosError(error)) return fallback;
  return error.response?.data?.message || fallback;
};

const defaultQuery: IVouchersQuery = {
  page: 1,
  limit: 10,
  order: "desc",
  sort_by: "created_at",
};

const useVoucherStore = create<VoucherState>((set, get) => ({
  vouchers: [],
  meta: null,
  analytics: null,
  loading: false,
  analyticsLoading: false,
  submitting: false,
  exporting: false,
  error: null,
  query: defaultQuery,

  fetchVouchers: async (query) => {
    const params = query ?? get().query;
    set({ loading: true, error: null });
    try {
      const response = await axiosNormalApiClient.get("/vouchers/get-vouchers", { params });
      set({
        vouchers: response.data.data,
        meta: response.data.meta,
        loading: false,
      });
    } catch (error) {
      set({
        error: extractErrorMessage(error, "Failed to fetch vouchers"),
        loading: false,
      });
    }
  },

  fetchVouchersAnalytics: async () => {
    set({ analyticsLoading: true, error: null });
    try {
      const response = await axiosNormalApiClient.get("/vouchers/analytics");
      set({ analytics: response.data.data, analyticsLoading: false });
    } catch (error) {
      set({
        error: extractErrorMessage(error, "Failed to fetch vouchers analytics"),
        analyticsLoading: false,
      });
    }
  },

  createVoucher: async (payload) => {
    set({ submitting: true, error: null });
    try {
      await axiosNormalApiClient.post("/vouchers/create", payload);
    } catch (error) {
      set({ error: extractErrorMessage(error, "Failed to create voucher") });
      throw error;
    } finally {
      set({ submitting: false });
    }
  },

  updateVoucher: async (id, payload) => {
    set({ submitting: true, error: null });
    try {
      await axiosNormalApiClient.patch(`/vouchers/${id}`, payload);
    } catch (error) {
      set({ error: extractErrorMessage(error, "Failed to update voucher") });
      throw error;
    } finally {
      set({ submitting: false });
    }
  },

  updateVoucherStatus: async (id, status) => {
    set({ submitting: true, error: null });
    try {
      await axiosNormalApiClient.patch(`/vouchers/${id}/status`, { status });
    } catch (error) {
      set({ error: extractErrorMessage(error, "Failed to update voucher status") });
      throw error;
    } finally {
      set({ submitting: false });
    }
  },

  deleteVoucher: async (id) => {
    set({ submitting: true, error: null });
    try {
      await axiosNormalApiClient.delete(`/vouchers/${id}`);
    } catch (error) {
      set({ error: extractErrorMessage(error, "Failed to delete voucher") });
      throw error;
    } finally {
      set({ submitting: false });
    }
  },

  exportVouchers: async (payload) => {
    set({ exporting: true, error: null });
    try {
      const body = {
        ...get().query,
        ...(payload?.date_from ? { date_from: payload.date_from } : {}),
        ...(payload?.date_to ? { date_to: payload.date_to } : {}),
      };
      await axiosNormalApiClient.post("/vouchers/export", body);
    } catch (error) {
      set({ error: extractErrorMessage(error, "Failed to export vouchers") });
      throw error;
    } finally {
      set({ exporting: false });
    }
  },

  generateVoucherCode: async () => {
    try {
      const response = await axiosNormalApiClient.get("/vouchers/generate-code");
      return response.data.data.code as string;
    } catch (error) {
      set({ error: extractErrorMessage(error, "Failed to generate voucher code") });
      throw error;
    }
  },

  setQuery: (partial) => {
    const next = { ...get().query, ...partial, page: 1 };
    set({ query: next });
    get().fetchVouchers(next);
  },

  setPage: (page) => {
    const next = { ...get().query, page };
    set({ query: next });
    get().fetchVouchers(next);
  },

  resetQuery: () => {
    set({ query: defaultQuery });
    get().fetchVouchers(defaultQuery);
  },
}));

export default useVoucherStore;
