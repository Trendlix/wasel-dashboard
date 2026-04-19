import { useEffect, useRef } from "react";
import { NavLink, Navigate, Outlet } from "react-router-dom";
import clsx from "clsx";
import { LayoutPanelTop, FileStack } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { CmsMarketingLegalState } from "@/shared/hooks/store/createCmsMarketingLegalStore";

interface UseMarketingLegalStore {
    (): CmsMarketingLegalState;
}

interface MarketingLegalLayoutSharedProps {
    useStore: UseMarketingLegalStore;
    variant: "terms" | "privacy";
    heroPath: string;
    faqsPath: string;
}

const MarketingLegalLoadingSkeleton = () => (
    <div className="space-y-4">
        <div className="animate-pulse rounded-2xl border border-main-whiteMarble bg-main-white p-5">
            <div className="h-4 w-36 rounded bg-main-titaniumWhite" />
            <div className="mt-3 h-8 w-56 rounded bg-main-titaniumWhite" />
            <div className="mt-3 h-4 w-full max-w-[680px] rounded bg-main-titaniumWhite" />
            <div className="mt-2 h-4 w-full max-w-[520px] rounded bg-main-titaniumWhite" />
        </div>
        <div className="animate-pulse rounded-2xl border border-main-whiteMarble bg-main-white p-5">
            <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-3 rounded-xl border border-main-whiteMarble bg-main-titaniumWhite/35 p-4">
                    <div className="h-4 w-44 rounded bg-main-titaniumWhite" />
                    <div className="h-10 w-full rounded bg-main-titaniumWhite" />
                    <div className="h-10 w-full rounded bg-main-titaniumWhite" />
                    <div className="h-24 w-full rounded bg-main-titaniumWhite" />
                </div>
                <div className="space-y-3 rounded-xl border border-main-whiteMarble bg-main-titaniumWhite/35 p-4">
                    <div className="h-4 w-44 rounded bg-main-titaniumWhite" />
                    <div className="h-10 w-full rounded bg-main-titaniumWhite" />
                    <div className="h-10 w-full rounded bg-main-titaniumWhite" />
                    <div className="h-24 w-full rounded bg-main-titaniumWhite" />
                </div>
            </div>
        </div>
    </div>
);

const MarketingLegalLayoutShared = ({
    useStore,
    variant,
    heroPath,
    faqsPath,
}: MarketingLegalLayoutSharedProps) => {
    const { t } = useTranslation("cms");
    const { draft, loading, error, clearError, fetch, addGroup } = useStore();
    const initialEmptyHandled = useRef(false);

    useEffect(() => {
        void fetch();
    }, [fetch]);

    useEffect(() => {
        if (loading) {
            initialEmptyHandled.current = false;
            return;
        }
        if (
            !initialEmptyHandled.current &&
            draft.en.items.length === 0 &&
            draft.ar.items.length === 0
        ) {
            initialEmptyHandled.current = true;
            addGroup();
        }
    }, [loading, draft.en.items.length, draft.ar.items.length, addGroup]);

    return (
        <div className="space-y-5">
            <div className="rounded-2xl border border-main-whiteMarble bg-linear-to-r from-main-white to-main-titaniumWhite/70 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-main-lightSlate">
                    {t("legalMarketing.eyebrow")}
                </p>
                <h2 className="mt-1 text-xl font-bold text-main-mirage">
                    {t(`legalMarketing.${variant}.title`)}
                </h2>
                <p className="mt-1 text-sm text-main-coolGray">
                    {t(`legalMarketing.${variant}.description`)}
                </p>
            </div>

            <div className="rounded-2xl border border-main-whiteMarble bg-main-white p-2 shadow-[0_12px_30px_rgba(17,24,39,0.04)]">
                <div className="flex flex-wrap items-center gap-2">
                    <NavLink
                        to={heroPath}
                        className={({ isActive }) =>
                            clsx(
                                "group inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all",
                                isActive
                                    ? "bg-main-primary text-main-white shadow-[0_8px_18px_rgba(0,0,0,0.12)]"
                                    : "bg-main-titaniumWhite text-main-sharkGray hover:bg-main-whiteMarble/70 hover:text-main-primary",
                            )
                        }
                    >
                        <LayoutPanelTop size={16} className="opacity-90 group-hover:opacity-100" />
                        {t("legalMarketing.sharedTabs.hero")}
                    </NavLink>
                    <NavLink
                        to={faqsPath}
                        className={({ isActive }) =>
                            clsx(
                                "group inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all",
                                isActive
                                    ? "bg-main-primary text-main-white shadow-[0_8px_18px_rgba(0,0,0,0.12)]"
                                    : "bg-main-titaniumWhite text-main-sharkGray hover:bg-main-whiteMarble/70 hover:text-main-primary",
                            )
                        }
                    >
                        <FileStack size={16} className="opacity-90 group-hover:opacity-100" />
                        {t("legalMarketing.sharedTabs.content")}
                    </NavLink>
                </div>
            </div>

            {error ? (
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-main-remove/20 bg-main-remove/10 px-4 py-3 text-sm text-main-remove">
                    <span>{error}</span>
                    <button type="button" className="font-semibold underline" onClick={clearError}>
                        {t("legalMarketing.dismiss")}
                    </button>
                </div>
            ) : null}

            {loading ? <MarketingLegalLoadingSkeleton /> : <Outlet />}
        </div>
    );
};

export const MarketingLegalIndexRedirectShared = ({ to }: { to: string }) => (
    <Navigate to={to} replace />
);

export default MarketingLegalLayoutShared;
