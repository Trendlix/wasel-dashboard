import { isAxiosError } from "axios";
export { default as axiosNormalApiClient } from "@/shared/utils/axios";

export const extractErrorMessage = (error: unknown, fallback: string): string => {
    if (!isAxiosError(error)) return fallback;
    return error.response?.data?.message || fallback;
};
