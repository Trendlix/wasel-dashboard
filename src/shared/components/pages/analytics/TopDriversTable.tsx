import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { topDrivers } from "@/shared/core/pages/analytics";
import TablePagination from "@/shared/components/common/TablePagination";
import clsx from "clsx";

const PAGE_SIZE = 5;

const rankClass = (rank: number) =>
    clsx(
        "w-7 h-7 rounded-full inline-flex items-center justify-center text-xs font-bold",
        rank === 1 && "bg-[#F5B400] text-main-white",
        rank === 2 && "bg-[#C7CED8] text-[#4A5568]",
        rank === 3 && "bg-[#CD7F32] text-main-white",
        rank > 3 && "bg-[#EEF1F5] text-[#6B7280]"
    );

const TopDriversTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(topDrivers.length / PAGE_SIZE);
    const paginated = topDrivers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    return (
        <div className="w-full bg-main-white border border-main-whiteMarble common-rounded overflow-hidden">
            <div className="px-6 py-4 border-b border-main-whiteMarble">
                <h3 className="text-main-mirage font-semibold text-base">Top Performing Drivers</h3>
            </div>
            <Table>
                <TableHeader>
                    <TableRow className="bg-main-luxuryWhite hover:bg-main-luxuryWhite border-b border-main-whiteMarble">
                        <TableHead className="px-6 py-4 text-main-hydrocarbon font-semibold text-sm">Rank</TableHead>
                        <TableHead className="px-6 py-4 text-main-hydrocarbon font-semibold text-sm">Driver</TableHead>
                        <TableHead className="px-6 py-4 text-main-hydrocarbon font-semibold text-sm">Total Trips</TableHead>
                        <TableHead className="px-6 py-4 text-main-hydrocarbon font-semibold text-sm">Total Earnings</TableHead>
                        <TableHead className="px-6 py-4 text-main-hydrocarbon font-semibold text-sm">Avg. per Trip</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginated.map((driver) => (
                        <TableRow key={driver.rank} className="border-b border-main-whiteMarble last:border-b-0 hover:bg-main-luxuryWhite/50 transition-colors">
                            <TableCell className="px-6 py-4">
                                <span className={rankClass(driver.rank)}>{driver.rank}</span>
                            </TableCell>
                            <TableCell className="px-6 py-4 text-main-mirage font-semibold text-sm">{driver.name}</TableCell>
                            <TableCell className="px-6 py-4 text-main-hydrocarbon text-sm">{driver.totalTrips}</TableCell>
                            <TableCell className="px-6 py-4 text-main-vividMint font-semibold text-sm">EGP {driver.totalEarnings.toLocaleString()}</TableCell>
                            <TableCell className="px-6 py-4 text-main-sharkGray text-sm">EGP {driver.avgPerTrip}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <TablePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
    );
};

export default TopDriversTable;