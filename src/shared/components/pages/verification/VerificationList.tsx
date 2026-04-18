import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { FileText, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import TablePagination from "@/shared/components/common/TablePagination";
import {
  verificationStatusStyles,
  type TVerificationStatus,
} from "@/shared/core/pages/verification";
import useVerificationStore, {
  type IAppVerificationItem,
} from "@/shared/hooks/store/useVerificationStore";
import VerificationDetailsModal from "./VerificationDetailsModal";
import {
  CommonModal,
  CommonModalBody,
  CommonModalFooter,
  CommonModalHeader,
} from "@/shared/components/common/CommonModal";

type TTab = TVerificationStatus;

const tabs: TTab[] = ["pending", "approved", "rejected"];

const VerificationList = () => {
  const {
    verifications,
    meta,
    counts,
    loading,
    query,
    fetchVerifications,
    setQuery,
    setPage,
    updateVerificationStatus,
    updating,
  } = useVerificationStore();

  const [activeTab, setActiveTab] = useState<TTab>(query.status ?? "pending");
  const [searchInput, setSearchInput] = useState("");
  const [selectedVerification, setSelectedVerification] = useState<IAppVerificationItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: "approve" | "reject";
    verification: IAppVerificationItem;
  } | null>(null);

  useEffect(() => {
    fetchVerifications({ ...query, status: activeTab });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery({
        status: activeTab,
        search: searchInput.trim() || undefined,
      });
    }, 350);
    return () => clearTimeout(timer);
  }, [activeTab, searchInput]);

  const openActionConfirmation = (
    type: "approve" | "reject",
    verification: IAppVerificationItem,
  ) => {
    setConfirmAction({ type, verification });
    setConfirmModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;

    if (confirmAction.type === "approve") {
      await updateVerificationStatus(confirmAction.verification.id, { status: "approved" });
    } else {
      await updateVerificationStatus(confirmAction.verification.id, {
        status: "rejected",
        reason_for_rejection: "Rejected by admin",
      });
    }

    setConfirmModalOpen(false);
    setConfirmAction(null);
  };

  const currentCount = useMemo(
    () => ({
      pending: counts.pending,
      approved: counts.approved,
      rejected: counts.rejected,
    }),
    [counts],
  );

  const currentPage = meta?.current_page ?? 1;
  const totalPages = meta?.total_pages ?? 1;
  const showPagination = !loading && verifications.length > 0 && totalPages > 1;

  return (
    <div className="bg-main-white border border-main-whiteMarble common-rounded overflow-hidden">
      <div className="border-b border-main-whiteMarble px-4">
        <div className="flex items-center gap-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                "h-10 text-sm font-semibold border-b-2 transition",
                activeTab === tab
                  ? "text-main-primary border-main-primary"
                  : "text-main-hydrocarbon border-transparent",
              )}
            >
              {verificationStatusStyles[tab].label} ({currentCount[tab]})
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border-b border-main-whiteMarble">
        <div className="h-10 border border-main-whiteMarble common-rounded px-3 flex items-center gap-2">
          <Search size={16} className="text-main-silverSteel" />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name or type..."
            className="w-full bg-transparent outline-none text-sm placeholder:text-main-silverSteel"
          />
        </div>
      </div>

      <div>
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <VerificationRowSkeleton key={i} />)
        ) : verifications.length > 0 ? (
          verifications.map((item) => (
            <VerificationRow
              key={item.id}
              item={item}
              updating={updating}
              onViewDocuments={() => {
                setSelectedVerification(item);
                setModalOpen(true);
              }}
              onApprove={() => openActionConfirmation("approve", item)}
              onReject={() => openActionConfirmation("reject", item)}
            />
          ))
        ) : (
          <div className="p-6 text-center text-main-sharkGray text-sm">
            No verification requests found.
          </div>
        )}
      </div>

      {showPagination ? (
        <div className="border-t border-main-whiteMarble">
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      ) : null}

      <VerificationDetailsModal
        open={modalOpen}
        verification={selectedVerification}
        onOpenChange={setModalOpen}
      />

      <CommonModal
        open={confirmModalOpen}
        onOpenChange={(v) => {
          setConfirmModalOpen(v);
          if (!v) setConfirmAction(null);
        }}
        loading={updating}
      >
        <CommonModalHeader
          title={`${confirmAction?.type === "approve" ? "Approve" : "Reject"} Verification`}
          description={
            confirmAction
              ? `Are you sure you want to ${confirmAction.type} verification for ${confirmAction.verification.name ?? "this driver"}?`
              : "Please confirm this action."
          }
        />
        <CommonModalBody className="pt-0">
          <p className="text-sm text-main-sharkGray">
            This action will update the verification status immediately.
          </p>
        </CommonModalBody>
        <CommonModalFooter>
          <Button
            type="button"
            variant="ghost"
            className="h-11 px-7 text-main-sharkGray hover:bg-main-titaniumWhite"
            onClick={() => {
              setConfirmModalOpen(false);
              setConfirmAction(null);
            }}
            disabled={updating}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className={clsx(
              "h-11 px-7 text-main-white",
              confirmAction?.type === "approve"
                ? "bg-main-vividMint hover:bg-main-vividMint/90"
                : "bg-main-remove hover:bg-main-remove/90",
            )}
            onClick={handleConfirmAction}
            disabled={updating || !confirmAction}
          >
            {updating
              ? "Saving..."
              : confirmAction?.type === "approve"
                ? "Confirm Approve"
                : "Confirm Reject"}
          </Button>
        </CommonModalFooter>
      </CommonModal>
    </div>
  );
};

