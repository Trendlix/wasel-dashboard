import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { formatAppDateShort } from "@/lib/formatLocaleDate";
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
import { Download, RotateCcw, Search } from "lucide-react";
import { statusStyles, type TUserStatus } from "@/shared/core/pages/users";
import TablePagination from "../../common/TablePagination";
import NoDataFound from "../../common/NoDataFound";
import UserDetailsModal from "./UserDetailsModal";
import UsersExportModal from "./UsersExportModal";
import useUserStore, { type IAppUser } from "@/shared/hooks/store/useUserStore";
import StatusSelect from "../../common/StatusSelect";
import { formInputWrapperClass } from "../../common/formStyles";

// ─── Skeleton row ─────────────────────────────────────────────────────────────

const SkeletonRow = () => (
    <TableRow className="border-b border-main-whiteMarble animate-pulse">
        <TableCell className="py-4 px-6">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-main-whiteMarble shrink-0" />
                <div className="space-y-1.5">
                    <div className="h-3.5 w-28 rounded bg-main-whiteMarble" />
                    <div className="h-3 w-36 rounded bg-main-whiteMarble" />
                </div>
            </div>
        </TableCell>
        <TableCell className="py-4 px-6"><div className="h-3.5 w-32 rounded bg-main-whiteMarble" /></TableCell>
        <TableCell className="py-4 px-6"><div className="h-6 w-20 rounded-full bg-main-whiteMarble" /></TableCell>
        <TableCell className="py-4 px-6"><div className="h-3.5 w-8 rounded bg-main-whiteMarble" /></TableCell>
        <TableCell className="py-4 px-6"><div className="h-3.5 w-24 rounded bg-main-whiteMarble" /></TableCell>
        <TableCell className="py-4 px-6 text-end"><div className="h-3.5 w-16 rounded bg-main-whiteMarble ms-auto" /></TableCell>
    </TableRow>
);

// ─── Main table ───────────────────────────────────────────────────────────────

