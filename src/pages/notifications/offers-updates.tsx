import clsx from "clsx";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { formatAppDateTime } from "@/lib/formatLocaleDate";
import PageTransition from "@/shared/components/common/PageTransition";
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
import SendNotificationModal from "@/shared/components/pages/notifications/SendNotificationModal";
import useOffersUpdatesNotificationsStore, {
    type TReadFilter,
    type TSortValue,
    type IOffersUpdatesRow,
} from "@/shared/hooks/store/useOffersUpdatesNotificationsStore";

const sourceI18nKey: Record<IOffersUpdatesRow["source"], "typeOffer" | "typeUpdate"> = {
    offer: "typeOffer",
    update: "typeUpdate",
};

const sourceBadge: Record<IOffersUpdatesRow["source"], string> = {
    offer: "bg-main-goldenYellow/20 text-main-goldenYellow",
    update: "bg-main-primary/10 text-main-primary",
};

const PAGE_SIZE = 15;

const NotificationsOffersUpdatesTab = () => {
    const { t, i18n } = useTranslation(["notifications", "common"]);

    const formatDate = (value: string | null | undefined) => formatAppDateTime(value, i18n.language);

    const {
        rows,
        loading,
        search,
        readFilter,
        sortValue,
        page,
        viewItem,
        sendModalOpen,
        itemActionLoading,
        markAllLoading,
        setSearch,
        setReadFilter,
        setSortValue,
        setPage,
        setViewItem,
        setSendModalOpen,
        resetFilters,
        fetchNotifications,
        markAsRead,
        markAllOffersAsRead,
        markAllUpdatesAsRead,
    } = useOffersUpdatesNotificationsStore();

    useEffect(() => {
        fetchNotifications();
    }, [readFilter]);

    const paginatedRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
    const hasUnreadOffers = rows.some((r) => r.source === "offer" && !r.is_read);
    const hasUnreadUpdates = rows.some((r) => r.source === "update" && !r.is_read);

    return (
        <PageTransition>
            <div className="space-y-6">
                {/* Header actions */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3 flex-wrap">
                        {hasUnreadOffers && (
                            <Button
                                variant="outline"
                                className="h-11 px-5 border-main-whiteMarble text-main-hydrocarbon font-semibold"
                                onClick={markAllOffersAsRead}
                                disabled={markAllLoading}
                            >
                                <CheckCheck size={16} />
                                {markAllLoading ? t("common:marking") : t("notifications:markAllOffersRead")}
                            </Button>
                        )}
                        {hasUnreadUpdates && (
                            <Button
                                variant="outline"
                                className="h-11 px-5 border-main-whiteMarble text-main-hydrocarbon font-semibold"
                                onClick={markAllUpdatesAsRead}
                                disabled={markAllLoading}
                            >
                                <CheckCheck size={16} />
                                {markAllLoading ? t("common:marking") : t("notifications:markAllUpdatesRead")}
                            </Button>
                        )}
                        <Button
                            className="h-11 px-5 bg-main-primary text-main-white hover:bg-main-primary/90 font-semibold"
                            onClick={() => setSendModalOpen(true)}
                        >
                            <Send size={16} />
                            {t("notifications:sendNotification")}
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-main-white border border-main-whiteMarble common-rounded p-6 overflow-x-auto">
                    <div className="flex items-center gap-3 flex-nowrap min-w-max">
                        <div className={clsx("flex items-center gap-2 min-w-[280px] flex-1 shrink-0", formInputWrapperClass)}>
                            <Search size={16} className="text-main-trueBlack/50 shrink-0" />
                            <Input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={t("notifications:searchByTitleOrContent")}
                                className="border-0 shadow-none h-full p-0 placeholder:text-main-trueBlack/50 focus-visible:ring-0 bg-transparent"
                            />
                        </div>

                        <Select value={readFilter} onValueChange={(v) => setReadFilter(v as TReadFilter)}>
                            <SelectTrigger className={`${formSelectTriggerClass} w-fit`}>
                                <SelectValue placeholder={t("common:readStatus")} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t("common:all")}</SelectItem>
                                <SelectItem value="unread">{t("common:unread")}</SelectItem>
                                <SelectItem value="read">{t("common:read")}</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={sortValue} onValueChange={(v) => setSortValue(v as TSortValue)}>
                            <SelectTrigger className={`${formSelectTriggerClass} w-fit`}>
                                <SelectValue placeholder={t("common:sortBy")} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="created-desc">{t("common:newestFirst")}</SelectItem>
                                <SelectItem value="created-asc">{t("common:oldestFirst")}</SelectItem>
                                <SelectItem value="title-asc">{t("common:titleAZ")}</SelectItem>
                                <SelectItem value="title-desc">{t("common:titleZA")}</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button
                            variant="outline"
                            onClick={resetFilters}
                            className="h-11 px-4 border-main-whiteMarble text-main-hydrocarbon"
                        >
                            <RotateCcw size={16} />
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-main-white border border-main-whiteMarble common-rounded overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-main-luxuryWhite border-b border-main-whiteMarble hover:bg-main-luxuryWhite">
                                    <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">{t("common:title")}</TableHead>
                                    <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">{t("notifications:messagePreview")}</TableHead>
                                    <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">{t("notifications:type")}</TableHead>
                                    <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">{t("notifications:target")}</TableHead>
                                    <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">{t("notifications:sentBy")}</TableHead>
                                    <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">{t("common:createdAt")}</TableHead>
                                    <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">{t("common:status")}</TableHead>
                                    <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6 text-end">{t("common:actions")}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading && Array.from({ length: 8 }).map((_, i) => (
                                    <TableRow key={`sk-${i}`} className="border-b border-main-whiteMarble animate-pulse">
                                        <TableCell className="py-4 px-6"><div className="h-3.5 w-28 rounded bg-main-whiteMarble" /></TableCell>
                                        <TableCell className="py-4 px-6"><div className="h-3.5 w-44 rounded bg-main-whiteMarble" /></TableCell>
                                        <TableCell className="py-4 px-6"><div className="h-6 w-16 rounded-full bg-main-whiteMarble" /></TableCell>
                                        <TableCell className="py-4 px-6"><div className="h-3.5 w-24 rounded bg-main-whiteMarble" /></TableCell>
                                        <TableCell className="py-4 px-6"><div className="h-3.5 w-20 rounded bg-main-whiteMarble" /></TableCell>
                                        <TableCell className="py-4 px-6"><div className="h-3.5 w-28 rounded bg-main-whiteMarble" /></TableCell>
                                        <TableCell className="py-4 px-6"><div className="h-6 w-14 rounded-full bg-main-whiteMarble" /></TableCell>
                                        <TableCell className="py-4 px-6 text-end"><div className="h-3.5 w-20 rounded bg-main-whiteMarble ms-auto" /></TableCell>
                                    </TableRow>
                                ))}

                                {!loading && paginatedRows.map((row) => (
                                    <TableRow
                                        key={row.row_key}
                                        className={clsx(
                                            "border-b border-main-whiteMarble hover:bg-main-luxuryWhite/50 transition-colors",
                                            !row.is_read && "bg-main-primary/[0.02]",
                                        )}
                                    >
                                        <TableCell className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                {!row.is_read && (
                                                    <span className="h-2 w-2 rounded-full bg-main-primary shrink-0" />
                                                )}
                                                <span className="text-sm font-semibold text-main-mirage max-w-[200px] truncate">
                                                    {row.title}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 px-6 text-sm text-main-sharkGray max-w-[280px] truncate">
                                            {row.description}
                                        </TableCell>
                                        <TableCell className="py-4 px-6">
                                            <span className={clsx("px-3 py-1 rounded-full text-xs font-semibold capitalize", sourceBadge[row.source])}>
                                                {t(`notifications:${sourceI18nKey[row.source]}`)}
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-4 px-6 text-sm text-main-hydrocarbon">{row.target_audience}</TableCell>
                                        <TableCell className="py-4 px-6 text-sm text-main-hydrocarbon">{row.sent_by}</TableCell>
                                        <TableCell className="py-4 px-6 text-sm text-main-sharkGray">{formatDate(row.created_at)}</TableCell>
                                        <TableCell className="py-4 px-6">
                                            <span className={clsx(
                                                "px-3 py-1 rounded-full text-xs font-semibold",
                                                row.is_read
                                                    ? "bg-main-whiteMarble text-main-sharkGray"
                                                    : "bg-main-primary/10 text-main-primary",
                                            )}>
                                                {row.is_read ? t("common:read") : t("common:unread")}
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-4 px-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    type="button"
                                                    className="h-8 px-2.5 common-rounded text-main-primary hover:bg-main-primary/10 text-xs font-semibold"
                                                    onClick={() => setViewItem(row)}
                                                >
                                                    <span className="inline-flex items-center gap-1"><Eye size={13} />{t("common:view")}</span>
                                                </button>
                                                {!row.is_read && (
                                                    <button
                                                        type="button"
                                                        disabled={itemActionLoading === row.row_key}
                                                        className="h-8 px-2.5 common-rounded text-main-sharkGray hover:bg-main-luxuryWhite text-xs font-semibold disabled:opacity-50"
                                                        onClick={() => markAsRead(row)}
                                                    >
                                                        <span className="inline-flex items-center gap-1">
                                                            <CheckCheck size={13} />
                                                            {itemActionLoading === row.row_key ? "…" : t("common:markRead")}
                                                        </span>
                                                    </button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {!loading && paginatedRows.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} className="p-2">
                                            <NoDataFound
                                                title={t("notifications:noOffersUpdates")}
                                                description={t("notifications:adjustFilters")}
                                            />
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {!loading && rows.length > PAGE_SIZE && (
                        <TablePagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                    )}
                </div>
            </div>

            {/* Send modal */}
            <SendNotificationModal
                open={sendModalOpen}
                onOpenChange={setSendModalOpen}
                onSent={fetchNotifications}
                initialTab="offers-updates"
                initialTitle=""
                initialMessage=""
            />

            {/* View modal */}
            <CommonModal open={Boolean(viewItem)} onOpenChange={(open) => !open && setViewItem(null)} maxWidth="sm:max-w-[620px]">
                <CommonModalHeader title={t("notifications:notificationDetails")} description={t("notifications:detailsDescription")} />
                <CommonModalBody className="space-y-4 pb-6">
                    <div className="space-y-1">
                        <p className="text-xs uppercase tracking-wide text-main-sharkGray">{t("common:title")}</p>
                        <p className="text-main-mirage font-semibold">{viewItem?.title}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs uppercase tracking-wide text-main-sharkGray">{t("common:description")}</p>
                        <p className="text-main-hydrocarbon leading-6 whitespace-pre-wrap">{viewItem?.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-main-sharkGray">{t("notifications:type")}</p>
                            <span className={clsx("inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize", viewItem ? sourceBadge[viewItem.source] : "")}>
                                {viewItem ? t(`notifications:${sourceI18nKey[viewItem.source]}`) : "—"}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wide text-main-sharkGray">{t("notifications:target")}</p>
                            <p className="text-sm text-main-hydrocarbon">{viewItem?.target_audience}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wide text-main-sharkGray">{t("notifications:sentBy")}</p>
                            <p className="text-sm text-main-hydrocarbon">{viewItem?.sent_by}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wide text-main-sharkGray">{t("common:createdAt")}</p>
                            <p className="text-sm text-main-hydrocarbon">{viewItem ? formatDate(viewItem.created_at) : "—"}</p>
                        </div>
                    </div>
                </CommonModalBody>
                <CommonModalFooter>
                    <Button
                        variant="outline"
                        className="h-11 px-5 border-main-whiteMarble text-main-hydrocarbon"
                        onClick={() => setViewItem(null)}
                    >
                        {t("common:close")}
                    </Button>
                </CommonModalFooter>
            </CommonModal>
        </PageTransition>
    );
};

export default NotificationsOffersUpdatesTab;
