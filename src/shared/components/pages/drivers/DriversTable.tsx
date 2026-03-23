import clsx from "clsx";
import { useState } from "react";
import { Star } from "lucide-react";
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { drivers, driverStatusStyles, type IDriver, type TDriverStatus } from "@/shared/core/pages/drivers";
import Searchbar from "../../common/Searchbar";
import TablePagination from "../../common/TablePagination";
import { useTableSearch } from "@/shared/hooks/useTableSearch";
import EmptyRow from "../../common/EmptyRow";

const PAGE_SIZE = 5;

const DriversTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const { query, setQuery, filtered } = useTableSearch(drivers, ["name", "vehicleType", "status"]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const handleSearch = (q: string) => {
        setQuery(q);
        setCurrentPage(1);
    };

    return (
        <div className="space-y-6">
            <Searchbar placeholder="Search drivers by name or vehicle..." value={query} onChange={handleSearch} />
            <div className="bg-main-white border border-main-whiteMarble common-rounded overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-main-luxuryWhite border-b border-main-whiteMarble hover:bg-main-luxuryWhite">
                            <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">Driver</TableHead>
                            <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">Vehicle Type</TableHead>
                            <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">Status</TableHead>
                            <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">Earnings</TableHead>
                            <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">Trips</TableHead>
                            <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">Rating</TableHead>
                            <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginated.length > 0 ? (
                            paginated.map((driver) => <DriverRow key={driver.id} driver={driver} />)
                        ) : (
                            <EmptyRow colSpan={7} />
                        )}
                    </TableBody>
                </Table>
                <TablePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
        </div>
    );
};

const DriverRow = ({ driver }: { driver: IDriver }) => {
    const initials = driver.name
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
                        <span className="text-main-mirage font-semibold text-sm">{driver.name}</span>
                        <span className="text-main-sharkGray text-xs">Joined {driver.joinDate}</span>
                    </div>
                </div>
            </TableCell>
            <TableCell className="py-4 px-6 text-main-hydrocarbon text-sm">{driver.vehicleType}</TableCell>
            <TableCell className="py-4 px-6"><StatusBadge status={driver.status} /></TableCell>
            <TableCell className="py-4 px-6 text-main-primary font-semibold text-sm">
                {driver.earnings > 0 ? `EGP ${driver.earnings.toLocaleString()}` : "EGP 0"}
            </TableCell>
            <TableCell className="py-4 px-6 text-main-mirage font-bold text-sm">{driver.trips}</TableCell>
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
            <TableCell className="py-4 px-6">
                <div className="flex items-center gap-3">
                    <button className="text-main-primary font-semibold text-sm hover:underline">View</button>
                    {driver.status === "pending" && (
                        <>
                            <button className="text-main-vividMint font-semibold text-sm hover:underline">Approve</button>
                            <button className="text-main-remove font-semibold text-sm hover:underline">Reject</button>
                        </>
                    )}
                </div>
            </TableCell>
        </TableRow>
    );
};

const StatusBadge = ({ status }: { status: TDriverStatus }) => {
    const { bg, text, label } = driverStatusStyles[status];
    return <span className={clsx("px-3 py-1 rounded-full text-xs font-medium", bg, text)}>{label}</span>;
};

export default DriversTable;