const UsersTable = () => {
    const { t } = useTranslation(["users", "common"]);
    const { users, meta, loading, exporting, fetchUsers, setQuery, setPage, resetQuery, exportUsers } = useUserStore();

    const statusFilterOptions: { value: string; label: string }[] = [
        { value: "all", label: t("users:filters.allStatuses") },
        { value: "active", label: t("users:filters.active") },
        { value: "inactive", label: t("users:filters.inactive") },
        { value: "blocked", label: t("users:filters.blocked") },
        { value: "deleted", label: t("users:filters.deleted") },
    ];

    const [searchInput, setSearchInput] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedUser, setSelectedUser] = useState<IAppUser | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [exportModalOpen, setExportModalOpen] = useState(false);
    const [exportDateFrom, setExportDateFrom] = useState("");
    const [exportDateTo, setExportDateTo] = useState("");

    const inputRef = useRef<HTMLInputElement>(null);

    // Initial fetch
    useEffect(() => { fetchUsers(); }, []);

    // Debounced search → backend
    useEffect(() => {
        const timer = setTimeout(() => {
            setQuery({ search: searchInput.trim() || undefined });
        }, 400);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const handleStatusFilter = (value: string) => {
        setStatusFilter(value);
        setQuery({ status: value === "all" ? undefined : value as TUserStatus });
    };

    const handleResetFilters = () => {
        setSearchInput("");
        setStatusFilter("all");
        resetQuery();
    };

    const handleViewDetails = (user: IAppUser) => {
        setSelectedUser(user);
        setModalOpen(true);
    };

    const handleExportConfirm = async (payload: { date_from?: string; date_to?: string }) => {
        setExportDateFrom(payload.date_from || "");
        setExportDateTo(payload.date_to || "");
        await exportUsers(payload);
    };

    const currentPage = meta?.current_page ?? 1;
    const totalPages = meta?.total_pages ?? 1;
    const showPagination = !loading && users.length > 0 && totalPages > 1;

    return (
        <div className="space-y-6">

            {/* ── Toolbar ── */}
            <div className="bg-main-white border border-main-whiteMarble common-rounded p-6 flex items-center gap-4">
                {/* Search input */}
                <div
                    className={clsx(
                        "flex items-center gap-2 flex-1 cursor-text",
                        formInputWrapperClass
                    )}
                    onClick={() => inputRef.current?.focus()}
                >
                    <Search className="text-main-trueBlack/50 shrink-0" size={16} />
                    <Input
                        type="search"
                        ref={inputRef}
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder={t("users:searchPlaceholder")}
                        className="border-0 shadow-none h-full p-0 placeholder:text-main-trueBlack/50 focus-visible:ring-0 bg-transparent"
                    />
                </div>

                {/* Status filter */}
                <StatusSelect
                    value={statusFilter}
                    onChange={handleStatusFilter}
                    options={statusFilterOptions}
                    statusStyles={statusStyles}
                    placeholder={t("users:filters.allStatuses")}
                />

                {/* Export */}
                <Button
                    className="h-11 px-6 bg-main-primary text-main-white shrink-0 font-bold"
                    onClick={() => setExportModalOpen(true)}
                    disabled={exporting}
                >
                    <Download size={16} />
                    <span>{exporting ? t("common:exporting") : t("common:export")}</span>
                </Button>

                {/* Reset */}
                <Button
                    type="button"
                    variant="outline"
                    className="h-11 px-5 border-main-whiteMarble text-main-hydrocarbon shrink-0 font-semibold"
                    onClick={handleResetFilters}
                    aria-label={t("common:resetFilters")}
                >
                    <RotateCcw size={16} />
                </Button>
            </div>

            {/* ── Table ── */}
            <div className="bg-main-white border border-main-whiteMarble common-rounded overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-main-luxuryWhite border-b border-main-whiteMarble hover:bg-main-luxuryWhite">
                            <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">{t("users:table.user")}</TableHead>
                            <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">{t("users:table.phone")}</TableHead>
                            <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">{t("users:table.status")}</TableHead>
                            <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">{t("users:table.voucherUsage")}</TableHead>
                            <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">{t("users:table.joined")}</TableHead>
                            <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6 text-end">{t("users:table.actions")}</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {loading
                            ? Array.from({ length: 10 }).map((_, i) => <SkeletonRow key={i} />)
                            : users.map((user) => (
                                <UserRow
                                    key={user.id}
                                    user={user}
                                    onViewDetails={handleViewDetails}
                                />
                            ))
                        }

                        {!loading && users.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="p-2">
                                    <NoDataFound
                                        title={t("users:emptyTitle")}
                                        description={t("users:emptyDescription")}
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

            {/* ── Details modal ── */}
            <UserDetailsModal
                user={selectedUser}
                open={modalOpen}
                onOpenChange={setModalOpen}
            />

            <UsersExportModal
                open={exportModalOpen}
                loading={exporting}
                initialDateFrom={exportDateFrom}
                initialDateTo={exportDateTo}
                onOpenChange={setExportModalOpen}
                onConfirm={handleExportConfirm}
            />
        </div>
    );
};

// ─── Row ──────────────────────────────────────────────────────────────────────

const UserRow = ({
    user,
    onViewDetails,
}: {
    user: IAppUser;
    onViewDetails: (u: IAppUser) => void;
}) => {
    const { t, i18n } = useTranslation("users");
    const joinDate = formatAppDateShort(user.created_at, i18n.language);
    const initials = user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <TableRow className="border-b border-main-whiteMarble hover:bg-main-luxuryWhite/50 transition-colors">
            <TableCell className="py-4 px-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-main-primary flex items-center justify-center shrink-0">
                        <span className="text-main-white text-xs font-semibold">{initials}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-main-mirage font-semibold text-sm">{user.full_name}</span>
                        <span className="text-main-sharkGray text-xs">{user.email}</span>
                    </div>
                </div>
            </TableCell>

            <TableCell className="py-4 px-6 text-main-hydrocarbon text-sm">{user.phone}</TableCell>

            <TableCell className="py-4 px-6">
                <StatusBadge status={user.status} />
            </TableCell>

            <TableCell className="py-4 px-6 text-main-mirage font-bold text-sm">
                {user.total_voucher_usage}
            </TableCell>

            <TableCell className="py-4 px-6 text-main-sharkGray text-sm">{joinDate}</TableCell>

            <TableCell className="py-4 px-6 text-end">
                <button
                    type="button"
                    onClick={() => onViewDetails(user)}
                    className="text-main-primary font-semibold text-sm hover:underline"
                >
                    {t("viewDetails")}
                </button>
            </TableCell>
        </TableRow>
    );
};

// ─── Status badge ─────────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: TUserStatus }) => {
    const { t } = useTranslation("users");
    const style = statusStyles[status] ?? statusStyles.inactive;
    return (
        <span className={clsx("px-3 py-1 rounded-full text-xs font-medium", style.bg, style.text)}>
            {t(`statuses.${status}`)}
        </span>
    );
};

export default UsersTable;
