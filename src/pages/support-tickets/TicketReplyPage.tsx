import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { CheckCircle, Send, XCircle } from "lucide-react";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/button";
import PageTransition from "@/shared/components/common/PageTransition";
import BackButton from "@/shared/components/common/BackButton";
import {
    CommonModal,
    CommonModalFooter,
    CommonModalHeader,
} from "@/shared/components/common/CommonModal";
import useTicketStore, { getSupportSocket } from "@/shared/hooks/store/useTicketStore";
import useAuthStore from "@/shared/hooks/store/useAuthStore";
import { showToast } from "@/shared/utils/toast";
import {
    getOwnerDisplayName,
    ticketPriorityStyles,
    ticketStatusStyles,
    type ITicketSupport,
    type TTicketPriority,
    type TTicketStatus,
} from "@/shared/core/pages/supportTickets";
import { formatAppDateTime } from "@/lib/formatLocaleDate";

const MAX_CHARS = 500;

const TicketReplyPage = () => {
    const { t, i18n } = useTranslation(["support", "common"]);
    const { ticketId } = useParams<{ ticketId: string }>();
    const navigate = useNavigate();

    const {
        selectedTicket,
        detailLoading,
        fetchTicketDetail,
        replyOnTicket,
        appendSupportMessage,
        closeTicket,
        solveTicket,
        setActiveSupportChatTicket,
        clearActiveSupportChatTicket,
        markSupportNotificationsForTicketAsRead,
    } = useTicketStore();
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

    const sendShortcutLabel =
        typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/.test(navigator.userAgent)
            ? t("support:chat.shortcutSendMac")
            : t("support:chat.shortcutSend");

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
    }, [ticketId, fetchTicketDetail]);

    useEffect(() => {
        const numId = Number(ticketId);
        if (!numId) return;

        const socket = getSupportSocket();
        if (!socket) return;

        const handler = (payload: { ticketId: number; support: ITicketSupport }) => {
            if (payload.ticketId === numId) {
                appendSupportMessage(numId, payload.support);
                void markSupportNotificationsForTicketAsRead(numId);
            }
        };

        socket.on("ticket:new_message", handler);
        return () => {
            socket.off("ticket:new_message", handler);
        };
    }, [ticketId, appendSupportMessage, markSupportNotificationsForTicketAsRead]);

    useEffect(() => {
        const numId = Number(ticketId);
        if (!numId) return;

        setActiveSupportChatTicket(numId);
        void markSupportNotificationsForTicketAsRead(numId);

        const handleBeforeUnload = () => {
            clearActiveSupportChatTicket(numId);
        };
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            clearActiveSupportChatTicket(numId);
        };
    }, [ticketId, setActiveSupportChatTicket, clearActiveSupportChatTicket, markSupportNotificationsForTicketAsRead]);

    const scrollChatToBottom = (behavior: ScrollBehavior = "smooth") => {
        requestAnimationFrame(() => {
            const el = chatRef.current;
            if (!el) return;
            el.scrollTo({ top: el.scrollHeight, behavior });
        });
    };

    const supportsLength = selectedTicket?.supports?.length ?? 0;
    const prevLengthRef = useRef(supportsLength);
    useEffect(() => {
        if (supportsLength > prevLengthRef.current) {
            scrollChatToBottom("smooth");
        }
        prevLengthRef.current = supportsLength;
    }, [supportsLength]);

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
        if (!text || !selectedTicket || sending || isLockedForCurrentAdmin) return;
        setSending(true);
        try {
            const title = text.length > 60 ? text.slice(0, 60).trimEnd() + "…" : text;
            await replyOnTicket(selectedTicket.id, title, text);
            setMessage("");
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
                textareaRef.current.focus();
            }
        } catch (error) {
            const messageFromApi = isAxiosError(error)
                ? error.response?.data?.message
                : null;
            showToast(messageFromApi || t("support:lock.actionDenied"), "error");
            if (selectedTicket) {
                await fetchTicketDetail(selectedTicket.id);
            }
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            void handleSend();
        }
    };

    const handleConfirm = async () => {
        if (!ticket || !confirmAction) return;
        if (isLockedForCurrentAdmin) {
            showToast(t("support:lock.actionDenied"), "error");
            return;
        }
        setActing(true);
        try {
            if (confirmAction === "close") await closeTicket(ticket.id);
            else await solveTicket(ticket.id);
            setConfirmAction(null);
        } catch (error) {
            const messageFromApi = isAxiosError(error)
                ? error.response?.data?.message
                : null;
            showToast(messageFromApi || t("support:lock.actionDenied"), "error");
            await fetchTicketDetail(ticket.id);
        } finally {
            setActing(false);
        }
    };

    const ticket = selectedTicket;
    const owner = ticket?.user ?? ticket?.driver;
    const rawOwnerName = owner ? getOwnerDisplayName(owner) : "";
    const ownerName = owner ? (rawOwnerName || t("support:owner.noName")) : t("support:owner.customer");
    const ownerInitial = ownerName[0]?.toUpperCase() ?? "?";
    const isResolved = ticket?.status === "closed" || ticket?.status === "solved";
    const currentAdminId = userProfile?.id ?? null;
    const assignedAdmin = ticket?.assigned_admin ?? null;
    const isLockedForCurrentAdmin =
        ticket !== null &&
        ticket !== undefined &&
        ticket.assigned_admin_id !== null &&
        ticket.assigned_admin_id !== currentAdminId;
    const canManageTicket = !isResolved && !isLockedForCurrentAdmin;

    const createdLine =
        ticket &&
        `${formatAppDateTime(ticket.created_at, i18n.language)}`;

    return (
        <>
            <PageTransition>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 shrink-0">
                        <BackButton
                            label={t("common:back")}
                            onClick={() => navigate("/support-tickets")}
                            aria-label={t("support:chat.backAria")}
                        />
                        {detailLoading || !ticket ? (
                            <div className="space-y-1.5">
                                <div className="h-5 w-36 rounded bg-main-whiteMarble animate-pulse" />
                                <div className="h-3.5 w-48 rounded bg-main-whiteMarble animate-pulse" />
                            </div>
                        ) : (
                            <div>
                                <h1 className="font-bold text-xl text-main-mirage leading-tight">
                                    {t("support:chat.ticketHeading", { id: ticket.id })}
                                </h1>
                                <p className="text-main-sharkGray text-sm">{ticket.subject}</p>
                            </div>
                        )}
                    </div>

                    {ticket && !detailLoading && (
                        <div className="bg-main-primary common-rounded px-6 py-5 text-main-white shrink-0">
                            <div className="grid grid-cols-3 gap-4 mb-5">
                                <InfoCell label={t("support:chat.labels.status")}>
                                    <StatusBadge status={ticket.status} />
                                </InfoCell>
                                <InfoCell label={t("support:chat.labels.priority")}>
                                    <PriorityBadge priority={ticket.priority} />
                                </InfoCell>
                                <InfoCell label={t("support:chat.labels.category")}>
                                    <span className="text-sm font-semibold">{ticket.category.name}</span>
                                </InfoCell>
                            </div>

                            <hr className="border-main-white/15 mb-5" />

                            <div className="grid grid-cols-2 gap-4">
                                <InfoCell label={t("support:chat.labels.customer")}>
                                    <p className="text-sm font-bold">{ownerName}</p>
                                    {owner?.email && (
                                        <p className="text-xs text-main-white/60">{owner.email}</p>
                                    )}
                                </InfoCell>
                                <InfoCell label={t("support:chat.labels.created")}>
                                    <p className="text-sm font-bold">{createdLine}</p>
                                </InfoCell>
                            </div>

                            {assignedAdmin && (
                                <div className="mt-4 rounded-lg bg-main-white/10 px-3 py-2 text-xs">
                                    <span className="text-main-white/60">{t("support:lock.assignedTo")} </span>
                                    <span className="font-semibold text-main-white">
                                        {assignedAdmin.name || assignedAdmin.email}
                                    </span>
                                </div>
                            )}

                            {isLockedForCurrentAdmin && (
                                <div className="mt-4 rounded-lg bg-main-remove/15 border border-main-remove/30 px-3 py-2 text-xs text-main-white">
                                    {t("support:lock.onlyOwnerCanReply")}
                                </div>
                            )}

                            {canManageTicket && (
                                <>
                                    <hr className="border-main-white/15 mt-5" />
                                    <div className="flex gap-2 mt-4">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setConfirmAction("close")}
                                            className="h-8 px-3 bg-main-white/10 hover:bg-main-white/20 text-main-white font-semibold text-xs"
                                        >
                                            <XCircle size={13} />
                                            {t("support:chat.closeTicket")}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setConfirmAction("solve")}
                                            className="h-8 px-3 bg-main-white/10 hover:bg-main-white/20 text-main-white font-semibold text-xs"
                                        >
                                            <CheckCircle size={13} />
                                            {t("support:chat.markSolved")}
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

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
                                        senderType={s.sender_type}
                                        currentAdminId={currentAdminId}
                                    />
                                ))}
                            </>
                        ) : null}
                    </div>

                    <div
                        onMouseDown={onDragMouseDown}
                        className="flex items-center justify-center h-3 cursor-row-resize group shrink-0 -my-1"
                        title={t("support:chat.dragResize")}
                        role="separator"
                        aria-orientation="horizontal"
                    >
                        <div className="w-10 h-1 rounded-full bg-main-whiteMarble group-hover:bg-main-primary/30 transition-colors" />
                    </div>

                    <div className="bg-main-white common-rounded px-5 py-4 shrink-0">
                        {isResolved ? (
                            <p className="text-center text-sm text-main-sharkGray py-1">
                                {t("support:chat.resolvedNotice", {
                                    status: t(`support:statuses.${ticket?.status ?? "closed"}`),
                                })}
                            </p>
                        ) : isLockedForCurrentAdmin ? (
                            <p className="text-center text-sm text-main-remove py-1">
                                {t("support:lock.chatDisabled")}
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
                                        placeholder={t("support:chat.placeholder")}
                                        className="flex-1 min-h-[44px] max-h-40 resize-none bg-transparent text-sm text-main-mirage placeholder:text-main-sharkGray outline-none leading-relaxed py-3"
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => void handleSend()}
                                        disabled={sending || !message.trim()}
                                        className="h-11 px-5 bg-main-primary text-main-white font-semibold shrink-0 mb-0.5"
                                    >
                                        <Send size={14} />
                                        {sending ? t("support:chat.sending") : t("support:chat.send")}
                                    </Button>
                                </div>
                                <p className={clsx(
                                    "text-xs px-1",
                                    message.length >= MAX_CHARS ? "text-main-remove font-semibold" : "text-main-sharkGray"
                                )}>
                                    {t("support:chat.charCount", { current: message.length, max: MAX_CHARS })}
                                    {" "}
                                    ({sendShortcutLabel})
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </PageTransition>

            <CommonModal
                open={confirmAction !== null}
                onOpenChange={(v) => !v && setConfirmAction(null)}
                maxWidth="sm:max-w-[400px]"
                loading={acting}
                variant={confirmAction === "close" ? "danger" : "success"}
            >
                <CommonModalHeader
                    title={
                        confirmAction === "close"
                            ? t("support:chat.confirmCloseTitle")
                            : t("support:chat.confirmSolveTitle")
                    }
                    description={
                        confirmAction === "close"
                            ? t("support:chat.confirmCloseBody")
                            : t("support:chat.confirmSolveBody")
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
                        onClick={() => void handleConfirm()}
                        disabled={acting}
                        className={clsx(
                            "h-10 px-5 font-semibold text-main-white",
                            confirmAction === "close"
                                ? "bg-main-remove hover:bg-main-remove/90"
                                : "bg-main-vividMint hover:bg-main-vividMint/90"
                        )}
                    >
                        {acting
                            ? t("support:chat.processing")
                            : confirmAction === "close"
                              ? t("support:chat.yesClose")
                              : t("support:chat.yesSolved")}
                    </Button>
                </CommonModalFooter>
            </CommonModal>
        </>
    );
};

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
    const { i18n } = useTranslation("support");
    const time = formatAppDateTime(timestamp, i18n.language);
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
                <p className="text-main-white text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">{text}</p>
            </div>
        </div>
    );
};

