import { isAxiosError, type AxiosError } from "axios";
import i18n from "@/i18n";

const isServerMessage = (data: unknown): data is { message: string } => {
    if (!data || typeof data !== "object") return false;
    const msg = (data as { message?: unknown }).message;
    return typeof msg === "string" && msg.trim().length > 0;
};

/** User-facing message for failed / flaky connections (no HTTP body or timeout). */
export function getNetworkErrorMessage(error: unknown): string {
    if (!isAxiosError(error)) {
        return i18n.t("common:errors.requestFailed");
    }
    const code = error.code;
    if (code === "ECONNABORTED" || code === "ETIMEDOUT") {
        return i18n.t("common:errors.timeout");
    }
    if (!error.response || code === "ERR_NETWORK") {
        return i18n.t("common:errors.network");
    }
    return i18n.t("common:errors.requestFailed");
}

/** Prefer API `message` when present; otherwise network / generic copy. */
export function axiosRequestErrorMessage(error: unknown): string {
    if (isAxiosError(error) && error.response?.data && isServerMessage(error.response.data)) {
        return error.response.data.message.trim();
    }
    return getNetworkErrorMessage(error);
}

export function shouldRetryGetAfterNetworkFailure(error: AxiosError): boolean {
    if (error.response) return false;
    const code = error.code;
    return code === "ERR_NETWORK" || code === "ECONNABORTED" || code === "ETIMEDOUT";
}
