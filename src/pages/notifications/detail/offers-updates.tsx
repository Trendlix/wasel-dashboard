import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { Hash, Users } from "lucide-react";
import { isAxiosError } from "axios";
import axiosNormalApiClient from "@/shared/utils/axios";
import PageTransition from "@/shared/components/common/PageTransition";
import PageHeader from "@/shared/components/common/PageHeader";
import NoDataFound from "@/shared/components/common/NoDataFound";
import BackButton from "@/shared/components/common/BackButton";
import { formatAppDateTime } from "@/lib/formatLocaleDate";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import TablePagination from "@/shared/components/common/TablePagination";

type CampaignSource = "offer" | "update";

interface CampaignNotificationDetail {
    id: number;
    campaign_id: string;
    title: string;
    description: string;
    created_at: string;
    payload: Record<string, unknown> | null;
    made_by_admin_id: number;
    sent_users_count: number;
}

interface CampaignItemsMeta {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}

interface CampaignNotificationItem {
    id: number;
    campaign_id: string;
    title: string;
    description: string;
    created_at: string;
    user_id: number;
    made_by_admin_id: number;
}

const PAGE_SIZE = 15;

const NotificationsOffersUpdatesDetail = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation(["notifications", "common"]);
    const { source, campaignId } = useParams<{ source: CampaignSource; campaignId: string }>();

    const [headerLoading, setHeaderLoading] = useState(true);
    const [itemsLoading, setItemsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [headerData, setHeaderData] = useState<CampaignNotificationDetail | null>(null);
    const [items, setItems] = useState<CampaignNotificationItem[]>([]);
    const [meta, setMeta] = useState<CampaignItemsMeta>({
        total: 0,
        page: 1,
        limit: PAGE_SIZE,
        total_pages: 1,
    });
    const [page, setPage] = useState(1);

    const normalizedCampaignId = useMemo(() => {
        if (!campaignId) return "";
        try {
            return decodeURIComponent(campaignId).trim();
        } catch {
            return campaignId.trim();
        }
    }, [campaignId]);

    const sourceLabel =
        source === "offer" ? t("notifications:typeOffer") : t("notifications:typeUpdate");

    const sourceBadge = clsx(
        "inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize",
        source === "offer"
            ? "bg-main-goldenYellow/20 text-main-goldenYellow"
            : "bg-main-primary/10 text-main-primary",
    );

    useEffect(() => {
        setPage(1);
    }, [source, normalizedCampaignId]);

    useEffect(() => {
        const fetchHeader = async () => {
            setHeaderLoading(true);
            setError(null);
            setHeaderData(null);
            try {
                if (!source || !normalizedCampaignId || (source !== "offer" && source !== "update")) {
                    setError(t("notifications:notFoundDescription"));
                    return;
                }
                const endpoint =
                    source === "offer"
                        ? `/dashboard/offers-notifications/campaigns/${encodeURIComponent(normalizedCampaignId)}/latest`
                        : `/dashboard/updates-notifications/campaigns/${encodeURIComponent(normalizedCampaignId)}/latest`;
                const response = await axiosNormalApiClient.get(endpoint);
                setHeaderData(response.data?.data ?? null);
            } catch (e: unknown) {
                setError(isAxiosError(e)
                    ? e.response?.data?.message ?? t("notifications:notFoundDescription")
                    : t("notifications:notFoundDescription"));
            } finally {
                setHeaderLoading(false);
            }
        };
        fetchHeader();
    }, [source, normalizedCampaignId, t]);

    useEffect(() => {
        const fetchItems = async () => {
            setItemsLoading(true);
            try {
                if (!source || !normalizedCampaignId || (source !== "offer" && source !== "update")) {
                    setItems([]);
                    return;
                }

                const endpoint =
                    source === "offer"
                        ? `/dashboard/offers-notifications/campaigns/${encodeURIComponent(normalizedCampaignId)}/items`
                        : `/dashboard/updates-notifications/campaigns/${encodeURIComponent(normalizedCampaignId)}/items`;
                const response = await axiosNormalApiClient.get(endpoint, {
                    params: { page, limit: PAGE_SIZE },
                });

                setItems(response.data?.data ?? []);
                const nextMeta = response.data?.meta;
                setMeta({
                    total: Number(nextMeta?.total ?? 0),
                    page: Number(nextMeta?.page ?? page),
                    limit: Number(nextMeta?.limit ?? PAGE_SIZE),
                    total_pages: Math.max(1, Number(nextMeta?.total_pages ?? 1)),
                });
            } catch (e: unknown) {
                setError(isAxiosError(e)
                    ? e.response?.data?.message ?? t("notifications:notFoundDescription")
                    : t("notifications:notFoundDescription"));
                setItems([]);
                setMeta({ total: 0, page, limit: PAGE_SIZE, total_pages: 1 });
            } finally {
                setItemsLoading(false);
            }
        };

        fetchItems();
    }, [source, normalizedCampaignId, page, t]);

    if (headerLoading && itemsLoading) {
        return (
            <PageTransition>
                <div className="space-y-4 animate-pulse">
                    <div className="h-10 w-36 rounded bg-main-whiteMarble" />
                    <div className="h-8 w-64 rounded bg-main-whiteMarble" />
                    <div className="h-36 rounded bg-main-whiteMarble" />
                </div>
            </PageTransition>
        );
    }

    if (error && !headerData && items.length === 0) {
        return (
            <PageTransition>
                <div className="space-y-6">
                    <BackButton
                        label={t("common:back")}
                        onClick={() => navigate("/notifications/offers-updates")}
                    />
                    <NoDataFound
                        title={t("notifications:notFoundTitle")}
                        description={error ?? t("notifications:notFoundDescription")}
                    />
                </div>
            </PageTransition>
        );
    }

    return (
        <PageTransition>
            <div className="space-y-6">
                <BackButton
                    label={t("common:back")}
                    onClick={() => navigate("/notifications/offers-updates")}
                />

                <PageHeader
                    title={t("notifications:notificationDetails")}
                    description={t("notifications:detailsDescription")}
                />

                <div className="bg-main-white border border-main-whiteMarble common-rounded p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-main-sharkGray mb-2">
                                {t("notifications:type")}
                            </p>
                            <span className={sourceBadge}>{sourceLabel}</span>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wide text-main-sharkGray mb-2">
                                {t("notifications:campaignRecipients")}
                            </p>
                            <p className="text-sm text-main-hydrocarbon inline-flex items-center gap-2">
                                <Users size={14} />
                                {t("notifications:sentToUsersCount", {
                                    count: headerData?.sent_users_count ?? meta.total,
                                })}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wide text-main-sharkGray mb-2">
                                {t("notifications:campaignId")}
                            </p>
                            <p className="text-sm text-main-hydrocarbon inline-flex items-center gap-2 break-all">
                                <Hash size={14} />
                                {normalizedCampaignId}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-main-white border border-main-whiteMarble common-rounded overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-main-luxuryWhite border-b border-main-whiteMarble hover:bg-main-luxuryWhite">
                                    <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">
                                        {t("common:title")}
                                    </TableHead>
                                    <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">
                                        {t("notifications:messagePreview")}
                                    </TableHead>
                                    <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">
                                        {t("notifications:target")}
                                    </TableHead>
                                    <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">
                                        {t("notifications:sentBy")}
                                    </TableHead>
                                    <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">
                                        {t("common:createdAt")}
                                    </TableHead>
                                    <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">
                                        {t("notifications:type")}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {itemsLoading &&
                                    Array.from({ length: 8 }).map((_, i) => (
                                        <TableRow
                                            key={`campaign-item-sk-${i}`}
                                            className="border-b border-main-whiteMarble animate-pulse"
                                        >
                                            <TableCell className="py-4 px-6">
                                                <div className="h-3.5 w-28 rounded bg-main-whiteMarble" />
                                            </TableCell>
                                            <TableCell className="py-4 px-6">
                                                <div className="h-3.5 w-44 rounded bg-main-whiteMarble" />
                                            </TableCell>
                                            <TableCell className="py-4 px-6">
                                                <div className="h-3.5 w-24 rounded bg-main-whiteMarble" />
                                            </TableCell>
                                            <TableCell className="py-4 px-6">
                                                <div className="h-3.5 w-20 rounded bg-main-whiteMarble" />
                                            </TableCell>
                                            <TableCell className="py-4 px-6">
                                                <div className="h-3.5 w-28 rounded bg-main-whiteMarble" />
                                            </TableCell>
                                            <TableCell className="py-4 px-6">
                                                <div className="h-6 w-16 rounded-full bg-main-whiteMarble" />
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                {!itemsLoading &&
                                    items.map((item) => (
                                        <TableRow
                                            key={item.id}
                                            className="border-b border-main-whiteMarble hover:bg-main-luxuryWhite/50 transition-colors"
                                        >
                                            <TableCell className="py-4 px-6 text-sm font-semibold text-main-mirage max-w-[220px] truncate">
                                                {item.title}
                                            </TableCell>
                                            <TableCell className="py-4 px-6 text-sm text-main-sharkGray max-w-[320px] truncate">
                                                {item.description}
                                            </TableCell>
                                            <TableCell className="py-4 px-6 text-sm text-main-hydrocarbon">
                                                User #{item.user_id}
                                            </TableCell>
                                            <TableCell className="py-4 px-6 text-sm text-main-hydrocarbon">
                                                {item.made_by_admin_id
                                                    ? `Admin #${item.made_by_admin_id}`
                                                    : "System"}
                                            </TableCell>
                                            <TableCell className="py-4 px-6 text-sm text-main-sharkGray">
                                                {formatAppDateTime(item.created_at, i18n.language)}
                                            </TableCell>
                                            <TableCell className="py-4 px-6">
                                                <span className={sourceBadge}>{sourceLabel}</span>
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                {!itemsLoading && items.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="p-2">
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

                    {!itemsLoading && meta.total > meta.limit && (
                        <TablePagination
                            currentPage={meta.page || page}
                            totalPages={meta.total_pages || 1}
                            onPageChange={setPage}
                        />
                    )}
                </div>
            </div>
        </PageTransition>
    );
};

export default NotificationsOffersUpdatesDetail;
