import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useCmsBlogsStore, type BlogStatus, type CmsLocale } from "@/shared/hooks/store/useCmsBlogsStore";
import NoDataFound from "@/shared/components/common/NoDataFound";
import TablePagination from "@/shared/components/common/TablePagination";
import { formInputWrapperClass } from "@/shared/components/common/formStyles";
import { RotateCcw, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CommonModal, CommonModalFooter, CommonModalHeader } from "@/shared/components/common/CommonModal";
import { formatAppDateShort } from "@/lib/formatLocaleDate";

type ConfirmActionType = "publish" | "draft" | "delete";
type StatusFilter = "all" | BlogStatus;

interface ConfirmActionState {
    type: ConfirmActionType;
    itemId: string;
    itemTitle: string;
}

const stripHtml = (value: string) => value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const ITEMS_PER_PAGE = 10;

const statusBadgeClass: Record<BlogStatus, string> = {
    draft: "bg-main-coolGray/15 text-main-coolGray",
    scheduled: "bg-amber-100 text-amber-700",
    published: "bg-emerald-100 text-emerald-700",
};

const BlogItemsListPage = () => {
    const { t, i18n } = useTranslation(["cms", "common"]);
    const navigate = useNavigate();
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("all");
    const [selectedLocale, setSelectedLocale] = useState<"all" | CmsLocale>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [confirmAction, setConfirmAction] = useState<ConfirmActionState | null>(null);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const {
        items,
        itemsMeta,
        categories,
        loadingItems,
        loadingCategories,
        error,
        fetchItems,
        fetchCategories,
        deleteItem,
        publishItem,
        draftItem,
    } = useCmsBlogsStore();

    const filterTabs: Array<{ value: StatusFilter; labelKey: "filterAll" | "filterDrafts" | "filterScheduled" | "filterPublished" }> = [
        { value: "all", labelKey: "filterAll" },
        { value: "draft", labelKey: "filterDrafts" },
        { value: "scheduled", labelKey: "filterScheduled" },
        { value: "published", labelKey: "filterPublished" },
    ];

    const formatStatusLabel = (status: BlogStatus) => t(`cms:blogItemsList.status.${status}`);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery.trim());
        }, 350);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        void fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, selectedCategory, selectedStatus, selectedLocale]);

    useEffect(() => {
        void fetchItems({
            status: selectedStatus === "all" ? undefined : selectedStatus,
            locale: selectedLocale === "all" ? undefined : selectedLocale,
            category: selectedCategory === "all" ? undefined : selectedCategory,
            search: debouncedSearch || undefined,
            page: currentPage,
            limit: ITEMS_PER_PAGE,
        });
    }, [fetchItems, selectedStatus, selectedLocale, selectedCategory, debouncedSearch, currentPage]);

    useEffect(() => {
        if (itemsMeta?.current_page && itemsMeta.current_page !== currentPage) {
            setCurrentPage(itemsMeta.current_page);
        }
    }, [itemsMeta?.current_page, currentPage]);

    const handleResetFilters = () => {
        setSearchQuery("");
        setSelectedCategory("all");
        setSelectedStatus("all");
        setSelectedLocale("all");
    };

    const handleOpenConfirm = (type: ConfirmActionType, itemId: string, itemTitle: string) => {
        setConfirmAction({ type, itemId, itemTitle });
    };

    const handleCloseConfirm = () => {
        if (confirmLoading) return;
        setConfirmAction(null);
    };

    const handleConfirmAction = async () => {
        if (!confirmAction) return;
        setConfirmLoading(true);
        try {
            if (confirmAction.type === "delete") {
                await deleteItem(confirmAction.itemId);
            } else if (confirmAction.type === "publish") {
                await publishItem(confirmAction.itemId);
            } else {
                await draftItem(confirmAction.itemId);
            }
            setConfirmAction(null);
        } finally {
            setConfirmLoading(false);
        }
    };

    const getConfirmCopy = () => {
        if (!confirmAction) {
            return {
                title: "",
                description: "",
                buttonLabel: t("cms:blogItemsList.confirmDefault"),
                buttonClassName: "",
            };
        }

        if (confirmAction.type === "delete") {
            return {
                title: t("cms:blogItemsList.confirmDeleteTitle"),
                description: t("cms:blogItemsList.confirmDeleteBody", { title: confirmAction.itemTitle }),
                buttonLabel: t("cms:blogItemsList.confirmDeleteButton"),
                buttonClassName: "bg-main-remove hover:bg-main-remove/90 text-white",
            };
        }

        if (confirmAction.type === "draft") {
            return {
                title: t("cms:blogItemsList.confirmDraftTitle"),
                description: t("cms:blogItemsList.confirmDraftBody", { title: confirmAction.itemTitle }),
                buttonLabel: t("cms:blogItemsList.confirmDraftButton"),
                buttonClassName: "bg-main-gunmetalBlue hover:bg-main-gunmetalBlue/90 text-white",
            };
        }

        return {
            title: t("cms:blogItemsList.confirmPublishTitle"),
            description: t("cms:blogItemsList.confirmPublishBody", { title: confirmAction.itemTitle }),
            buttonLabel: t("cms:blogItemsList.confirmPublishButton"),
            buttonClassName: "bg-main-primary hover:bg-main-primary/90 text-white",
        };
    };

    const confirmCopy = getConfirmCopy();

    return (
        <div className="rounded-2xl border border-main-whiteMarble bg-main-white p-5 shadow-[0_12px_32px_rgba(17,24,39,0.04)] space-y-4">
            <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-main-mirage">
                    {t("cms:blogItemsList.title")}
                </h3>
                <Button type="button" onClick={() => navigate("/cms/blogs/blog-items/new")}>
                    {t("cms:blogItemsList.addBlog")}
                </Button>
            </div>

            <div className="space-y-3 rounded-2xl border border-main-whiteMarble bg-main-luxuryWhite/40 p-3">
                <div className="flex flex-wrap items-center gap-2">
                    {filterTabs.map((tab) => (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => setSelectedStatus(tab.value)}
                            className={
                                selectedStatus === tab.value
                                    ? "inline-flex h-8 items-center rounded-lg bg-main-primary px-3 text-xs font-semibold text-main-white shadow-sm"
                                    : "inline-flex h-8 items-center rounded-lg bg-main-white px-3 text-xs font-semibold text-main-sharkGray hover:bg-main-whiteMarble/70 hover:text-main-primary"
                            }
                        >
                            {t(`cms:blogItemsList.${tab.labelKey}`)}
                        </button>
                    ))}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div
                        className={`flex min-w-[220px] flex-1 items-center gap-2 px-3 ${formInputWrapperClass}`}
                        onClick={() => searchInputRef.current?.focus()}
                    >
                        <Search className="shrink-0 text-main-trueBlack/50" size={16} />
                        <Input
                            ref={searchInputRef}
                            type="search"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder={t("cms:blogItemsList.searchPlaceholder")}
                            className="h-full border-0 bg-transparent p-0 shadow-none placeholder:text-main-trueBlack/50 focus-visible:ring-0"
                        />
                    </div>

                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="h-11 w-[220px]">
                            <SelectValue placeholder={t("cms:blogItemsList.allCategories")} />
                        </SelectTrigger>
                        <SelectContent align="end">
                            <SelectItem value="all">{t("cms:blogItemsList.allCategories")}</SelectItem>
                            {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                    {category}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={selectedLocale} onValueChange={(value) => setSelectedLocale(value as "all" | CmsLocale)}>
                        <SelectTrigger className="h-11 w-[160px]">
                            <SelectValue placeholder={t("cms:blogItemsList.allLocales")} />
                        </SelectTrigger>
                        <SelectContent align="end">
                            <SelectItem value="all">{t("cms:blogItemsList.allLocales")}</SelectItem>
                            <SelectItem value="en">{t("common:english")}</SelectItem>
                            <SelectItem value="ar">{t("common:arabic")}</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        type="button"
                        variant="outline"
                        className="h-11 border-main-whiteMarble px-4 text-main-hydrocarbon"
                        onClick={handleResetFilters}
                        aria-label={t("common:resetFilters")}
                    >
                        <RotateCcw size={14} />
                    </Button>
                </div>
                {loadingCategories && (
                    <p className="text-xs text-main-coolGray">{t("cms:blogItemsList.loadingCategories")}</p>
                )}
            </div>

            {error && (
                <div className="text-sm text-main-remove bg-main-remove/10 rounded-lg px-3 py-2">
                    {error}
                </div>
            )}

            {loadingItems ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 animate-pulse">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="overflow-hidden rounded-2xl border border-main-whiteMarble bg-main-white shadow-[0_10px_24px_rgba(17,24,39,0.06)]"
                        >
                            <div className="aspect-16/8 w-full bg-main-titaniumWhite" />
                            <div className="space-y-3 px-4 py-4">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="h-6 w-24 rounded-full bg-main-titaniumWhite" />
                                    <div className="h-6 w-20 rounded-full bg-main-titaniumWhite" />
                                </div>
                                <div className="h-5 w-11/12 rounded bg-main-titaniumWhite" />
                                <div className="h-5 w-3/4 rounded bg-main-titaniumWhite" />
                                <div className="h-4 w-full rounded bg-main-titaniumWhite" />
                                <div className="h-4 w-5/6 rounded bg-main-titaniumWhite" />
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-16 rounded bg-main-titaniumWhite" />
                                    <div className="h-3 w-20 rounded bg-main-titaniumWhite" />
                                    <div className="h-3 w-14 rounded bg-main-titaniumWhite" />
                                </div>
                                <div className="flex gap-1.5 pt-1">
                                    <div className="h-7 w-14 rounded bg-main-titaniumWhite" />
                                    <div className="h-7 w-16 rounded bg-main-titaniumWhite" />
                                    <div className="h-7 w-14 rounded bg-main-titaniumWhite" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : items.length === 0 ? (
                <NoDataFound
                    title={t("cms:blogItemsList.emptyTitle")}
                    description={t("cms:blogItemsList.emptyDescription")}
                />
            ) : (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {items.map((item) => {
                        const summary = stripHtml(item.description ?? "");
                        const releaseLabel = item.release_date
                            ? formatAppDateShort(item.release_date, i18n.language)
                            : t("cms:blogItemsList.notScheduled");
                        const createdLabel = item.created_at
                            ? formatAppDateShort(item.created_at, i18n.language)
                            : "—";

                        return (
                            <article
                                key={item.id}
                                className="overflow-hidden rounded-2xl border border-main-whiteMarble bg-main-white shadow-[0_10px_24px_rgba(17,24,39,0.06)]"
                            >
                                {item.cover_img ? (
                                    <img
                                        src={item.cover_img}
                                        alt={item.title}
                                        className="aspect-16/8 w-full object-cover"
                                    />
                                ) : (
                                    <div className="aspect-16/8 w-full bg-main-titaniumWhite" />
                                )}

                                <div className="space-y-3 px-4 py-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="inline-flex rounded-full bg-main-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-main-primary">
                                            {item.category || t("cms:blogItemsList.generalCategory")}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex rounded-full bg-main-titaniumWhite px-2 py-1 text-[10px] font-semibold uppercase text-main-sharkGray">
                                                {item.locale}
                                            </span>
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass[item.status]}`}
                                            >
                                                {formatStatusLabel(item.status)}
                                            </span>
                                        </div>
                                    </div>

                                    <h4 className="line-clamp-2 text-lg font-bold leading-snug text-main-mirage">
                                        {item.title}
                                    </h4>

                                    <p className="line-clamp-2 text-sm leading-relaxed text-main-sharkGray">
                                        {summary || t("cms:blogItemsList.noDescription")}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-main-coolGray">
                                        <span>{createdLabel}</span>
                                        <span>{releaseLabel}</span>
                                        {item.time_to_read != null && Number(item.time_to_read) > 0 && (
                                            <span>{t("cms:blogItemsList.minRead", { minutes: Number(item.time_to_read) })}</span>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="h-7 border-main-whiteMarble px-3 text-xs text-main-mirage hover:bg-main-luxuryWhite"
                                            onClick={() => navigate(`/cms/blogs/blog-items/${item.id}/edit`)}
                                        >
                                            {t("cms:blogItemsList.edit")}
                                        </Button>
                                        {item.status !== "published" ? (
                                            <Button
                                                type="button"
                                                className="h-7 bg-main-primary px-3 text-xs text-white hover:bg-main-primary/90"
                                                onClick={() => handleOpenConfirm("publish", item.id, item.title)}
                                            >
                                                {t("cms:blogItemsList.publish")}
                                            </Button>
                                        ) : (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="h-7 border-main-whiteMarble px-3 text-xs text-main-gunmetalBlue hover:bg-main-gunmetalBlue/10"
                                                onClick={() => handleOpenConfirm("draft", item.id, item.title)}
                                            >
                                                {t("cms:blogItemsList.moveToDraft")}
                                            </Button>
                                        )}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="h-7 px-3 text-xs text-main-remove hover:bg-main-remove/10 hover:text-main-remove"
                                            onClick={() => handleOpenConfirm("delete", item.id, item.title)}
                                        >
                                            {t("cms:blogItemsList.delete")}
                                        </Button>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>

                    {(itemsMeta?.total_pages ?? 1) > 1 && (
                        <div className="rounded-xl border border-main-whiteMarble bg-main-white">
                            <TablePagination
                                currentPage={itemsMeta?.current_page ?? currentPage}
                                totalPages={itemsMeta?.total_pages ?? 1}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    )}
                </div>
            )}

            <CommonModal
                open={Boolean(confirmAction)}
                onOpenChange={(open) => !open && handleCloseConfirm()}
                loading={confirmLoading}
                maxWidth="sm:max-w-[460px]"
            >
                <CommonModalHeader title={confirmCopy.title} description={confirmCopy.description} />
                <CommonModalFooter className="mt-0 py-5">
                    <Button
                        type="button"
                        variant="ghost"
                        className="h-10 px-5 text-main-sharkGray hover:bg-main-titaniumWhite hover:text-main-mirage"
                        onClick={handleCloseConfirm}
                        disabled={confirmLoading}
                    >
                        {t("common:cancel")}
                    </Button>
                    <Button
                        type="button"
                        className={`h-10 px-5 font-semibold ${confirmCopy.buttonClassName}`}
                        onClick={handleConfirmAction}
                        disabled={confirmLoading}
                    >
                        {confirmLoading ? t("cms:blogItemsList.pleaseWait") : confirmCopy.buttonLabel}
                    </Button>
                </CommonModalFooter>
            </CommonModal>
        </div>
    );
};

export default BlogItemsListPage;
