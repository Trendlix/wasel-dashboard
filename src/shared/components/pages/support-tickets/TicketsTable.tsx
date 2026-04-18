import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RotateCcw, Search, Settings2 } from "lucide-react";
import TablePagination from "../../common/TablePagination";
import NoDataFound from "../../common/NoDataFound";
import StatusSelect from "../../common/StatusSelect";
import { formInputWrapperClass } from "../../common/formStyles";
import useTicketStore from "@/shared/hooks/store/useTicketStore";
import ManageCategoriesModal from "./ManageCategoriesModal";
import TicketDetailsModal from "./TicketDetailsModal";
import {
    getOwnerDisplayName,
    ticketPriorityStyles,
    ticketStatusStyles,
    type ITicket,
    type TTicketPriority,
    type TTicketStatus,
} from "@/shared/core/pages/supportTickets";

// ─── Filter options ───────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Open" },
    { value: "reply", label: "Pending Reply" },
    { value: "closed", label: "Closed" },
    { value: "solved", label: "Solved" },
];

const PRIORITY_OPTIONS = [
    { value: "all", label: "All Priority" },
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
];

const statusStylesForSelect: Record<string, { label: string; bg: string; text: string }> = {
    ...ticketStatusStyles,
    all: { label: "All Status", bg: "", text: "" },
};

const priorityStylesForSelect: Record<string, { label: string; bg: string; text: string }> = {
    ...ticketPriorityStyles,
    all: { label: "All Priority", bg: "", text: "" },
};

const ORDER_OPTIONS = [
    { value: "desc", label: "Newest First" },
    { value: "asc", label: "Oldest First" },
];

const orderStylesForSelect: Record<string, { label: string; bg: string; text: string }> = {
    desc: { label: "Newest First", bg: "", text: "" },
    asc:  { label: "Oldest First", bg: "", text: "" },
};

// ─── Skeleton row ─────────────────────────────────────────────────────────────

const SkeletonRow = () => (
    <TableRow className="border-b border-main-whiteMarble animate-pulse">
        {Array.from({ length: 8 }).map((_, i) => (
            <TableCell key={i} className="py-4 px-5">
                <div className="h-3.5 rounded bg-main-whiteMarble w-20" />
            </TableCell>
        ))}
    </TableRow>
);

// ─── Main ─────────────────────────────────────────────────────────────────────

const TicketsTable = () => {
    const {
        tickets,
        meta,
        loading,
        fetchTickets,
        fetchCategories,
        setQuery,
        setPage,
        resetQuery,
        fetchTicketDetail,
    } = useTicketStore();

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [orderFilter, setOrderFilter] = useState<"asc" | "desc">("desc");
    const [categoriesModalOpen, setCategoriesModalOpen] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchTickets();
        fetchCategories();
    }, []);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            setQuery({ partial_matching: search.trim() || undefined });
        }, 400);
        return () => clearTimeout(timer);
    }, [search]);

    const handleStatusFilter = (value: string) => {
        setStatusFilter(value);
        setQuery({ status: value === "all" ? undefined : (value as TTicketStatus) });
    };

    const handlePriorityFilter = (value: string) => {
        setPriorityFilter(value);
        setQuery({ priority: value === "all" ? undefined : (value as TTicketPriority) });
    };

    const handleOrderFilter = (value: string) => {
        const order = value as "asc" | "desc";
        setOrderFilter(order);
        setQuery({ sorting: order });
    };

    const handleReset = () => {
        setSearch("");
        setStatusFilter("all");
        setPriorityFilter("all");
        setOrderFilter("desc");
        resetQuery();
    };

    const handleViewDetails = async (ticket: ITicket) => {
        await fetchTicketDetail(ticket.id);
        setDetailModalOpen(true);
    };

    const currentPage = meta?.current_page ?? 1;
    const totalPages = meta?.total_pages ?? 1;
    const showPagination = !loading && tickets.length > 0 && totalPages > 1;

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="bg-main-white border border-main-whiteMarble common-rounded p-4 flex flex-wrap items-center gap-3">
                {/* Search */}
                <div
                    className={clsx(
                        "flex items-center gap-2 flex-1 min-w-50 cursor-text",
                        formInputWrapperClass
                    )}
                    onClick={() => inputRef.current?.focus()}
                >
                    <Search className="text-main-trueBlack/50 shrink-0" size={16} />
                    <Input
                        ref={inputRef}
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by subject or description…"
                        className="border-0 shadow-none h-full p-0 placeholder:text-main-trueBlack/50 focus-visible:ring-0 bg-transparent"
                    />
                </div>

                {/* Status filter */}
                <StatusSelect
                    value={statusFilter}
                    onChange={handleStatusFilter}
                    options={STATUS_OPTIONS}
                    statusStyles={statusStylesForSelect}
                    placeholder="All Status"
                />

                {/* Priority filter */}
                <StatusSelect
                    value={priorityFilter}
                    onChange={handlePriorityFilter}
                    options={PRIORITY_OPTIONS}
                    statusStyles={priorityStylesForSelect}
                    placeholder="All Priority"
                />

                {/* Order filter */}
                <StatusSelect
                    value={orderFilter}
                    onChange={handleOrderFilter}
                    options={ORDER_OPTIONS}
                    statusStyles={orderStylesForSelect}
                    placeholder="Newest First"
                />

                {/* Manage Categories */}
                <Button
                    variant="outline"
                    onClick={() => setCategoriesModalOpen(true)}
                    className="h-11 px-5 border-main-whiteMarble text-main-hydrocarbon font-semibold shrink-0"
                >
                    <Settings2 size={15} />
                    Manage Categories
                </Button>

                {/* Reset */}
                <Button
                    variant="outline"
                    onClick={handleReset}
                    className="h-11 px-4 border-main-whiteMarble text-main-hydrocarbon shrink-0"
                >
                    <RotateCcw size={15} />
                </Button>
            </div>

            {/* Table */}
            <div className="bg-main-white border border-main-whiteMarble common-rounded overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-main-luxuryWhite border-b border-main-whiteMarble hover:bg-main-luxuryWhite">
                            {["Ticket", "Subject", "Customer", "Type", "Category", "Priority", "Status", "Updated", "Actions"].map(
                                (h) => (
                                    <TableHead
                                        key={h}
                                        className="text-main-hydrocarbon font-semibold text-sm py-4 px-5"
                                    >
                                        {h}
                                    </TableHead>
                                )
                            )}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {loading
                            ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                            : tickets.map((ticket) => (
                                <TicketRow
                                    key={ticket.id}
                                    ticket={ticket}
                                    onViewDetails={handleViewDetails}
                                />
                            ))}

                        {!loading && tickets.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={9} className="p-2">
                                    <NoDataFound
                                        title="No tickets found"
                                        description="Try adjusting your filters."
                                    />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {showPagination && (
                    <TablePagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                )}
            </div>

            <ManageCategoriesModal
                open={categoriesModalOpen}
                onOpenChange={setCategoriesModalOpen}
            />

            <TicketDetailsModal
                open={detailModalOpen}
                onOpenChange={setDetailModalOpen}
            />
        </div>
    );
};

