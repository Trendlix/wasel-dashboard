// axios.ts
import axios, { isAxiosError, isCancel } from "axios";
import { getCookie, setCookie, removeCookie } from "./cookieUtils";
import { toastHandler } from "./toast";
import { axiosRequestErrorMessage, shouldRetryGetAfterNetworkFailure } from "./networkErrors";

const baseURL = import.meta.env.VITE_API_BASE_URL || "";

const DEFAULT_TIMEOUT_MS = 45_000;

const resolveTimeoutMs = (): number => {
    const raw = import.meta.env.VITE_API_TIMEOUT_MS;
    if (raw === undefined || raw === "") return DEFAULT_TIMEOUT_MS;
    const n = Number.parseInt(String(raw), 10);
    return Number.isFinite(n) && n > 0 ? n : DEFAULT_TIMEOUT_MS;
};

const REQUEST_TIMEOUT_MS = resolveTimeoutMs();

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const RETRY_STATUSES = [401, 403, 498];

// separate instance to avoid interceptor loop on refresh call
const axiosRefreshClient = axios.create({
    baseURL,
    withCredentials: true,
    timeout: REQUEST_TIMEOUT_MS,
});

const axiosNormalApiClient = axios.create({
    baseURL,
    withCredentials: true,
    timeout: REQUEST_TIMEOUT_MS,
});

// ─── Request interceptor ──────────────────────────────────────────────────────

axiosNormalApiClient.interceptors.request.use((config) => {
    const token = getCookie("wasel_admin_access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ─── Response interceptor ─────────────────────────────────────────────────────

let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (err: unknown) => void }[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token!);
    });
    failedQueue = [];
};

const MAX_GET_RETRIES = 2;

axiosNormalApiClient.interceptors.response.use(
    (res) => {
        const method = res.config.method?.toUpperCase();
        if (method && method !== "GET") {
            toastHandler(res.data?.message, res.status);
        }
        return res;
    },
    async (error) => {
        if (isCancel(error)) {
            return Promise.reject(error);
        }

        const originalRequest = error.config;
        const status = error.response?.status;

        // ── Should we attempt a token refresh? ───────────────────────────────
        if (
            originalRequest &&
            RETRY_STATUSES.includes(status) &&
            !originalRequest._retry
        ) {
            const refreshToken = getCookie("wasel_admin_refresh_token");

            // No refresh token — logout immediately
            if (!refreshToken) {
                removeCookie("wasel_admin_access_token");
                removeCookie("wasel_admin_refresh_token");
                // toastHandler("Session expired. Please log in again.", status, "error");
                return Promise.reject(error);
            }

            // Another request is already refreshing — queue this one
            if (isRefreshing) {
                return new Promise<string>((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((newToken) => {
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        return axiosNormalApiClient(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            // Start refreshing
            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const response = await axiosRefreshClient.post("/admin/token/refresh", {
                    refresh_token: refreshToken,
                });

                const { access_token, refresh_token } = response.data.data;

                setCookie("wasel_admin_access_token", access_token);
                setCookie("wasel_admin_refresh_token", refresh_token);

                axiosNormalApiClient.defaults.headers.common.Authorization = `Bearer ${access_token}`;
                originalRequest.headers.Authorization = `Bearer ${access_token}`;

                processQueue(null, access_token);

                return axiosNormalApiClient(originalRequest);
            } catch (err) {
                processQueue(err, null);
                removeCookie("wasel_admin_access_token");
                removeCookie("wasel_admin_refresh_token");
                toastHandler(axiosRequestErrorMessage(err), undefined, "error");
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        // ── Transient GET retry (network / timeout; no HTTP response) ─────────
        if (
            isAxiosError(error) &&
            originalRequest &&
            originalRequest.method?.toUpperCase() === "GET" &&
            shouldRetryGetAfterNetworkFailure(error)
        ) {
            const count = originalRequest._getRetryCount ?? 0;
            if (count < MAX_GET_RETRIES) {
                originalRequest._getRetryCount = count + 1;
                await sleep(1000 * 2 ** count);
                return axiosNormalApiClient(originalRequest);
            }
        }

        const message = axiosRequestErrorMessage(error);
        toastHandler(message, status, "error");
        return Promise.reject(error);
    }
);

export default axiosNormalApiClient;
