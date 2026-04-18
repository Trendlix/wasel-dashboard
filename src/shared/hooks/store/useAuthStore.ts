import { create } from "zustand";
import { isAxiosError } from "axios";
import axiosNormalApiClient from "@/shared/utils/axios";
import { getCookie, setCookie, removeCookie } from "@/shared/utils/cookieUtils";

export enum CreateAccountCase {
    SIGNUP_PENDING_APPROVAL = "SIGNUP_PENDING_APPROVAL",
    LOGIN_SUCCESS = "LOGIN_SUCCESS",
    TWOFA_SETUP_REQUIRED = "TWOFA_SETUP_REQUIRED",
    TWOFA_VERIFICATION_REQUIRED = "TWOFA_VERIFICATION_REQUIRED",
}

type RequestMeta = {
    showToast?: boolean;
    toastType?: "success" | "error" | "info" | "alert";
};

interface TwoFaSetupData {
    temp_token: string;
    otpauth: string;
    qr: string;
    secret: string;
}

interface UserProfile {
    id: number;
    name: string;
    email: string;
    role: {
        id: number;
        name: string;
        slug: string;
        pages: string[];
    };
}

interface AuthState {
    twoFaSetupData: TwoFaSetupData | null;
    tempToken: string | null;
    userProfile: UserProfile | null;

    fetchMe: () => Promise<void>;
    refineAccessToken: () => Promise<void>;

    createAccount: (
        email: string,
        password: string,
        setLoading: (loading: boolean) => void,
        name?: string,
        meta?: RequestMeta
    ) => Promise<CreateAccountCase>;

    logout: () => Promise<void>;

    verifyTwoFa: (
        totpToken: string,
        setLoading: (loading: boolean) => void,
        meta?: RequestMeta
    ) => Promise<void>;

    acceptInvitation: (
        token: string,
        password: string,
        setLoading: (loading: boolean) => void,
        name?: string,
        meta?: RequestMeta
    ) => Promise<void>;

    validateInvitation: (
        token: string,
        setLoading: (loading: boolean) => void
    ) => Promise<{ email: string; name?: string; role_name: string }>;

    setupTwoFaAuthenticated: (
        setLoading: (loading: boolean) => void
    ) => Promise<TwoFaSetupData>;

    enableTwoFaAuthenticated: (
        token: string,
        setLoading: (loading: boolean) => void
    ) => Promise<void>;

    clearTwoFaState: () => void;
}

let fetchMeInFlight: Promise<void> | null = null;

const extractErrorMessage = (error: unknown, fallback: string) => {
    if (!isAxiosError(error)) return fallback;

    const message = error.response?.data?.message;

    if (typeof message === "string" && message.trim()) {
        return message;
    }

    if (Array.isArray(message)) {
        const normalized = message
            .map((item) => {
                if (typeof item === "string") return item;
                if (item?.constraints && typeof item.constraints === "object") {
                    return Object.values(item.constraints).join(", ");
                }
                return "";
            })
            .filter(Boolean)
            .join(", ");

        return normalized || fallback;
    }

    return fallback;
};