// ─── Row ──────────────────────────────────────────────────────────────────────

const TicketRow = ({
    ticket,
    onViewDetails,
}: {
    ticket: ITicket;
    onViewDetails: (t: ITicket) => void;
}) => {
    const owner = ticket.user ?? ticket.driver;
    const ownerType = ticket.user ? "User" : ticket.driver ? "Driver" : "—";

    const updatedDate = new Date(ticket.updated_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    return (
        <TableRow className="border-b border-main-whiteMarble hover:bg-main-luxuryWhite/50 transition-colors">
            <TableCell className="py-4 px-5 font-semibold text-main-primary text-sm">
                #{ticket.id}
            </TableCell>
            <TableCell className="py-4 px-5 text-main-mirage font-medium text-sm max-w-45 truncate">
                {ticket.subject}
            </TableCell>
            <TableCell className="py-4 px-5">
                {owner ? (
                    <div className="flex flex-col">
                        <span className="text-main-mirage font-semibold text-sm">
                            {getOwnerDisplayName(owner)}
                        </span>
                        {owner.email && (
                            <span className="text-main-sharkGray text-xs">{owner.email}</span>
                        )}
                    </div>
                ) : (
                    <span className="text-main-sharkGray text-sm">—</span>
                )}
            </TableCell>
            <TableCell className="py-4 px-5">
                <span
                    className={clsx(
                        "px-2.5 py-1 rounded-full text-xs font-medium",
                        ownerType === "User"
                            ? "bg-main-primary/10 text-main-primary"
                            : ownerType === "Driver"
                            ? "bg-main-vividSubmarine/15 text-main-vividSubmarine"
                            : "bg-main-sharkGray/15 text-main-sharkGray"
                    )}
                >
                    {ownerType}
                </span>
            </TableCell>
            <TableCell className="py-4 px-5 text-main-hydrocarbon text-sm">
                {ticket.category.name}
            </TableCell>
            <TableCell className="py-4 px-5">
                <PriorityBadge priority={ticket.priority} />
            </TableCell>
            <TableCell className="py-4 px-5">
                <StatusBadge status={ticket.status} />
            </TableCell>
            <TableCell className="py-4 px-5 text-main-sharkGray text-sm whitespace-nowrap">
                {updatedDate}
            </TableCell>
            <TableCell className="py-4 px-5">
                <button
                    onClick={() => onViewDetails(ticket)}
                    className="text-main-primary font-semibold text-sm hover:underline whitespace-nowrap"
                >
                    View Details
                </button>
            </TableCell>
        </TableRow>
    );
};

// ─── Badges ───────────────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: TTicketStatus }) => {
    const s = ticketStatusStyles[status] ?? ticketStatusStyles.pending;
    return (
        <span className={clsx("px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap", s.bg, s.text)}>
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

export default TicketsTable;
