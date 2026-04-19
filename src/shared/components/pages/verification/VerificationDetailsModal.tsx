import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ExternalLink, FileText, IdCard, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  CommonModal,
  CommonModalBody,
  CommonModalFooter,
  CommonModalHeader,
} from "@/shared/components/common/CommonModal";
import { verificationStatusStyles, type TVerificationStatus } from "@/shared/core/pages/verification";
import useVerificationStore, {
  type IAppVerificationItem,
} from "@/shared/hooks/store/useVerificationStore";
import { formatAppDateShort } from "@/lib/formatLocaleDate";

interface VerificationDetailsModalProps {
  open: boolean;
  verification: IAppVerificationItem | null;
  onOpenChange: (value: boolean) => void;
}

const isImageDocument = (url: string) => /\.(png|jpe?g|webp|gif|avif|svg)$/i.test(url);

const VerificationDetailsModal = ({
  open,
  verification,
  onOpenChange,
}: VerificationDetailsModalProps) => {
  const { t, i18n } = useTranslation(["verification", "common"]);
  const {
    details,
    detailsLoading,
    updating,
    fetchVerificationDetails,
    clearVerificationDetails,
    updateVerificationStatus,
  } = useVerificationStore();

  const [rejectReason, setRejectReason] = useState("");
  const [verificationNotes, setVerificationNotes] = useState("");
  const [reasonError, setReasonError] = useState<string | null>(null);

  const handleModalOpenChange = (next: boolean) => {
    if (!next) {
      clearVerificationDetails();
      setRejectReason("");
      setVerificationNotes("");
      setReasonError(null);
    }
    onOpenChange(next);
  };

  useEffect(() => {
    if (open && verification) {
      fetchVerificationDetails(verification.id);
    }
    // Intentionally depend on id only: `verification` object identity may change without a new fetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fetch when modal opens for this id
  }, [open, verification?.id, fetchVerificationDetails]);

  useEffect(() => {
    if (!details) return;
    queueMicrotask(() => {
      setRejectReason(details.verification.rejected_reason ?? "");
      setVerificationNotes(details.verification.notes ?? "");
    });
  }, [details]);

  const documents = useMemo(() => {
    if (!details) return [];
    const docs = details.documents;
    return [
      { key: "profile_image", label: t("verification:documents.profileImage"), value: docs.profile_image, icon: ShieldCheck },
      { key: "national_id_front", label: t("verification:documents.nationalIdFront"), value: docs.national_id_front, icon: IdCard },
      { key: "national_id_back", label: t("verification:documents.nationalIdBack"), value: docs.national_id_back, icon: IdCard },
      { key: "license_front", label: t("verification:documents.licenseFront"), value: docs.license_front, icon: IdCard },
      { key: "license_back", label: t("verification:documents.licenseBack"), value: docs.license_back, icon: IdCard },
      { key: "criminal_record", label: t("verification:documents.criminalRecord"), value: docs.criminal_record, icon: FileText },
    ].filter((doc) => doc.value);
  }, [details, t]);

  const handleApprove = async () => {
    if (!verification) return;
    await updateVerificationStatus(verification.id, {
      status: "approved",
      verification_notes: verificationNotes.trim() || undefined,
    });
    handleModalOpenChange(false);
  };

  const handleReject = async () => {
    if (!verification) return;
    const reason = rejectReason.trim() || t("verification:rejectReasonDefault");
    try {
      setReasonError(null);
      await updateVerificationStatus(verification.id, {
        status: "rejected",
        reason_for_rejection: reason,
        verification_notes: verificationNotes.trim() || undefined,
      });
      handleModalOpenChange(false);
    } catch {
      setReasonError(t("verification:rejectError"));
    }
  };

  if (!verification) return null;

  const displayStatus = details?.verification.status ?? verification.status;
  const statusKey = (["pending", "approved", "rejected"] as const).includes(displayStatus as TVerificationStatus)
    ? (displayStatus as TVerificationStatus)
    : "pending";
  const statusStyle = verificationStatusStyles[statusKey];
  const name = details?.driver.name ?? verification.name ?? t("verification:list.driverLabel");

  const fmt = (v?: string | null) => formatAppDateShort(v, i18n.language, "—");

  return (
    <CommonModal
      open={open}
      onOpenChange={handleModalOpenChange}
      loading={updating}
      maxWidth="sm:max-w-[980px]"
      variant="success"
    >
      <CommonModalHeader
        title={t("verification:details.title")}
        description={t("verification:details.description")}
      />

      <CommonModalBody className="space-y-6">
        {detailsLoading ? (
          <DetailsSkeleton />
        ) : details ? (
          <>
            <div className="rounded-2xl border border-main-whiteMarble bg-main-luxuryWhite p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-main-mirage text-lg font-bold">{name}</p>
                <p className="text-main-sharkGray text-sm">
                  {details.driver.email ?? t("verification:details.noEmail")} • {details.driver.phone}
                </p>
                <p className="text-main-sharkGray text-xs mt-1">
                  {t("verification:details.submittedAt", { date: fmt(details.driver.created_at) })}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                {t(`verification:statuses.${statusKey}`)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.length > 0 ? (
                documents.map((doc) => {
                  const Icon = doc.icon;
                  const value = doc.value as string;
                  return (
                    <div key={doc.key} className="rounded-2xl border border-main-whiteMarble p-4 bg-main-white">
                      <div className="flex items-center justify-between mb-3 gap-2">
                        <p className="text-main-mirage font-semibold flex items-center gap-2 min-w-0">
                          <Icon size={15} className="shrink-0" />
                          <span className="truncate">{doc.label}</span>
                        </p>
                        <a
                          href={value}
                          target="_blank"
                          rel="noreferrer"
                          className="text-main-primary text-xs font-semibold inline-flex items-center gap-1 hover:underline shrink-0"
                        >
                          {t("verification:details.open")}
                          <ExternalLink size={13} />
                        </a>
                      </div>
                      {isImageDocument(value) ? (
                        <img
                          src={value}
                          alt={doc.label}
                          className="w-full h-48 rounded-xl object-cover border border-main-whiteMarble"
                        />
                      ) : (
                        <div className="h-48 rounded-xl border border-dashed border-main-whiteMarble bg-main-luxuryWhite flex items-center justify-center text-main-sharkGray text-sm">
                          {t("verification:details.previewUnavailable")}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full rounded-2xl border border-main-whiteMarble bg-main-luxuryWhite p-6 text-center text-main-sharkGray">
                  {t("verification:details.noDocuments")}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-main-whiteMarble p-4 space-y-2">
                <p className="text-main-sharkGray text-xs">{t("verification:details.nationalIdExpiry")}</p>
                <p className="text-main-mirage font-semibold">{fmt(details.documents.national_id_expiry)}</p>
                <p className="text-main-sharkGray text-xs mt-3">{t("verification:details.licenseExpiry")}</p>
                <p className="text-main-mirage font-semibold">{fmt(details.documents.license_expiry)}</p>
              </div>
              <div className="rounded-2xl border border-main-whiteMarble p-4 space-y-2">
                <p className="text-main-sharkGray text-xs">{t("verification:details.address")}</p>
                <p className="text-main-mirage font-semibold">{details.documents.address ?? "—"}</p>
                <p className="text-main-sharkGray text-xs mt-3">{t("verification:details.additionalPhone")}</p>
                <p className="text-main-mirage font-semibold">{details.documents.additional_phone ?? "—"}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-main-mirage text-sm font-semibold">{t("verification:details.notesLabel")}</p>
              <Textarea
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                placeholder={t("verification:details.notesPlaceholder")}
                className="min-h-[90px]"
                disabled={updating}
              />
            </div>

            <div className="space-y-2">
              <p className="text-main-mirage text-sm font-semibold">{t("verification:details.rejectionLabel")}</p>
              <Textarea
                value={rejectReason}
                onChange={(e) => {
                  setRejectReason(e.target.value);
                  if (reasonError) setReasonError(null);
                }}
                placeholder={t("verification:details.rejectionPlaceholder")}
                className="min-h-[90px]"
                disabled={updating}
              />
              {reasonError ? (
                <p className="text-xs font-medium text-main-red mt-1">{reasonError}</p>
              ) : null}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-main-whiteMarble bg-main-luxuryWhite p-6 text-center text-main-sharkGray">
            {t("verification:details.loadError")}
          </div>
        )}
      </CommonModalBody>

      <CommonModalFooter>
        <Button
          type="button"
          variant="ghost"
          className="h-11 px-7 text-main-sharkGray hover:bg-main-titaniumWhite"
          onClick={() => handleModalOpenChange(false)}
          disabled={updating}
        >
          {t("common:cancel")}
        </Button>
        <div className="ms-auto flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-11 px-7 border-main-remove text-main-remove hover:bg-main-remove/10"
            onClick={handleReject}
            disabled={updating || detailsLoading}
          >
            {updating ? t("verification:details.rejecting") : t("verification:details.reject")}
          </Button>
          <Button
            type="button"
            className="h-11 px-7 bg-main-vividMint text-main-white hover:bg-main-vividMint/90"
            onClick={handleApprove}
            disabled={updating || detailsLoading}
          >
            {updating ? t("verification:details.approving") : t("verification:details.approve")}
          </Button>
        </div>
      </CommonModalFooter>
    </CommonModal>
  );
};

const DetailsSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-24 rounded-2xl bg-main-whiteMarble" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-64 rounded-2xl bg-main-whiteMarble" />
      ))}
    </div>
    <div className="h-28 rounded-2xl bg-main-whiteMarble" />
    <div className="h-28 rounded-2xl bg-main-whiteMarble" />
  </div>
);

export default VerificationDetailsModal;
