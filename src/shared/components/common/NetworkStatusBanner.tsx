import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { WifiOff } from "lucide-react";

const NetworkStatusBanner = () => {
    const { t } = useTranslation("layout");
    const [online, setOnline] = useState(() => (typeof navigator !== "undefined" ? navigator.onLine : true));

    useEffect(() => {
        const onOnline = () => setOnline(true);
        const onOffline = () => setOnline(false);
        window.addEventListener("online", onOnline);
        window.addEventListener("offline", onOffline);
        return () => {
            window.removeEventListener("online", onOnline);
            window.removeEventListener("offline", onOffline);
        };
    }, []);

    if (online) return null;

    return (
        <div
            role="status"
            className="flex items-center gap-2 rounded-xl border border-amber-300/80 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-950 shadow-sm"
        >
            <WifiOff className="h-4 w-4 shrink-0" aria-hidden />
            <span>{t("offlineBanner")}</span>
        </div>
    );
};

export default NetworkStatusBanner;
