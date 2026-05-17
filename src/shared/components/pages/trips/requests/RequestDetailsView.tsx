import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CommonModalBody, CommonModalFooter } from "@/shared/components/common/CommonModal";
import type { IAppTruckRequest, ITruckRequestDetails } from "@/shared/hooks/store/useTruckRequestsStore";
import { requestStatusStyles } from "@/shared/core/pages/requests";
import { formatAppDateShort, formatAppTime } from "@/lib/formatLocaleDate";
import { ExternalLink } from "lucide-react";

export type RequestDetailsViewVariant = "modal" | "page";

export interface RequestDetailsViewProps {
  variant: RequestDetailsViewVariant;
  requestId: number;
  listRequest: IAppTruckRequest | null;
  requestDetails: ITruckRequestDetails | null;
  requestDetailsLoading: boolean;
  onClose?: () => void;
  onOpenFullPage?: () => void;
}

const RequestDetailsView = ({
  variant,
  requestId,
  listRequest,
  requestDetails,
  requestDetailsLoading,
  onClose,
  onOpenFullPage,
}: RequestDetailsViewProps) => {
  const { t, i18n } = useTranslation(["trips", "common"]);
  const navigate = useNavigate();
  const d = requestDetails;
  const status = d?.status ?? listRequest?.status;
  const style = status ? requestStatusStyles[status] : null;

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
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{t("trips:requestsDetails.title")}</h2>
          <p className="text-sm sm:text-base text-main-white/90 font-medium">
            {t("trips:requestsDetails.requestLine", {
              number: d?.request_number ?? listRequest?.request_number ?? "—",
              date: formatAppDateShort(d?.created_at ?? listRequest?.created_at, i18n.language, "—"),
            })}
          </p>
        </div>
        {status && style ? (
          <span
            className={clsx(
              "inline-flex w-fit shrink-0 items-center px-3.5 py-1.5 rounded-full text-xs font-semibold",
              "bg-main-white/15 text-main-white border border-main-white/25",
            )}
          >
            {t(`trips:requestStatuses.${status}`)}
          </span>
        ) : null}
      </div>
    </div>
  );

  const bodyInner = requestDetailsLoading ? (
    <div className="space-y-5 animate-pulse">
      <div className="h-32 rounded-2xl bg-main-whiteMarble" />
      <div className="h-48 rounded-2xl bg-main-whiteMarble" />
    </div>
  ) : (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-main-whiteMarble bg-main-luxuryWhite p-5">
          <p className="text-main-mirage font-bold">{t("trips:requestsDetails.user")}</p>
          <p className="mt-2 text-main-mirage font-semibold">{d?.user.full_name ?? listRequest?.user_name}</p>
          <p className="text-main-sharkGray text-sm">{d?.user.phone ?? "—"}</p>
        </div>
        <div className="rounded-2xl border border-main-whiteMarble bg-main-luxuryWhite p-5 space-y-2 text-sm">
          <p>
            <span className="text-main-sharkGray">{t("trips:requestsDetails.tripAt")}: </span>
            <span className="font-semibold text-main-mirage">
              {formatAppDateShort(d?.trip_at, i18n.language, "—")} {formatAppTime(d?.trip_at, i18n.language, "")}
            </span>
          </p>
          <p>
            <span className="text-main-sharkGray">{t("trips:requestsDetails.expiresAt")}: </span>
            <span className="font-semibold text-main-mirage">
              {formatAppDateShort(d?.expires_at ?? listRequest?.expires_at, i18n.language, "—")}
            </span>
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-main-ladyBlue/40 bg-main-ladyBlue/10 p-5">
        <p className="text-main-mirage font-bold">{t("trips:requestsDetails.route")}</p>
        <p className="mt-2 text-main-mirage font-semibold">{d?.pickup_name ?? listRequest?.pickup_location}</p>
        <ul className="mt-3 space-y-2">
          {(d?.drop_off_locations ?? []).map((loc, i) => (
            <li key={i} className="text-sm text-main-hydrocarbon flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-main-remove shrink-0" />
              {loc.destination_name}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-main-whiteMarble bg-main-luxuryWhite p-5">
          <p className="text-main-mirage font-bold">{t("trips:requestsDetails.cargo")}</p>
          <div className="mt-3 space-y-2 text-sm">
            <p>
              <span className="text-main-sharkGray">{t("trips:details.truckType")}: </span>
              <span className="font-semibold">{d?.vehicle_goods.truck_type ?? "—"}</span>
            </p>
            <p>
              <span className="text-main-sharkGray">{t("trips:details.goodsType")}: </span>
              <span className="font-semibold">{d?.vehicle_goods.goods_type ?? "—"}</span>
            </p>
            <p>
              <span className="text-main-sharkGray">{t("trips:details.weight")}: </span>
              <span className="font-semibold">
                {d?.vehicle_goods.weight != null ? t("trips:details.tons", { value: d.vehicle_goods.weight }) : "—"}
              </span>
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-main-vividMint/35 bg-main-vividMint/10 p-5">
          <p className="text-main-mirage font-bold">{t("trips:requestsDetails.pricing")}</p>
          <div className="mt-3 space-y-2 text-sm">
            <p>
              <span className="text-main-sharkGray">{t("trips:requestsDetails.userOffer")}: </span>
              <span className="font-semibold">
                {d?.currency} {d?.offered_price_by_user?.toLocaleString(i18n.language?.startsWith("ar") ? "ar-SA" : "en-US")}
              </span>
            </p>
            {d?.wasel_suggested_price != null ? (
              <p>
                <span className="text-main-sharkGray">{t("trips:requestsDetails.suggested")}: </span>
                <span className="font-semibold">
                  {d.currency} {d.wasel_suggested_price.toLocaleString(i18n.language?.startsWith("ar") ? "ar-SA" : "en-US")}
                </span>
              </p>
            ) : null}
            {d?.final_price != null ? (
              <p>
                <span className="text-main-sharkGray">{t("trips:requestsDetails.final")}: </span>
                <span className="font-semibold text-main-vividMint">
                  {d.currency} {d.final_price.toLocaleString(i18n.language?.startsWith("ar") ? "ar-SA" : "en-US")}
                </span>
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {d?.goods_images && d.goods_images.length > 0 ? (
        <div className="rounded-2xl border border-main-whiteMarble bg-main-luxuryWhite p-5">
          <p className="text-main-mirage font-bold mb-3">{t("trips:requestsDetails.goodsImages")}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {d.goods_images.map((img) => (
              <a
                key={img.key}
                href={img.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block aspect-square rounded-xl overflow-hidden border border-main-whiteMarble hover:opacity-90"
              >
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </a>
            ))}
          </div>
        </div>
      ) : null}

      {d?.special_notes ? (
        <div className="rounded-2xl border border-main-mustardGold/45 bg-main-mustardGold/10 p-5">
          <p className="text-main-mirage font-bold">{t("trips:details.notes")}</p>
          <p className="text-main-hydrocarbon mt-2 whitespace-pre-wrap">{d.special_notes}</p>
        </div>
      ) : null}

      {d?.driver_offers && d.driver_offers.length > 0 ? (
        <div className="rounded-2xl border border-main-whiteMarble bg-main-luxuryWhite p-5 overflow-x-auto">
          <p className="text-main-mirage font-bold mb-3">{t("trips:requestsDetails.offers")}</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-main-sharkGray text-left border-b border-main-whiteMarble">
                <th className="py-2 pr-4">{t("trips:requestsDetails.offerDriver")}</th>
                <th className="py-2 pr-4">{t("trips:requestsDetails.offerPrice")}</th>
                <th className="py-2">{t("trips:requestsDetails.offerStatus")}</th>
              </tr>
            </thead>
            <tbody>
              {d.driver_offers.map((o) => (
                <tr key={o.id} className="border-b border-main-whiteMarble/60">
                  <td className="py-2 pr-4 font-medium text-main-mirage">{o.driver_name}</td>
                  <td className="py-2 pr-4">
                    {o.currency} {o.driver_offered_price.toLocaleString(i18n.language?.startsWith("ar") ? "ar-SA" : "en-US")}
                  </td>
                  <td className="py-2 text-main-hydrocarbon">{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {d?.trip ? (
        <div className="rounded-2xl border border-main-vividMint/40 bg-main-vividMint/10 p-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-main-mirage font-bold">{t("trips:requestsDetails.linkedTrip")}</p>
            <p className="text-sm text-main-hydrocarbon mt-1">
              #{d.trip.booking_number} — {t(`trips:statuses.${d.trip.status as "pending"}`)}
            </p>
          </div>
          <Button
            type="button"
            className="h-10 px-4 bg-main-primary text-main-white font-semibold"
            onClick={() => navigate(`/trips/view/${d.trip!.id}`)}
          >
            {t("trips:viewTrip")}
          </Button>
        </div>
      ) : null}
    </>
  );

  const footer =
    variant === "modal" ? (
      <CommonModalFooter className="mt-0 border-t border-main-whiteMarble px-6 sm:px-8 py-5 justify-between gap-3 flex-wrap">
        {onClose ? (
          <Button type="button" variant="outline" className="h-11 px-6" onClick={onClose}>
            {t("trips:details.close")}
          </Button>
        ) : (
          <span />
        )}
        {onOpenFullPage ? (
          <Button type="button" className="h-11 px-6 gap-2 bg-main-primary text-main-white font-bold" onClick={onOpenFullPage}>
            <ExternalLink size={16} />
            {t("trips:details.openFullPage")}
          </Button>
        ) : null}
      </CommonModalFooter>
    ) : null;

  const scrollClass = variant === "modal" ? "max-h-[66vh] overflow-y-auto space-y-5 pt-6" : "space-y-5 pt-2 pb-4";

  if (variant === "modal") {
    return (
      <>
        {hero}
        <CommonModalBody className={scrollClass}>{bodyInner}</CommonModalBody>
        {footer}
      </>
    );
  }

  return (
    <div
      key={`request-detail-${requestId}`}
      className="common-rounded border border-main-whiteMarble bg-main-white overflow-hidden shadow-[0_4px_24px_-12px_rgba(17,24,39,0.08)]"
    >
      {hero}
      <div className={clsx("px-4 sm:px-8", scrollClass)}>{bodyInner}</div>
    </div>
  );
};

export default RequestDetailsView;
