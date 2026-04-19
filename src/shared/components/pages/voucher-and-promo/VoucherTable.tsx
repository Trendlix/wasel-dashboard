import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Download, Pencil, Plus, RotateCcw, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import NoDataFound from "@/shared/components/common/NoDataFound";
import StatusSelect from "@/shared/components/common/StatusSelect";
import TablePagination from "@/shared/components/common/TablePagination";
import { formInputWrapperClass } from "@/shared/components/common/formStyles";
import {
  voucherStatusStyles,
} from "@/shared/core/pages/voucherAndPromo";
import useVoucherStore, {
  type IVoucher,
  type TVoucherStatus,
} from "@/shared/hooks/store/useVoucherStore";
import VoucherDeleteModal from "./modals/VoucherDeleteModal";
import VoucherExportModal from "./modals/VoucherExportModal";
import VoucherFormModal from "./modals/VoucherFormModal";
import { formatAppDateShort } from "@/lib/formatLocaleDate";

const SkeletonRow = () => (
  <TableRow className="border-b border-main-whiteMarble animate-pulse">
    {Array.from({ length: 7 }).map((_, idx) => (
      <TableCell key={idx} className="py-6 px-6">
        <div className="h-4 rounded bg-main-whiteMarble" />
      </TableCell>
    ))}
  </TableRow>
);

