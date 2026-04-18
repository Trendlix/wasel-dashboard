import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { Search, Star, RotateCcw, Download } from "lucide-react";
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { driverStatusStyles, type TDriverStatus } from "@/shared/core/pages/drivers";
import TablePagination from "../../common/TablePagination";
import NoDataFound from "../../common/NoDataFound";
import useDriverStore, { type IAppDriver } from "@/shared/hooks/store/useDriverStore";
import StatusSelect from "../../common/StatusSelect";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formInputWrapperClass } from "../../common/formStyles";
import DriverDetailsModal from "./DriverDetailsModal";

const STATUS_FILTER_OPTIONS: { value: string; label: string }[] = [
    { value: "all", label: "All statuses" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "suspended", label: "Suspended" },
    { value: "blocked", label: "Blocked" },
    { value: "rejected", label: "Rejected" },
    { value: "deleted", label: "Deleted" },
];

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
        <TableCell className="py-4 px-6"><div className="h-3.5 w-28 rounded bg-main-whiteMarble" /></TableCell>
        <TableCell className="py-4 px-6"><div className="h-6 w-20 rounded-full bg-main-whiteMarble" /></TableCell>
        <TableCell className="py-4 px-6"><div className="h-3.5 w-12 rounded bg-main-whiteMarble" /></TableCell>
        <TableCell className="py-4 px-6"><div className="h-3.5 w-24 rounded bg-main-whiteMarble" /></TableCell>
        <TableCell className="py-4 px-6 text-right"><div className="h-3.5 w-16 rounded bg-main-whiteMarble ml-auto" /></TableCell>
    </TableRow>
);

const DriversTable = () => {
    const { drivers, meta, loading, exporting, fetchDrivers, setQuery, setPage, resetQuery, exportDrivers } = useDriverStore();
    const [searchInput, setSearchInput] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedDriver, setSelectedDriver] = useState<IAppDriver | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { fetchDrivers(); }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setQuery({ search: searchInput.trim() || undefined });
        }, 400);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const handleStatusFilter = (value: string) => {
        setStatusFilter(value);
        setQuery({ status: value === "all" ? undefined : value as TDriverStatus });
    };

    const handleResetFilters = () => {
        setSearchInput("");
        setStatusFilter("all");
        resetQuery();
    };

    const handleViewDetails = (driver: IAppDriver) => {
        setSelectedDriver(driver);
        setModalOpen(true);
    };

    const currentPage = meta?.current_page ?? 1;
    const totalPages = meta?.total_pages ?? 1;
    const showPagination = !loading && drivers.length > 0 && totalPages > 1;

    return (
        <div className="space-y-6">
            <div className="bg-main-white border border-main-whiteMarble common-rounded p-6 flex items-center gap-4">
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

                <StatusSelect
                    value={statusFilter}
                    onChange={handleStatusFilter}
                    options={STATUS_FILTER_OPTIONS}
                    statusStyles={driverStatusStyles}
                    placeholder="All statuses"
                />

                <Button
                    className="h-11 px-6 bg-main-primary text-main-white shrink-0 font-bold"
                    onClick={exportDrivers}
                    disabled={exporting}
                >
                    <Download size={16} />
                    <span>{exporting ? "Exporting..." : "Export"}</span>
                </Button>

                <Button
                    variant="outline"
                    className="h-11 px-5 border-main-whiteMarble text-main-hydrocarbon shrink-0 font-semibold"
                    onClick={handleResetFilters}
                >
                    <RotateCcw size={16} />
                    <span>Reset</span>
                </Button>
            </div>

            <div className="bg-main-white border border-main-whiteMarble common-rounded overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-main-luxuryWhite border-b border-main-whiteMarble hover:bg-main-luxuryWhite">
                            <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">Driver</TableHead>
                            <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">Phone</TableHead>
                            <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">Status</TableHead>
                            <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">Rating</TableHead>
                            <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">Joined</TableHead>
                            <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 10 }).map((_, i) => <SkeletonRow key={i} />)
                        ) : drivers.length > 0 ? (
                            drivers.map((driver) => (
                                <DriverRow
                                    key={driver.id}
                                    driver={driver}
                                    onViewDetails={handleViewDetails}
                                />
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="p-2">
                                    <NoDataFound
                                        title="No drivers found"
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

            <DriverDetailsModal
                driver={selectedDriver}
                open={modalOpen}
                onOpenChange={setModalOpen}
            />
        </div>
    );
};

const DriverRow = ({
    driver,
    onViewDetails,
}: {
    driver: IAppDriver;
    onViewDetails: (d: IAppDriver) => void;
}) => {
    const name = driver.name ?? "Driver";
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const joinDate = new Date(driver.created_at).toLocaleDateString("en-US", {
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
                        <span className="text-main-mirage font-semibold text-sm">{name}</span>
                        <span className="text-main-sharkGray text-xs">{driver.email ?? "—"}</span>
                    </div>
                </div>
            </TableCell>
            <TableCell className="py-4 px-6 text-main-hydrocarbon text-sm">{driver.phone}</TableCell>
            <TableCell className="py-4 px-6"><StatusBadge status={driver.status} /></TableCell>
            <TableCell className="py-4 px-6">
                {driver.rating ? (
                    <div className="flex items-center gap-1">
                        <Star size={14} className="text-main-mustardGold fill-main-mustardGold" />
                        <span className="text-main-mirage font-semibold text-sm">{driver.rating}</span>
                    </div>
                ) : (
                    <span className="text-main-sharkGray text-sm">N/A</span>
                )}
            </TableCell>
            <TableCell className="py-4 px-6 text-main-sharkGray text-sm">{joinDate}</TableCell>
            <TableCell className="py-4 px-6 text-right">
                <button
                    onClick={() => onViewDetails(driver)}
                    className="text-main-primary font-semibold text-sm hover:underline"
                >
                    View Details
                </button>
            </TableCell>
        </TableRow>
    );
};

const StatusBadge = ({ status }: { status: TDriverStatus }) => {
    const { bg, text, label } = driverStatusStyles[status];
    return <span className={clsx("px-3 py-1 rounded-full text-xs font-medium", bg, text)}>{label}</span>;
};

export default DriversTable;
