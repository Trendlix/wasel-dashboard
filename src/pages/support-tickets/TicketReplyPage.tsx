import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import clsx from "clsx";
import { ArrowLeft, CheckCircle, Send, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTransition from "@/shared/components/common/PageTransition";
import {
    CommonModal,
    CommonModalFooter,
    CommonModalHeader,
} from "@/shared/components/common/CommonModal";
import useTicketStore, { getSupportSocket } from "@/shared/hooks/store/useTicketStore";
import useAuthStore from "@/shared/hooks/store/useAuthStore";
import {
    getOwnerDisplayName,
    ticketPriorityStyles,
    ticketStatusStyles,
    type ITicketSupport,
    type TTicketPriority,
    type TTicketStatus,
} from "@/shared/core/pages/supportTickets";

const MAX_CHARS = 500;

const TicketReplyPage = () => {
    const { ticketId } = useParams<{ ticketId: string }>();
    const navigate = useNavigate();

    const { selectedTicket, detailLoading, fetchTicketDetail, replyOnTicket, appendSupportMessage, closeTicket, solveTicket } = useTicketStore();
    const { userProfile } = useAuthStore();

    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [confirmAction, setConfirmAction] = useState<"close" | "solve" | null>(null);
    const [acting, setActing] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const chatRef = useRef<HTMLDivElement>(null);
    const [chatHeight, setChatHeight] = useState(420);
    const dragStartY = useRef<number | null>(null);
    const dragStartH = useRef<number>(420);

    const onDragMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        dragStartY.current = e.clientY;
        dragStartH.current = chatHeight;

        const onMove = (ev: MouseEvent) => {
            if (dragStartY.current === null) return;
            const delta = ev.clientY - dragStartY.current;
            const next = Math.min(Math.max(dragStartH.current + delta, 180), window.innerHeight * 0.72);
            setChatHeight(next);
        };
        const onUp = () => {
            dragStartY.current = null;
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
    };

    useEffect(() => {
        if (ticketId) fetchTicketDetail(Number(ticketId));
    }, [ticketId]);

    // Subscribe to real-time new messages for this ticket
    useEffect(() => {
        const numId = Number(ticketId);
        if (!numId) return;

        const socket = getSupportSocket();
        if (!socket) return;

        const handler = (payload: { ticketId: number; support: ITicketSupport }) => {
            if (payload.ticketId === numId) {
                appendSupportMessage(numId, payload.support);
            }
        };

        socket.on("ticket:new_message", handler);
        return () => {
            socket.off("ticket:new_message", handler);
        };
    }, [ticketId, appendSupportMessage]);

    const scrollChatToBottom = (behavior: ScrollBehavior = "smooth") => {
        requestAnimationFrame(() => {
            const el = chatRef.current;
            if (!el) return;
            el.scrollTo({ top: el.scrollHeight, behavior });
        });
    };

    // Smooth scroll inside the container when a new message arrives
    const supportsLength = selectedTicket?.supports?.length ?? 0;
    const prevLengthRef = useRef(supportsLength);
    useEffect(() => {
        if (supportsLength > prevLengthRef.current) {
            scrollChatToBottom("smooth");
        }
        prevLengthRef.current = supportsLength;
    }, [supportsLength]);

    // Jump to bottom instantly on initial load
    const ticketLoaded = !detailLoading && !!selectedTicket;
    useEffect(() => {
        if (ticketLoaded) {
            scrollChatToBottom("instant");
        }
    }, [ticketLoaded]);

    const autoResize = (el: HTMLTextAreaElement) => {
        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value.slice(0, MAX_CHARS);
        setMessage(val);
        autoResize(e.target);
    };

    const handleSend = async () => {
        const text = message.trim();
        if (!text || !selectedTicket || sending) return;
        setSending(true);
        try {
            const title = text.length > 60 ? text.slice(0, 60).trimEnd() + "…" : text;
            await replyOnTicket(selectedTicket.id, title, text);
            setMessage("");
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
                textareaRef.current.focus();
            }
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            handleSend();
        }
        // plain Enter → default textarea behaviour (new line)
    };

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

    const ticket = selectedTicket;
    const owner = ticket?.user ?? ticket?.driver;
    const ownerName = owner ? getOwnerDisplayName(owner) : "Customer";
    const ownerInitial = ownerName[0]?.toUpperCase() ?? "?";
    const isResolved = ticket?.status === "closed" || ticket?.status === "solved";
    const currentAdminId = userProfile?.id ?? null;

    return (
        <>
            <PageTransition>
                <div className="flex flex-col gap-4">

                    {/* ── Page title ──────────────────────────────────────────── */}
                    <div className="flex items-center gap-3 shrink-0">
                        <button
                            onClick={() => navigate("/support-tickets")}
                            className="w-9 h-9 rounded-full bg-main-primary flex items-center justify-center text-main-white hover:bg-main-primary/85 transition-colors shrink-0"
                        >
                            <ArrowLeft size={16} />
                        </button>
                        {detailLoading || !ticket ? (
                            <div className="space-y-1.5">
                                <div className="h-5 w-36 rounded bg-main-whiteMarble animate-pulse" />
                                <div className="h-3.5 w-48 rounded bg-main-whiteMarble animate-pulse" />
                            </div>
                        ) : (
                            <div>
                                <h1 className="font-bold text-xl text-main-mirage leading-tight">
                                    Ticket #{ticket.id}
                                </h1>
                                <p className="text-main-sharkGray text-sm">{ticket.subject}</p>
                            </div>
                        )}
                    </div>

                    {/* ── Blue info card ─────────────────────────────────────── */}
                    {ticket && !detailLoading && (
                        <div className="bg-main-primary common-rounded px-6 py-5 text-main-white shrink-0">
                            <div className="grid grid-cols-3 gap-4 mb-5">
                                <InfoCell label="Status">
                                    <StatusBadge status={ticket.status} />
                                </InfoCell>
                                <InfoCell label="Priority">
                                    <PriorityBadge priority={ticket.priority} />
                                </InfoCell>
                                <InfoCell label="Category">
                                    <span className="text-sm font-semibold">{ticket.category.name}</span>
                                </InfoCell>
                            </div>

                            <hr className="border-main-white/15 mb-5" />

                            <div className="grid grid-cols-2 gap-4">
                                <InfoCell label="Customer">
                                    <p className="text-sm font-bold">{ownerName}</p>
                                    {owner?.email && (
                                        <p className="text-xs text-main-white/60">{owner.email}</p>
                                    )}
                                </InfoCell>
                                <InfoCell label="Created">
                                    <p className="text-sm font-bold">
                                        {new Date(ticket.created_at).toLocaleDateString("en-US", {
                                            month: "short", day: "numeric", year: "numeric",
                                        })}, {new Date(ticket.created_at).toLocaleTimeString("en-US", {
                                            hour: "2-digit", minute: "2-digit",
                                        })}
                                    </p>
                                </InfoCell>
                            </div>

                            {!isResolved && (
                                <>
                                    <hr className="border-main-white/15 mt-5" />
                                    <div className="flex gap-2 mt-4">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setConfirmAction("close")}
                                            className="h-8 px-3 bg-main-white/10 hover:bg-main-white/20 text-main-white font-semibold text-xs"
                                        >
                                            <XCircle size={13} />
                                            Close Ticket
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setConfirmAction("solve")}
                                            className="h-8 px-3 bg-main-white/10 hover:bg-main-white/20 text-main-white font-semibold text-xs"
                                        >
                                            <CheckCircle size={13} />
                                            Mark Solved
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* ── Messages ──────────────────────────────────────────── */}
                    <div ref={chatRef} className="overflow-y-auto bg-main-white common-rounded p-6 space-y-5 transition-none" style={{ height: chatHeight }}>
                        {detailLoading ? (
                            <div className="space-y-5">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={clsx(
                                            "flex gap-3",
                                            i % 2 === 0 ? "justify-end" : "justify-start"
                                        )}
                                    >
                                        {i % 2 !== 0 && (
                                            <div className="w-9 h-9 rounded-full bg-main-whiteMarble animate-pulse shrink-0" />
                                        )}
                                        <div className={clsx(
                                            "h-20 rounded-2xl bg-main-whiteMarble animate-pulse",
                                            i % 2 === 0 ? "w-2/3" : "flex-1 max-w-lg"
                                        )} />
                                    </div>
                                ))}
                            </div>
                        ) : ticket ? (
                            <>
                                <CustomerBubble
                                    initial={ownerInitial}
                                    senderName={ownerName}
                                    timestamp={ticket.created_at}
                                    text={ticket.description}
                                />

                                {ticket.supports?.map((s) => (
                                    <SupportBubble
                                        key={s.id}
                                        timestamp={s.created_at}
                                        text={s.description ?? s.title}
                                        updatedBy={s.updated_by}
                                        currentAdminId={currentAdminId}
                                    />
                                ))}

                            </>
                        ) : null}
                    </div>

                    {/* ── Drag handle ──────────────────────────────────────── */}
                    <div
                        onMouseDown={onDragMouseDown}
                        className="flex items-center justify-center h-3 cursor-row-resize group shrink-0 -my-1"
                        title="Drag to resize"
                    >
                        <div className="w-10 h-1 rounded-full bg-main-whiteMarble group-hover:bg-main-primary/30 transition-colors" />
                    </div>

                    {/* ── Reply input ────────────────────────────────────────── */}
                    <div className="bg-main-white common-rounded px-5 py-4 shrink-0">
                        {isResolved ? (
                            <p className="text-center text-sm text-main-sharkGray py-1">
                                This ticket is <strong className="capitalize">{ticket?.status}</strong> — replies are disabled.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                <div className="flex items-end gap-3">
                                    <textarea
                                        ref={textareaRef}
                                        rows={1}
                                        value={message}
                                        onChange={handleChange}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Type your reply…"
                                        className="flex-1 min-h-[44px] max-h-40 resize-none bg-transparent text-sm text-main-mirage placeholder:text-main-sharkGray outline-none leading-relaxed py-3"
                                    />
                                    <Button
                                        onClick={handleSend}
                                        disabled={sending || !message.trim()}
                                        className="h-11 px-5 bg-main-primary text-main-white font-semibold shrink-0 mb-0.5"
                                    >
                                        <Send size={14} />
                                        {sending ? "Sending…" : "Send"}
                                    </Button>
                                </div>
                                <p className={clsx(
                                    "text-xs px-1",
                                    message.length >= MAX_CHARS ? "text-main-remove font-semibold" : "text-main-sharkGray"
                                )}>
                                    {message.length}/{MAX_CHARS}
                                    {" "}
                                    (Ctrl+Enter to send)
                                </p>
                            </div>
                        )}
                    </div>

                </div>
            </PageTransition>

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
                        {acting ? "Processing…" : confirmAction === "close" ? "Yes, Close" : "Yes, Solved"}
                    </Button>
                </CommonModalFooter>
            </CommonModal>
        </>
    );
};

