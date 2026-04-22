import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronDown, ChevronUp, ExternalLink, FileText, IdCard, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageHeader from "@/shared/components/common/PageHeader";
import PageTransition from "@/shared/components/common/PageTransition";
import BackButton from "@/shared/components/common/BackButton";
import { CommonModal, CommonModalBody, CommonModalFooter, CommonModalHeader } from "@/shared/components/common/CommonModal";
import { showToast } from "@/shared/utils/toast";
import useDriverStore from "@/shared/hooks/store/useDriverStore";
import useVerificationStore from "@/shared/hooks/store/useVerificationStore";
import { driverStatusStyles, type TDriverStatus } from "@/shared/core/pages/drivers";
import { formatAppDateLong } from "@/lib/formatLocaleDate";

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

const DRIVER_STATUS_OPTIONS: TDriverStatus[] = [
  "pending",
  "approved",
  "suspended",
  "blocked",
  "rejected",
  "deleted",
];

const isDriverStatus = (value: string): value is TDriverStatus => DRIVER_STATUS_OPTIONS.includes(value as TDriverStatus);

const toInputDate = (value?: string | null) => {
  if (!value) return "";
  return value.slice(0, 10);
};

const toIsoDateString = (value: string) => new Date(`${value}T00:00:00.000Z`).toISOString();

