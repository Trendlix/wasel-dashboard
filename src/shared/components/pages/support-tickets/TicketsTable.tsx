import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
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
import { formatAppDateShort } from "@/lib/formatLocaleDate";
import useAuthStore from "@/shared/hooks/store/useAuthStore";

const SkeletonRow = () => (
    <TableRow className="border-b border-main-whiteMarble animate-pulse">
        {Array.from({ length: 9 }).map((_, i) => (
            <TableCell key={i} className="py-4 px-5">
                <div className="h-3.5 rounded bg-main-whiteMarble w-20" />
            </TableCell>
        ))}
    </TableRow>
);

const TicketsTable = () => {
    const { t, i18n } = useTranslation(["support", "common"]);
    const { userProfile } = useAuthStore();
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

    const statusOptions = useMemo(
        () => [
            { value: "all", label: t("support:filters.allStatus") },
            { value: "pending", label: t("support:statuses.pending") },
            { value: "reply", label: t("support:statuses.reply") },
            { value: "closed", label: t("support:statuses.closed") },
            { value: "solved", label: t("support:statuses.solved") },
        ],
        [t],
    );

    const priorityOptions = useMemo(
        () => [
            { value: "all", label: t("support:filters.allPriority") },
            { value: "low", label: t("support:priorities.low") },
            { value: "medium", label: t("support:priorities.medium") },
            { value: "high", label: t("support:priorities.high") },
        ],
        [t],
    );

    const orderOptions = useMemo(
        () => [
            { value: "desc", label: t("support:filters.newestFirst") },
            { value: "asc", label: t("support:filters.oldestFirst") },
        ],
        [t],
    );

    const statusStylesForSelect = useMemo(
        () => ({
            ...ticketStatusStyles,
            all: { bg: "", text: "" },
        }),
        [],
    );

    const priorityStylesForSelect = useMemo(
        () => ({
            ...ticketPriorityStyles,
            all: { bg: "", text: "" },
        }),
        [],
    );

    const orderStylesForSelect = useMemo(
        () => ({
            desc: { bg: "", text: "" },
            asc: { bg: "", text: "" },
        }),
        [],
    );

    const tableHeaderKeys = useMemo(
        () =>
            [
                "table.headers.ticket",
                "table.headers.subject",
                "table.headers.customer",
                "table.headers.type",
                "table.headers.category",
                "table.headers.priority",
                "table.headers.status",
                "table.headers.updated",
                "table.headers.actions",
            ] as const,
        [],
    );

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
    }, [fetchTickets, fetchCategories]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setQuery({ partial_matching: search.trim() || undefined });
        }, 400);
        return () => clearTimeout(timer);
    }, [search, setQuery]);

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
            <div className="bg-main-white border border-main-whiteMarble common-rounded p-4 flex flex-wrap items-center gap-3">
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
                        placeholder={t("support:table.searchPlaceholder")}
                        className="border-0 shadow-none h-full p-0 placeholder:text-main-trueBlack/50 focus-visible:ring-0 bg-transparent"
                    />
                </div>

                <StatusSelect
                    value={statusFilter}
                    onChange={handleStatusFilter}
                    options={statusOptions}
                    statusStyles={statusStylesForSelect}
                    placeholder={t("support:filters.allStatus")}
                />

                <StatusSelect
                    value={priorityFilter}
                    onChange={handlePriorityFilter}
                    options={priorityOptions}
                    statusStyles={priorityStylesForSelect}
                    placeholder={t("support:filters.allPriority")}
                />

                <StatusSelect
                    value={orderFilter}
                    onChange={handleOrderFilter}
                    options={orderOptions}
                    statusStyles={orderStylesForSelect}
                    placeholder={t("support:filters.newestFirst")}
                />

                <Button
                    variant="outline"
                    onClick={() => setCategoriesModalOpen(true)}
                    className="h-11 px-5 border-main-whiteMarble text-main-hydrocarbon font-semibold shrink-0"
                >
                    <Settings2 size={15} />
                    {t("support:table.manageCategories")}
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    className="h-11 px-4 border-main-whiteMarble text-main-hydrocarbon shrink-0"
                    aria-label={t("common:resetFilters")}
                >
                    <RotateCcw size={15} />
                </Button>
            </div>

            <div className="bg-main-white border border-main-whiteMarble common-rounded overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-main-luxuryWhite border-b border-main-whiteMarble hover:bg-main-luxuryWhite">
                            {tableHeaderKeys.map((key) => (
                                <TableHead
                                    key={key}
                                    className="text-main-hydrocarbon font-semibold text-sm py-4 px-5"
                                >
                                    {t(`support:${key}`)}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {loading
                            ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                            : tickets.map((ticket) => (
                                <TicketRow
                                    key={ticket.id}
                                    ticket={ticket}
                                    lang={i18n.language}
                                    currentAdminId={userProfile?.id ?? null}
                                    onViewDetails={handleViewDetails}
                                />
                            ))}

                        {!loading && tickets.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={9} className="p-2">
                                    <NoDataFound
                                        title={t("support:table.emptyTitle")}
                                        description={t("support:table.emptyDescription")}
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

const TicketRow = ({
    ticket,
    lang,
    currentAdminId,
    onViewDetails,
}: {
    ticket: ITicket;
    lang: string;
    currentAdminId: number | null;
    onViewDetails: (t: ITicket) => void;
}) => {
    const { t } = useTranslation("support");
    const owner = ticket.user ?? ticket.driver;
    const ownerType = ticket.user
        ? t("owner.user")
        : ticket.driver
          ? t("owner.driver")
          : "—";

    const rawName = owner ? getOwnerDisplayName(owner) : "";
    const displayName = owner ? (rawName || t("owner.noName")) : "—";
    const assignedAdmin = ticket.assigned_admin;
    const isLockedForCurrentAdmin =
        ticket.assigned_admin_id !== null &&
        ticket.assigned_admin_id !== currentAdminId;

    const updatedDate = formatAppDateShort(ticket.updated_at, lang);

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
                            {displayName}
                        </span>
                        {owner.email && (
                            <span className="text-main-sharkGray text-xs">{owner.email}</span>
                        )}
                        {assignedAdmin && (
                            <span className="text-main-primary text-[11px] font-medium">
                                {t("lock.assignedTo")}: {assignedAdmin.name || assignedAdmin.email}
                            </span>
                        )}
                        {isLockedForCurrentAdmin && (
                            <span className="text-main-remove text-[11px] font-semibold">
                                {t("lock.lockedForYou")}
                            </span>
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
                        ticket.user
                            ? "bg-main-primary/10 text-main-primary"
                            : ticket.driver
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
                    type="button"
                    onClick={() => onViewDetails(ticket)}
                    className="text-main-primary font-semibold text-sm hover:underline whitespace-nowrap"
                >
                    {t("table.viewDetails")}
                </button>
            </TableCell>
        </TableRow>
    );
};

const StatusBadge = ({ status }: { status: TTicketStatus }) => {
    const { t } = useTranslation("support");
    const s = ticketStatusStyles[status] ?? ticketStatusStyles.pending;
    return (
        <span className={clsx("px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap", s.bg, s.text)}>
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

export default TicketsTable;
