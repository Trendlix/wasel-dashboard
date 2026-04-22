import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Eye, RotateCcw, Search, Send } from "lucide-react";
import TablePagination from "@/shared/components/common/TablePagination";
import NoDataFound from "@/shared/components/common/NoDataFound";
import { formInputWrapperClass, formSelectTriggerClass } from "@/shared/components/common/formStyles";
import SendNotificationModal from "@/shared/components/pages/notifications/SendNotificationModal";
import useOffersUpdatesNotificationsStore, {
    type TSortValue,
    type IOffersUpdatesRow,
} from "@/shared/hooks/store/useOffersUpdatesNotificationsStore";

const sourceI18nKey: Record<IOffersUpdatesRow["source"], "typeOffer" | "typeUpdate"> = {
    offer: "typeOffer",
    update: "typeUpdate",
};

const sourceBadge: Record<IOffersUpdatesRow["source"], string> = {
    offer: "bg-main-secondary/15 text-main-secondary border-main-secondary/30",
    update: "bg-main-primary/10 text-main-primary border-main-primary/20",
};

const PAGE_SIZE = 15;
type TTypeFilter = "all" | IOffersUpdatesRow["source"];

const NotificationsOffersUpdatesTab = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation(["notifications", "common"]);

    const formatDate = (value: string | null | undefined) => formatAppDateTime(value, i18n.language);
    const [typeFilter, setTypeFilter] = useState<TTypeFilter>("all");

    const {
        rows,
        loading,
        search,
        sortValue,
        page,
        sendModalOpen,
        setSearch,
        setSortValue,
        setPage,
        setSendModalOpen,
        resetFilters,
        fetchNotifications,
    } = useOffersUpdatesNotificationsStore();

    useEffect(() => {
        fetchNotifications();
    }, []);

    const filteredRows = useMemo(() => {
        const lowerSearch = search.trim().toLowerCase();
        let data = rows.filter((row) => {
            if (!lowerSearch) return true;
            return `${row.title} ${row.description}`.toLowerCase().includes(lowerSearch);
        });
        if (typeFilter !== "all") {
            data = data.filter((row) => row.source === typeFilter);
        }

        data = data.sort((a, b) => {
            if (sortValue === "created-desc")
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            if (sortValue === "created-asc")
                return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            if (sortValue === "title-asc") return a.title.localeCompare(b.title);
            if (sortValue === "title-desc") return b.title.localeCompare(a.title);
            return 0;
        });
        return data;
    }, [rows, search, sortValue, typeFilter]);

    const paginatedRows = filteredRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));

    return (
        <PageTransition>
            <div className="space-y-6">
                {/* Header actions */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3 flex-wrap">
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

                        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as TTypeFilter)}>
                            <SelectTrigger className={`${formSelectTriggerClass} w-fit`}>
                                <SelectValue placeholder={t("notifications:type")} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t("common:all")}</SelectItem>
                                <SelectItem value="offer">{t("notifications:typeOffer")}</SelectItem>
                                <SelectItem value="update">{t("notifications:typeUpdate")}</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button
                            variant="outline"
                            onClick={() => {
                                resetFilters();
                                setTypeFilter("all");
                            }}
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
                                    <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">{t("notifications:campaignRecipients")}</TableHead>
                                    <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">{t("notifications:sentBy")}</TableHead>
                                    <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">{t("common:createdAt")}</TableHead>
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
                                        <TableCell className="py-4 px-6 text-end"><div className="h-3.5 w-20 rounded bg-main-whiteMarble ms-auto" /></TableCell>
                                    </TableRow>
                                ))}

                                {!loading && paginatedRows.map((row) => (
                                    <TableRow
                                        key={row.row_key}
                                        className="border-b border-main-whiteMarble hover:bg-main-luxuryWhite/50 transition-colors"
                                    >
                                        <TableCell className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold text-main-mirage max-w-[200px] truncate">
                                                    {row.title}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 px-6 text-sm text-main-sharkGray max-w-[280px] truncate">
                                            {row.description}
                                        </TableCell>
                                        <TableCell className="py-4 px-6">
                                            <span
                                                className={clsx(
                                                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border capitalize",
                                                    sourceBadge[row.source],
                                                )}
                                            >
                                                <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
                                                {t(`notifications:${sourceI18nKey[row.source]}`)}
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-4 px-6 text-sm text-main-hydrocarbon">
                                            {t("notifications:sentToUsersCount", { count: row.sent_users_count })}
                                        </TableCell>
                                        <TableCell className="py-4 px-6 text-sm text-main-hydrocarbon">{row.sent_by}</TableCell>
                                        <TableCell className="py-4 px-6 text-sm text-main-sharkGray">{formatDate(row.created_at)}</TableCell>
                                        <TableCell className="py-4 px-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    type="button"
                                                    className="h-8 px-2.5 common-rounded text-main-primary hover:bg-main-primary/10 text-xs font-semibold"
                                                    onClick={() =>
                                                        navigate(
                                                            `/notifications/offers-updates/${row.source}/${encodeURIComponent(row.campaign_id)}`,
                                                        )
                                                    }
                                                >
                                                    <span className="inline-flex items-center gap-1"><Eye size={13} />{t("common:view")}</span>
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {!loading && paginatedRows.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="p-2">
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

                    {!loading && filteredRows.length > PAGE_SIZE && (
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
        </PageTransition>
    );
};

export default NotificationsOffersUpdatesTab;
