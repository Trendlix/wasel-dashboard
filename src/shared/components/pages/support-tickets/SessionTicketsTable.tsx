import TicketsTable from "./TicketsTable";
import type { ITicket } from "@/shared/core/pages/supportTickets";

const sessionReplyPathBuilder = (ticket: ITicket): string => {
    const actor = ticket.user_id ? "user" : "driver";
    const actorId = ticket.user_id ?? ticket.driver_id ?? 0;
    return `/support-tickets/sessions/${ticket.id}/reply?actor=${actor}&actor_id=${actorId}`;
};

const SessionTicketsTable = () => (
    <TicketsTable
        baseFilter={{ has_session: true }}
        replyPathBuilder={sessionReplyPathBuilder}
    />
);

export default SessionTicketsTable;