const SupportBubble = ({
    timestamp,
    text,
    updatedBy,
    senderType,
    currentAdminId,
}: {
    timestamp: string;
    text: string;
    updatedBy?: { id: number; name: string | null } | null;
    senderType?: "admin" | "user" | "driver";
    currentAdminId: number | null;
}) => {
    const { t, i18n } = useTranslation("support");
    const time = formatAppDateTime(timestamp, i18n.language);
    const initial = updatedBy?.name?.[0]?.toUpperCase() ?? "S";
    const normalizedSenderType = senderType ?? "admin";
    const isCustomerMessage = normalizedSenderType === "user" || normalizedSenderType === "driver";
    const isMe = normalizedSenderType === "admin" && currentAdminId !== null && updatedBy?.id === currentAdminId;
    const senderLabel = isMe ? t("chat.you") : (updatedBy?.name ?? t("chat.supportTeam"));

    return (
        <div className={clsx("flex", isCustomerMessage ? "justify-end" : "justify-start")}>
            <div
                className={clsx(
                    "max-w-[65%] px-5 py-4",
                    isCustomerMessage
                        ? "bg-main-primary rounded-2xl rounded-tr-sm"
                        : "bg-main-white border border-main-whiteMarble rounded-2xl rounded-tl-sm shadow-sm",
                )}
            >
                <div className="flex items-center gap-2.5 mb-2">
                    <div
                        className={clsx(
                            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                            isCustomerMessage
                                ? "bg-main-white text-main-primary"
                                : "bg-main-primary/10 text-main-primary",
                        )}
                    >
                        {initial}
                    </div>
                    <div>
                        <p className={clsx("font-bold text-sm leading-tight", isCustomerMessage ? "text-main-white" : "text-main-mirage")}>
                            {senderLabel}
                        </p>
                        <p className={clsx("text-xs", isCustomerMessage ? "text-main-white/60" : "text-main-sharkGray")}>{time}</p>
                    </div>
                </div>
                <p className={clsx("text-sm leading-relaxed whitespace-pre-wrap wrap-break-word", isCustomerMessage ? "text-main-white" : "text-main-hydrocarbon")}>
                    {text}
                </p>
            </div>
        </div>
    );
};

const InfoCell = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-1">
        <span className="text-main-white/50 text-xs font-semibold uppercase tracking-wide">{label}</span>
        <div className="text-main-white">{children}</div>
    </div>
);

const StatusBadge = ({ status }: { status: TTicketStatus }) => {
    const { t } = useTranslation("support");
    const s = ticketStatusStyles[status] ?? ticketStatusStyles.pending;
    return (
        <span className={clsx("px-2.5 py-1 rounded-full text-xs font-semibold", s.bg, s.text)}>
            {t(`statuses.${status}`)}
        </span>
    );
};

const PriorityBadge = ({ priority }: { priority: TTicketPriority }) => {
    const { t } = useTranslation("support");
    const p = ticketPriorityStyles[priority] ?? ticketPriorityStyles.low;
    return (
        <span className={clsx("px-2.5 py-1 rounded-full text-xs font-semibold", p.bg, p.text)}>
            {t(`priorities.${priority}`)}
        </span>
    );
};

export default TicketReplyPage;