const DriverFullViewPage = () => {
  const { t, i18n } = useTranslation(["drivers", "common"]);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const driverId = Number(id);
  const isValidId = Number.isInteger(driverId) && driverId > 0;

  const {
    details,
    detailsLoading,
    expiriesUpdating,
    fetchVerificationDetails,
    clearVerificationDetails,
    updateVerificationExpiries,
  } = useVerificationStore();
  const { updateStatus, updating: statusUpdating } = useDriverStore();

  const [documentsExpanded, setDocumentsExpanded] = useState(true);
  const [expiriesExpanded, setExpiriesExpanded] = useState(true);
  const [nationalIdExpiry, setNationalIdExpiry] = useState("");
  const [licenseExpiry, setLicenseExpiry] = useState("");
  const [initialNationalIdExpiry, setInitialNationalIdExpiry] = useState("");
  const [initialLicenseExpiry, setInitialLicenseExpiry] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<ISelectedDocument | null>(null);
  const [documentModalOpen, setDocumentModalOpen] = useState(false);
  const [selectedDriverStatus, setSelectedDriverStatus] = useState<TDriverStatus>("pending");

  useEffect(() => {
    if (!isValidId) return;
    fetchVerificationDetails(driverId);
    return () => clearVerificationDetails();
  }, [clearVerificationDetails, driverId, fetchVerificationDetails, isValidId]);

  useEffect(() => {
    if (!details) return;
    const nextNational = toInputDate(details.documents.national_id_expiry);
    const nextLicense = toInputDate(details.documents.license_expiry);
    queueMicrotask(() => {
      setNationalIdExpiry(nextNational);
      setLicenseExpiry(nextLicense);
      setInitialNationalIdExpiry(nextNational);
      setInitialLicenseExpiry(nextLicense);
      const nextStatus = isDriverStatus(details.verification.status) ? details.verification.status : "pending";
      setSelectedDriverStatus(nextStatus);
    });
  }, [details]);

  const documents = useMemo(() => {
    if (!details) return [];
    return [
      {
        key: "profile_image",
        label: t("fullView.documents.profileImage"),
        value: details.documents.profile_image,
        icon: ShieldCheck,
      },
      {
        key: "national_id_front",
        label: t("fullView.documents.nationalIdFront"),
        value: details.documents.national_id_front,
        icon: IdCard,
      },
      {
        key: "national_id_back",
        label: t("fullView.documents.nationalIdBack"),
        value: details.documents.national_id_back,
        icon: IdCard,
      },
      {
        key: "license_front",
        label: t("fullView.documents.licenseFront"),
        value: details.documents.license_front,
        icon: IdCard,
      },
      {
        key: "license_back",
        label: t("fullView.documents.licenseBack"),
        value: details.documents.license_back,
        icon: IdCard,
      },
      {
        key: "criminal_record",
        label: t("fullView.documents.criminalRecord"),
        value: details.documents.criminal_record,
        icon: FileText,
      },
    ].filter((item) => item.value);
  }, [details, t]);

  const payload = useMemo(() => {
    const next: { national_id_expiry?: string; license_expiry?: string } = {};
    if (nationalIdExpiry && nationalIdExpiry !== initialNationalIdExpiry) {
      next.national_id_expiry = toIsoDateString(nationalIdExpiry);
    }
    if (licenseExpiry && licenseExpiry !== initialLicenseExpiry) {
      next.license_expiry = toIsoDateString(licenseExpiry);
    }
    return next;
  }, [initialLicenseExpiry, initialNationalIdExpiry, licenseExpiry, nationalIdExpiry]);

  const canSaveExpiries = Object.keys(payload).length > 0 && !expiriesUpdating;

  const handleSaveExpiries = async () => {
    if (!isValidId || !canSaveExpiries) return;
    try {
      await updateVerificationExpiries(driverId, payload);
      showToast(t("fullView.expiries.saved"), "success");
    } catch {
      showToast(t("fullView.expiries.saveFailed"), "error");
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

  const currentDriverStatus: TDriverStatus = details && isDriverStatus(details.verification.status)
    ? details.verification.status
    : "pending";

  const handleSaveStatus = async () => {
    if (!isValidId || selectedDriverStatus === currentDriverStatus) return;
    try {
      await updateStatus(driverId, selectedDriverStatus);
      await fetchVerificationDetails(driverId);
      showToast(t("fullView.status.saved"), "success");
    } catch {
      showToast(t("fullView.status.saveFailed"), "error");
    }
  };

  if (!isValidId) {
    return (
      <PageTransition>
        <PageHeader title={t("fullView.invalidTitle")} description={t("fullView.invalidDescription")} />
      </PageTransition>
    );
  }

  const statusKey = currentDriverStatus;
  const statusStyle = driverStatusStyles[statusKey] ?? driverStatusStyles.pending;

  return (
    <PageTransition>
      <PageHeader title={t("fullView.title")} description={t("fullView.description")} />

      <div className="mb-6">
        <BackButton
          label={t("fullView.backToDrivers")}
          onClick={() => navigate("/drivers")}
        />
      </div>

      {detailsLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-28 rounded-2xl bg-main-whiteMarble" />
          <div className="h-56 rounded-2xl bg-main-whiteMarble" />
          <div className="h-56 rounded-2xl bg-main-whiteMarble" />
        </div>
      ) : !details ? (
        <div className="rounded-2xl border border-main-whiteMarble bg-main-white p-6 text-main-sharkGray">
          {t("fullView.notFound")}
        </div>
      ) : (
        <div className="space-y-6">
          <section className="rounded-2xl border border-main-whiteMarble bg-main-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-main-mirage text-lg font-bold">{details.driver.name ?? t("defaultDriverName")}</p>
                <p className="text-main-sharkGray text-sm">{details.driver.email ?? "—"}</p>
                <p className="text-main-sharkGray text-xs mt-1">
                  {t("fullView.joinedOn", {
                    date: formatAppDateLong(details.driver.created_at, i18n.language),
                  })}
                </p>
              </div>
              <span className={clsx("px-3 py-1 rounded-full text-xs font-medium", statusStyle.bg, statusStyle.text)}>
                {t(`statuses.${statusKey}`)}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <InfoCard label={t("fullView.phone")} value={details.driver.phone} />
              <InfoCard label={t("fullView.additionalPhone")} value={details.documents.additional_phone ?? "—"} />
              <InfoCard label={t("fullView.address")} value={details.documents.address ?? "—"} />
              <InfoCard label={t("fullView.verificationNotes")} value={details.verification.notes ?? "—"} />
            </div>

            <div className="mt-4 rounded-xl border border-main-whiteMarble bg-main-luxuryWhite p-4">
              <p className="text-xs text-main-sharkGray mb-2">{t("fullView.status.label")}</p>
              <div className="flex flex-wrap items-center gap-3">
                <Select
                  value={selectedDriverStatus}
                  onValueChange={(value) => setSelectedDriverStatus(value as TDriverStatus)}
                >
                  <SelectTrigger className="w-full md:w-[260px] h-10 bg-main-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {DRIVER_STATUS_OPTIONS.map((status) => {
                      const style = driverStatusStyles[status];
                      return (
                        <SelectItem key={status} value={status}>
                          <span className={clsx("px-2 py-0.5 rounded-full text-xs font-medium", style.bg, style.text)}>
                            {t(`statuses.${status}`)}
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                <Button
                  type="button"
                  onClick={handleSaveStatus}
                  disabled={statusUpdating || selectedDriverStatus === currentDriverStatus}
                  className="h-10 px-6 bg-main-primary text-main-white"
                >
                  {statusUpdating ? t("fullView.status.saving") : t("fullView.status.save")}
                </Button>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-main-whiteMarble bg-main-white overflow-hidden">
            <ToggleHeader
              title={t("fullView.documents.title")}
              description={t("fullView.documents.description")}
              expanded={documentsExpanded}
              onToggle={() => setDocumentsExpanded((prev) => !prev)}
            />

            {documentsExpanded ? (
              <div className="p-5 pt-0">
                {documents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {documents.map((doc) => {
                      const Icon = doc.icon;
                      const value = doc.value as string;
                      const previewType = detectDocumentPreviewType(value);
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
                              {t("fullView.documents.openInModal")}
                              <ExternalLink size={13} />
                            </button>
                          </div>
                          {previewType === "image" ? (
                            <img
                              src={value}
                              alt={doc.label}
                              className="w-full h-48 rounded-xl object-cover border border-main-whiteMarble"
                            />
                          ) : previewType === "pdf" ? (
                            <div className="h-48 rounded-xl border border-main-whiteMarble bg-main-luxuryWhite flex items-center justify-center text-main-sharkGray text-sm">
                              {t("fullView.documents.pdfPreviewLabel")}
                            </div>
                          ) : (
                            <div className="h-48 rounded-xl border border-dashed border-main-whiteMarble bg-main-luxuryWhite flex items-center justify-center text-main-sharkGray text-sm">
                              {t("fullView.documents.previewUnavailable")}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-xl border border-main-whiteMarble bg-main-luxuryWhite p-5 text-center text-main-sharkGray">
                    {t("fullView.documents.empty")}
                  </div>
                )}
              </div>
            ) : null}
          </section>

          <section className="rounded-2xl border border-main-whiteMarble bg-main-white overflow-hidden">
            <ToggleHeader
              title={t("fullView.expiries.title")}
              description={t("fullView.expiries.description")}
              expanded={expiriesExpanded}
              onToggle={() => setExpiriesExpanded((prev) => !prev)}
            />

            {expiriesExpanded ? (
              <div className="p-5 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-main-sharkGray mb-2">{t("fullView.expiries.nationalIdLabel")}</p>
                    <Input
                      type="date"
                      value={nationalIdExpiry}
                      onChange={(e) => setNationalIdExpiry(e.target.value)}
                      className="h-11"
                      disabled={expiriesUpdating}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-main-sharkGray mb-2">{t("fullView.expiries.licenseLabel")}</p>
                    <Input
                      type="date"
                      value={licenseExpiry}
                      onChange={(e) => setLicenseExpiry(e.target.value)}
                      className="h-11"
                      disabled={expiriesUpdating}
                    />
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button
                    type="button"
                    onClick={handleSaveExpiries}
                    disabled={!canSaveExpiries}
                    className="h-11 px-8 bg-main-primary text-main-white"
                  >
                    {expiriesUpdating ? t("fullView.expiries.saving") : t("fullView.expiries.save")}
                  </Button>
                </div>
              </div>
            ) : null}
          </section>
        </div>
      )}

      <CommonModal
        open={documentModalOpen}
        onOpenChange={(open) => {
          setDocumentModalOpen(open);
          if (!open) setSelectedDocument(null);
        }}
        maxWidth="sm:max-w-[960px]"
      >
        <CommonModalHeader
          title={selectedDocument?.label ?? t("fullView.documents.title")}
          description={t("fullView.documents.modalDescription")}
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
              {t("fullView.documents.unsupportedType")}
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
            {t("fullView.documents.openInBrowser")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="h-10 px-6"
            onClick={() => setDocumentModalOpen(false)}
          >
            {t("fullView.documents.close")}
          </Button>
        </CommonModalFooter>
      </CommonModal>
    </PageTransition>
  );
};

const ToggleHeader = ({
  title,
  description,
  expanded,
  onToggle,
}: {
  title: string;
  description: string;
  expanded: boolean;
  onToggle: () => void;
}) => (
  <button
    type="button"
    className="w-full px-5 py-4 flex items-center justify-between gap-3 text-start"
    onClick={onToggle}
  >
    <div>
      <p className="text-main-mirage font-semibold">{title}</p>
      <p className="text-main-sharkGray text-sm">{description}</p>
    </div>
    {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
  </button>
);

const InfoCard = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl border border-main-whiteMarble bg-main-luxuryWhite p-3">
    <p className="text-main-sharkGray text-xs">{label}</p>
    <p className="text-main-mirage text-sm font-semibold mt-1 wrap-break-word">{value}</p>
  </div>
);

export default DriverFullViewPage;
