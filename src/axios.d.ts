import "axios";

declare module "axios" {
    export interface AxiosRequestConfig {
        meta?: {
            showToast?: boolean;
            toastType?: "success" | "error" | "info" | "alert";
        };
        _retry?: boolean;
        /** GET retries after transient network failures (internal). */
        _getRetryCount?: number;
    }
}