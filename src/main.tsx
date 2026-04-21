import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { router } from "./app/router";
import "./index.css";
import { i18nInitPromise } from "./i18n";
import useLanguageStore from "./shared/hooks/store/useLanguageStore";
import useBackendHealthStore from "./shared/hooks/store/useBackendHealthStore";
import BackendUnavailablePage from "./shared/components/common/BackendUnavailablePage";

const RootChrome = () => {
    const isRTL = useLanguageStore((s) => s.isRTL);
    const backendUnavailable = useBackendHealthStore((s) => s.backendUnavailable);
    return (
        <>
            {backendUnavailable ? <BackendUnavailablePage /> : <RouterProvider router={router} />}
            <Toaster
                position={isRTL ? "top-left" : "top-right"}
                gutter={12}
                containerStyle={isRTL ? { top: 20, left: 20 } : { top: 20, right: 20 }}
                toastOptions={{
                    duration: 4200,
                    style: {
                        fontFamily: "inherit",
                    },
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
