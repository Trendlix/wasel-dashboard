import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { FileText, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { formatAppDateShort } from "@/lib/formatLocaleDate";
import NoDataFound from "@/shared/components/common/NoDataFound";

type TStatusTab = Exclude<TVerificationStatus, "suspended">;
type TFlowTab = "registration" | "re_verification";

const VerificationList = ({
  flowType,
  statusTab,
}: {
  flowType: TFlowTab;
  statusTab: TStatusTab;
}) => {
  const { t } = useTranslation(["verification", "common"]);
  const navigate = useNavigate();
  const {
    verifications,
    meta,
    loading,
    query,
    setQuery,
    setPage,
    fetchVerificationCounts,
    updateVerificationStatus,
    updating,
  } = useVerificationStore();

  const [searchInput, setSearchInput] = useState("");
  const [selectedVerification, setSelectedVerification] = useState<IAppVerificationItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: "approve" | "reject";
    verification: IAppVerificationItem;
  } | null>(null);
  const [confirmMessage, setConfirmMessage] = useState("");
  const previousFlowTypeRef = useRef<TFlowTab | null>(null);
  const effectiveStatus = flowType === "re_verification" && statusTab === "pending"
    ? "suspended"
    : statusTab;

  useEffect(() => {
    setQuery({ flow_type: flowType, status: effectiveStatus });

    if (previousFlowTypeRef.current !== flowType) {
      fetchVerificationCounts();
      previousFlowTypeRef.current = flowType;
    }
  }, [effectiveStatus, fetchVerificationCounts, flowType, setQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const normalizedSearch = searchInput.trim() || undefined;
      if (normalizedSearch === query.search) return;

      setQuery({
        flow_type: flowType,
        status: effectiveStatus,
        search: normalizedSearch,
      });
    }, 350);
    return () => clearTimeout(timer);
  }, [effectiveStatus, flowType, query.search, searchInput, setQuery]);

  const openActionConfirmation = (
    type: "approve" | "reject",
    verification: IAppVerificationItem,
  ) => {
    setConfirmAction({ type, verification });
    setConfirmMessage("");
    setConfirmModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;
    const trimmedMessage = confirmMessage.trim();

    if (confirmAction.type === "approve") {
      await updateVerificationStatus(confirmAction.verification.id, {
        status: "approved",
        verification_notes: trimmedMessage || undefined,
      });
    } else {
      await updateVerificationStatus(confirmAction.verification.id, {
        status: "rejected",
        reason_for_rejection: trimmedMessage || undefined,
      });
    }

    setConfirmModalOpen(false);
    setConfirmAction(null);
    setConfirmMessage("");
  };

  const currentPage = meta?.current_page ?? 1;
  const totalPages = meta?.total_pages ?? 1;
  const showPagination = !loading && verifications.length > 0 && totalPages > 1;

  const confirmName =
    confirmAction?.verification.name ?? t("verification:confirm.nameFallback");

  return (
    <div className="bg-main-white border border-main-whiteMarble common-rounded overflow-hidden">
      <div className="p-4 border-b border-main-whiteMarble">
        <div className="h-10 border border-main-whiteMarble common-rounded px-3 flex items-center gap-2">
          <Search size={16} className="text-main-silverSteel shrink-0" />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t("verification:list.searchPlaceholder")}
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
              onFullView={() => navigate(`/verification/${item.id}`)}
            />
          ))
        ) : (
          <div className="p-2">
            <NoDataFound
              title={t("verification:list.empty")}
              description={t("verification:list.emptyDescription")}
            />
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
          if (!v) {
            setConfirmAction(null);
            setConfirmMessage("");
          }
        }}
        loading={updating}
        variant={confirmAction?.type === "approve" ? "success" : "danger"}
      >
        <CommonModalHeader
          title={
            confirmAction?.type === "approve"
              ? t("verification:confirm.approveTitle")
              : t("verification:confirm.rejectTitle")
          }
          description={
            confirmAction
              ? confirmAction.type === "approve"
                ? t("verification:confirm.approveDescription", { name: confirmName })
                : t("verification:confirm.rejectDescription", { name: confirmName })
              : t("verification:confirm.fallbackDescription")
          }
        />
        <CommonModalBody className="pt-0">
          <p className="text-sm text-main-sharkGray mb-3">{t("verification:confirm.note")}</p>
          <Textarea
            value={confirmMessage}
            onChange={(event) => setConfirmMessage(event.target.value)}
            placeholder={t("verification:confirm.messagePlaceholder")}
            className="min-h-[110px] border-main-whiteMarble focus-visible:ring-main-primary/30"
          />
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
            {t("common:cancel")}
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
              ? t("verification:confirm.saving")
              : confirmAction?.type === "approve"
                ? t("verification:confirm.confirmApprove")
                : t("verification:confirm.confirmReject")}
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
  onFullView,
}: {
  item: IAppVerificationItem;
  updating: boolean;
  onViewDocuments: () => void;
  onApprove: () => void;
  onReject: () => void;
  onFullView: () => void;
}) => {
  const { t, i18n } = useTranslation("verification");
  const initials = (item.name ?? t("list.driverLabel"))
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const statusKey = (["pending", "approved", "rejected", "suspended"] as const).includes(item.status)
    ? item.status
    : "pending";
  const status = verificationStatusStyles[statusKey];
  const submittedAt = formatAppDateShort(item.created_at, i18n.language, "—");

  const docLabels = [
    item.profile?.national_id_front ? t("list.docId") : null,
    item.profile?.license_front ? t("list.docLicense") : null,
    item.profile?.criminal_record ? t("list.docCriminal") : null,
  ].filter(Boolean) as string[];

  return (
    <div className="p-4 border-b border-main-whiteMarble flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-main-primary text-main-white flex items-center justify-center font-bold">
          {initials}
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="text-main-mirage font-semibold">{item.name ?? t("list.driverLabel")}</h4>
            <p className="text-main-sharkGray text-xs">
              {t("list.driverLabel")} • {submittedAt}
            </p>
          </div>

          <div>
            <p className="text-main-sharkGray text-xs mb-2">{t("list.submittedDocuments")}</p>
            <div className="flex flex-wrap gap-2">
              {(docLabels.length > 0 ? docLabels : [t("list.noDocsListed")]).map((doc, idx) => (
                <span
                  key={`${doc}-${idx}`}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-main-luxuryWhite text-main-hydrocarbon text-xs border border-main-whiteMarble"
                >
                  <FileText size={12} />
                  {doc}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={onFullView}
              disabled={updating}
              className="h-8 px-4 text-xs font-semibold border border-main-primary text-main-primary rounded-md hover:bg-main-primary/5 disabled:opacity-60"
            >
              {t("list.fullView")}
            </button>
            <button
              type="button"
              onClick={onViewDocuments}
              disabled={updating}
              className="h-8 px-4 text-xs font-semibold bg-main-primary text-main-white rounded-md disabled:opacity-60"
            >
              {t("list.viewDocuments")}
            </button>
            <button
              type="button"
              onClick={onApprove}
              disabled={updating}
              className="h-8 px-4 text-xs font-semibold bg-main-vividMint text-main-white rounded-md disabled:opacity-60"
            >
              {t("list.approve")}
            </button>
            <button
              type="button"
              onClick={onReject}
              disabled={updating}
              className="h-8 px-4 text-xs font-semibold bg-main-remove text-main-white rounded-md disabled:opacity-60"
            >
              {t("list.reject")}
            </button>
          </div>
        </div>
      </div>

      <span className={clsx("px-3 py-1 rounded-full text-xs font-medium shrink-0", status.bg, status.text)}>
        {t(`statuses.${statusKey}`)}
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
