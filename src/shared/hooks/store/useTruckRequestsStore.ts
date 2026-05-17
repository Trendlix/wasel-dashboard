import { create } from "zustand";
import axiosNormalApiClient from "@/shared/utils/axios";
import { isAxiosError } from "axios";
import type { TRequestStatus } from "@/shared/core/pages/requests";
import {
  buildTruckRequestsExportBody,
  type TruckRequestsExportPayload,
} from "@/shared/utils/export-query";

export interface IAppTruckRequest {
  id: number;
  request_number: string;
  status: TRequestStatus;
  created_at: string;
  expires_at: string;
  user_name: string;
  pickup_location: string;
  dropoff_location: string | null;
  offered_price_by_user: number;
  final_price: number | null;
  currency: string;
  offers_count: number;
  trip_id: number | null;
  booking_number: string | null;
}

export interface ITruckRequestDetails {
  id: number;
  request_number: string;
  status: TRequestStatus;
  created_at: string;
  updated_at: string;
  expires_at: string;
  trip_at: string;
  pickup_name: string;
  pickup_lat: number;
  pickup_long: number;
  user_lat: number;
  user_long: number;
  offered_price_by_user: number;
  wasel_suggested_price: number | null;
  final_price: number | null;
  currency: string;
  total_weight: number;
  total_km: number;
  estimated_duration_in_minutes: number;
  special_notes: string | null;
  goods_images: Array<{ key: string; url: string }>;
  user: { id: number; full_name: string; phone: string };
  drop_off_locations: Array<{ destination_name: string; lat: number; long: number }>;
  vehicle_goods: {
    truck_type: string | null;
    goods_type: string | null;
    weight: number;
  };
  driver_offers: Array<{
    id: number;
    driver_name: string;
    driver_offered_price: number;
    currency: string;
    status: string;
    created_at: string;
  }>;
  trip: { id: number; booking_number: string; status: string } | null;
}

export interface IRequestsAnalytics {
  pending: number;
  expired: number;
  confirmed: number;
  cancelled: number;
}

export interface IRequestPaginationMeta {
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

export interface ITruckRequestsQuery {
  page?: number;
  limit?: number;
  search?: string;
  order?: "asc" | "desc";
  status?: TRequestStatus;
  sort_by?: "created_at" | "status" | "request_number";
  date_from?: string;
  date_to?: string;
}

interface TruckRequestsState {
  requests: IAppTruckRequest[];
  meta: IRequestPaginationMeta | null;
  analytics: IRequestsAnalytics | null;
  requestDetails: ITruckRequestDetails | null;
  requestDetailsId: number | null;
  analyticsLoading: boolean;
  loading: boolean;
  requestDetailsLoading: boolean;
  exporting: boolean;
  error: string | null;
  query: ITruckRequestsQuery;

  fetchRequests: (query?: ITruckRequestsQuery) => Promise<void>;
  fetchRequestDetails: (id: number) => Promise<void>;
  clearRequestDetails: () => void;
  fetchRequestsAnalytics: () => Promise<void>;
  setPage: (page: number) => void;
  setQuery: (query: Partial<ITruckRequestsQuery>) => void;
  resetQuery: () => void;
  exportRequests: (overrides?: Partial<TruckRequestsExportPayload>) => Promise<void>;
}

const extractErrorMessage = (error: unknown, fallback: string): string => {
  if (isAxiosError(error) === false) return fallback;
  return error.response?.data?.message || fallback;
};

const parseEntityId = (id: unknown): number | null => {
  if (typeof id === "number" && Number.isInteger(id) && id > 0) return id;
  if (typeof id === "string" && /^\d+$/.test(id)) {
    const parsed = Number.parseInt(id, 10);
    return parsed > 0 ? parsed : null;
  }
  return null;
};

const defaultQuery: ITruckRequestsQuery = {
  page: 1,
  limit: 10,
  order: "desc",
};

const useTruckRequestsStore = create<TruckRequestsState>((set, get) => ({
  requests: [],
  meta: null,
  analytics: null,
  requestDetails: null,
  requestDetailsId: null,
  analyticsLoading: false,
  loading: false,
  requestDetailsLoading: false,
  exporting: false,
  error: null,
  query: defaultQuery,

  fetchRequests: async (query) => {
    const params = query ?? get().query;
    set({ loading: true, error: null });
    try {
      const response = await axiosNormalApiClient.get("/dashboard/truck-requests", { params });
      set({
        requests: response.data.data,
        meta: response.data.meta,
        loading: false,
      });
    } catch (error) {
      set({
        error: extractErrorMessage(error, "Failed to fetch truck requests"),
        loading: false,
      });
    }
  },

  fetchRequestDetails: async (id) => {
    const entityId = parseEntityId(id);
    if (entityId === null) {
      set({ requestDetailsLoading: false, requestDetails: null, requestDetailsId: null });
      return;
    }
    set({ requestDetailsLoading: true, error: null, requestDetailsId: entityId, requestDetails: null });
    try {
      const response = await axiosNormalApiClient.get(`/dashboard/truck-requests/${entityId}`);
      set({
        requestDetails: response.data.data,
        requestDetailsLoading: false,
      });
    } catch (error) {
      set({
        error: extractErrorMessage(error, "Failed to fetch request details"),
        requestDetailsLoading: false,
        requestDetails: null,
      });
    }
  },

  clearRequestDetails: () => {
    set({ requestDetails: null, requestDetailsId: null, requestDetailsLoading: false });
  },

  fetchRequestsAnalytics: async () => {
    set({ analyticsLoading: true, error: null });
    try {
      const response = await axiosNormalApiClient.get("/dashboard/truck-requests/analytics");
      set({
        analytics: response.data.data,
        analyticsLoading: false,
      });
    } catch (error) {
      set({
        error: extractErrorMessage(error, "Failed to fetch requests analytics"),
        analyticsLoading: false,
      });
    }
  },

  setPage: (page) => {
    const next = { ...get().query, page };
    set({ query: next });
    get().fetchRequests(next);
  },

  setQuery: (partial) => {
    const next = { ...get().query, ...partial, page: 1 };
    set({ query: next });
    get().fetchRequests(next);
  },

  resetQuery: () => {
    set({ query: defaultQuery });
    get().fetchRequests(defaultQuery);
  },

  exportRequests: async (overrides) => {
    set({ exporting: true, error: null });
    try {
      const body = buildTruckRequestsExportBody(get().query, overrides);
      await axiosNormalApiClient.post("/dashboard/truck-requests/export", body);
    } catch (error) {
      set({ error: extractErrorMessage(error, "Failed to export truck requests") });
      throw error;
    } finally {
      set({ exporting: false });
    }
  },
}));

export default useTruckRequestsStore;
