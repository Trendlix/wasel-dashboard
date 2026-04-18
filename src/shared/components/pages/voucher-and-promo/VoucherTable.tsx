import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
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
  voucherStatusFilterOptions,
  voucherStatusStyles,
} from "@/shared/core/pages/voucherAndPromo";
import useVoucherStore, {
  type IVoucher,
  type TVoucherStatus,
} from "@/shared/hooks/store/useVoucherStore";
import VoucherDeleteModal from "./modals/VoucherDeleteModal";
import VoucherExportModal from "./modals/VoucherExportModal";
import VoucherFormModal from "./modals/VoucherFormModal";

const SkeletonRow = () => (
  <TableRow className="border-b border-main-whiteMarble animate-pulse">
    {Array.from({ length: 7 }).map((_, idx) => (
      <TableCell key={idx} className="py-6 px-6">
        <div className="h-4 rounded bg-main-whiteMarble" />
      </TableCell>
    ))}
  </TableRow>
);

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

const formatDiscount = (voucher: IVoucher) => {
  if (voucher.discount_type === "percentage") return `${voucher.discount_value}%`;
  return `${voucher.discount_value} EGP`;
};

const VoucherTable = () => {
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
              placeholder="Search vouchers by code or description..."
              className="border-0 shadow-none h-full p-0 placeholder:text-main-trueBlack/50 focus-visible:ring-0 bg-transparent"
            />
          </div>

          <StatusSelect
            value={statusFilter}
            onChange={handleStatusFilter}
            options={voucherStatusFilterOptions}
            statusStyles={voucherStatusStyles}
            placeholder="All statuses"
          />

          <Button
            className="h-11 px-5 bg-main-primary text-main-white shrink-0"
            onClick={() => {
              setSelectedVoucher(null);
              setFormOpen(true);
            }}
          >
            <Plus size={16} />
            <span>Add Voucher</span>
          </Button>

          <Button
            className="h-11 px-6 bg-main-primary text-main-white shrink-0"
            onClick={() => setExportOpen(true)}
            disabled={exporting}
          >
            <Download size={16} />
            <span>{exporting ? "Exporting..." : "Export"}</span>
          </Button>

          <Button
            variant="outline"
            className="h-11 px-5 border-main-whiteMarble text-main-hydrocarbon shrink-0"
            onClick={handleResetFilters}
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </Button>
        </div>

        <div className="bg-main-white border border-main-whiteMarble common-rounded overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="min-w-[1080px]">
              <TableHeader>
                <TableRow className="bg-main-luxuryWhite border-b border-main-whiteMarble hover:bg-main-luxuryWhite">
                  <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">Code</TableHead>
                  <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">Description</TableHead>
                  <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">Discount</TableHead>
                  <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">Usage</TableHead>
                  <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">Valid To</TableHead>
                  <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">Status</TableHead>
                  <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                ) : vouchers.length > 0 ? (
                  vouchers.map((voucher) => (
                    <TableRow
                      key={voucher.id}
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
                      <TableCell className="py-4 px-6 text-main-sharkGray text-sm">{formatDate(voucher.valid_to)}</TableCell>
                      <TableCell className="py-4 px-6">
                        <span
                          className={clsx(
                            "px-3 py-1 rounded-full text-xs font-medium",
                            voucherStatusStyles[voucher.status].bg,
                            voucherStatusStyles[voucher.status].text,
                          )}
                        >
                          {voucherStatusStyles[voucher.status].label}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-3">
                          <button
                            onClick={() => {
                              setSelectedVoucher(voucher);
                              setFormOpen(true);
                            }}
                            className="text-main-primary hover:opacity-70 transition-opacity"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          {voucher.status === "expired" ? null : (
                            <button
                              onClick={() => handleToggleStatus(voucher)}
                              className={clsx(
                                "font-semibold text-sm hover:underline",
                                voucher.status === "active" ? "text-main-primary" : "text-main-vividMint",
                              )}
                            >
                              {voucher.status === "active" ? "Disable" : "Enable"}
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setSelectedVoucher(voucher);
                              setDeleteOpen(true);
                            }}
                            className="text-main-remove hover:opacity-70 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="p-2">
                      <NoDataFound
                        title="No vouchers found"
                        description="Try adjusting search or status filter."
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

export default VoucherTable;