// ─── Customer bubble (right-aligned, blue) ────────────────────────────────────

const CustomerBubble = ({
    initial,
    senderName,
    timestamp,
    text,
}: {
    initial: string;
    senderName: string;
    timestamp: string;
    text: string;
}) => {
    const time = formatTime(timestamp);
    return (
        <div className="flex justify-end">
            <div className="bg-main-primary rounded-2xl rounded-tr-sm px-5 py-4 max-w-[65%]">
                <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-full bg-main-white flex items-center justify-center text-main-primary text-xs font-bold shrink-0">
                        {initial}
                    </div>
                    <div>
                        <p className="text-main-white font-bold text-sm leading-tight">{senderName}</p>
                        <p className="text-main-white/60 text-xs">{time}</p>
                    </div>
                </div>
                <p className="text-main-white text-sm leading-relaxed whitespace-pre-wrap break-words">{text}</p>
            </div>
        </div>
    );
};

// ─── Support bubble (left-aligned, white card) ────────────────────────────────

const SupportBubble = ({
    timestamp,
    text,
    updatedBy,
    currentAdminId,
}: {
    timestamp: string;
    text: string;
    updatedBy?: { id: number; name: string | null } | null;
    currentAdminId: number | null;
}) => {
    const time = formatTime(timestamp);
    const initial = updatedBy?.name?.[0]?.toUpperCase() ?? "S";
    const isMe = currentAdminId !== null && updatedBy?.id === currentAdminId;
    const senderLabel = isMe ? "You" : (updatedBy?.name ?? "Support Team");

    return (
        <div className="flex justify-start">
            <div className="max-w-[65%] bg-main-white border border-main-whiteMarble rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm">
                <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-full bg-main-primary/10 flex items-center justify-center text-main-primary text-xs font-bold shrink-0">
                        {initial}
                    </div>
                    <div>
                        <p className="text-main-mirage font-bold text-sm leading-tight">{senderLabel}</p>
                        <p className="text-main-sharkGray text-xs">{time}</p>
                    </div>
                </div>
                <p className="text-main-hydrocarbon text-sm leading-relaxed whitespace-pre-wrap break-words">{text}</p>
            </div>
        </div>
    );
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatTime = (ts: string) =>
    new Date(ts).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

const InfoCell = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-1">
        <span className="text-main-white/50 text-xs font-semibold uppercase tracking-wide">{label}</span>
        <div className="text-main-white">{children}</div>
    </div>
);

const StatusBadge = ({ status }: { status: TTicketStatus }) => {
    const s = ticketStatusStyles[status] ?? ticketStatusStyles.pending;
    return (
        <span className={clsx("px-2.5 py-1 rounded-full text-xs font-semibold", s.bg, s.text)}>
            {s.label}
        </span>
    );
};

const PriorityBadge = ({ priority }: { priority: TTicketPriority }) => {
    const p = ticketPriorityStyles[priority] ?? ticketPriorityStyles.low;
    return (
        <span className={clsx("px-2.5 py-1 rounded-full text-xs font-semibold", p.bg, p.text)}>
            {p.label}
        </span>
    );
};

export default TicketReplyPage;
