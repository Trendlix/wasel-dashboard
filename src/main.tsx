import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { router } from "./app/router";
import "./index.css";
import { i18nInitPromise } from "./i18n";
import useLanguageStore from "./shared/hooks/store/useLanguageStore";
import useBackendHealthStore from "./shared/hooks/store/useBackendHealthStore";
import BackendUnavailablePage from "./shared/components/common/BackendUnavailablePage";
import FcmTopBanner from "./shared/components/common/FcmTopBanner";
import { fcmEventBus } from "./shared/core/notifications/fcm/fcm-event-bus";
import useFcmTopBannerStore from "./shared/hooks/store/useFcmTopBannerStore";

const FcmTopBannerBridge = () => {
    const show = useFcmTopBannerStore((s) => s.show);

    React.useEffect(() => {
        const unsub = fcmEventBus.subscribe(undefined, (payload) => {
            show(payload);
        });
        return () => unsub();
    }, [show]);

    return <FcmTopBanner />;
};

const RootChrome = () => {
    const isRTL = useLanguageStore((s) => s.isRTL);
    const backendUnavailable = useBackendHealthStore((s) => s.backendUnavailable);
    return (
        <>
            {backendUnavailable ? <BackendUnavailablePage /> : <RouterProvider router={router} />}
            <FcmTopBannerBridge />
            <Toaster
                position={isRTL ? "top-left" : "top-right"}
                visibleToasts={4}
                gap={12}
                dir={isRTL ? "rtl" : "ltr"}
                offset={20}
                closeButton={false}
                toastOptions={{
                    unstyled: true,
                    className: "wasel-toast-shell",
                    duration: 4200,
                }}
            />
        </>
    );
};

void i18nInitPromise.then(() => {
    useLanguageStore.getState().init();
    ReactDOM.createRoot(document.getElementById("root")!).render(
        <React.StrictMode>
            <RootChrome />
        </React.StrictMode>,
    );
});
