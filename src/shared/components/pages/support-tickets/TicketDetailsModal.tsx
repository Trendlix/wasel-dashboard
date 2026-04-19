import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { CheckCircle, MessageSquare, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    CommonModal,
    CommonModalBody,
    CommonModalFooter,
    CommonModalHeader,
} from "../../common/CommonModal";
import useTicketStore from "@/shared/hooks/store/useTicketStore";
import {
    ticketPriorityStyles,
    ticketStatusStyles,
    getOwnerDisplayName,
    type TTicketStatus,
    type TTicketPriority,
} from "@/shared/core/pages/supportTickets";
import { formatAppDateShort } from "@/lib/formatLocaleDate";

interface TicketDetailsModalProps {
    open: boolean;
    onOpenChange: (v: boolean) => void;
}

type TConfirmAction = "close" | "solve" | null;

const TicketDetailsModal = ({ open, onOpenChange }: TicketDetailsModalProps) => {
    const { t, i18n } = useTranslation(["support", "common"]);
    const navigate = useNavigate();
    const { selectedTicket, detailLoading, closeTicket, solveTicket } = useTicketStore();

    const [confirmAction, setConfirmAction] = useState<TConfirmAction>(null);
    const [acting, setActing] = useState(false);

    const ticket = selectedTicket;
    const owner = ticket?.user ?? ticket?.driver;
    const ownerType = ticket?.user
        ? t("support:owner.user")
        : ticket?.driver
          ? t("support:owner.driver")
          : t("support:owner.unknown");

    const ownerDisplay = owner
        ? (getOwnerDisplayName(owner) || t("support:owner.noName"))
        : t("support:owner.unknown");

    const isClosed = ticket?.status === "closed";
    const isSolved = ticket?.status === "solved";

    const handleConfirm = async () => {
        if (!ticket || !confirmAction) return;
        setActing(true);
        try {
            if (confirmAction === "close") await closeTicket(ticket.id);
            else await solveTicket(ticket.id);
            setConfirmAction(null);
        } finally {
            setActing(false);
        }
    };

    const handleReply = () => {
        if (!ticket) return;
        onOpenChange(false);
        navigate(`/support-tickets/${ticket.id}/reply`);
    };

    const replyCount = ticket?.supports?.length ?? 0;

    return (
        <>
            <CommonModal open={open} onOpenChange={onOpenChange} maxWidth="sm:max-w-[600px]">
                <CommonModalHeader
                    title={
                        detailLoading
                            ? t("support:details.loading")
                            : t("support:details.ticketTitle", { id: ticket?.id ?? "" })
                    }
                    description={ticket?.subject}
                />

                <CommonModalBody className="space-y-5">
                    {detailLoading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-8 rounded-lg bg-main-whiteMarble animate-pulse" />
                            ))}
                        </div>
                    ) : ticket ? (
                        <>
                            <div className="flex flex-wrap gap-2">
                                <StatusBadge status={ticket.status} />
                                <PriorityBadge priority={ticket.priority} />
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-main-primary/10 text-main-primary">
                                    {ticket.category.name}
                                </span>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-xl border border-main-whiteMarble bg-main-luxuryWhite">
                                <div className="w-9 h-9 rounded-full bg-main-primary flex items-center justify-center shrink-0 text-main-white text-sm font-bold">
                                    {ownerDisplay[0]?.toUpperCase() ?? "?"}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-main-mirage">
                                        {ownerDisplay}
                                        <span className="ms-2 text-xs font-normal text-main-sharkGray">
                                            ({ownerType})
                                        </span>
                                    </p>
                                    {owner?.email && (
                                        <p className="text-xs text-main-sharkGray">{owner.email}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-semibold text-main-sharkGray uppercase tracking-wide mb-1.5">
                                    {t("support:details.description")}
                                </p>
                                <p className="text-sm text-main-hydrocarbon leading-relaxed">
                                    {ticket.description}
                                </p>
                            </div>

                            {replyCount > 0 && (
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-main-primary/5 border border-main-primary/10">
                                    <MessageSquare size={15} className="text-main-primary shrink-0" />
                                    <p className="text-sm text-main-primary font-medium">
                                        {t("support:details.replySummary", { count: replyCount })}
                                    </p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3 text-xs text-main-sharkGray">
                                <div>
                                    <span className="font-semibold uppercase tracking-wide">
                                        {t("support:details.created")}
                                    </span>
                                    <p className="mt-0.5 text-main-hydrocarbon">
                                        {formatAppDateShort(ticket.created_at, i18n.language)}
                                    </p>
                                </div>
                                <div>
                                    <span className="font-semibold uppercase tracking-wide">
                                        {t("support:details.lastUpdated")}
                                    </span>
                                    <p className="mt-0.5 text-main-hydrocarbon">
                                        {formatAppDateShort(ticket.updated_at, i18n.language)}
                                    </p>
                                </div>
                            </div>
                        </>
                    ) : null}
                </CommonModalBody>

                {ticket && !detailLoading && (
                    <CommonModalFooter className="justify-between">
                        <div className="flex gap-2">
                            {!isClosed && !isSolved && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setConfirmAction("close")}
                                    className="h-10 px-4 border-main-sharkGray/30 text-main-sharkGray font-semibold"
                                >
                                    <XCircle size={14} />
                                    {t("support:details.close")}
                                </Button>
                            )}
                            {!isSolved && !isClosed && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setConfirmAction("solve")}
                                    className="h-10 px-4 border-main-vividMint/40 text-main-vividMint font-semibold"
                                >
                                    <CheckCircle size={14} />
                                    {t("support:details.solved")}
                                </Button>
                            )}
                        </div>

                        <Button
                            type="button"
                            onClick={handleReply}
                            className="h-10 px-5 bg-main-primary text-main-white font-semibold"
                        >
                            <MessageSquare size={14} />
                            {t("support:details.openChat")}
                        </Button>
                    </CommonModalFooter>
                )}
            </CommonModal>

            <CommonModal
                open={confirmAction !== null}
                onOpenChange={(v) => !v && setConfirmAction(null)}
                maxWidth="sm:max-w-[400px]"
                loading={acting}
            >
                <CommonModalHeader
                    title={
                        confirmAction === "close"
                            ? t("support:details.confirmCloseTitle")
                            : t("support:details.confirmSolveTitle")
                    }
                    description={
                        confirmAction === "close"
                            ? t("support:details.confirmCloseBody")
                            : t("support:details.confirmSolveBody")
                    }
                />
                <CommonModalFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setConfirmAction(null)}
                        disabled={acting}
                        className="h-10 px-5 border-main-whiteMarble text-main-hydrocarbon"
                    >
                        {t("common:cancel")}
                    </Button>
                    <Button
                        type="button"
                        onClick={handleConfirm}
                        disabled={acting}
                        className={clsx(
                            "h-10 px-5 font-semibold text-main-white",
                            confirmAction === "close"
                                ? "bg-main-sharkGray hover:bg-main-sharkGray/90"
                                : "bg-main-vividMint hover:bg-main-vividMint/90"
                        )}
                    >
                        {acting
                            ? t("support:details.processing")
                            : confirmAction === "close"
                              ? t("support:details.yesClose")
                              : t("support:details.yesSolved")}
                    </Button>
                </CommonModalFooter>
            </CommonModal>
        </>
    );
};

const StatusBadge = ({ status }: { status: TTicketStatus }) => {
    const { t } = useTranslation("support");
    const s = ticketStatusStyles[status] ?? ticketStatusStyles.pending;
    return (
        <span className={clsx("px-3 py-1 rounded-full text-xs font-medium", s.bg, s.text)}>
            {t(`statuses.${status}`)}
        </span>
    );
};

const PriorityBadge = ({ priority }: { priority: TTicketPriority }) => {
    const { t } = useTranslation("support");
    const p = ticketPriorityStyles[priority] ?? ticketPriorityStyles.low;
    return (
        <span className={clsx("px-3 py-1 rounded-full text-xs font-medium", p.bg, p.text)}>
            {t(`priorities.${priority}`)}
        </span>
    );
};

export default TicketDetailsModal;
