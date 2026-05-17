import clsx from "clsx";
import { useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ClipboardList, MapPin } from "lucide-react";
import PageHeader from "@/shared/components/common/PageHeader";
import PageTransition from "@/shared/components/common/PageTransition";
import TripsAnalytics from "@/shared/components/pages/trips/Analytics";
import RequestsAnalytics from "@/shared/components/pages/trips/requests/RequestsAnalytics";
import {
  REQUEST_LIST_TABS,
  REQUEST_LIST_TAB_ICONS,
  requestListTabStyles,
} from "@/shared/core/pages/requests";
import { TRIP_LIST_TABS, TRIP_STATUS_TAB_ICONS, tripListTabStyles } from "@/shared/core/pages/trips";
import useTruckRequestsStore from "@/shared/hooks/store/useTruckRequestsStore";
import useTripsStore from "@/shared/hooks/store/useTripsStore";

const parentTabs = [
  { key: "requests" as const, to: "/trips/requests/all", icon: ClipboardList },
  { key: "trips" as const, to: "/trips/all", icon: MapPin },
];

const TripsLayout = () => {
  const { t } = useTranslation("trips");
  const location = useLocation();
  const isRequests = location.pathname.includes("/trips/requests");
  const isViewPage =
    location.pathname.includes("/trips/view/") ||
    location.pathname.includes("/trips/requests/view/");

  const { fetchRequestsAnalytics } = useTruckRequestsStore();
  const { fetchTripsAnalytics } = useTripsStore();

  useEffect(() => {
    if (isViewPage) return;
    if (isRequests) {
      fetchRequestsAnalytics();
    } else {
      fetchTripsAnalytics();
    }
  }, [isRequests, isViewPage, fetchRequestsAnalytics, fetchTripsAnalytics]);

  if (isViewPage) {
    return (
      <PageTransition>
        <Outlet />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <PageHeader title={t("pageTitle")} description={t("pageDescription")} />
      {isRequests ? <RequestsAnalytics /> : <TripsAnalytics />}

      <div className="space-y-4">
        <div className="rounded-2xl border border-main-whiteMarble bg-main-white p-2 shadow-[0_12px_30px_rgba(17,24,39,0.04)]">
          <div className="flex items-center gap-2">
            {parentTabs.map((tab) => (
              <NavLink
                key={tab.key}
                to={tab.to}
                className={() =>
                  clsx(
                    "group inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all",
                    (tab.key === "requests" && isRequests) || (tab.key === "trips" && !isRequests)
                      ? "bg-main-primary text-main-white shadow-[0_8px_18px_rgba(0,0,0,0.12)]"
                      : "bg-main-titaniumWhite text-main-sharkGray hover:bg-main-whiteMarble/70 hover:text-main-primary",
                  )
                }
              >
                <tab.icon size={16} className="opacity-90 group-hover:opacity-100" />
                {t(`parentTabs.${tab.key}`)}
              </NavLink>
            ))}
          </div>
        </div>

        {isRequests ? (
          <div className="rounded-2xl border border-main-whiteMarble bg-main-white p-2 shadow-[0_12px_30px_rgba(17,24,39,0.04)]">
            <div className="flex flex-wrap items-center gap-2">
              {REQUEST_LIST_TABS.map((status) => {
                const StatusIcon = REQUEST_LIST_TAB_ICONS[status];
                const tabStyles = requestListTabStyles[status];
                return (
                  <NavLink
                    key={status}
                    to={status === "all" ? "/trips/requests/all" : `/trips/requests/${status}`}
                    className={({ isActive }) =>
                      clsx(
                        "group inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all",
                        isActive ? tabStyles.active : tabStyles.inactive,
                      )
                    }
                  >
                    <StatusIcon size={16} className="opacity-90 group-hover:opacity-100" />
                    {status === "all" ? t("requestTabs.all") : t(`requestStatuses.${status}`)}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-main-whiteMarble bg-main-white p-2 shadow-[0_12px_30px_rgba(17,24,39,0.04)]">
            <div className="flex flex-wrap items-center gap-2">
              {TRIP_LIST_TABS.map((status) => {
                const StatusIcon = TRIP_STATUS_TAB_ICONS[status];
                const tabStyles = tripListTabStyles[status];
                return (
                  <NavLink
                    key={status}
                    to={status === "all" ? "/trips/all" : `/trips/${status}`}
                    className={({ isActive }) =>
                      clsx(
                        "group inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all",
                        isActive ? tabStyles.active : tabStyles.inactive,
                      )
                    }
                  >
                    <StatusIcon size={16} className="opacity-90 group-hover:opacity-100" />
                    {status === "all"
                      ? t("tripTabs.all")
                      : status === "urgent"
                        ? t("tripTabs.urgent")
                        : t(`statuses.${status}`)}
                  </NavLink>
                );
              })}
            </div>
          </div>
        )}

        <Outlet />
      </div>
    </PageTransition>
  );
};

export default TripsLayout;
