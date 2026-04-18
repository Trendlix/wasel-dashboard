import clsx from "clsx";
import { useEffect, useMemo } from "react";
import {
  CarFront,
  CreditCard,
  Navigation,
  Package,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommonModal,
  CommonModalBody,
  CommonModalFooter,
} from "@/shared/components/common/CommonModal";
import useTripsStore, { type IAppTrip } from "@/shared/hooks/store/useTripsStore";
import { tripStatusStyles } from "@/shared/core/pages/trips";

interface TripDetailsModalProps {
  open: boolean;
  trip: IAppTrip | null;
  onOpenChange: (value: boolean) => void;
}

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const initialsFromName = (name?: string | null) => {
  if (!name) return "-";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const TripDetailsModal = ({ open, trip, onOpenChange }: TripDetailsModalProps) => {
  const { tripDetails, tripDetailsLoading, updating, fetchTripDetails, clearTripDetails, updateStatus } = useTripsStore();

  useEffect(() => {
    if (open && trip) {
      fetchTripDetails(trip.id);
    }
    if (open === false) {
      clearTripDetails();
    }
  }, [open, trip?.id]);

  const displayStatus = tripDetails?.status ?? trip?.status;
  const statusStyle = displayStatus ? tripStatusStyles[displayStatus] : null;

  const canCancel = useMemo(() => {
    if (!displayStatus) return false;
    return displayStatus !== "cancelled" && displayStatus !== "completed";
  }, [displayStatus]);

  const handleCancelTrip = async () => {
    if (!trip) return;
    await updateStatus(trip.id, "cancelled");
  };

  if (!trip) return null;

  const pickupName = tripDetails?.request.pickup_location?.name ?? trip.pickup_location;
  const dropoffName = tripDetails?.request.dropoff_locations?.[0]?.name ?? trip.dropoff_location ?? "-";
  const distance = tripDetails?.request.distance_km;
  const duration = tripDetails?.request.duration_minutes;
  const totalPrice = Number(trip.final_price || 0);
  const commission = Math.round(totalPrice * 0.1);
  const bookingNo = tripDetails?.booking_number ?? trip.booking_number;
  const headerDate = formatDate(trip.created_at);
  const truckType = tripDetails?.request.vehicle_goods?.truck_type ?? "-";
  const goodsType = tripDetails?.request.vehicle_goods?.goods_type ?? "-";
  const weightValue = tripDetails?.request.vehicle_goods?.weight;
  const weightLabel = weightValue === null || weightValue === undefined ? "-" : `${weightValue} Tons`;
  const specialNotes = tripDetails?.request.special_notes ?? "-";

  return (
    <CommonModal
      open={open}
      onOpenChange={onOpenChange}
      loading={updating}
      maxWidth="sm:max-w-[1120px]"
      className="max-h-[92vh] [&_[data-slot=dialog-close]]:text-main-white [&_[data-slot=dialog-close]]:hover:text-main-white [&_[data-slot=dialog-close]]:hover:bg-main-white/15"
    >
      <div className="bg-main-primary px-8 py-6 text-main-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-4 font-bold">Trip Details</h2>
            <p className="text-main-white/85 mt-1">#{bookingNo} - {headerDate}</p>
          </div>
          {statusStyle && (
            <span className={clsx("px-3 py-1 rounded-full text-xs font-semibold", statusStyle.bg, statusStyle.text)}>
              {statusStyle.label}
            </span>
          )}
        </div>
      </div>

      <CommonModalBody className="max-h-[66vh] overflow-y-auto space-y-5 pt-6">
        {tripDetailsLoading ? (
          <div className="space-y-5 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-main-whiteMarble bg-main-luxuryWhite p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full bg-main-whiteMarble" />
                  <div className="space-y-2">
                    <div className="h-4 w-20 rounded bg-main-whiteMarble" />
                    <div className="h-3 w-32 rounded bg-main-whiteMarble" />
                  </div>
                </div>
                <div className="h-4 w-40 rounded bg-main-whiteMarble mb-3" />
                <div className="h-3 w-32 rounded bg-main-whiteMarble" />
              </div>

              <div className="rounded-2xl border border-main-whiteMarble bg-main-luxuryWhite p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full bg-main-whiteMarble" />
                  <div className="space-y-2">
                    <div className="h-4 w-20 rounded bg-main-whiteMarble" />
                    <div className="h-3 w-32 rounded bg-main-whiteMarble" />
                  </div>
                </div>
                <div className="h-4 w-40 rounded bg-main-whiteMarble mb-3" />
                <div className="h-3 w-32 rounded bg-main-whiteMarble" />
              </div>
            </div>

            <div className="rounded-2xl border border-main-ladyBlue/40 bg-main-ladyBlue/10 p-5">
              <div className="h-5 w-44 rounded bg-main-whiteMarble mb-4" />
              <div className="space-y-3">
                <div className="h-3 w-28 rounded bg-main-whiteMarble" />
                <div className="h-4 w-48 rounded bg-main-whiteMarble" />
                <div className="h-3 w-24 rounded bg-main-whiteMarble" />
                <div className="h-3 w-28 rounded bg-main-whiteMarble mt-4" />
                <div className="h-4 w-48 rounded bg-main-whiteMarble" />
                <div className="h-3 w-24 rounded bg-main-whiteMarble" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-6">
                <div className="h-8 rounded bg-main-whiteMarble" />
                <div className="h-8 rounded bg-main-whiteMarble" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-main-whiteMarble bg-main-luxuryWhite p-5">
                <div className="h-5 w-36 rounded bg-main-whiteMarble mb-4" />
                <div className="space-y-3">
                  <div className="h-8 rounded bg-main-whiteMarble" />
                  <div className="h-8 rounded bg-main-whiteMarble" />
                  <div className="h-8 rounded bg-main-whiteMarble" />
                </div>
              </div>
              <div className="rounded-2xl border border-main-vividMint/35 bg-main-vividMint/10 p-5">
                <div className="h-5 w-36 rounded bg-main-whiteMarble mb-4" />
                <div className="space-y-3">
                  <div className="h-8 rounded bg-main-whiteMarble" />
                  <div className="h-8 rounded bg-main-whiteMarble" />
                  <div className="h-8 rounded bg-main-whiteMarble" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-main-mustardGold/45 bg-main-mustardGold/10 p-5">
              <div className="h-5 w-24 rounded bg-main-whiteMarble mb-3" />
              <div className="h-4 w-full rounded bg-main-whiteMarble" />
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-main-whiteMarble bg-main-luxuryWhite p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full bg-main-primary flex items-center justify-center text-main-white font-bold">
                    {initialsFromName(tripDetails?.user.full_name ?? trip.user_name)}
                  </div>
                  <div>
                    <p className="text-main-mirage font-bold">User</p>
                    <p className="text-main-sharkGray text-sm">Customer Information</p>
                  </div>
                </div>
                <p className="text-main-mirage font-semibold">{tripDetails?.user.full_name ?? trip.user_name}</p>
                <p className="mt-2 text-main-sharkGray text-sm flex items-center gap-2"><Phone size={14} /> {tripDetails?.user.phone ?? "-"}</p>
              </div>

              <div className="rounded-2xl border border-main-whiteMarble bg-main-luxuryWhite p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full bg-main-vividMint flex items-center justify-center text-main-white font-bold">
                    {initialsFromName(tripDetails?.driver.name ?? trip.driver_name)}
                  </div>
                  <div>
                    <p className="text-main-mirage font-bold">Driver</p>
                    <p className="text-main-sharkGray text-sm">Driver Information</p>
                  </div>
                </div>
                <p className="text-main-mirage font-semibold">{tripDetails?.driver.name ?? trip.driver_name ?? "-"}</p>
                <p className="mt-2 text-main-sharkGray text-sm flex items-center gap-2"><Phone size={14} /> {tripDetails?.driver.phone ?? "-"}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#A7CDF7] bg-[#EEF5FF] p-4">
              <p className="text-main-mirage font-bold text-lg flex items-center gap-2">
                <Navigation size={18} className="text-main-primary" />
                Route Information
              </p>

              <div className="mt-4">
                <div className="flex gap-4">
                  <span className="w-3 h-3 rounded-full bg-main-vividMint mt-2 shrink-0" />
                  <div>
                    <p className="text-main-sharkGray text-xs">Pickup Location</p>
                    <p className="text-main-mirage text-base font-semibold">{pickupName}</p>
                    <p className="text-main-sharkGray text-xs mt-1">
                      Time: {formatTime(tripDetails?.picked_up_at ?? trip.picked_up_at)}
                    </p>
                  </div>
                </div>

                <div className="h-8 w-0 border-l border-dashed border-main-sharkGray/35 ml-[5px] my-2" />

                <div className="flex gap-4">
                  <span className="w-3 h-3 rounded-full bg-main-remove mt-2 shrink-0" />
                  <div>
                    <p className="text-main-sharkGray text-xs">Dropoff Location</p>
                    <p className="text-main-mirage text-base font-semibold">{dropoffName}</p>
                    <p className="text-main-sharkGray text-xs mt-1">
                      Time: {formatTime(tripDetails?.completed_at)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[#A7CDF7] grid grid-cols-2 gap-4">
                <div>
                  <p className="text-main-sharkGray text-xs">Distance</p>
                  <p className="text-main-mirage text-lg font-bold">
                    {distance ?? "-"} {distance ? "KM" : ""}
                  </p>
                </div>
                <div>
                  <p className="text-main-sharkGray text-xs">Duration</p>
                  <p className="text-main-mirage text-lg font-bold">
                    {duration ?? "-"} {duration ? "mins" : ""}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-main-whiteMarble bg-main-luxuryWhite p-5">
                <p className="text-main-mirage font-bold flex items-center gap-2"><CarFront size={18} /> Vehicle & Goods</p>
                <div className="mt-4 space-y-3">
                  <InfoRow label="Truck Type" value={truckType} />
                  <InfoRow label="Goods Type" value={goodsType} />
                  <InfoRow label="Weight" value={weightLabel} />
                </div>
              </div>

              <div className="rounded-2xl border border-main-vividMint/35 bg-main-vividMint/10 p-5">
                <p className="text-main-mirage font-bold flex items-center gap-2"><CreditCard size={18} /> Payment Details</p>
                <div className="mt-4 space-y-3">
                  <InfoRow label="Total Price" value={`${trip.currency} ${totalPrice.toLocaleString()}`} valueClass="text-main-vividMint" />
                  <InfoRow label="Commission (10%)" value={`${trip.currency} ${commission.toLocaleString()}`} />
                  <InfoRow label="Payment Method" value="-" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-main-mustardGold/45 bg-main-mustardGold/10 p-5">
              <p className="text-main-mirage font-bold flex items-center gap-2"><Package size={18} /> Notes</p>
              <p className="text-main-hydrocarbon mt-2 whitespace-pre-wrap break-words">{specialNotes}</p>
            </div>
          </>
        )}
      </CommonModalBody>

      <CommonModalFooter className="mt-0 border-t border-main-whiteMarble/50 px-8 py-6">
        <Button
          type="button"
          variant="secondary"
          className="h-11 px-7 bg-main-whiteMarble text-main-hydrocarbon hover:bg-main-whiteMarble/80 common-rounded"
          onClick={() => onOpenChange(false)}
          disabled={updating}
        >
          Close
        </Button>
        <div className="ml-auto flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-11 px-7 border-main-remove text-main-remove hover:bg-main-remove/10 common-rounded"
            onClick={handleCancelTrip}
            disabled={updating || canCancel === false}
          >
            {updating ? "Cancelling..." : "Cancel Trip"}
          </Button>
          <Button
            type="button"
            className="h-11 px-7 bg-main-primary text-main-white common-rounded"
            onClick={() => { }}
          >
            Track Trip
          </Button>
        </div>
      </CommonModalFooter>
    </CommonModal>
  );
};

const InfoRow = ({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) => (
  <div>
    <p className="text-main-sharkGray text-sm">{label}</p>
    <p className={clsx("text-main-mirage font-bold", valueClass)}>{value}</p>
  </div>
);

export default TripDetailsModal;
