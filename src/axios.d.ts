import "axios";

declare module "axios" {
    export interface AxiosRequestConfig {
        meta?: {
            showToast?: boolean;
            toastType?: "success" | "error" | "info" | "alert";
        };
        _retry?: boolean;
    }
}