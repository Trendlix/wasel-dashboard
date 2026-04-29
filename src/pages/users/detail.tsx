import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageHeader from "@/shared/components/common/PageHeader";
import PageTransition from "@/shared/components/common/PageTransition";
import BackButton from "@/shared/components/common/BackButton";
import { formatAppDateLong } from "@/lib/formatLocaleDate";
import { showToast } from "@/shared/utils/toast";
import useUserStore from "@/shared/hooks/store/useUserStore";
import { statusStyles, type TUserStatus } from "@/shared/core/pages/users";

const STATUS_OPTIONS: TUserStatus[] = ["active", "inactive", "blocked", "deleted"];

const UserFullViewPage = () => {
  const { t, i18n } = useTranslation(["users", "common"]);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);
  const isValidId = Number.isInteger(userId) && userId > 0;

  const {
    details,
    detailsLoading,
    updating,
    fetchUserDetails,
    clearUserDetails,
    updateStatus,
  } = useUserStore();

  const [selectedStatus, setSelectedStatus] = useState<TUserStatus>("active");

  useEffect(() => {
    if (!isValidId) return;
    fetchUserDetails(userId).catch(() => {});
    return () => clearUserDetails();
  }, [clearUserDetails, fetchUserDetails, isValidId, userId]);

  useEffect(() => {
    if (!details) return;
    setSelectedStatus(details.status);
  }, [details]);

  const currentStatus = details?.status ?? "inactive";
  const canSaveStatus = !!details && selectedStatus !== currentStatus && !updating;
  const statusStyle = statusStyles[currentStatus] ?? statusStyles.inactive;

  const joinedOn = useMemo(
    () => formatAppDateLong(details?.created_at, i18n.language),
    [details?.created_at, i18n.language],
  );
  const updatedOn = useMemo(
    () => formatAppDateLong(details?.updated_at, i18n.language),
    [details?.updated_at, i18n.language],
  );

  const handleSaveStatus = async () => {
    if (!details || !canSaveStatus) return;
    try {
      await updateStatus(details.id, selectedStatus);
      await fetchUserDetails(details.id);
      showToast(t("users:fullView.status.saved"), "success");
    } catch {
      showToast(t("users:fullView.status.saveFailed"), "error");
    }
  };

  if (!isValidId) {
    return (
      <PageTransition>
        <PageHeader title={t("users:fullView.invalidTitle")} description={t("users:fullView.invalidDescription")} />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <PageHeader title={t("users:fullView.title")} description={t("users:fullView.description")} />
      <div className="mb-6">
        <BackButton label={t("users:fullView.backToUsers")} onClick={() => navigate("/users")} />
      </div>

      {detailsLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-28 rounded-2xl bg-main-whiteMarble" />
          <div className="h-48 rounded-2xl bg-main-whiteMarble" />
          <div className="h-44 rounded-2xl bg-main-whiteMarble" />
        </div>
      ) : !details ? (
        <div className="rounded-2xl border border-main-whiteMarble bg-main-white p-6 text-main-sharkGray">
          {t("users:fullView.notFound")}
        </div>
      ) : (
        <div className="space-y-6">
          <section className="rounded-2xl border border-main-whiteMarble bg-main-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-main-mirage text-lg font-bold">{details.full_name}</p>
                <p className="text-main-sharkGray text-sm">{details.email ?? "—"} • {details.phone}</p>
                <p className="text-main-sharkGray text-xs mt-1">{t("users:fullView.joinedOn", { date: joinedOn })}</p>
              </div>
              <span className={clsx("px-3 py-1 rounded-full text-xs font-medium", statusStyle.bg, statusStyle.text)}>
                {t(`users:statuses.${currentStatus}`)}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <InfoCard label={t("users:fullView.phone")} value={details.phone} />
              <InfoCard label={t("users:fullView.email")} value={details.email ?? "—"} />
              <InfoCard
                label={t("users:fullView.emailVerified")}
                value={details.email_verified ? t("users:yes") : t("users:no")}
                valueClass={details.email_verified ? "text-main-vividMint" : "text-main-remove"}
              />
              <InfoCard
                label={t("users:fullView.phoneVerified")}
                value={details.phone_verified ? t("users:yes") : t("users:no")}
                valueClass={details.phone_verified ? "text-main-vividMint" : "text-main-remove"}
              />
              <InfoCard label={t("users:fullView.voucherUsage")} value={String(details.total_voucher_usage)} />
              <InfoCard label={t("users:fullView.lastUpdated")} value={updatedOn} />
            </div>

            <div className="mt-4 rounded-xl border border-main-whiteMarble bg-main-luxuryWhite p-4">
              <p className="text-xs text-main-sharkGray mb-2">{t("users:fullView.status.label")}</p>
              <div className="flex flex-wrap items-center gap-3">
                <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as TUserStatus)}>
                  <SelectTrigger className="w-full md:w-[260px] h-10 bg-main-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {STATUS_OPTIONS.map((status) => {
                      const style = statusStyles[status];
                      return (
                        <SelectItem key={status} value={status}>
                          <span className={clsx("px-2 py-0.5 rounded-full text-xs font-medium", style.bg, style.text)}>
                            {t(`users:statuses.${status}`)}
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  onClick={handleSaveStatus}
                  disabled={!canSaveStatus}
                  className="h-10 px-6 bg-main-primary text-main-white"
                >
                  {updating ? t("users:fullView.status.saving") : t("users:fullView.status.save")}
                </Button>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-main-whiteMarble bg-main-white p-5">
            <p className="text-main-mirage font-semibold mb-1">{t("users:fullView.addresses.title")}</p>
            <p className="text-main-sharkGray text-sm mb-4">{t("users:fullView.addresses.description")}</p>
            {details.addresses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {details.addresses.map((address) => (
                  <div key={address.id} className="rounded-xl border border-main-whiteMarble bg-main-luxuryWhite p-3">
                    <p className="text-main-mirage text-sm font-semibold">
                      {address.label} <span className="text-main-sharkGray font-normal">({address.type})</span>
                    </p>
                    <p className="text-main-sharkGray text-sm mt-1">{address.location}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-main-whiteMarble bg-main-luxuryWhite p-5 text-center text-main-sharkGray">
                {t("users:fullView.addresses.empty")}
              </div>
            )}
          </section>
        </div>
      )}
    </PageTransition>
  );
};

const InfoCard = ({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) => (
  <div className="rounded-xl border border-main-whiteMarble bg-main-luxuryWhite p-3">
    <p className="text-main-sharkGray text-xs">{label}</p>
    <p className={clsx("text-main-mirage text-sm font-semibold mt-1", valueClass)}>{value}</p>
  </div>
);

export default UserFullViewPage;
