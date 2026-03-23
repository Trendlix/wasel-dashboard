import clsx from "clsx";
import { useState } from "react";
import { Search } from "lucide-react";
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { trips, tripStatusStyles, type ITrip, type TTripStatus } from "@/shared/core/pages/trips";
import TablePagination from "@/shared/components/common/TablePagination";
import { useTableSearch } from "@/shared/hooks/useTableSearch";
import EmptyRow from "../../common/EmptyRow";

const PAGE_SIZE = 5;

const TripsTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const { query, setQuery, filtered } = useTableSearch(trips, ["tripId", "user", "driver", "from", "to", "status"]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const handleSearch = (q: string) => {
        setQuery(q);
        setCurrentPage(1);
    };

    return (
        <div className="bg-main-white border border-main-whiteMarble common-rounded overflow-hidden">
            {/* Search */}
            <div className={clsx("p-4", paginated.length > 0 && "border-b border-main-whiteMarble")}>
                <div className="h-10 border border-main-whiteMarble common-rounded px-3 flex items-center gap-2">
                    <Search size={16} className="text-main-silverSteel shrink-0" />
                    <input
                        value={query}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search trips..."
                        className="w-full bg-transparent outline-none text-sm placeholder:text-main-silverSteel"
                    />
                </div>
            </div>

            {/* Table */}
            <Table>
                <TableHeader>
                    <TableRow className="bg-main-luxuryWhite border-b border-main-whiteMarble hover:bg-main-luxuryWhite">
                        <TableHead className="py-4 px-6 text-main-hydrocarbon font-semibold text-sm">Trip ID</TableHead>
                        <TableHead className="py-4 px-6 text-main-hydrocarbon font-semibold text-sm">User</TableHead>
                        <TableHead className="py-4 px-6 text-main-hydrocarbon font-semibold text-sm">Driver</TableHead>
                        <TableHead className="py-4 px-6 text-main-hydrocarbon font-semibold text-sm">Route</TableHead>
                        <TableHead className="py-4 px-6 text-main-hydrocarbon font-semibold text-sm">Price</TableHead>
                        <TableHead className="py-4 px-6 text-main-hydrocarbon font-semibold text-sm">Status</TableHead>
                        <TableHead className="py-4 px-6 text-main-hydrocarbon font-semibold text-sm">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginated.length > 0 ? (
                        paginated.map((trip) => <TripRow key={trip.id} trip={trip} />)
                    ) : (
                        <EmptyRow colSpan={7} />
                    )}
                </TableBody>
            </Table>

            <TablePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
    );
};

const TripRow = ({ trip }: { trip: ITrip }) => (
    <TableRow className="border-b border-main-whiteMarble hover:bg-main-luxuryWhite/50 transition-colors">
        <TableCell className="py-4 px-6 text-main-primary font-bold text-sm">{trip.tripId}</TableCell>
        <TableCell className="py-4 px-6 text-main-hydrocarbon text-sm">{trip.user}</TableCell>
        <TableCell className="py-4 px-6 text-main-hydrocarbon text-sm">{trip.driver}</TableCell>
        <TableCell className="py-4 px-6">
            <div className="text-sm space-y-1">
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-main-vividMint shrink-0" />{trip.from}</div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-main-remove shrink-0" />{trip.to}</div>
            </div>
        </TableCell>
        <TableCell className="py-4 px-6 text-main-vividMint font-semibold text-sm">EGP {trip.price.toLocaleString()}</TableCell>
        <TableCell className="py-4 px-6"><StatusBadge status={trip.status} /></TableCell>
        <TableCell className="py-4 px-6">
            <button className="text-main-primary font-semibold text-sm hover:underline">View Details</button>
        </TableCell>
    </TableRow>
);

const StatusBadge = ({ status }: { status: TTripStatus }) => {
    const { bg, text, label } = tripStatusStyles[status];
    return <span className={clsx("px-3 py-1 rounded-full text-xs font-medium", bg, text)}>{label}</span>;
};

export default TripsTable;