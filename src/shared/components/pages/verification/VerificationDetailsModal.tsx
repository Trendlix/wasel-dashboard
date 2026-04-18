import { useEffect, useMemo, useState } from "react";
import { ExternalLink, FileText, IdCard, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  CommonModal,
  CommonModalBody,
  CommonModalFooter,
  CommonModalHeader,
} from "@/shared/components/common/CommonModal";
import { verificationStatusStyles } from "@/shared/core/pages/verification";
import useVerificationStore, {
  type IAppVerificationItem,
} from "@/shared/hooks/store/useVerificationStore";

interface VerificationDetailsModalProps {
  open: boolean;
  verification: IAppVerificationItem | null;
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

const isImageDocument = (url: string) => /\.(png|jpe?g|webp|gif|avif|svg)$/i.test(url);

const VerificationDetailsModal = ({
  open,
  verification,
  onOpenChange,
}: VerificationDetailsModalProps) => {
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

  useEffect(() => {
    if (open && verification) {
      fetchVerificationDetails(verification.id);
    }
    if (!open) {
      clearVerificationDetails();
      setRejectReason("");
      setVerificationNotes("");
      setReasonError(null);
    }
  }, [open, verification?.id]);

  useEffect(() => {
    if (!details) return;
    setRejectReason(details.verification.rejected_reason ?? "");
    setVerificationNotes(details.verification.notes ?? "");
  }, [details]);

  const documents = useMemo(() => {
    if (!details) return [];
    const docs = details.documents;
    return [
      { key: "profile_image", label: "Profile Image", value: docs.profile_image, icon: ShieldCheck },
      { key: "national_id_front", label: "National ID (Front)", value: docs.national_id_front, icon: IdCard },
      { key: "national_id_back", label: "National ID (Back)", value: docs.national_id_back, icon: IdCard },
      { key: "license_front", label: "License (Front)", value: docs.license_front, icon: IdCard },
      { key: "license_back", label: "License (Back)", value: docs.license_back, icon: IdCard },
      { key: "criminal_record", label: "Criminal Record", value: docs.criminal_record, icon: FileText },
    ].filter((doc) => doc.value);
  }, [details]);

  const handleApprove = async () => {
    if (!verification) return;
    await updateVerificationStatus(verification.id, {
      status: "approved",
      verification_notes: verificationNotes.trim() || undefined,
    });
    onOpenChange(false);
  };

  const handleReject = async () => {
    if (!verification) return;
    const reason = rejectReason.trim() || "Rejected by admin";
    try {
      setReasonError(null);
      await updateVerificationStatus(verification.id, {
        status: "rejected",
        reason_for_rejection: reason,
        verification_notes: verificationNotes.trim() || undefined,
      });
      onOpenChange(false);
    } catch (error) {
      setReasonError("Failed to reject verification. Please try again.");
    }
  };

  if (!verification) return null;

  const displayStatus = details?.verification.status ?? verification.status;
  const statusStyle = verificationStatusStyles[displayStatus];
  const name = details?.driver.name ?? verification.name ?? "Driver";

  return (
    <CommonModal
      open={open}
      onOpenChange={onOpenChange}
      loading={updating}
      maxWidth="sm:max-w-[980px]"
    >
      <CommonModalHeader
        title="Verification Documents"
        description="Review uploaded documents and decide whether to approve or reject this verification request."
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
                  {details.driver.email ?? "No email"} • {details.driver.phone}
                </p>
                <p className="text-main-sharkGray text-xs mt-1">
                  Submitted: {formatDate(details.driver.created_at)}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                {statusStyle.label}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.length > 0 ? (
                documents.map((doc) => {
                  const Icon = doc.icon;
                  const value = doc.value as string;
                  return (
                    <div key={doc.key} className="rounded-2xl border border-main-whiteMarble p-4 bg-main-white">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-main-mirage font-semibold flex items-center gap-2">
                          <Icon size={15} />
                          {doc.label}
                        </p>
                        <a
                          href={value}
                          target="_blank"
                          rel="noreferrer"
                          className="text-main-primary text-xs font-semibold inline-flex items-center gap-1 hover:underline"
                        >
                          Open
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
                          Preview unavailable
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full rounded-2xl border border-main-whiteMarble bg-main-luxuryWhite p-6 text-center text-main-sharkGray">
                  No uploaded documents found.
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-main-whiteMarble p-4 space-y-2">
                <p className="text-main-sharkGray text-xs">National ID Expiry</p>
                <p className="text-main-mirage font-semibold">{formatDate(details.documents.national_id_expiry)}</p>
                <p className="text-main-sharkGray text-xs mt-3">License Expiry</p>
                <p className="text-main-mirage font-semibold">{formatDate(details.documents.license_expiry)}</p>
              </div>
              <div className="rounded-2xl border border-main-whiteMarble p-4 space-y-2">
                <p className="text-main-sharkGray text-xs">Address</p>
                <p className="text-main-mirage font-semibold">{details.documents.address ?? "-"}</p>
                <p className="text-main-sharkGray text-xs mt-3">Additional Phone</p>
                <p className="text-main-mirage font-semibold">{details.documents.additional_phone ?? "-"}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-main-mirage text-sm font-semibold">Verification Notes</p>
              <Textarea
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                placeholder="Add internal notes for this verification..."
                className="min-h-[90px]"
                disabled={updating}
              />
            </div>

            <div className="space-y-2">
              <p className="text-main-mirage text-sm font-semibold">Rejection Reason</p>
              <Textarea
                value={rejectReason}
                onChange={(e) => {
                  setRejectReason(e.target.value);
                  if (reasonError) setReasonError(null);
                }}
                placeholder="Required when rejecting verification..."
                className="min-h-[90px]"
                disabled={updating}
              />
              {reasonError ? (
                <p className="text-main-remove text-xs font-medium">{reasonError}</p>
              ) : null}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-main-whiteMarble bg-main-luxuryWhite p-6 text-center text-main-sharkGray">
            Unable to load verification details.
          </div>
        )}
      </CommonModalBody>

      <CommonModalFooter>
        <Button
          type="button"
          variant="ghost"
          className="h-11 px-7 text-main-sharkGray hover:bg-main-titaniumWhite"
          onClick={() => onOpenChange(false)}
          disabled={updating}
        >
          Cancel
        </Button>
        <div className="ml-auto flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-11 px-7 border-main-remove text-main-remove hover:bg-main-remove/10"
            onClick={handleReject}
            disabled={updating || detailsLoading}
          >
            {updating ? "Rejecting..." : "Reject"}
          </Button>
          <Button
            type="button"
            className="h-11 px-7 bg-main-vividMint text-main-white hover:bg-main-vividMint/90"
            onClick={handleApprove}
            disabled={updating || detailsLoading}
          >
            {updating ? "Approving..." : "Approve"}
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
