import clsx from "clsx";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { CommonModalBody, CommonModalFooter } from "@/shared/components/common/CommonModal";
import type { IAppTrip, ITripDetails } from "@/shared/hooks/store/useTripsStore";
import { formatAppDateShort, formatAppTime } from "@/lib/formatLocaleDate";
import { ExternalLink } from "lucide-react";

export type TripDetailsViewVariant = "modal" | "page";

export interface TripDetailsViewProps {
  variant: TripDetailsViewVariant;
  tripId: number;
  listTrip: IAppTrip | null;
  tripDetails: ITripDetails | null;
  tripDetailsLoading: boolean;
  updating: boolean;
  onCancelTrip: () => Promise<void>;
  onClose?: () => void;
  /** Modal only: navigate to standalone `/trips/:id` page. */
  onOpenFullPage?: () => void;
}

const initialsFromName = (name?: string | null) => {
  if (!name) return "-";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const TripDetailsView = ({
  variant,
  tripId,
  listTrip,
  tripDetails,
  tripDetailsLoading,
  updating,
  onCancelTrip,
  onClose,
  onOpenFullPage,
}: TripDetailsViewProps) => {
  const { t, i18n } = useTranslation("trips");

  const numLocale = i18n.language?.startsWith("ar") ? "ar-SA" : "en-US";
  const fmtNum = (n: number) => n.toLocaleString(numLocale);

  const list = listTrip;
  const displayStatus = tripDetails?.status ?? list?.status;

  const canCancel = useMemo(() => {
    if (!displayStatus) return false;
    return displayStatus !== "cancelled" && displayStatus !== "completed";
  }, [displayStatus]);

  const pickupName =
    tripDetails?.request.pickup_location?.name ?? list?.pickup_location ?? "-";
  const dropoffName =
    tripDetails?.request.dropoff_locations?.[0]?.name ?? list?.dropoff_location ?? "-";
  const distance = tripDetails?.request.distance_km;
  const duration = tripDetails?.request.duration_minutes;
  const totalPrice = Number(tripDetails?.final_price ?? list?.final_price ?? 0);
  const currency = tripDetails?.currency ?? list?.currency ?? "";
  const commission = Math.round(totalPrice * 0.1);
  const bookingNo = tripDetails?.booking_number ?? list?.booking_number ?? "";
  const createdSource = tripDetails?.created_at ?? list?.created_at ?? "";
  const headerDate = formatAppDateShort(createdSource, i18n.language, "-");
  const truckType = tripDetails?.request.vehicle_goods?.truck_type ?? "-";
  const goodsType = tripDetails?.request.vehicle_goods?.goods_type ?? "-";
  const weightValue = tripDetails?.request.vehicle_goods?.weight;
  const weightLabel =
    weightValue === null || weightValue === undefined
      ? "-"
      : t("trips:details.tons", { value: weightValue });
  const specialNotes = tripDetails?.request.special_notes ?? "-";

  const pickupTime = formatAppTime(
    tripDetails?.picked_up_at ?? list?.picked_up_at,
    i18n.language,
    "-",
  );
  const completedTime = formatAppTime(tripDetails?.completed_at, i18n.language, "-");

  const hero = (
    <div
      className={clsx(
        "bg-main-primary px-6 sm:px-8 py-6 sm:py-7 text-main-white",
        variant === "modal" && "-translate-y-4",
        variant === "page" && "rounded-t-[inherit]",
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-main-white">
            {t("trips:details.title")}
          </h2>
          <p className="text-sm sm:text-base text-main-white/90 font-medium">
            {t("trips:details.bookingLine", { number: bookingNo || "—", date: headerDate })}
          </p>
        </div>
        {displayStatus && (
          <span
            className={clsx(
              "inline-flex w-fit shrink-0 items-center px-3.5 py-1.5 rounded-full text-xs font-semibold",
              "bg-main-white/15 text-main-white border border-main-white/25 backdrop-blur-sm",
            )}
          >
            {t(`trips:statuses.${displayStatus}`)}
          </span>
        )}
      </div>
    </div>
  );

  const bodyInner =
    tripDetailsLoading ? (
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
                {initialsFromName(tripDetails?.user.full_name ?? list?.user_name)}
              </div>
              <div>
                <p className="text-main-mirage font-bold">{t("trips:details.user")}</p>
                <p className="text-main-sharkGray text-sm">{t("trips:details.userSubtitle")}</p>
              </div>
            </div>
            <p className="text-main-mirage font-semibold">
              {tripDetails?.user.full_name ?? list?.user_name}
            </p>
            <p className="mt-2 text-main-sharkGray text-sm">{tripDetails?.user.phone ?? "-"}</p>
          </div>

          <div className="rounded-2xl border border-main-whiteMarble bg-main-luxuryWhite p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full bg-main-vividMint flex items-center justify-center text-main-white font-bold">
                {initialsFromName(tripDetails?.driver.name ?? list?.driver_name)}
              </div>
              <div>
                <p className="text-main-mirage font-bold">{t("trips:details.driver")}</p>
                <p className="text-main-sharkGray text-sm">{t("trips:details.driverSubtitle")}</p>
              </div>
            </div>
            <p className="text-main-mirage font-semibold">
              {tripDetails?.driver.name ?? list?.driver_name ?? "-"}
            </p>
            <p className="mt-2 text-main-sharkGray text-sm">{tripDetails?.driver.phone ?? "-"}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-main-ladyBlue/40 bg-main-ladyBlue/10 p-5 sm:p-6">
          <p className="text-main-mirage font-bold text-base sm:text-lg">{t("trips:details.routeSection")}</p>

          <div className="mt-4">
            <div className="flex gap-4">
              <span className="w-3 h-3 rounded-full bg-main-vividMint mt-2 shrink-0" />
              <div>
                <p className="text-main-sharkGray text-xs">{t("trips:details.pickup")}</p>
                <p className="text-main-mirage text-base font-semibold">{pickupName}</p>
                <p className="text-main-sharkGray text-xs mt-1">
                  {t("trips:details.timeLabel")}: {pickupTime}
                </p>
              </div>
            </div>

            <div className="h-8 w-0 border-s border-dashed border-main-sharkGray/35 ms-[5px] my-2" />

            <div className="flex gap-4">
              <span className="w-3 h-3 rounded-full bg-main-remove mt-2 shrink-0" />
              <div>
                <p className="text-main-sharkGray text-xs">{t("trips:details.dropoff")}</p>
                <p className="text-main-mirage text-base font-semibold">{dropoffName}</p>
                <p className="text-main-sharkGray text-xs mt-1">
                  {t("trips:details.timeLabel")}: {completedTime}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-main-ladyBlue/30 grid grid-cols-2 gap-4 sm:gap-6">
            <div>
              <p className="text-main-sharkGray text-xs">{t("trips:details.distance")}</p>
              <p className="text-main-mirage text-lg font-bold">
                {distance ?? "-"} {distance != null ? t("trips:details.km") : ""}
              </p>
            </div>
            <div>
              <p className="text-main-sharkGray text-xs">{t("trips:details.duration")}</p>
              <p className="text-main-mirage text-lg font-bold">
                {duration ?? "-"} {duration != null ? t("trips:details.mins") : ""}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-main-whiteMarble bg-main-luxuryWhite p-5">
            <p className="text-main-mirage font-bold">{t("trips:details.vehicleGoods")}</p>
            <div className="mt-4 space-y-3">
              <InfoRow label={t("trips:details.truckType")} value={truckType} />
              <InfoRow label={t("trips:details.goodsType")} value={goodsType} />
              <InfoRow label={t("trips:details.weight")} value={weightLabel} />
            </div>
          </div>

          <div className="rounded-2xl border border-main-vividMint/35 bg-main-vividMint/10 p-5">
            <p className="text-main-mirage font-bold">{t("trips:details.payment")}</p>
            <div className="mt-4 space-y-3">
              <InfoRow
                label={t("trips:details.totalPrice")}
                value={`${currency} ${fmtNum(totalPrice)}`}
                valueClass="text-main-vividMint"
              />
              <InfoRow label={t("trips:details.commission")} value={`${currency} ${fmtNum(commission)}`} />
              <InfoRow label={t("trips:details.paymentMethod")} value="-" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-main-mustardGold/45 bg-main-mustardGold/10 p-5">
          <p className="text-main-mirage font-bold">{t("trips:details.notes")}</p>
          <p className="text-main-hydrocarbon mt-2 whitespace-pre-wrap wrap-break-word">{specialNotes}</p>
        </div>
      </>
    );

  const cancelButton = (
    <Button
      type="button"
      variant="outline"
      className={clsx(
        "h-11 px-6 font-semibold border-main-whiteMarble",
        "text-main-remove hover:bg-main-remove/5 hover:text-main-remove hover:border-main-remove/25",
        "focus-visible:ring-main-remove/20",
      )}
      onClick={() => {
        void onCancelTrip();
      }}
      disabled={updating || canCancel === false}
    >
      {updating ? t("trips:details.cancelling") : t("trips:details.cancelTrip")}
    </Button>
  );

  const fullPageButton =
    onOpenFullPage != null ? (
      <Button
        type="button"
        className="h-11 px-6 gap-2 bg-main-primary text-main-white font-bold hover:bg-main-primary/90"
        onClick={() => onOpenFullPage()}
        disabled={tripDetailsLoading}
      >
        <ExternalLink size={16} className="shrink-0 opacity-90" />
        {t("trips:details.openFullPage")}
      </Button>
    ) : null;

  const footer =
    variant === "modal" ? (
      <CommonModalFooter className="mt-0 border-t border-main-whiteMarble px-6 sm:px-8 py-5 sm:py-6 justify-between gap-3 flex-wrap items-center">
        {onClose ? (
          <Button
            type="button"
            variant="outline"
            className="h-11 px-6 border-main-whiteMarble text-main-hydrocarbon font-semibold hover:bg-main-luxuryWhite"
            onClick={() => onClose()}
            disabled={updating}
          >
            {t("trips:details.close")}
          </Button>
        ) : (
          <span className="min-w-0 shrink-0" />
        )}
        <div className="flex flex-wrap items-center justify-end gap-3">
          {fullPageButton}
          {cancelButton}
        </div>
      </CommonModalFooter>
    ) : (
      <div className="flex flex-col gap-2 border-t border-main-whiteMarble bg-main-luxuryWhite/60 px-6 sm:px-8 py-5 sm:py-6 sm:flex-row sm:items-center sm:justify-end">
        {(displayStatus === "cancelled" || displayStatus === "completed") && !tripDetailsLoading ? (
          <p className="text-center text-sm text-main-sharkGray sm:me-auto sm:text-start">
            {t("trips:details.noActionsForTerminalStatus")}
          </p>
        ) : null}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-end">{cancelButton}</div>
      </div>
    );

  const scrollBodyClass =
    variant === "modal" ? "max-h-[66vh] overflow-y-auto space-y-5 pt-6" : "space-y-5 pt-2 pb-4";

  if (variant === "modal") {
    return (
      <>
        {hero}
        <CommonModalBody className={scrollBodyClass}>{bodyInner}</CommonModalBody>
        {footer}
      </>
    );
  }

  return (
    <div
      key={`trip-detail-${tripId}`}
      className="common-rounded border border-main-whiteMarble bg-main-white overflow-hidden shadow-[0_4px_24px_-12px_rgba(17,24,39,0.08)]"
    >
      {hero}
      <div className={clsx("px-4 sm:px-8", scrollBodyClass)}>{bodyInner}</div>
      {footer}
    </div>
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

export default TripDetailsView;
