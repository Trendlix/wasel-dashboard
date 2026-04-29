import { create } from "zustand";
import { isAxiosError } from "axios";
import axiosNormalApiClient from "@/shared/utils/axios";
import type { TestCenterTripFormValues } from "@/shared/schemas/test-center-trip.schema";

type OptionItem = { id: number; name: string };
type UserOptionItem = { id: number; name: string; phone?: string };
type OfferItem = {
    id: number;
    driver?: { id: number; name: string };
    price?: number;
    currency?: string;
};
type FanoutDiagnostics = {
    request_id: number;
    request_status: string;
    total_drivers: number;
    has_offer_already: number;
    offline: number;
    not_approved: number;
    missing_application_reference: number;
    no_approved_matching_truck: number;
    eligible_now: number;
};
type RawOption = { id: number; name?: string; full_name?: string; phone?: string };

interface TestCenterTripState {
    users: UserOptionItem[];
    truckTypes: OptionItem[];
    goodsTypes: OptionItem[];
    loadingOptions: boolean;
    submitting: boolean;
    error: string | null;
    successMessage: string | null;
    offers: OfferItem[];
    requestStatusSubmitting: boolean;
    tripStatusSubmitting: boolean;
    fanoutSubmitting: boolean;
    diagnosticsLoading: boolean;
    fanoutDiagnostics: FanoutDiagnostics | null;
    fetchOptions: () => Promise<void>;
    submitTripRequest: (payload: TestCenterTripFormValues, goodsImages: File[]) => Promise<number | null>;
    updateRequestStatus: (requestId: number, status: "pending" | "expired" | "confirmed") => Promise<void>;
    fetchOffersForRequest: (requestId: number) => Promise<void>;
    acceptOffer: (offerId: number) => Promise<number | null>;
    updateTripStatus: (tripId: number, status: string) => Promise<void>;
    refanoutRequest: (requestId: number) => Promise<void>;
    fetchFanoutDiagnostics: (requestId: number) => Promise<void>;
}

const extractErrorMessage = (error: unknown, fallback: string) => {
    if (!isAxiosError(error)) return fallback;
    return error.response?.data?.message || fallback;
};

