import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

interface TicketDetailsModalProps {
    open: boolean;
    onOpenChange: (v: boolean) => void;
}

type TConfirmAction = "close" | "solve" | null;

const TicketDetailsModal = ({ open, onOpenChange }: TicketDetailsModalProps) => {
    const navigate = useNavigate();
    const { selectedTicket, detailLoading, closeTicket, solveTicket } = useTicketStore();

    const [confirmAction, setConfirmAction] = useState<TConfirmAction>(null);
    const [acting, setActing] = useState(false);

    const ticket = selectedTicket;
    const owner = ticket?.user ?? ticket?.driver;
    const ownerType = ticket?.user ? "User" : ticket?.driver ? "Driver" : "Unknown";

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

    return (
        <>
            {/* ── Main detail modal ── */}
            <CommonModal open={open} onOpenChange={onOpenChange} maxWidth="sm:max-w-[600px]">
                <CommonModalHeader
                    title={detailLoading ? "Loading…" : `Ticket #${ticket?.id}`}
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
                            {/* Meta badges */}
                            <div className="flex flex-wrap gap-2">
                                <StatusBadge status={ticket.status} />
                                <PriorityBadge priority={ticket.priority} />
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-main-primary/10 text-main-primary">
                                    {ticket.category.name}
                                </span>
                            </div>

                            {/* Owner */}
                            <div className="flex items-center gap-3 p-3 rounded-xl border border-main-whiteMarble bg-main-luxuryWhite">
                                <div className="w-9 h-9 rounded-full bg-main-primary flex items-center justify-center shrink-0 text-main-white text-sm font-bold">
                                    {(owner ? getOwnerDisplayName(owner) : "?")[0].toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-main-mirage">
                                        {owner ? getOwnerDisplayName(owner) : "Unknown"}
                                        <span className="ml-2 text-xs font-normal text-main-sharkGray">
                                            ({ownerType})
                                        </span>
                                    </p>
                                    {owner?.email && (
                                        <p className="text-xs text-main-sharkGray">{owner.email}</p>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <p className="text-xs font-semibold text-main-sharkGray uppercase tracking-wide mb-1.5">
                                    Description
                                </p>
                                <p className="text-sm text-main-hydrocarbon leading-relaxed">
                                    {ticket.description}
                                </p>
                            </div>

                            {/* Reply count */}
                            {ticket.supports && ticket.supports.length > 0 && (
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-main-primary/5 border border-main-primary/10">
                                    <MessageSquare size={15} className="text-main-primary shrink-0" />
                                    <p className="text-sm text-main-primary font-medium">
                                        {ticket.supports.length} repl{ticket.supports.length === 1 ? "y" : "ies"} — open chat to view the full conversation
                                    </p>
                                </div>
                            )}

                            {/* Dates */}
                            <div className="grid grid-cols-2 gap-3 text-xs text-main-sharkGray">
                                <div>
                                    <span className="font-semibold uppercase tracking-wide">Created</span>
                                    <p className="mt-0.5 text-main-hydrocarbon">
                                        {new Date(ticket.created_at).toLocaleDateString("en-US", {
                                            month: "short", day: "numeric", year: "numeric",
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <span className="font-semibold uppercase tracking-wide">Last Updated</span>
                                    <p className="mt-0.5 text-main-hydrocarbon">
                                        {new Date(ticket.updated_at).toLocaleDateString("en-US", {
                                            month: "short", day: "numeric", year: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>
                        </>
                    ) : null}
                </CommonModalBody>

                {ticket && !detailLoading && (
                    <CommonModalFooter className="justify-between">
                        {/* Action buttons */}
                        <div className="flex gap-2">
                            {!isClosed && !isSolved && (
                                <Button
                                    variant="outline"
                                    onClick={() => setConfirmAction("close")}
                                    className="h-10 px-4 border-main-sharkGray/30 text-main-sharkGray font-semibold"
                                >
                                    <XCircle size={14} />
                                    Close
                                </Button>
                            )}
                            {!isSolved && !isClosed && (
                                <Button
                                    variant="outline"
                                    onClick={() => setConfirmAction("solve")}
                                    className="h-10 px-4 border-main-vividMint/40 text-main-vividMint font-semibold"
                                >
                                    <CheckCircle size={14} />
                                    Solved
                                </Button>
                            )}
                        </div>

                        {/* Open chat */}
                        <Button
                            onClick={handleReply}
                            className="h-10 px-5 bg-main-primary text-main-white font-semibold"
                        >
                            <MessageSquare size={14} />
                            Open Chat
                        </Button>
                    </CommonModalFooter>
                )}
            </CommonModal>

            {/* ── Confirmation modal ── */}
            <CommonModal
                open={confirmAction !== null}
                onOpenChange={(v) => !v && setConfirmAction(null)}
                maxWidth="sm:max-w-[400px]"
                loading={acting}
            >
                <CommonModalHeader
                    title={confirmAction === "close" ? "Close Ticket?" : "Mark as Solved?"}
                    description={
                        confirmAction === "close"
                            ? "This ticket will be closed and no further replies can be sent."
                            : "This will mark the ticket as solved. You can reopen it anytime."
                    }
                />
                <CommonModalFooter>
                    <Button
                        variant="outline"
                        onClick={() => setConfirmAction(null)}
                        disabled={acting}
                        className="h-10 px-5 border-main-whiteMarble text-main-hydrocarbon"
                    >
                        Cancel
                    </Button>
                    <Button
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
                            ? "Processing…"
                            : confirmAction === "close"
                            ? "Yes, Close"
                            : "Yes, Solved"}
                    </Button>
                </CommonModalFooter>
            </CommonModal>
        </>
    );
};

// ─── Badges ───────────────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: TTicketStatus }) => {
    const s = ticketStatusStyles[status] ?? ticketStatusStyles.pending;
    return (
        <span className={clsx("px-3 py-1 rounded-full text-xs font-medium", s.bg, s.text)}>
            {s.label}
        </span>
    );
};

const PriorityBadge = ({ priority }: { priority: TTicketPriority }) => {
    const p = ticketPriorityStyles[priority] ?? ticketPriorityStyles.low;
    return (
        <span className={clsx("px-3 py-1 rounded-full text-xs font-medium", p.bg, p.text)}>
            {p.label}
        </span>
    );
};

export default TicketDetailsModal;
