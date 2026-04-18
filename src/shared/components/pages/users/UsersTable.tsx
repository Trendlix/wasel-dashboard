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
import { Download, RotateCcw, Search } from "lucide-react";
import { statusStyles, type TUserStatus } from "@/shared/core/pages/users";
import TablePagination from "../../common/TablePagination";
import NoDataFound from "../../common/NoDataFound";
import UserDetailsModal from "./UserDetailsModal";
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
        <TableCell className="py-4 px-6 text-right"><div className="h-3.5 w-16 rounded bg-main-whiteMarble ml-auto" /></TableCell>
    </TableRow>
);

// ─── Main table ───────────────────────────────────────────────────────────────

const STATUS_FILTER_OPTIONS: { value: string; label: string }[] = [
    { value: "all", label: "All statuses" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "blocked", label: "Blocked" },
    { value: "deleted", label: "Deleted" },
];

const UsersTable = () => {
    const { users, meta, loading, exporting, fetchUsers, setQuery, setPage, resetQuery, exportUsers } = useUserStore();

    const [searchInput, setSearchInput] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedUser, setSelectedUser] = useState<IAppUser | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

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
                        placeholder="Search by name, email or phone…"
                        className="border-0 shadow-none h-full p-0 placeholder:text-main-trueBlack/50 focus-visible:ring-0 bg-transparent"
                    />
                </div>

                {/* Status filter */}
                <StatusSelect
                    value={statusFilter}
                    onChange={handleStatusFilter}
                    options={STATUS_FILTER_OPTIONS}
                    statusStyles={statusStyles}
                    placeholder="All statuses"
                />

                {/* Export */}
                <Button
                    className="h-11 px-6 bg-main-primary text-main-white shrink-0 font-bold"
                    onClick={exportUsers}
                    disabled={exporting}
                >
                    <Download size={16} />
                    <span>{exporting ? "Exporting..." : "Export"}</span>
                </Button>

                {/* Reset */}
                <Button
                    variant="outline"
                    className="h-11 px-5 border-main-whiteMarble text-main-hydrocarbon shrink-0 font-semibold"
                    onClick={handleResetFilters}
                >
                    <RotateCcw size={16} />
                    <span>Reset</span>
                </Button>
            </div>

            {/* ── Table ── */}
            <div className="bg-main-white border border-main-whiteMarble common-rounded overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-main-luxuryWhite border-b border-main-whiteMarble hover:bg-main-luxuryWhite">
                            <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">User</TableHead>
                            <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">Phone</TableHead>
                            <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">Status</TableHead>
                            <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">Voucher Usage</TableHead>
                            <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">Joined</TableHead>
                            <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6 text-right">Actions</TableHead>
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
                                        title="No users found"
                                        description="Try adjusting your search or filters."
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
    const initials = user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const joinDate = new Date(user.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

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

            <TableCell className="py-4 px-6 text-right">
                <button
                    onClick={() => onViewDetails(user)}
                    className="text-main-primary font-semibold text-sm hover:underline"
                >
                    View Details
                </button>
            </TableCell>
        </TableRow>
    );
};

// ─── Status badge ─────────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: TUserStatus }) => {
    const style = statusStyles[status] ?? statusStyles.inactive;
    return (
        <span className={clsx("px-3 py-1 rounded-full text-xs font-medium", style.bg, style.text)}>
            {style.label}
        </span>
    );
};

export default UsersTable;