const useTestCenterTripStore = create<TestCenterTripState>((set) => ({
    users: [],
    truckTypes: [],
    goodsTypes: [],
    loadingOptions: false,
    submitting: false,
    requestStatusSubmitting: false,
    tripStatusSubmitting: false,
    fanoutSubmitting: false,
    diagnosticsLoading: false,
    error: null,
    successMessage: null,
    offers: [],
    fanoutDiagnostics: null,

    fetchOptions: async () => {
        set({ loadingOptions: true, error: null });
        try {
            const [usersRes, trucksRes, goodsRes] = await Promise.all([
                axiosNormalApiClient.get("/dashboard/users", {
                    params: { page: 1, limit: 100, order: "desc", is_deleted: "false" },
                }),
                axiosNormalApiClient.get("/dashboard/data-management/truck-types", {
                    params: { page: 1, limit: 500 },
                }),
                axiosNormalApiClient.get("/dashboard/data-management/good-types", {
                    params: { page: 1, limit: 500 },
                }),
            ]);

            set({
                users: (usersRes.data?.data ?? []).map((item: RawOption) => ({
                    id: item.id,
                    name: item.full_name || `User ${item.id}`,
                    phone: item.phone || "",
                })),
                truckTypes: (trucksRes.data?.data ?? []).map((item: RawOption) => ({ id: item.id, name: item.name ?? "" })),
                goodsTypes: (goodsRes.data?.data ?? []).map((item: RawOption) => ({ id: item.id, name: item.name ?? "" })),
                loadingOptions: false,
            });
        } catch (error) {
            set({
                loadingOptions: false,
                error: extractErrorMessage(error, "Failed to load truck/goods options."),
            });
        }
    },

    submitTripRequest: async (payload, goodsImages) => {
        set({ submitting: true, error: null, successMessage: null });
        try {
            const formData = new FormData();
            formData.append("payload", JSON.stringify(payload));
            goodsImages.forEach((file) => formData.append("goods_images", file));

            const response = await axiosNormalApiClient.post(
                "/dashboard/trips/test-center/request",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } },
            );
            const requestNo = response?.data?.data?.request_number;
            const requestId = Number(response?.data?.data?.id ?? 0) || null;
            set({
                submitting: false,
                successMessage: requestNo
                    ? `Trip request created successfully: ${requestNo}`
                    : "Trip request created successfully.",
            });
            return requestId;
        } catch (error) {
            set({
                submitting: false,
                error: extractErrorMessage(error, "Failed to create trip request."),
            });
            throw error;
        }
    },

    updateRequestStatus: async (requestId, status) => {
        set({ requestStatusSubmitting: true, error: null, successMessage: null });
        try {
            await axiosNormalApiClient.patch(`/dashboard/trips/test-center/request/${requestId}/status`, { status });
            set({
                requestStatusSubmitting: false,
                successMessage: `Request #${requestId} status updated to ${status}.`,
            });
        } catch (error) {
            set({
                requestStatusSubmitting: false,
                error: extractErrorMessage(error, "Failed to update request status."),
            });
            throw error;
        }
    },

    fetchOffersForRequest: async (requestId) => {
        set({ error: null, successMessage: null });
        try {
            const response = await axiosNormalApiClient.get(`/dashboard/trips/test-center/request/${requestId}/offers`);
            set({ offers: response.data?.data ?? [] });
        } catch (error) {
            set({
                offers: [],
                error: extractErrorMessage(error, "Failed to fetch request offers."),
            });
            throw error;
        }
    },

    acceptOffer: async (offerId) => {
        set({ submitting: true, error: null, successMessage: null });
        try {
            const response = await axiosNormalApiClient.post(`/dashboard/trips/test-center/offers/${offerId}/accept`);
            const tripId = Number(response?.data?.data?.trip_id ?? 0) || null;
            set({
                submitting: false,
                successMessage: tripId
                    ? `Offer accepted successfully. Trip created with ID ${tripId}.`
                    : "Offer accepted successfully.",
            });
            return tripId;
        } catch (error) {
            set({
                submitting: false,
                error: extractErrorMessage(error, "Failed to accept offer."),
            });
            throw error;
        }
    },

    updateTripStatus: async (tripId, status) => {
        set({ tripStatusSubmitting: true, error: null, successMessage: null });
        try {
            await axiosNormalApiClient.patch(`/dashboard/trips/${tripId}/status`, { status });
            set({
                tripStatusSubmitting: false,
                successMessage: `Trip #${tripId} status updated to ${status}.`,
            });
        } catch (error) {
            set({
                tripStatusSubmitting: false,
                error: extractErrorMessage(error, "Failed to update trip status."),
            });
            throw error;
        }
    },

    refanoutRequest: async (requestId) => {
        set({ fanoutSubmitting: true, error: null, successMessage: null });
        try {
            const response = await axiosNormalApiClient.post(`/dashboard/trips/test-center/request/${requestId}/refanout`);
            const created = response?.data?.data?.offers_created ?? 0;
            set({
                fanoutSubmitting: false,
                successMessage: `Re-fanout done for request #${requestId}. New offers created: ${created}.`,
            });
        } catch (error) {
            set({
                fanoutSubmitting: false,
                error: extractErrorMessage(error, "Failed to re-fanout request."),
            });
            throw error;
        }
    },

    fetchFanoutDiagnostics: async (requestId) => {
        set({ diagnosticsLoading: true, error: null, successMessage: null });
        try {
            const response = await axiosNormalApiClient.get(`/dashboard/trips/test-center/request/${requestId}/fanout-diagnostics`);
            set({
                diagnosticsLoading: false,
                fanoutDiagnostics: response.data?.data ?? null,
            });
        } catch (error) {
            set({
                diagnosticsLoading: false,
                fanoutDiagnostics: null,
                error: extractErrorMessage(error, "Failed to load fanout diagnostics."),
            });
            throw error;
        }
    },
}));

export default useTestCenterTripStore;
