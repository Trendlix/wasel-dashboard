import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ChevronDown, ChevronUp, ExternalLink, FileText, IdCard, ShieldCheck, Truck as TruckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageHeader from "@/shared/components/common/PageHeader";
import PageTransition from "@/shared/components/common/PageTransition";
import BackButton from "@/shared/components/common/BackButton";
import { CommonModal, CommonModalBody, CommonModalFooter, CommonModalHeader } from "@/shared/components/common/CommonModal";
import { showToast } from "@/shared/utils/toast";
import useVerificationStore from "@/shared/hooks/store/useVerificationStore";
import { driverStatusStyles, type TDriverStatus } from "@/shared/core/pages/drivers";
import type { TVerificationStatus } from "@/shared/core/pages/verification";
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
  "approved",
  "suspended",
  "rejected",
];
type TAllowedVerificationStatus = Extract<TVerificationStatus, "approved" | "rejected" | "suspended">;

const isDriverStatus = (value: string): value is TDriverStatus => DRIVER_STATUS_OPTIONS.includes(value as TDriverStatus);

const toInputDateTimeLocal = (value?: string | null) => {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  const hours = String(parsed.getHours()).padStart(2, "0");
  const minutes = String(parsed.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const toIsoDateTimeString = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
};

const truckStatusStyles: Record<"pending" | "approved" | "suspended", { bg: string; text: string }> = {
  pending: { bg: "bg-main-vividAmber/15", text: "text-main-vividAmber" },
  approved: { bg: "bg-main-vividMint/15", text: "text-main-vividMint" },
  suspended: { bg: "bg-main-remove/15", text: "text-main-remove" },
};

const noteStatusStyles: Record<TDriverStatus, { badge: string; panel: string; title: string }> = {
  pending: {
    badge: "bg-main-vividAmber/15 text-main-vividAmber",
    panel: "border-main-vividAmber/20 bg-main-vividAmber/5",
    title: "text-main-vividAmber",
  },
  approved: {
    badge: "bg-main-vividMint/15 text-main-vividMint",
    panel: "border-main-vividMint/20 bg-main-vividMint/5",
    title: "text-main-vividMint",
  },
  suspended: {
    badge: "bg-main-remove/15 text-main-remove",
    panel: "border-main-remove/20 bg-main-remove/5",
    title: "text-main-remove",
  },
  rejected: {
    badge: "bg-main-remove/15 text-main-remove",
    panel: "border-main-remove/20 bg-main-remove/5",
    title: "text-main-remove",
  },
  blocked: {
    badge: "bg-main-remove/15 text-main-remove",
    panel: "border-main-remove/20 bg-main-remove/5",
    title: "text-main-remove",
  },
  deleted: {
    badge: "bg-main-remove/15 text-main-remove",
    panel: "border-main-remove/20 bg-main-remove/5",
    title: "text-main-remove",
  },
};

const DriverFullViewPage = () => {
  const { t, i18n } = useTranslation(["drivers", "common"]);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const isVerificationFullView = location.pathname.startsWith("/verification/");
  const driverId = Number(id);
  const isValidId = Number.isInteger(driverId) && driverId > 0;

  const {
    details,
    detailsLoading,
    updating: statusUpdating,
    expiriesUpdating,
    fetchVerificationDetails,
    clearVerificationDetails,
    updateVerificationStatus,
    updateVerificationExpiries,
  } = useVerificationStore();

  const [documentsExpanded, setDocumentsExpanded] = useState(true);
  const [driverUploadsExpanded, setDriverUploadsExpanded] = useState(true);
  const [expiriesExpanded, setExpiriesExpanded] = useState(true);
  const [nationalIdNumber, setNationalIdNumber] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [nationalIdExpiry, setNationalIdExpiry] = useState("");
  const [licenseExpiry, setLicenseExpiry] = useState("");
  const [initialNationalIdNumber, setInitialNationalIdNumber] = useState("");
  const [initialLicenseNumber, setInitialLicenseNumber] = useState("");
  const [initialNationalIdExpiry, setInitialNationalIdExpiry] = useState("");
  const [initialLicenseExpiry, setInitialLicenseExpiry] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<ISelectedDocument | null>(null);
  const [documentModalOpen, setDocumentModalOpen] = useState(false);
  const [selectedDriverStatus, setSelectedDriverStatus] = useState<TDriverStatus>("pending");
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (!isValidId) return;
    fetchVerificationDetails(driverId);
    return () => clearVerificationDetails();
  }, [clearVerificationDetails, driverId, fetchVerificationDetails, isValidId]);

  useEffect(() => {
    if (!details) return;
    const nextNational = toInputDateTimeLocal(details.documents.national_id_expiry);
    const nextLicense = toInputDateTimeLocal(details.documents.license_expiry);
    queueMicrotask(() => {
      setNationalIdNumber(details.documents.national_id_number ?? "");
      setLicenseNumber(details.documents.license_number ?? "");
      setNationalIdExpiry(nextNational);
      setLicenseExpiry(nextLicense);
      setInitialNationalIdNumber(details.documents.national_id_number ?? "");
      setInitialLicenseNumber(details.documents.license_number ?? "");
      setInitialNationalIdExpiry(nextNational);
      setInitialLicenseExpiry(nextLicense);
      const nextStatus = isDriverStatus(details.verification.status) ? details.verification.status : "pending";
      setSelectedDriverStatus(
        DRIVER_STATUS_OPTIONS.includes(nextStatus) ? nextStatus : "approved",
      );
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
    const next: {
      national_id_number?: string;
      national_id_expiry?: string;
      license_number?: string;
      license_expiry?: string;
    } = {};
    if (nationalIdNumber !== initialNationalIdNumber) {
      next.national_id_number = nationalIdNumber;
    }
    if (nationalIdExpiry && nationalIdExpiry !== initialNationalIdExpiry) {
      const iso = toIsoDateTimeString(nationalIdExpiry);
      if (iso) next.national_id_expiry = iso;
    }
    if (licenseNumber !== initialLicenseNumber) {
      next.license_number = licenseNumber;
    }
    if (licenseExpiry && licenseExpiry !== initialLicenseExpiry) {
      const iso = toIsoDateTimeString(licenseExpiry);
      if (iso) next.license_expiry = iso;
    }
    return next;
  }, [
    initialLicenseExpiry,
    initialLicenseNumber,
    initialNationalIdExpiry,
    initialNationalIdNumber,
    licenseExpiry,
    licenseNumber,
    nationalIdExpiry,
    nationalIdNumber,
  ]);

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

    setStatusMessage("");
    setStatusModalOpen(true);
  };

  const handleConfirmSaveStatus = async () => {
    if (!isValidId || selectedDriverStatus === currentDriverStatus) return;

    const trimmedMessage = statusMessage.trim();
    const payload: { status: TAllowedVerificationStatus; verification_notes?: string; reason_for_rejection?: string } = {
      status: selectedDriverStatus as TAllowedVerificationStatus,
    };

    if (trimmedMessage) {
      if (selectedDriverStatus === "approved") {
        payload.verification_notes = trimmedMessage;
      } else if (selectedDriverStatus === "rejected") {
        payload.reason_for_rejection = trimmedMessage;
      }
    }

    try {
      await updateVerificationStatus(driverId, payload);
      await fetchVerificationDetails(driverId);
      showToast(t("fullView.status.saved"), "success");
      setStatusModalOpen(false);
      setStatusMessage("");
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
  const notesVisualStyle = noteStatusStyles[statusKey] ?? noteStatusStyles.pending;
  const statusReasonNote = details?.verification.rejected_reason?.trim() ?? "";
  const isStatusReasonMissing = statusReasonNote.length === 0;
  const verificationAdminNote = details?.verification.notes?.trim() ?? "";

  return (
    <PageTransition>
      <PageHeader title={t("fullView.title")} description={t("fullView.description")} />

      <div className="mb-6">
        <BackButton
          label={isVerificationFullView ? t("common:back") : t("fullView.backToDrivers")}
          onClick={() => navigate(isVerificationFullView ? "/verification" : "/drivers")}
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

          <section className="rounded-2xl border border-main-whiteMarble bg-main-white p-5">
            <div className="mb-3">
              <p className="text-main-mirage font-semibold">{t("fullView.trucks.title")}</p>
              <p className="text-main-sharkGray text-sm">{t("fullView.trucks.description")}</p>
            </div>
            {details.trucks.length === 0 ? (
              <div className="rounded-xl border border-main-whiteMarble bg-main-luxuryWhite p-4 text-main-sharkGray text-sm">
                {t("fullView.trucks.empty")}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {details.trucks.map((truck) => (
                  <div key={truck.id} className="rounded-xl border border-main-whiteMarble bg-main-luxuryWhite p-4">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="min-w-0">
                        <p className="text-main-mirage font-semibold flex items-center gap-2">
                          <TruckIcon size={16} className="shrink-0" />
                          <span className="truncate">{truck.truck_type_name ?? `${t("fullView.trucks.truck")} #${truck.id}`}</span>
                        </p>
                        <p className="text-main-sharkGray text-xs mt-1">
                          {t("fullView.trucks.idLabel")}: #{truck.id}
                        </p>
                      </div>
                      <span
                        className={clsx(
                          "px-2.5 py-1 rounded-full text-xs font-medium shrink-0",
                          truckStatusStyles[truck.status]?.bg ?? "bg-main-whiteMarble",
                          truckStatusStyles[truck.status]?.text ?? "text-main-sharkGray",
                        )}
                      >
                        {t(`fullView.trucks.statusValues.${truck.status}`)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <InfoCard label={t("fullView.trucks.brand")} value={truck.brand || "—"} />
                      <InfoCard label={t("fullView.trucks.year")} value={String(truck.year ?? "—")} />
                      <InfoCard label={t("fullView.trucks.plate")} value={truck.license_plate || "—"} />
                      <InfoCard label={t("fullView.trucks.license")} value={truck.license || "—"} />
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-main-sharkGray mb-1">{t("fullView.trucks.adsOnTruck")}</p>
                      <span
                        className={clsx(
                          "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
                          truck.accepts_ads
                            ? "bg-main-vividMint/15 text-main-vividMint"
                            : "bg-main-whiteMarble text-main-sharkGray",
                        )}
                      >
                        {truck.accepts_ads
                          ? t("fullView.trucks.adsValues.yes")
                          : t("fullView.trucks.adsValues.no")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-main-whiteMarble bg-main-white p-5 shadow-sm">
            <div className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-main-whiteMarble bg-linear-to-r from-main-luxuryWhite to-main-white p-4">
              <div>
                <p className="text-main-mirage font-semibold">{t("fullView.notes.title")}</p>
                <p className="text-main-sharkGray text-sm">{t("fullView.notes.description")}</p>
              </div>
              <span className={clsx("px-3 py-1 rounded-full text-xs font-semibold", notesVisualStyle.badge)}>
                {t(`statuses.${statusKey}`)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={clsx(
                  "rounded-xl border p-4 shadow-sm transition-all",
                  notesVisualStyle.panel,
                  isStatusReasonMissing ? "border-dashed" : "",
                )}
              >
                <p className={clsx("text-sm font-semibold mb-2 tracking-wide flex items-center gap-2", notesVisualStyle.title)}>
                  {t("fullView.notes.statusReasonLabel")}
                </p>
                <p
                  className={clsx(
                    "text-sm leading-6 whitespace-pre-wrap wrap-break-word min-h-[56px] rounded-lg px-3 py-2",
                    isStatusReasonMissing
                      ? "text-main-sharkGray bg-main-white/70 border border-main-whiteMarble/70 italic"
                      : "text-main-mirage bg-main-white/40 border border-main-white/70",
                  )}
                >
                  {isStatusReasonMissing
                    ? t("fullView.notes.statusReasonFallback", { status: t(`statuses.${statusKey}`) })
                    : statusReasonNote}
                </p>
              </div>

              <div className="rounded-xl border border-main-whiteMarble bg-main-luxuryWhite p-4 shadow-sm transition-all">
                <p className="text-sm font-semibold text-main-mirage mb-2 tracking-wide">
                  {t("fullView.notes.verificationNoteLabel")}
                </p>
                <p className="text-sm text-main-mirage leading-6 whitespace-pre-wrap wrap-break-word min-h-[56px]">
                  {verificationAdminNote || t("fullView.notes.verificationNoteFallback")}
                </p>
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

          {(details.driver_documents?.length ?? 0) > 0 ? (
            <section className="rounded-2xl border border-main-whiteMarble bg-main-white overflow-hidden">
              <ToggleHeader
                title={t("fullView.driverUploads.title")}
                description={t("fullView.driverUploads.description")}
                expanded={driverUploadsExpanded}
                onToggle={() => setDriverUploadsExpanded((prev) => !prev)}
              />

              {driverUploadsExpanded ? (
                <div className="p-5 pt-0 space-y-6">
                  {(details.driver_documents ?? []).map((doc) => {
                    const currentUrl = doc.link;
                    const currentPreview = detectDocumentPreviewType(currentUrl);
                    return (
                      <div
                        key={doc.id}
                        className="rounded-xl border border-main-whiteMarble bg-main-luxuryWhite p-4 space-y-4"
                      >
                        <div>
                          <p className="text-main-mirage font-semibold">{doc.name}</p>
                          <p className="text-main-sharkGray text-xs mt-0.5">
                            {t(`fullView.driverUploads.type.${doc.type}`)} · {doc.status}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-main-sharkGray mb-2 font-medium">
                            {t("fullView.driverUploads.current")}
                          </p>
                          <div className="flex items-center justify-end mb-2">
                            <button
                              type="button"
                              onClick={() => handleOpenDocument(doc.name, currentUrl)}
                              className="text-main-primary text-xs font-semibold inline-flex items-center gap-1 hover:underline"
                            >
                              {t("fullView.documents.openInModal")}
                              <ExternalLink size={13} />
                            </button>
                          </div>
                          {currentPreview === "image" ? (
                            <img
                              src={currentUrl}
                              alt={doc.name}
                              className="w-full h-48 rounded-xl object-cover border border-main-whiteMarble"
                            />
                          ) : currentPreview === "pdf" ? (
                            <div className="h-48 rounded-xl border border-main-whiteMarble bg-main-white flex items-center justify-center text-main-sharkGray text-sm">
                              {t("fullView.documents.pdfPreviewLabel")}
                            </div>
                          ) : (
                            <div className="h-48 rounded-xl border border-dashed border-main-whiteMarble bg-main-white flex items-center justify-center text-main-sharkGray text-sm">
                              {t("fullView.documents.previewUnavailable")}
                            </div>
                          )}
                          <div className="mt-2 text-xs text-main-sharkGray space-y-1">
                            {doc.expiry_date ? (
                              <p>
                                {t("fullView.driverUploads.expiry")}:{" "}
                                {formatAppDateLong(doc.expiry_date, i18n.language)}
                              </p>
                            ) : null}
                            <p>
                              {t("fullView.driverUploads.fileName")}: {doc.file_name}
                            </p>
                          </div>
                        </div>

                        {(doc.history?.length ?? 0) > 0 ? (
                          <div>
                            <p className="text-xs text-main-sharkGray mb-2 font-medium">
                              {t("fullView.driverUploads.previousVersions")}
                            </p>
                            <ul className="space-y-3">
                              {doc.history.map((h, idx) => (
                                <li
                                  key={`${h.archived_at}-${idx}`}
                                  className="rounded-lg border border-main-whiteMarble bg-main-white p-3"
                                >
                                  <p className="text-main-sharkGray text-xs">
                                    {t("fullView.driverUploads.archivedOn", {
                                      date: formatAppDateLong(h.archived_at, i18n.language),
                                    })}
                                  </p>
                                  <p className="text-main-sharkGray text-xs mt-1">
                                    {t("fullView.driverUploads.fileName")}: {h.file_name}
                                  </p>
                                  <p className="text-main-sharkGray text-xs mt-1">
                                    {t("fullView.driverUploads.status")}: {h.status}
                                  </p>
                                  {h.expiry_date ? (
                                    <p className="text-main-sharkGray text-xs mt-1">
                                      {t("fullView.driverUploads.expiry")}:{" "}
                                      {formatAppDateLong(h.expiry_date, i18n.language)}
                                    </p>
                                  ) : null}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleOpenDocument(
                                        `${doc.name} — ${h.file_name}`,
                                        h.link,
                                      )
                                    }
                                    className="mt-2 text-main-primary text-xs font-semibold inline-flex items-center gap-1 hover:underline"
                                  >
                                    {t("fullView.documents.openInModal")}
                                    <ExternalLink size={13} />
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </section>
          ) : null}

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
                    <p className="text-xs text-main-sharkGray mb-2">{t("fullView.expiries.nationalIdNumberLabel")}</p>
                    <Input
                      value={nationalIdNumber}
                      onChange={(e) => setNationalIdNumber(e.target.value)}
                      className="h-11"
                      disabled={expiriesUpdating}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-main-sharkGray mb-2">{t("fullView.expiries.licenseNumberLabel")}</p>
                    <Input
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      className="h-11"
                      disabled={expiriesUpdating}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-main-sharkGray mb-2">{t("fullView.expiries.nationalIdLabel")}</p>
                    <Input
                      type="datetime-local"
                      value={nationalIdExpiry}
                      onChange={(e) => setNationalIdExpiry(e.target.value)}
                      className="h-11"
                      disabled={expiriesUpdating}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-main-sharkGray mb-2">{t("fullView.expiries.licenseLabel")}</p>
                    <Input
                      type="datetime-local"
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
        open={statusModalOpen}
        onOpenChange={(open) => {
          setStatusModalOpen(open);
          if (!open) setStatusMessage("");
        }}
        loading={statusUpdating}
      >
        <CommonModalHeader
          title={t("fullView.status.confirmTitle")}
          description={t("fullView.status.confirmDescription", {
            status: t(`statuses.${selectedDriverStatus}`),
          })}
        />
        <CommonModalBody className="space-y-3">
          {(selectedDriverStatus === "approved" || selectedDriverStatus === "rejected") && (
            <>
              <p className="text-sm text-main-sharkGray">
                {selectedDriverStatus === "approved"
                  ? t("fullView.status.approveMessageHint")
                  : t("fullView.status.rejectMessageHint")}
              </p>
              <Textarea
                value={statusMessage}
                onChange={(event) => setStatusMessage(event.target.value)}
                placeholder={t("fullView.status.messagePlaceholder")}
                className="min-h-[110px] border-main-whiteMarble focus-visible:ring-main-primary/30"
              />
            </>
          )}
        </CommonModalBody>
        <CommonModalFooter>
          <Button
            type="button"
            variant="ghost"
            className="h-10 px-6"
            onClick={() => setStatusModalOpen(false)}
            disabled={statusUpdating}
          >
            {t("common:cancel")}
          </Button>
          <Button
            type="button"
            onClick={handleConfirmSaveStatus}
            disabled={statusUpdating}
            className="h-10 px-6 bg-main-primary text-main-white"
          >
            {statusUpdating ? t("fullView.status.saving") : t("fullView.status.save")}
          </Button>
        </CommonModalFooter>
      </CommonModal>

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
