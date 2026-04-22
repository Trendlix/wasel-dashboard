import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ExternalLink, FileText, IdCard, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

type TDocumentPreviewType = "image" | "pdf" | "unsupported";

const IMAGE_EXTENSIONS = new Set(["png", "jpg", "jpeg", "webp", "gif", "avif", "svg"]);

const getFileExtension = (url: string) => {
  const cleanUrl = url.split(/[?#]/)[0];
  const ext = cleanUrl.split(".").pop() ?? "";
  return ext.toLowerCase();
};

const detectDocumentPreviewType = (url: string): TDocumentPreviewType => {
  const ext = getFileExtension(url);
  if (IMAGE_EXTENSIONS.has(ext)) return "image";
  if (ext === "pdf") return "pdf";
  return "unsupported";
};

interface ISelectedDocument {
  label: string;
  url: string;
  previewType: TDocumentPreviewType;
}

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
  const [nationalIdExpiry, setNationalIdExpiry] = useState("");
  const [licenseExpiry, setLicenseExpiry] = useState("");
  const [address, setAddress] = useState("");
  const [additionalPhone, setAdditionalPhone] = useState("");
  const [nationalIdExpiryError, setNationalIdExpiryError] = useState<string | null>(null);
  const [licenseExpiryError, setLicenseExpiryError] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<ISelectedDocument | null>(null);
  const [documentModalOpen, setDocumentModalOpen] = useState(false);

  const handleModalOpenChange = (next: boolean) => {
    if (!next) {
      clearVerificationDetails();
      setRejectReason("");
      setVerificationNotes("");
      setReasonError(null);
      setNationalIdExpiry("");
      setLicenseExpiry("");
      setAddress("");
      setAdditionalPhone("");
      setNationalIdExpiryError(null);
      setLicenseExpiryError(null);
      setSelectedDocument(null);
      setDocumentModalOpen(false);
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
    const toDateInput = (value?: string | null) => {
      if (!value) return "";
      const parsed = new Date(value);
      if (Number.isNaN(parsed.getTime())) return "";
      return parsed.toISOString().slice(0, 10);
    };
    queueMicrotask(() => {
      setRejectReason(details.verification.rejected_reason ?? "");
      setVerificationNotes(details.verification.notes ?? "");
      setNationalIdExpiry(toDateInput(details.documents.national_id_expiry));
      setLicenseExpiry(toDateInput(details.documents.license_expiry));
      setAddress(details.documents.address ?? "");
      setAdditionalPhone(details.documents.additional_phone ?? "");
      setNationalIdExpiryError(null);
      setLicenseExpiryError(null);
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
    const nationalExpiryValue = nationalIdExpiry.trim();
    const licenseExpiryValue = licenseExpiry.trim();
    let hasError = false;
    if (!nationalExpiryValue) {
      setNationalIdExpiryError(t("verification:details.expiryRequiredError"));
      hasError = true;
    } else {
      setNationalIdExpiryError(null);
    }
    if (!licenseExpiryValue) {
      setLicenseExpiryError(t("verification:details.expiryRequiredError"));
      hasError = true;
    } else {
      setLicenseExpiryError(null);
    }
    if (hasError) return;

    await updateVerificationStatus(verification.id, {
      status: "approved",
      verification_notes: verificationNotes.trim() || undefined,
      national_id_expiry: nationalExpiryValue,
      license_expiry: licenseExpiryValue,
      address,
      additional_phone: additionalPhone,
    });
    handleModalOpenChange(false);
  };

  const handleReject = async () => {
    if (!verification) return;
    const reason = rejectReason.trim() || t("verification:rejectReasonDefault");
    const payload: {
      status: "rejected";
      reason_for_rejection: string;
      verification_notes?: string;
      national_id_expiry?: string;
      license_expiry?: string;
      address?: string;
      additional_phone?: string;
    } = {
      status: "rejected",
      reason_for_rejection: reason,
      verification_notes: verificationNotes.trim() || undefined,
    };

    if (nationalIdExpiry.trim()) payload.national_id_expiry = nationalIdExpiry.trim();
    if (licenseExpiry.trim()) payload.license_expiry = licenseExpiry.trim();
    if (address !== (details?.documents.address ?? "")) payload.address = address;
    if (additionalPhone !== (details?.documents.additional_phone ?? "")) {
      payload.additional_phone = additionalPhone;
    }

    try {
      setReasonError(null);
      setNationalIdExpiryError(null);
      setLicenseExpiryError(null);
      await updateVerificationStatus(verification.id, payload);
      handleModalOpenChange(false);
    } catch {
      setReasonError(t("verification:rejectError"));
    }
  };

  const handleOpenDocument = (label: string, url: string) => {
    setSelectedDocument({
      label,
      url,
      previewType: detectDocumentPreviewType(url),
    });
    setDocumentModalOpen(true);
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
    <>
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
                        <button
                          type="button"
                          onClick={() => handleOpenDocument(doc.label, value)}
                          className="text-main-primary text-xs font-semibold inline-flex items-center gap-1 hover:underline shrink-0"
                        >
                          {t("verification:details.openInModal")}
                          <ExternalLink size={13} />
                        </button>
                      </div>
                      {detectDocumentPreviewType(value) === "image" ? (
                        <img
                          src={value}
                          alt={doc.label}
                          className="w-full h-48 rounded-xl object-cover border border-main-whiteMarble"
                        />
                      ) : detectDocumentPreviewType(value) === "pdf" ? (
                        <div className="h-48 rounded-xl border border-main-whiteMarble bg-main-luxuryWhite flex items-center justify-center text-main-sharkGray text-sm">
                          {t("verification:details.pdfPreviewLabel")}
                        </div>
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
                <p className="text-main-sharkGray text-xs">{t("verification:details.nationalIdExpiryRequired")}</p>
                <Input
                  type="date"
                  value={nationalIdExpiry}
                  onChange={(e) => {
                    setNationalIdExpiry(e.target.value);
                    if (nationalIdExpiryError) setNationalIdExpiryError(null);
                  }}
                  className="h-10"
                  disabled={updating}
                />
                {nationalIdExpiryError ? (
                  <p className="text-xs font-medium text-main-red">{nationalIdExpiryError}</p>
                ) : null}

                <p className="text-main-sharkGray text-xs mt-3">{t("verification:details.licenseExpiryRequired")}</p>
                <Input
                  type="date"
                  value={licenseExpiry}
                  onChange={(e) => {
                    setLicenseExpiry(e.target.value);
                    if (licenseExpiryError) setLicenseExpiryError(null);
                  }}
                  className="h-10"
                  disabled={updating}
                />
                {licenseExpiryError ? (
                  <p className="text-xs font-medium text-main-red">{licenseExpiryError}</p>
                ) : null}
              </div>
              <div className="rounded-2xl border border-main-whiteMarble p-4 space-y-2">
                <p className="text-main-sharkGray text-xs">{t("verification:details.address")}</p>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={t("verification:details.addressPlaceholder")}
                  className="h-10"
                  disabled={updating}
                />
                <p className="text-main-sharkGray text-xs mt-3">{t("verification:details.additionalPhone")}</p>
                <Input
                  value={additionalPhone}
                  onChange={(e) => setAdditionalPhone(e.target.value)}
                  placeholder={t("verification:details.additionalPhonePlaceholder")}
                  className="h-10"
                  disabled={updating}
                />
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
          className="h-10 px-6 bg-main-primary/10 text-main-primary hover:bg-main-primary/15 border border-main-primary/20 rounded-xl font-semibold"
          onClick={() => selectedDocument?.url && window.open(selectedDocument.url, "_blank", "noopener,noreferrer")}
          disabled={!selectedDocument?.url}
        >
          <ExternalLink size={15} />
          {t("verification:details.openInBrowser")}
        </Button>
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

      <CommonModal
      open={documentModalOpen}
      onOpenChange={(next) => {
        setDocumentModalOpen(next);
        if (!next) setSelectedDocument(null);
      }}
      maxWidth="sm:max-w-[980px]"
    >
      <CommonModalHeader
        title={selectedDocument?.label ?? t("verification:details.title")}
        description={t("verification:details.modalDescription")}
      />
      <CommonModalBody className="pb-6">
        {selectedDocument?.previewType === "image" ? (
          <img
            src={selectedDocument.url}
            alt={selectedDocument.label}
            className="w-full max-h-[70vh] rounded-xl object-contain border border-main-whiteMarble bg-main-luxuryWhite"
          />
        ) : selectedDocument?.previewType === "pdf" ? (
          <iframe
            title={selectedDocument.label}
            src={selectedDocument.url}
            className="w-full h-[70vh] rounded-xl border border-main-whiteMarble"
          />
        ) : (
          <div className="rounded-xl border border-dashed border-main-whiteMarble bg-main-luxuryWhite p-8 text-center text-main-sharkGray">
            {t("verification:details.unsupportedType")}
          </div>
        )}
      </CommonModalBody>
      <CommonModalFooter>
        <Button
          type="button"
          variant="ghost"
          className="h-10 px-6"
          onClick={() => setDocumentModalOpen(false)}
        >
          {t("verification:details.close")}
        </Button>
      </CommonModalFooter>
      </CommonModal>
    </>
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