const VoucherTable = () => {
  const { t, i18n } = useTranslation(["voucher", "common"]);
  const {
    vouchers,
    meta,
    loading,
    submitting,
    exporting,
    fetchVouchers,
    fetchVouchersAnalytics,
    setQuery,
    setPage,
    resetQuery,
    updateVoucherStatus,
    deleteVoucher,
    exportVouchers,
  } = useVoucherStore();

  const statusFilterOptions: { value: string; label: string }[] = [
    { value: "all", label: t("voucher:filters.allStatuses") },
    { value: "active", label: t("voucher:filters.active") },
    { value: "inactive", label: t("voucher:filters.inactive") },
    { value: "suspended", label: t("voucher:filters.suspended") },
    { value: "expired", label: t("voucher:filters.expired") },
  ];

  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<IVoucher | null>(null);
  const [exportDateFrom, setExportDateFrom] = useState("");
  const [exportDateTo, setExportDateTo] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery({ search: searchInput.trim() || undefined });
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput, setQuery]);

  const refreshAll = async () => {
    await fetchVouchers();
    await fetchVouchersAnalytics();
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setQuery({ status: value === "all" ? undefined : (value as TVoucherStatus) });
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setStatusFilter("all");
    setExportDateFrom("");
    setExportDateTo("");
    resetQuery();
  };

  const handleToggleStatus = async (voucher: IVoucher) => {
    const nextStatus: TVoucherStatus = voucher.status === "active" ? "inactive" : "active";
    await updateVoucherStatus(voucher.id, nextStatus);
    await refreshAll();
  };

  const handleDelete = async () => {
    if (!selectedVoucher) return;
    await deleteVoucher(selectedVoucher.id);
    setSelectedVoucher(null);
    await refreshAll();
  };

  const handleSaved = async () => {
    setSelectedVoucher(null);
    await refreshAll();
  };

  const handleExportConfirm = async (payload: { date_from?: string; date_to?: string }) => {
    setExportDateFrom(payload.date_from || "");
    setExportDateTo(payload.date_to || "");
    await exportVouchers(payload);
  };

  const formatDiscount = (voucher: IVoucher) => {
    if (voucher.discount_type === "percentage") return `${voucher.discount_value}%`;
    return `${voucher.discount_value} ${t("voucher:currencyEgp")}`;
  };

  const currentPage = meta?.current_page ?? 1;
  const totalPages = meta?.total_pages ?? 1;
  const showPagination = loading === false && vouchers.length > 0 && totalPages > 1;

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
              placeholder={t("voucher:searchPlaceholder")}
              className="border-0 shadow-none h-full p-0 placeholder:text-main-trueBlack/50 focus-visible:ring-0 bg-transparent"
            />
          </div>

          <StatusSelect
            value={statusFilter}
            onChange={handleStatusFilter}
            options={statusFilterOptions}
            statusStyles={voucherStatusStyles}
            placeholder={t("voucher:filters.allStatuses")}
          />

          <Button
            className="h-11 px-5 bg-main-primary text-main-white shrink-0"
            onClick={() => {
              setSelectedVoucher(null);
              setFormOpen(true);
            }}
          >
            <Plus size={16} />
            <span>{t("voucher:addVoucher")}</span>
          </Button>

          <Button
            className="h-11 px-6 bg-main-primary text-main-white shrink-0"
            onClick={() => setExportOpen(true)}
            disabled={exporting}
          >
            <Download size={16} />
            <span>{exporting ? t("common:exporting") : t("common:export")}</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-11 px-5 border-main-whiteMarble text-main-hydrocarbon shrink-0"
            onClick={handleResetFilters}
            aria-label={t("common:resetFilters")}
          >
            <RotateCcw size={16} />
          </Button>
        </div>

        <div className="bg-main-white border border-main-whiteMarble common-rounded overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="min-w-[1080px]">
              <TableHeader>
                <TableRow className="bg-main-luxuryWhite border-b border-main-whiteMarble hover:bg-main-luxuryWhite">
                  <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">{t("voucher:table.code")}</TableHead>
                  <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">{t("voucher:table.description")}</TableHead>
                  <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">{t("voucher:table.discount")}</TableHead>
                  <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">{t("voucher:table.usage")}</TableHead>
                  <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">{t("voucher:table.validTo")}</TableHead>
                  <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">{t("voucher:table.status")}</TableHead>
                  <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6 text-end">{t("voucher:table.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                ) : vouchers.length > 0 ? (
                  vouchers.map((voucher) => (
                    <VoucherDataRow
                      key={voucher.id}
                      voucher={voucher}
                      formatDiscount={formatDiscount}
                      validTo={formatAppDateShort(voucher.valid_to, i18n.language, "—")}
                      onEdit={() => {
                        setSelectedVoucher(voucher);
                        setFormOpen(true);
                      }}
                      onToggle={() => handleToggleStatus(voucher)}
                      onDelete={() => {
                        setSelectedVoucher(voucher);
                        setDeleteOpen(true);
                      }}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="p-2">
                      <NoDataFound
                        title={t("voucher:emptyTitle")}
                        description={t("voucher:emptyDescription")}
                      />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {showPagination && (
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>

      <VoucherFormModal
        open={formOpen}
        voucher={selectedVoucher}
        onOpenChange={setFormOpen}
        onSaved={handleSaved}
      />

      <VoucherDeleteModal
        open={deleteOpen}
        voucher={selectedVoucher}
        loading={submitting}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
      />

      <VoucherExportModal
        open={exportOpen}
        loading={exporting}
        initialDateFrom={exportDateFrom}
        initialDateTo={exportDateTo}
        onOpenChange={setExportOpen}
        onConfirm={handleExportConfirm}
      />
    </>
  );
};

const VoucherDataRow = ({
  voucher,
  formatDiscount,
  validTo,
  onEdit,
  onToggle,
  onDelete,
}: {
  voucher: IVoucher;
  formatDiscount: (v: IVoucher) => string;
  validTo: string;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
}) => {
  const { t } = useTranslation("voucher");
  const style = voucherStatusStyles[voucher.status];
  return (
    <TableRow
      className="border-b border-main-whiteMarble hover:bg-main-luxuryWhite/50 transition-colors"
    >
      <TableCell className="py-4 px-6 text-main-primary font-bold text-sm">{voucher.code}</TableCell>
      <TableCell className="py-4 px-6 text-main-hydrocarbon text-sm">
        {voucher.description || "—"}
      </TableCell>
      <TableCell className="py-4 px-6 text-main-hydrocarbon font-semibold text-sm">
        {formatDiscount(voucher)}
      </TableCell>
      <TableCell className="py-4 px-6 text-main-sharkGray text-sm">
        {voucher.total_used}/{voucher.usage_limit ?? "∞"}
      </TableCell>
      <TableCell className="py-4 px-6 text-main-sharkGray text-sm">{validTo}</TableCell>
      <TableCell className="py-4 px-6">
        <span
          className={clsx(
            "px-3 py-1 rounded-full text-xs font-medium",
            style.bg,
            style.text,
          )}
        >
          {t(`statuses.${voucher.status}`)}
        </span>
      </TableCell>
      <TableCell className="py-4 px-6 text-end">
        <div className="inline-flex items-center gap-3">
          <button
            type="button"
            onClick={onEdit}
            className="text-main-primary hover:opacity-70 transition-opacity"
          >
            <Pencil className="w-4 h-4" />
          </button>

          {voucher.status === "expired" ? null : (
            <button
              type="button"
              onClick={onToggle}
              className={clsx(
                "font-semibold text-sm hover:underline",
                voucher.status === "active" ? "text-main-primary" : "text-main-vividMint",
              )}
            >
              {voucher.status === "active" ? t("voucher:disable") : t("voucher:enable")}
            </button>
          )}

          <button
            type="button"
            onClick={onDelete}
            className="text-main-remove hover:opacity-70 transition-opacity"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default VoucherTable;
