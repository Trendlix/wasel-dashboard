import clsx from "clsx";
import { useState } from "react";
import { MapPin, Search } from "lucide-react";
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { storageOwners, storageStatusStyles, type IStorageOwner, type TStorageStatus } from "@/shared/core/pages/storageOwners";
import TablePagination from "@/shared/components/common/TablePagination";
import { useTableSearch } from "@/shared/hooks/useTableSearch";
import EmptyRow from "../../common/EmptyRow";

const PAGE_SIZE = 5;

const StorageOwnersTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const { query, setQuery, filtered } = useTableSearch(storageOwners, ["owner", "location", "status"]);

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
                        placeholder="Search storage facilities..."
                        className="w-full bg-transparent outline-none text-sm placeholder:text-main-silverSteel"
                    />
                </div>
            </div>

            {/* Table */}
            <Table>
                <TableHeader>
                    <TableRow className="bg-main-luxuryWhite border-b border-main-whiteMarble hover:bg-main-luxuryWhite">
                        <TableHead className="py-4 px-6 text-main-hydrocarbon font-semibold text-sm">Owner</TableHead>
                        <TableHead className="py-4 px-6 text-main-hydrocarbon font-semibold text-sm">Location</TableHead>
                        <TableHead className="py-4 px-6 text-main-hydrocarbon font-semibold text-sm">Capacity</TableHead>
                        <TableHead className="py-4 px-6 text-main-hydrocarbon font-semibold text-sm">Pricing</TableHead>
                        <TableHead className="py-4 px-6 text-main-hydrocarbon font-semibold text-sm">Status</TableHead>
                        <TableHead className="py-4 px-6 text-main-hydrocarbon font-semibold text-sm">Bookings</TableHead>
                        <TableHead className="py-4 px-6 text-main-hydrocarbon font-semibold text-sm">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginated.length > 0 ? (
                        paginated.map((item) => <StorageRow key={item.id} item={item} />)
                    ) : (
                        <EmptyRow colSpan={7} />
                    )}
                </TableBody>
            </Table>

            <TablePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
    );
};

const StorageRow = ({ item }: { item: IStorageOwner }) => (
    <TableRow className="border-b border-main-whiteMarble hover:bg-main-luxuryWhite/50 transition-colors">
        <TableCell className="py-4 px-6 text-main-mirage font-semibold text-sm">{item.owner}</TableCell>
        <TableCell className="py-4 px-6">
            <div className="flex items-center gap-2 text-main-hydrocarbon text-sm">
                <MapPin size={15} className="text-main-sharkGray" />
                <span>{item.location}</span>
            </div>
        </TableCell>
        <TableCell className="py-4 px-6 text-main-mirage text-sm">{item.capacity} m²</TableCell>
        <TableCell className="py-4 px-6 text-main-vividMint font-semibold text-sm">EGP {item.pricingPerDay}/day</TableCell>
        <TableCell className="py-4 px-6"><StatusBadge status={item.status} /></TableCell>
        <TableCell className="py-4 px-6 text-main-mirage font-bold text-sm">{item.bookings}</TableCell>
        <TableCell className="py-4 px-6">
            <button className="text-main-primary font-semibold text-sm hover:underline">View Details</button>
        </TableCell>
    </TableRow>
);

const StatusBadge = ({ status }: { status: TStorageStatus }) => {
    const { bg, text, label } = storageStatusStyles[status];
    return <span className={clsx("px-3 py-1 rounded-full text-xs font-medium", bg, text)}>{label}</span>;
};

export default StorageOwnersTable;