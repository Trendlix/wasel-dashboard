import { create } from "zustand";
import axiosNormalApiClient from "@/shared/utils/axios";
import { isAxiosError } from "axios";
import type { TTripStatus } from "@/shared/core/pages/trips";

export interface IAppTrip {
  id: number;
  request_id: number;
  driver_id: number;
  truck_id: number;
  status: TTripStatus;
  booking_number: string;
  created_at: string;
  completed_at: string | null;
  cancelled_at: string | null;
  picked_up_at: string | null;
  user_name: string;
  driver_name: string | null;
  pickup_location: string;
  dropoff_location: string | null;
  final_price: number;
  currency: string;
}

export interface ITripDetails {
  booking_number: string;
  status: TTripStatus;
  picked_up_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  driver: {
    name: string | null;
    phone: string | null;
  };
  user: {
    full_name: string;
    phone: string;
  };
  request: {
    pickup_location: {
      name: string;
      lat: number;
      long: number;
    };
    dropoff_locations: Array<{
      name: string;
      lat: number;
      long: number;
    }>;
    distance_km: number | null;
    duration_minutes: number | null;
    vehicle_goods: {
      truck_type: string | null;
      goods_type: string | null;
      weight: number | null;
    };
    special_notes: string | null;
  };
}

export interface ITripPaginationMeta {
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

export interface ITripsQuery {
  page?: number;
  limit?: number;
  search?: string;
  order?: "asc" | "desc";
  status?: TTripStatus;
  sort_by?: "created_at" | "status" | "booking_number";
  date_from?: string;
  date_to?: string;
}

export interface ITripsAnalytics {
  today: {
    totalTrips: number;
    completedTodayTrips: number;
    cancelledTodayTrips: number;
    activeTodayTrips: number;
  };
  total: {
    totalTrips: number;
    completedTrips: number;
    canclledTrips: number;
    activeTrips: number;
  };
}

interface TripsState {
  trips: IAppTrip[];
  meta: ITripPaginationMeta | null;
  analytics: ITripsAnalytics | null;
  tripDetails: ITripDetails | null;
  tripDetailsId: number | null;
  analyticsLoading: boolean;
  loading: boolean;
  tripDetailsLoading: boolean;
  updating: boolean;
  exporting: boolean;
  error: string | null;
  query: ITripsQuery;

  fetchTrips: (query?: ITripsQuery) => Promise<void>;
  fetchTripDetails: (id: number) => Promise<void>;
  clearTripDetails: () => void;
  fetchTripsAnalytics: () => Promise<void>;
  setPage: (page: number) => void;
  setQuery: (query: Partial<ITripsQuery>) => void;
  resetQuery: () => void;
  updateStatus: (id: number, status: TTripStatus) => Promise<void>;
  exportTrips: (payload?: Pick<ITripsQuery, "date_from" | "date_to">) => Promise<void>;
}

const extractErrorMessage = (error: unknown, fallback: string): string => {
  if (isAxiosError(error) === false) return fallback;
  return error.response?.data?.message || fallback;
};

const defaultQuery: ITripsQuery = {
  page: 1,
  limit: 10,
  order: "desc",
};

const useTripsStore = create<TripsState>((set, get) => ({
  trips: [],
  meta: null,
  analytics: null,
  tripDetails: null,
  tripDetailsId: null,
  analyticsLoading: false,
  loading: false,
  tripDetailsLoading: false,
  updating: false,
  exporting: false,
  error: null,
  query: defaultQuery,

  fetchTrips: async (query) => {
    const params = query ?? get().query;
    set({ loading: true, error: null });
    try {
      const response = await axiosNormalApiClient.get("/dashboard/trips", { params });
      set({
        trips: response.data.data,
        meta: response.data.meta,
        loading: false,
      });
    } catch (error) {
      set({
        error: extractErrorMessage(error, "Failed to fetch trips"),
        loading: false,
      });
    }
  },

  fetchTripDetails: async (id) => {
    set({ tripDetailsLoading: true, error: null, tripDetailsId: id });
    try {
      const response = await axiosNormalApiClient.get(`/dashboard/trips/${id}`);
      set({
        tripDetails: response.data.data,
        tripDetailsLoading: false,
      });
    } catch (error) {
      set({
        error: extractErrorMessage(error, "Failed to fetch trip details"),
        tripDetailsLoading: false,
        tripDetails: null,
      });
    }
  },

  clearTripDetails: () => {
    set({ tripDetails: null, tripDetailsId: null, tripDetailsLoading: false });
  },

  fetchTripsAnalytics: async () => {
    set({ analyticsLoading: true, error: null });
    try {
      const response = await axiosNormalApiClient.get("/dashboard/trips/analytics");
      set({
        analytics: response.data.data,
        analyticsLoading: false,
      });
    } catch (error) {
      set({
        error: extractErrorMessage(error, "Failed to fetch trips analytics"),
        analyticsLoading: false,
      });
    }
  },

  setPage: (page) => {
    const next = { ...get().query, page };
    set({ query: next });
    get().fetchTrips(next);
  },

  setQuery: (partial) => {
    const next = { ...get().query, ...partial, page: 1 };
    set({ query: next });
    get().fetchTrips(next);
  },

  resetQuery: () => {
    set({ query: defaultQuery });
    get().fetchTrips(defaultQuery);
  },

  updateStatus: async (id, status) => {
    set({ updating: true, error: null });
    try {
      await axiosNormalApiClient.patch(`/dashboard/trips/${id}/status`, { status });
      set((state) => ({
        trips: state.trips.map((trip) => (trip.id === id ? { ...trip, status } : trip)),
        tripDetails:
          state.tripDetailsId === id && state.tripDetails
            ? {
                ...state.tripDetails,
                status,
                cancelled_at:
                  status === "cancelled"
                    ? new Date().toISOString()
                    : state.tripDetails.cancelled_at,
              }
            : state.tripDetails,
        updating: false,
      }));
    } catch (error) {
      set({
        error: extractErrorMessage(error, "Failed to update trip status"),
        updating: false,
      });
      throw error;
    }
  },

  exportTrips: async (payload) => {
    set({ exporting: true, error: null });
    try {
      const body = {
        ...get().query,
        ...(payload?.date_from ? { date_from: payload.date_from } : {}),
        ...(payload?.date_to ? { date_to: payload.date_to } : {}),
      };
      await axiosNormalApiClient.post("/dashboard/trips/export", body);
    } catch (error) {
      set({ error: extractErrorMessage(error, "Failed to export trips") });
      throw error;
    } finally {
      set({ exporting: false });
    }
  },
}));

export default useTripsStore;
