// ─── Enums ────────────────────────────────────────────────────────────────────

export type TTicketStatus = "pending" | "reply" | "closed" | "solved";
export type TTicketPriority = "low" | "medium" | "high";

// ─── Status styles ────────────────────────────────────────────────────────────

export const ticketStatusStyles: Record<
    TTicketStatus,
    { label: string; bg: string; text: string }
> = {
    pending: {
        label: "Open",
        bg: "bg-main-vividMint/15",
        text: "text-main-vividMint",
    },
    reply: {
        label: "Pending Reply",
        bg: "bg-main-mustardGold/15",
        text: "text-main-mustardGold",
    },
    closed: {
        label: "Closed",
        bg: "bg-main-sharkGray/15",
        text: "text-main-sharkGray",
    },
    solved: {
        label: "Solved",
        bg: "bg-main-vividMint/15",
        text: "text-main-vividMint",
    },
};

// ─── Priority styles ──────────────────────────────────────────────────────────

export const ticketPriorityStyles: Record<
    TTicketPriority,
    { label: string; bg: string; text: string }
> = {
    low: {
        label: "Low",
        bg: "bg-main-sharkGray/15",
        text: "text-main-sharkGray",
    },
    medium: {
        label: "Medium",
        bg: "bg-main-mustardGold/15",
        text: "text-main-mustardGold",
    },
    high: {
        label: "High",
        bg: "bg-main-remove/15",
        text: "text-main-remove",
    },
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ITicketOwner {
    id: number;
    full_name?: string;   // user field
    name?: string;        // driver field
    email: string | null;
    phone: string | null;
}

/** Returns the display name for a ticket owner (user or driver) */
export const getOwnerDisplayName = (owner: ITicketOwner): string =>
    owner.full_name ?? owner.name ?? "Unknown";

export interface ITicketCategory {
    id: number;
    name: string;
    ticket_count?: number;
}

export interface ITicket {
    id: number;
    subject: string;
    priority: TTicketPriority;
    status: TTicketStatus;
    description: string;
    attachments: string[];
    created_at: string;
    updated_at: string;
    category_id: number;
    category: ITicketCategory;
    user_id: number | null;
    user: ITicketOwner | null;
    driver_id: number | null;
    driver: ITicketOwner | null;
}

export interface ITicketStats {
    total: number;
    pending: number;
    reply: number;
    closed: number;
    solved: number;
}

export interface ITicketSupport {
    id: number;
    title: string;
    description: string | null;
    status: string;
    created_at: string;
    updated_by: { id: number; name: string | null } | null;
}

export interface ITicketDetail extends ITicket {
    attachments_urls: string[];
    supports: ITicketSupport[];
}

export interface ITicketQuery {
    page?: number;
    limit?: number;
    priority?: TTicketPriority;
    status?: TTicketStatus;
    category_id?: number;
    partial_matching?: string;
    sorting?: "asc" | "desc";
}
