import { create } from "zustand";

const DEFAULT_RECHECK_INTERVAL_MS = 15_000;
const PROBE_ATTEMPTS = 3;
const PROBE_TIMEOUT_MS = 8_000;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const getProbeUrl = () => {
    const baseURL = import.meta.env.VITE_API_BASE_URL || "";
    const normalized = baseURL.endsWith("/") ? baseURL.slice(0, -1) : baseURL;
    return `${normalized}/api/user`;
};

const probeBackend = async (): Promise<boolean> => {
    const url = getProbeUrl();

    for (let attempt = 0; attempt < PROBE_ATTEMPTS; attempt += 1) {
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);

        try {
            // Any HTTP response means the backend edge is reachable.
            await fetch(url, {
                method: "GET",
                credentials: "include",
                signal: controller.signal,
            });
            return true;
        } catch {
            if (attempt < PROBE_ATTEMPTS - 1) {
                await sleep(1000 * 2 ** attempt);
            }
        } finally {
            window.clearTimeout(timeout);
        }
    }

    return false;
};

interface BackendHealthState {
    backendUnavailable: boolean;
    checkingBackend: boolean;
    lastErrorMessage: string | null;
    lastOutageAt: number | null;
    recheckIntervalMs: number;
    markBackendHealthy: () => void;
    confirmBackendUnavailable: (message?: string) => Promise<boolean>;
    manualRecheck: () => Promise<boolean>;
}

const useBackendHealthStore = create<BackendHealthState>((set, get) => ({
    backendUnavailable: false,
    checkingBackend: false,
    lastErrorMessage: null,
    lastOutageAt: null,
    recheckIntervalMs: DEFAULT_RECHECK_INTERVAL_MS,

    markBackendHealthy: () => {
        if (!get().backendUnavailable && !get().lastErrorMessage) return;
        set({
            backendUnavailable: false,
            checkingBackend: false,
            lastErrorMessage: null,
            lastOutageAt: null,
        });
    },

    confirmBackendUnavailable: async (message) => {
        if (get().checkingBackend) return get().backendUnavailable;

        set({ checkingBackend: true });
        const reachable = await probeBackend();

        if (reachable) {
            set({
                backendUnavailable: false,
                checkingBackend: false,
                lastErrorMessage: null,
                lastOutageAt: null,
            });
            return false;
        }

        set({
            backendUnavailable: true,
            checkingBackend: false,
            lastErrorMessage: message ?? null,
            lastOutageAt: Date.now(),
        });
        return true;
    },

    manualRecheck: async () => {
        set({ checkingBackend: true });
        const reachable = await probeBackend();
        if (reachable) {
            set({
                backendUnavailable: false,
                checkingBackend: false,
                lastErrorMessage: null,
                lastOutageAt: null,
            });
            return true;
        }
        set({
            backendUnavailable: true,
            checkingBackend: false,
            lastOutageAt: Date.now(),
        });
        return false;
    },
}));

export default useBackendHealthStore;