const useAuthStore = create<AuthState>((set, get) => ({
    twoFaSetupData: null,
    tempToken: null,
    userProfile: null,

    logout: async () => {
        const accessToken = getCookie("wasel_admin_access_token");
        await axiosNormalApiClient.post("/admin/logout", { access_token: accessToken }).then(() => {
            set({ userProfile: null, tempToken: null, twoFaSetupData: null });
            removeCookie("wasel_admin_access_token");
            removeCookie("wasel_admin_refresh_token");
        }).catch(() => {
            // Even if the logout request fails, we should still clear the local auth state and cookies
            set({ userProfile: null, tempToken: null, twoFaSetupData: null });
            removeCookie("wasel_admin_access_token");
            removeCookie("wasel_admin_refresh_token");
        });
    },

    fetchMe: async () => {
        // Skip entirely if we already have the profile
        if (get().userProfile) return;

        if (fetchMeInFlight) {
            return fetchMeInFlight;
        }

        fetchMeInFlight = (async () => {
            try {
                const response = await axiosNormalApiClient.get("/admin/me");
                set({ userProfile: response.data.data });
            } catch {
                set({ userProfile: null });
            } finally {
                fetchMeInFlight = null;
            }
        })();

        return fetchMeInFlight;
    },

    refineAccessToken: async () => {
        const refreshToken = getCookie("wasel_admin_refresh_token");
        if (!refreshToken) return;

        const response = await axiosNormalApiClient.post("/admin/token/refresh", {
            refresh_token: refreshToken,
        });

        const { access_token, refresh_token } = response.data.data.login;

        setCookie("wasel_admin_access_token", access_token);
        setCookie("wasel_admin_refresh_token", refresh_token);
    },

    createAccount: async (email, password, setLoading, name, meta) => {
        setLoading(true);
        try {
            const response = await axiosNormalApiClient.post(
                "/admin/account",
                { email, password, ...(name ? { name } : {}) },
                { meta }
            );

            const data = response.data?.data ?? {};

            if (data.status === "blocked") {
                return CreateAccountCase.SIGNUP_PENDING_APPROVAL;
            }

            const loginInfo = data.login;
            if (!loginInfo) {
                throw new Error("Unexpected response from server.");
            }

            if (loginInfo.requires_2fa) {
                if (loginInfo.setup_required) {
                    set({
                        twoFaSetupData: {
                            temp_token: loginInfo.temp_token,
                            otpauth: loginInfo.otpauth,
                            qr: loginInfo.qr,
                            secret: loginInfo.secret,
                        },
                        tempToken: null,
                    });
                    return CreateAccountCase.TWOFA_SETUP_REQUIRED;
                } else {
                    set({ tempToken: loginInfo.temp_token, twoFaSetupData: null });
                    return CreateAccountCase.TWOFA_VERIFICATION_REQUIRED;
                }
            }

            if (loginInfo.access_token && loginInfo.refresh_token) {
                setCookie("wasel_admin_access_token", loginInfo.access_token);
                setCookie("wasel_admin_refresh_token", loginInfo.refresh_token);
                return CreateAccountCase.LOGIN_SUCCESS;
            }

            throw new Error("Unexpected response from server.");
        } catch (error: unknown) {
            throw new Error(extractErrorMessage(error, "Authentication failed."));
        } finally {
            setLoading(false);
        }
    },

    verifyTwoFa: async (totpToken, setLoading, meta) => {
        const { tempToken, twoFaSetupData } = get();
        const tempTokenValue = tempToken ?? twoFaSetupData?.temp_token;

        if (!tempTokenValue) {
            throw new Error("No pending 2FA session. Please log in again.");
        }

        setLoading(true);
        try {
            const response = await axiosNormalApiClient.post(
                "/admin/account/2fa/verify",
                {
                    temp_token: tempTokenValue,
                    token: String(totpToken),
                },
                { meta }
            );

            const { access_token, refresh_token } = response.data.data.login;

            setCookie("wasel_admin_access_token", access_token);
            setCookie("wasel_admin_refresh_token", refresh_token);

            set({ tempToken: null, twoFaSetupData: null });
        } catch (error: unknown) {
            throw new Error(extractErrorMessage(error, "2FA verification failed."));
        } finally {
            setLoading(false);
        }
    },

    acceptInvitation: async (token, password, setLoading, name, meta) => {
        setLoading(true);
        try {
            const response = await axiosNormalApiClient.post(
                "/admin/invitation/accept",
                { token, password, ...(name ? { name } : {}) },
                { meta }
            );

            const { access_token, refresh_token } = response.data.data.login;

            setCookie("wasel_admin_access_token", access_token);
            setCookie("wasel_admin_refresh_token", refresh_token);
        } catch (error: unknown) {
            throw new Error(extractErrorMessage(error, "Failed to accept invitation."));
        } finally {
            setLoading(false);
        }
    },

    validateInvitation: async (token, setLoading) => {
        setLoading(true);
        try {
            const response = await axiosNormalApiClient.get(
                `/admin/invitation/validate?token=${token}`
            );
            return response.data.data;
        } catch (error: unknown) {
            throw new Error(extractErrorMessage(error, "Invitation invalid or expired."));
        } finally {
            setLoading(false);
        }
    },

    setupTwoFaAuthenticated: async (setLoading) => {
        setLoading(true);
        try {
            const response = await axiosNormalApiClient.post("/admin/account/2fa/setup");
            return response.data.data;
        } catch (error: unknown) {
            throw new Error(extractErrorMessage(error, "Failed to setup 2FA."));
        } finally {
            setLoading(false);
        }
    },

    enableTwoFaAuthenticated: async (token, setLoading) => {
        setLoading(true);
        try {
            await axiosNormalApiClient.post("/admin/account/2fa/enable", { token });
        } catch (error: unknown) {
            throw new Error(extractErrorMessage(error, "Failed to enable 2FA."));
        } finally {
            setLoading(false);
        }
    },

    clearTwoFaState: () => set({ tempToken: null, twoFaSetupData: null }),
}));

export default useAuthStore;