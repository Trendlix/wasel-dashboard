import { io, type Socket } from "socket.io-client";
import { getCookie } from "@/shared/utils/cookieUtils";
import { getDashboardApiOrigin } from "./fcm-env";
import useTicketStore from "@/shared/hooks/store/useTicketStore";

let socket: Socket | null = null;
let refreshHintHandler: ((scope: string) => void) | null = null;

export const connectChatPresenceGateway = (adminId: number) => {
    if (socket?.connected) return socket;
    const token = getCookie("wasel_admin_access_token");
    const baseURL = getDashboardApiOrigin();

    socket = io(`${baseURL}/admin/support`, {
        transports: ["websocket", "polling"],
        withCredentials: true,
        auth: { ...(token ? { token } : {}), admin_id: adminId },
        query: { admin_id: adminId },
    });

    socket.on("connect", () => {
        const active = useTicketStore.getState().activeSupportChatTicketId;
        if (active) {
            socket?.emit("ticket:chat_presence", { ticket_id: active, active: true });
        }
    });

    socket.on("dashboard:refresh_hint", (payload: { scope?: string }) => {
        refreshHintHandler?.(String(payload?.scope ?? "system"));
    });

    return socket;
};

export const getChatPresenceSocket = () => socket;

export const emitChatPresence = (ticketId: number, active: boolean) => {
    if (!socket?.connected) return;
    socket.emit("ticket:chat_presence", { ticket_id: ticketId, active });
};

export const onRefreshHint = (handler: (scope: string) => void) => {
    refreshHintHandler = handler;
};

export const disconnectChatPresenceGateway = () => {
    refreshHintHandler = null;
    if (!socket) return;
    socket.disconnect();
    socket = null;
};