const VerificationRow = ({
  item,
  updating,
  onViewDocuments,
  onApprove,
  onReject,
}: {
  item: IAppVerificationItem;
  updating: boolean;
  onViewDocuments: () => void;
  onApprove: () => void;
  onReject: () => void;
}) => {
  const initials = (item.name ?? "Driver")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const status = verificationStatusStyles[item.status];
  const submittedAt = new Date(item.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const documents = [
    item.profile?.national_id_front ? "ID" : null,
    item.profile?.license_front ? "License" : null,
    item.profile?.criminal_record ? "Criminal Record" : null,
  ].filter(Boolean) as string[];

  return (
    <div className="p-4 border-b border-main-whiteMarble flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-main-primary text-main-white flex items-center justify-center font-bold">
          {initials}
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="text-main-mirage font-semibold">{item.name ?? "Driver"}</h4>
            <p className="text-main-sharkGray text-xs">
              Driver • {submittedAt}
            </p>
          </div>

          <div>
            <p className="text-main-sharkGray text-xs mb-2">Submitted Documents:</p>
            <div className="flex flex-wrap gap-2">
              {(documents.length > 0 ? documents : ["No docs in list"]).map((doc) => (
                <span
                  key={doc}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-main-luxuryWhite text-main-hydrocarbon text-xs border border-main-whiteMarble"
                >
                  <FileText size={12} />
                  {doc}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onViewDocuments}
              disabled={updating}
              className="h-8 px-4 text-xs font-semibold bg-main-primary text-main-white rounded-md disabled:opacity-60"
            >
              View Documents
            </button>
            <button
              onClick={onApprove}
              disabled={updating}
              className="h-8 px-4 text-xs font-semibold bg-main-vividMint text-main-white rounded-md disabled:opacity-60"
            >
              Approve
            </button>
            <button
              onClick={onReject}
              disabled={updating}
              className="h-8 px-4 text-xs font-semibold bg-main-remove text-main-white rounded-md disabled:opacity-60"
            >
              Reject
            </button>
          </div>
        </div>
      </div>

      <span className={clsx("px-3 py-1 rounded-full text-xs font-medium", status.bg, status.text)}>
        {status.label}
      </span>
    </div>
  );
};

const VerificationRowSkeleton = () => (
  <div className="p-4 border-b border-main-whiteMarble animate-pulse">
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3 flex-1">
        <div className="w-10 h-10 rounded-full bg-main-whiteMarble" />
        <div className="space-y-3 w-full">
          <div className="space-y-2">
            <div className="h-4 w-36 rounded bg-main-whiteMarble" />
            <div className="h-3 w-28 rounded bg-main-whiteMarble" />
          </div>
          <div className="flex gap-2">
            <div className="h-7 w-20 rounded bg-main-whiteMarble" />
            <div className="h-7 w-20 rounded bg-main-whiteMarble" />
            <div className="h-7 w-24 rounded bg-main-whiteMarble" />
          </div>
        </div>
      </div>
      <div className="h-6 w-16 rounded-full bg-main-whiteMarble" />
    </div>
  </div>
);

export default VerificationList;
