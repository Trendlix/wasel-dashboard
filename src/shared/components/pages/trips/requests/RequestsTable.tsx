import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Download, RotateCcw, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TablePagination from "../../../common/TablePagination";
import NoDataFound from "../../../common/NoDataFound";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formInputWrapperClass } from "../../../common/formStyles";
import useTruckRequestsStore, { type IAppTruckRequest } from "@/shared/hooks/store/useTruckRequestsStore";
import {
  requestStatusStyles,
  type TRequestListTab,
  type TRequestStatus,
} from "@/shared/core/pages/requests";
import { formatAppDateShort } from "@/lib/formatLocaleDate";
import RequestDetailsModal from "./RequestDetailsModal";
import RequestsExportModal from "./RequestsExportModal";

const SkeletonRow = () => (
  <TableRow className="border-b border-main-whiteMarble animate-pulse">
    {Array.from({ length: 8 }).map((_, idx) => (
      <TableCell key={idx} className="py-6 px-6">
        <div className="h-4 rounded bg-main-whiteMarble" />
      </TableCell>
    ))}
  </TableRow>
);

interface RequestsTableProps {
  statusTab: TRequestListTab;
}

const RequestsTable = ({ statusTab }: RequestsTableProps) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(["trips", "common"]);
  const { requests, meta, loading, exporting, setQuery, setPage, exportRequests } = useTruckRequestsStore();
  const [searchInput, setSearchInput] = useState("");
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportDateFrom, setExportDateFrom] = useState("");
  const [exportDateTo, setExportDateTo] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<IAppTruckRequest | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const apiStatus = statusTab === "all" ? undefined : (statusTab as TRequestStatus);

  const buildListQuery = () => ({
    status: apiStatus,
    search: searchInput.trim() || undefined,
  });

  useEffect(() => {
    setQuery(buildListQuery());
  }, [statusTab]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(buildListQuery());
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, statusTab]);

  const handleReset = () => {
    setSearchInput("");
    setExportDateFrom("");
    setExportDateTo("");
    setQuery({ status: apiStatus, search: undefined, page: 1 });
  };

  const exportActiveFilters = useMemo(() => {
    const search = searchInput.trim();
    if (statusTab === "all") {
      return {
        statusLabel: t("trips:requestTabs.all"),
        search: search || undefined,
      };
    }
    return {
      statusLabel: t(`trips:requestStatuses.${statusTab}`),
      search: search || undefined,
    };
  }, [statusTab, searchInput, t]);

  const handleExportConfirm = async (payload: { date_from?: string; date_to?: string }) => {
    setExportDateFrom(payload.date_from || "");
    setExportDateTo(payload.date_to || "");
    await exportRequests({
      ...payload,
      status: apiStatus,
      search: searchInput.trim() || undefined,
    });
  };

  const currentPage = meta?.current_page ?? 1;
  const totalPages = meta?.total_pages ?? 1;
  const showPagination = !loading && requests.length > 0 && totalPages > 1;

  return (
    <>
      <div className="space-y-6">
        <div className="bg-main-white border border-main-whiteMarble common-rounded p-6 flex items-center gap-4 flex-wrap">
          <div
            className={clsx("flex items-center gap-2 flex-1 cursor-text min-w-[240px]", formInputWrapperClass)}
            onClick={() => inputRef.current?.focus()}
          >
            <Search className="text-main-trueBlack/50 shrink-0" size={16} />
            <Input
              type="search"
              ref={inputRef}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t("trips:requestsSearchPlaceholder")}
              className="border-0 shadow-none h-full p-0 placeholder:text-main-trueBlack/50 focus-visible:ring-0 bg-transparent"
            />
          </div>

          <Button
            className="h-11 px-6 bg-main-primary text-main-white shrink-0 font-bold"
            onClick={() => setExportModalOpen(true)}
            disabled={exporting}
          >
            <Download size={16} />
            <span>{exporting ? t("common:exporting") : t("common:export")}</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-11 px-5 border-main-whiteMarble text-main-hydrocarbon shrink-0 font-semibold"
            onClick={handleReset}
            aria-label={t("common:resetFilters")}
          >
            <RotateCcw size={16} />
          </Button>
        </div>

        <div className="bg-main-white border border-main-whiteMarble common-rounded overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="min-w-[1200px]">
              <TableHeader>
                <TableRow className="bg-main-luxuryWhite border-b border-main-whiteMarble hover:bg-main-luxuryWhite">
                  <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">{t("trips:requestsTable.requestNumber")}</TableHead>
                  <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">{t("trips:requestsTable.user")}</TableHead>
                  <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">{t("trips:requestsTable.route")}</TableHead>
                  <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">{t("trips:requestsTable.price")}</TableHead>
                  <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">{t("trips:requestsTable.offers")}</TableHead>
                  <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">{t("trips:requestsTable.expires")}</TableHead>
                  <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">{t("trips:requestsTable.status")}</TableHead>
                  <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6 text-end">{t("trips:requestsTable.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 10 }).map((_, i) => <SkeletonRow key={i} />)
                ) : requests.length > 0 ? (
                  requests.map((req) => (
                    <TableRow
                      key={req.id}
                      className="border-b border-main-whiteMarble hover:bg-main-luxuryWhite/50 transition-colors"
                    >
                      <TableCell className="py-4 px-6 text-main-primary font-bold text-sm">{req.request_number}</TableCell>
                      <TableCell className="py-4 px-6 text-main-hydrocarbon text-sm">{req.user_name}</TableCell>
                      <TableCell className="py-4 px-6">
                        <div className="text-sm space-y-1">
                          <div className="flex items-center gap-2 text-main-hydrocarbon">
                            <span className="w-2 h-2 rounded-full bg-main-vividMint shrink-0" />
                            {req.pickup_location}
                          </div>
                          <div className="flex items-center gap-2 text-main-hydrocarbon">
                            <span className="w-2 h-2 rounded-full bg-main-remove shrink-0" />
                            {req.dropoff_location ?? "—"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6 text-main-hydrocarbon text-sm">
                        {req.currency} {(req.final_price ?? req.offered_price_by_user).toLocaleString(i18n.language?.startsWith("ar") ? "ar-SA" : "en-US")}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-main-hydrocarbon text-sm">{req.offers_count}</TableCell>
                      <TableCell className="py-4 px-6 text-main-sharkGray text-sm whitespace-nowrap">
                        {formatAppDateShort(req.expires_at, i18n.language, "—")}
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <span
                          className={clsx(
                            "px-3 py-1 rounded-full text-xs font-medium",
                            requestStatusStyles[req.status].bg,
                            requestStatusStyles[req.status].text,
                          )}
                        >
                          {t(`trips:requestStatuses.${req.status}`)}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 px-6 text-end">
                        <div className="flex flex-col items-end gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setSelected(req);
                              setModalOpen(true);
                            }}
                            className="text-main-primary font-semibold text-sm hover:underline"
                          >
                            {t("trips:viewDetails")}
                          </button>
                          <button
                            type="button"
                            onClick={() => navigate(`/trips/requests/view/${req.id}`)}
                            className="text-main-sharkGray font-semibold text-xs hover:text-main-primary hover:underline"
                          >
                            {t("trips:fullView")}
                          </button>
                          {req.trip_id ? (
                            <button
                              type="button"
                              onClick={() => navigate(`/trips/view/${req.trip_id}`)}
                              className="text-main-vividMint font-semibold text-xs hover:underline"
                            >
                              {t("trips:viewTrip")}
                            </button>
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="p-2">
                      <NoDataFound title={t("trips:requestsEmptyTitle")} description={t("trips:requestsEmptyDescription")} />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {showPagination && (
            <TablePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
          )}
        </div>
      </div>

      <RequestsExportModal
        open={exportModalOpen}
        loading={exporting}
        initialDateFrom={exportDateFrom}
        initialDateTo={exportDateTo}
        activeFilters={exportActiveFilters}
        onOpenChange={setExportModalOpen}
        onConfirm={handleExportConfirm}
      />

      <RequestDetailsModal open={modalOpen} request={selected} onOpenChange={setModalOpen} />
    </>
  );
};

export default RequestsTable;
