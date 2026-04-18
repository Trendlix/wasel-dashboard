import clsx from "clsx";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { CheckCheck, Eye, RotateCcw, Search, Send } from "lucide-react";
import TablePagination from "@/shared/components/common/TablePagination";
import {
    CommonModal,
    CommonModalBody,
    CommonModalFooter,
    CommonModalHeader,
} from "@/shared/components/common/CommonModal";
import NoDataFound from "@/shared/components/common/NoDataFound";
import { formInputWrapperClass, formSelectTriggerClass } from "@/shared/components/common/formStyles";
import SendNotificationModal from "./SendNotificationModal";
import { notificationManagementTabs, type TNotificationDeliveryStatus } from "@/shared/core/pages/notifications";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../common/PageHeader";
import useNotificationManagementStore, {
    toStoreTab,
    type TRowSource,
} from "@/shared/hooks/store/useNotificationManagementStore";

const statusStyles: Record<TNotificationDeliveryStatus, string> = {
    sent: "bg-main-primary/10 text-main-primary",
    scheduled: "bg-main-goldenYellow/20 text-main-goldenYellow",
    failed: "bg-main-lightCoral/20 text-main-lightCoral",
};

const formatDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const NotificationManagement = () => {
    const {
        rowsByTab,
        loading,
        activeTab,
        search,
        dateFilter,
        readFilter,
        sortValue,
        page,
        viewItem,
        sendModalOpen,
        sendModalInitial,
        itemActionLoading,
        markAllLoading,
        setActiveTab,
        setSearch,
        setDateFilter,
        setReadFilter,
        setSortValue,
        setPage,
        setViewItem,
        setSendModalOpen,
        setSendModalInitial,
        resetFilters,
        fetchNotifications,
        markAsRead,
        handleMarkAllAsRead,
    } = useNotificationManagementStore();

    const navigate = useNavigate();

    const redirectToSinglePage = (source: TRowSource, id: number) => {
        navigate(`/notifications/${source}s/${id}`);
    };

    useEffect(() => { fetchNotifications(); }, []);

    const rows = useMemo(() => rowsByTab[activeTab] ?? [], [rowsByTab, activeTab]);

    const filteredRows = useMemo(() => {
        const today = new Date();
        const lowerSearch = search.trim().toLowerCase();

        const filtered = rows.filter((row) => {
            if (lowerSearch) {
                const haystack = `${row.title} ${row.description}`.toLowerCase();
                if (!haystack.includes(lowerSearch)) return false;
            }

            if (readFilter === "read" && !row.is_read) return false;
            if (readFilter === "unread" && row.is_read) return false;

            if (dateFilter !== "all") {
                const date = new Date(row.created_at);
                if (Number.isNaN(date.getTime())) return false;
                if (dateFilter === "today") {
                    const isToday =
                        date.getDate() === today.getDate() &&
                        date.getMonth() === today.getMonth() &&
                        date.getFullYear() === today.getFullYear();
                    if (!isToday) return false;
                } else {
                    const days = dateFilter === "last7" ? 7 : 30;
                    const threshold = new Date(today.getTime() - days * 24 * 60 * 60 * 1000);
                    if (date < threshold) return false;
                }
            }

            return true;
        });

        return [...filtered].sort((a, b) => {
            if (sortValue === "created-desc") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            if (sortValue === "created-asc") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            if (sortValue === "title-asc") return a.title.localeCompare(b.title);
            if (sortValue === "title-desc") return b.title.localeCompare(a.title);
            return 0;
        });
    }, [rows, search, dateFilter, readFilter, sortValue]);

    const pageSize = 10;
    const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
    const currentPage = Math.min(page, totalPages);
    const paginatedRows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const tabCounts = useMemo(
        () => Object.fromEntries(
            notificationManagementTabs.map(({ value }) => [value, rowsByTab[value].length]),
        ) as Record<typeof activeTab, number>,
        [rowsByTab],
    );

    return (
        <>
            <PageHeader title="Notifications" description="Manage, filter, and send notifications across all admin channels." />
            <div className="space-y-6">
                {/* Tabs + Actions */}
                <div className="flex items-center justify-between gap-4">
                    <div className="inline-flex items-center gap-2 bg-main-luxuryWhite p-1 common-rounded">
                        {notificationManagementTabs.map((tab) => {
                            const active = activeTab === tab.value;
                            return (
                                <button
                                    key={tab.value}
                                    type="button"
                                    onClick={() => setActiveTab(tab.value)}
                                    className={clsx(
                                        "h-10 px-4 text-sm font-semibold common-rounded transition-colors",
                                        active ? "bg-main-primary text-main-white" : "text-main-sharkGray hover:text-main-mirage hover:bg-main-white",
                                    )}
                                >
                                    <span>{tab.label}</span>
                                    <span className={clsx(
                                        "ml-2 inline-flex min-w-6 h-6 items-center justify-center rounded-full px-1 text-xs font-bold",
                                        active ? "bg-main-white/20 text-main-white" : "bg-main-white text-main-primary",
                                    )}>
                                        {tabCounts[tab.value]}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-3">
                        {toStoreTab(activeTab) !== null && rows.some((r) => !r.is_read) && (
                            <Button
                                variant="outline"
                                className="h-11 px-5 border-main-whiteMarble text-main-hydrocarbon font-semibold"
                                onClick={handleMarkAllAsRead}
                                disabled={markAllLoading}
                            >
                                <CheckCheck size={16} />
                                {markAllLoading ? "Marking..." : "Mark All as Read"}
                            </Button>
                        )}
                        <Button
                            className="h-11 px-5 bg-main-primary text-main-white hover:bg-main-primary/90 font-semibold"
                            onClick={() => {
                                setSendModalInitial({ tab: activeTab, title: "", message: "" });
                                setSendModalOpen(true);
                            }}
                        >
                            <Send size={16} />
                            Send New Notification
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-main-white border border-main-whiteMarble common-rounded p-6 overflow-x-auto">
                    <div className="flex items-center gap-3 flex-nowrap min-w-max">
                        <div className={clsx("flex items-center gap-2 min-w-[320px] flex-1 shrink-0", formInputWrapperClass)}>
                            <Search size={16} className="text-main-trueBlack/50 shrink-0" />
                            <Input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by title or content..."
                                className="border-0 shadow-none h-full p-0 placeholder:text-main-trueBlack/50 focus-visible:ring-0 bg-transparent"
                            />
                        </div>

                        <Select value={readFilter} onValueChange={(v) => setReadFilter(v as typeof readFilter)}>
                            <SelectTrigger className={`${formSelectTriggerClass} w-fit`}>
                                <SelectValue placeholder="Read status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="unread">Unread</SelectItem>
                                <SelectItem value="read">Read</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={dateFilter} onValueChange={(v) => setDateFilter(v as typeof dateFilter)}>
                            <SelectTrigger className={`${formSelectTriggerClass} w-fit`}>
                                <SelectValue placeholder="Date" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All dates</SelectItem>
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="last7">Last 7 days</SelectItem>
                                <SelectItem value="last30">Last 30 days</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={sortValue} onValueChange={(v) => setSortValue(v as typeof sortValue)}>
                            <SelectTrigger className={`${formSelectTriggerClass} w-fit`}>
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="created-desc">Newest first</SelectItem>
                                <SelectItem value="created-asc">Oldest first</SelectItem>
                                <SelectItem value="title-asc">Title A-Z</SelectItem>
                                <SelectItem value="title-desc">Title Z-A</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button
                            variant="outline"
                            onClick={resetFilters}
                            className="h-11 px-4 border-main-whiteMarble text-main-hydrocarbon"
                        >
                            <RotateCcw size={16} />
                            Reset
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-main-white border border-main-whiteMarble common-rounded overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-main-luxuryWhite border-b border-main-whiteMarble hover:bg-main-luxuryWhite">
                                    <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">Notification Title</TableHead>
                                    <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">Message Preview</TableHead>
                                    <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">Target Audience</TableHead>
                                    <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">Sent By</TableHead>
                                    <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">Created At</TableHead>
                                    <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">Status</TableHead>
                                    <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading && Array.from({ length: 8 }).map((_, i) => (
                                    <TableRow key={`skeleton-${i}`} className="border-b border-main-whiteMarble animate-pulse">
                                        <TableCell className="py-4 px-6"><div className="h-3.5 w-28 rounded bg-main-whiteMarble" /></TableCell>
                                        <TableCell className="py-4 px-6"><div className="h-3.5 w-40 rounded bg-main-whiteMarble" /></TableCell>
                                        <TableCell className="py-4 px-6"><div className="h-3.5 w-28 rounded bg-main-whiteMarble" /></TableCell>
                                        <TableCell className="py-4 px-6"><div className="h-3.5 w-20 rounded bg-main-whiteMarble" /></TableCell>
                                        <TableCell className="py-4 px-6"><div className="h-3.5 w-30 rounded bg-main-whiteMarble" /></TableCell>
                                        <TableCell className="py-4 px-6"><div className="h-6 w-16 rounded-full bg-main-whiteMarble" /></TableCell>
                                        <TableCell className="py-4 px-6 text-right"><div className="h-3.5 w-24 rounded bg-main-whiteMarble ml-auto" /></TableCell>
                                    </TableRow>
                                ))}

                                {!loading && paginatedRows.map((row) => (
                                    <TableRow key={row.row_key} className="border-b border-main-whiteMarble hover:bg-main-luxuryWhite/50">
                                        <TableCell className="py-4 px-6 text-sm font-semibold text-main-mirage max-w-[220px] truncate">
                                            {row.title}
                                        </TableCell>
                                        <TableCell className="py-4 px-6 text-sm text-main-sharkGray max-w-[300px] truncate">
                                            {row.description}
                                        </TableCell>
                                        <TableCell className="py-4 px-6 text-sm text-main-hydrocarbon">{row.target_audience}</TableCell>
                                        <TableCell className="py-4 px-6 text-sm text-main-hydrocarbon">{row.sent_by}</TableCell>
                                        <TableCell className="py-4 px-6 text-sm text-main-sharkGray">{formatDate(row.created_at)}</TableCell>
                                        <TableCell className="py-4 px-6">
                                            <span className={clsx("px-3 py-1 rounded-full text-xs font-semibold capitalize", statusStyles[row.status])}>
                                                {row.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-4 px-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    type="button"
                                                    className="h-8 px-2.5 common-rounded text-main-primary hover:bg-main-primary/10 text-xs font-semibold"
                                                    onClick={() => setViewItem(row)}
                                                >
                                                    <span className="inline-flex items-center gap-1"><Eye size={13} />View</span>
                                                </button>
                                                {!row.is_read && (row.source === "user" || row.source === "driver" || row.source === "trip") && (
                                                    <button
                                                        type="button"
                                                        disabled={itemActionLoading === row.row_key}
                                                        className="h-8 px-2.5 common-rounded text-main-sharkGray hover:bg-main-luxuryWhite text-xs font-semibold disabled:opacity-50"
                                                        onClick={() => markAsRead(row)}
                                                    >
                                                        <span className="inline-flex items-center gap-1">
                                                            <CheckCheck size={13} />
                                                            {itemActionLoading === row.row_key ? "..." : "Mark Read"}
                                                        </span>
                                                    </button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {!loading && paginatedRows.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="p-2">
                                            <NoDataFound title="No notifications found" description="Try adjusting your search or filters." />
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {!loading && filteredRows.length > 0 && (
                        <TablePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
                    )}
                </div>
            </div>

            <SendNotificationModal
                open={sendModalOpen}
                onOpenChange={setSendModalOpen}
                onSent={fetchNotifications}
                initialTab={sendModalInitial.tab}
                initialTitle={sendModalInitial.title}
                initialMessage={sendModalInitial.message}
            />

            <CommonModal open={Boolean(viewItem)} onOpenChange={(open) => !open && setViewItem(null)} maxWidth="sm:max-w-[620px]">
                <CommonModalHeader title="Notification Details" description="Full message and metadata." />
                <CommonModalBody className="space-y-4 pb-6">
                    <div className="space-y-1">
                        <p className="text-xs uppercase tracking-wide text-main-sharkGray">Title</p>
                        <p className="text-main-mirage font-semibold">{viewItem?.title}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs uppercase tracking-wide text-main-sharkGray">Message</p>
                        <p className="text-main-hydrocarbon leading-6 whitespace-pre-wrap">{viewItem?.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-main-sharkGray">Target Audience</p>
                            <p className="text-sm text-main-hydrocarbon">{viewItem?.target_audience}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wide text-main-sharkGray">Sent By</p>
                            <p className="text-sm text-main-hydrocarbon">{viewItem?.sent_by}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wide text-main-sharkGray">Created At</p>
                            <p className="text-sm text-main-hydrocarbon">{viewItem ? formatDate(viewItem.created_at) : "-"}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wide text-main-sharkGray">Status</p>
                            <span className={clsx("inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize", viewItem ? statusStyles[viewItem.status] : statusStyles.sent)}>
                                {viewItem?.status ?? "sent"}
                            </span>
                        </div>
                    </div>
                </CommonModalBody>
                <CommonModalFooter>
                    <Button
                        variant="outline"
                        className="h-11 px-5 border-main-whiteMarble text-main-hydrocarbon"
                        onClick={() => setViewItem(null)}
                    >
                        Close
                    </Button>
                    {
                        !viewItem?.source.includes("offer") && <Button
                            className="h-11 px-5 bg-main-primary text-main-white hover:bg-main-primary/90"
                            onClick={() => {
                                if (viewItem) redirectToSinglePage(viewItem.source, viewItem.id);
                            }}
                        >
                            Open
                        </Button>
                    }
                    {/* {viewItem && !viewItem.is_read && (
                        <Button
                            className="h-11 px-5 bg-main-primary text-main-white hover:bg-main-primary/90"
                            onClick={async () => { await markAsRead(viewItem); setViewItem(null); }}
                            disabled={itemActionLoading === viewItem.row_key}
                        >
                            {itemActionLoading === viewItem.row_key ? "Marking..." : "Mark as Read"}
                        </Button>
                    )} */}
                </CommonModalFooter>
            </CommonModal>
        </>
    );
};

export default NotificationManagement;
