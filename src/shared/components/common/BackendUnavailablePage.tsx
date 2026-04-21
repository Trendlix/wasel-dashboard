import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AlertTriangle, RefreshCw, WifiOff } from "lucide-react";
import useBackendHealthStore from "@/shared/hooks/store/useBackendHealthStore";
import { Button } from "@/components/ui/button";

const formatTime = (ts: number | null, locale: string) => {
    if (!ts) return "";
    return new Date(ts).toLocaleTimeString(locale === "ar" ? "ar-EG" : "en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });
};

const BackendUnavailablePage = () => {
    const { t, i18n } = useTranslation("common");
    const {
        checkingBackend,
        lastErrorMessage,
        lastOutageAt,
        manualRecheck,
        recheckIntervalMs,
    } = useBackendHealthStore();

    useEffect(() => {
        const id = window.setInterval(() => {
            if (!useBackendHealthStore.getState().checkingBackend) {
                void useBackendHealthStore.getState().manualRecheck();
            }
        }, recheckIntervalMs);

        return () => window.clearInterval(id);
    }, [recheckIntervalMs]);

    return (
        <div className="min-h-screen bg-main-luxuryWhite flex items-center justify-center p-6">
            <div className="w-full max-w-2xl bg-main-white border border-main-whiteMarble common-rounded shadow-xl p-10 text-center">
                <div className="mx-auto w-20 h-20 rounded-2xl bg-main-remove/10 ring-8 ring-main-remove/5 flex items-center justify-center mb-6">
                    <WifiOff className="w-10 h-10 text-main-remove" />
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-main-mirage mb-3">
                    {t("backendUnavailable.title")}
                </h1>
                <p className="text-main-sharkGray text-sm md:text-base mb-6">
                    {t("backendUnavailable.description")}
                </p>

                <div className="mx-auto max-w-xl rounded-xl border border-main-whiteMarble bg-main-luxuryWhite p-4 text-left mb-7">
                    <div className="flex items-start gap-2 text-main-sharkGray text-sm">
                        <AlertTriangle className="w-4 h-4 mt-0.5 text-main-mustardGold shrink-0" />
                        <div>
                            <p className="font-medium text-main-mirage">
                                {t("backendUnavailable.lastCheck")}
                            </p>
                            <p>
                                {lastOutageAt
                                    ? t("backendUnavailable.detectedAt", {
                                          time: formatTime(lastOutageAt, i18n.language),
                                      })
                                    : t("backendUnavailable.detectedNow")}
                            </p>
                            {lastErrorMessage && (
                                <p className="mt-1 text-xs text-main-sharkGray/90 wrap-break-word">
                                    {lastErrorMessage}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-3">
                    <Button
                        type="button"
                        onClick={() => void manualRecheck()}
                        disabled={checkingBackend}
                        className="h-11 px-6 bg-main-primary hover:bg-main-primary/90 text-main-white font-semibold"
                    >
                        <RefreshCw className={`w-4 h-4 ${checkingBackend ? "animate-spin" : ""}`} />
                        {checkingBackend
                            ? t("backendUnavailable.rechecking")
                            : t("backendUnavailable.tryAgain")}
                    </Button>
                </div>

                <p className="mt-4 text-xs text-main-sharkGray">
                    {t("backendUnavailable.autoRetryHint")}
                </p>
            </div>
        </div>
    );
};

export default BackendUnavailablePage;
