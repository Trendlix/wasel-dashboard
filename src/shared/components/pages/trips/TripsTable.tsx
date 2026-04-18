import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { Download, RotateCcw, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TablePagination from "../../common/TablePagination";
import NoDataFound from "../../common/NoDataFound";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formInputWrapperClass } from "../../common/formStyles";
import StatusSelect from "../../common/StatusSelect";
import useTripsStore, { type IAppTrip } from "@/shared/hooks/store/useTripsStore";
import { tripStatusStyles, type TTripStatus } from "@/shared/core/pages/trips";
import TripsExportModal from "./TripsExportModal";
import TripDetailsModal from "./TripDetailsModal";

const STATUS_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "scheduled", label: "Scheduled" },
  { value: "on_the_way", label: "On the way" },
  { value: "arrived", label: "Arrived" },
  { value: "picked_up", label: "Picked up" },
  { value: "delivered", label: "Delivered" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const SkeletonRow = () => (
  <TableRow className="border-b border-main-whiteMarble animate-pulse">
    {Array.from({ length: 7 }).map((_, idx) => (
      <TableCell key={idx} className="py-6 px-6">
        <div className="h-4 rounded bg-main-whiteMarble" />
      </TableCell>
    ))}
  </TableRow>
);

const TripsTable = () => {
  const { trips, meta, loading, exporting, fetchTrips, setQuery, setPage, resetQuery, exportTrips } = useTripsStore();
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [tripDetailsOpen, setTripDetailsOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<IAppTrip | null>(null);
  const [exportDateFrom, setExportDateFrom] = useState("");
  const [exportDateTo, setExportDateTo] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchTrips();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery({ search: searchInput.trim() || undefined });
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setQuery({ status: value === "all" ? undefined : (value as TTripStatus) });
  };

  const handleExportConfirm = async (payload: { date_from?: string; date_to?: string }) => {
    setExportDateFrom(payload.date_from || "");
    setExportDateTo(payload.date_to || "");
    await exportTrips(payload);
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setStatusFilter("all");
    setExportDateFrom("");
    setExportDateTo("");
    resetQuery();
  };

  const handleViewDetails = (trip: IAppTrip) => {
    setSelectedTrip(trip);
    setTripDetailsOpen(true);
  };

  const handleTripDetailsOpenChange = (value: boolean) => {
    setTripDetailsOpen(value);
    if (value === false) {
      setSelectedTrip(null);
    }
  };

  const currentPage = meta?.current_page ?? 1;
  const totalPages = meta?.total_pages ?? 1;
  const showPagination = loading === false && trips.length > 0 && totalPages > 1;

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
              placeholder="Search trips..."
              className="border-0 shadow-none h-full p-0 placeholder:text-main-trueBlack/50 focus-visible:ring-0 bg-transparent"
            />
          </div>

          <StatusSelect
            value={statusFilter}
            onChange={handleStatusFilter}
            options={STATUS_FILTER_OPTIONS}
            statusStyles={tripStatusStyles}
            placeholder="All statuses"
          />

          <Button
            className="h-11 px-6 bg-main-primary text-main-white shrink-0 font-bold"
            onClick={() => setExportModalOpen(true)}
            disabled={exporting}
          >
            <Download size={16} />
            <span>{exporting ? "Exporting..." : "Export"}</span>
          </Button>

          <Button
            variant="outline"
            className="h-11 px-5 border-main-whiteMarble text-main-hydrocarbon shrink-0 font-semibold"
            onClick={handleResetFilters}
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </Button>
        </div>

        <div className="bg-main-white border border-main-whiteMarble common-rounded overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="min-w-[1120px]">
              <TableHeader>
                <TableRow className="bg-main-luxuryWhite border-b border-main-whiteMarble hover:bg-main-luxuryWhite">
                  <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">Booking Number</TableHead>
                  <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">User</TableHead>
                  <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">Driver</TableHead>
                  <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">Route</TableHead>
                  <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">Price</TableHead>
                  <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">Status</TableHead>
                  <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 10 }).map((_, i) => <SkeletonRow key={i} />)
                ) : trips.length > 0 ? (
                  trips.map((trip) => (
                    <TripRow
                      key={trip.id}
                      trip={trip}
                      onViewDetails={handleViewDetails}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="p-2">
                      <NoDataFound
                        title="No trips found"
                        description="Try adjusting your search or filters."
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

      <TripsExportModal
        open={exportModalOpen}
        loading={exporting}
        initialDateFrom={exportDateFrom}
        initialDateTo={exportDateTo}
        onOpenChange={setExportModalOpen}
        onConfirm={handleExportConfirm}
      />

      <TripDetailsModal
        open={tripDetailsOpen}
        trip={selectedTrip}
        onOpenChange={handleTripDetailsOpenChange}
      />
    </>
  );
};

const TripRow = ({
  trip,
  onViewDetails,
}: {
  trip: IAppTrip;
  onViewDetails: (trip: IAppTrip) => void;
}) => {
  const price = Number(trip.final_price || 0);
  const waselShare = Math.round(price * 0.05);
  const driverShare = Math.max(0, price - waselShare);
  const currency = trip.currency || "EGP";

  return (
    <TableRow className="border-b border-main-whiteMarble hover:bg-main-luxuryWhite/50 transition-colors">
      <TableCell className="py-4 px-6 text-main-primary font-bold text-sm">{trip.booking_number}</TableCell>
      <TableCell className="py-4 px-6 text-main-hydrocarbon text-sm">{trip.user_name}</TableCell>
      <TableCell className="py-4 px-6 text-main-hydrocarbon text-sm">{trip.driver_name ?? "—"}</TableCell>
      <TableCell className="py-4 px-6">
        <div className="text-sm space-y-1">
          <div className="flex items-center gap-2 text-main-hydrocarbon">
            <span className="w-2 h-2 rounded-full bg-main-vividMint shrink-0" />
            {trip.pickup_location}
          </div>
          <div className="flex items-center gap-2 text-main-hydrocarbon">
            <span className="w-2 h-2 rounded-full bg-main-remove shrink-0" />
            {trip.dropoff_location ?? "—"}
          </div>
        </div>
      </TableCell>
      <TableCell className="py-4 px-6">
        <div className="space-y-0.5">
          <p className="text-main-vividMint font-semibold text-sm">Total: {currency} {price.toLocaleString()}</p>
          <p className="text-main-primary font-semibold text-xs">Wasel % ({currency} {waselShare.toLocaleString()})</p>
          <p className="text-main-mustardGold font-semibold text-xs">Driver % ({currency} {driverShare.toLocaleString()})</p>
        </div>
      </TableCell>
      <TableCell className="py-4 px-6"><StatusBadge status={trip.status} /></TableCell>
      <TableCell className="py-4 px-6 text-right">
        <button
          onClick={() => onViewDetails(trip)}
          className="text-main-primary font-semibold text-sm hover:underline"
        >
          View Details
        </button>
      </TableCell>
    </TableRow>
  );
};

const StatusBadge = ({ status }: { status: TTripStatus }) => {
  const style = tripStatusStyles[status];
  return (
    <span className={clsx("px-3 py-1 rounded-full text-xs font-medium", style.bg, style.text)}>
      {style.label}
    </span>
  );
};

export default TripsTable;
