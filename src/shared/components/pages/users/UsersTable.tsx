import clsx from "clsx";
import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { users, statusStyles, type IUser, type TUserStatus } from "@/shared/core/pages/users";
import Searchbar from "../../common/Searchbar";
import TablePagination from "../../common/TablePagination";
import { useTableSearch } from "@/shared/hooks/useTableSearch";
import EmptyRow from "../../common/EmptyRow";

const PAGE_SIZE = 5;

const UsersTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const { query, setQuery, filtered } = useTableSearch(users, ["name", "email", "phone", "status"]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const handleSearch = (q: string) => {
        setQuery(q);
        setCurrentPage(1);
    };

    return (
        <div className="space-y-6">
            <Searchbar placeholder="Search users..." value={query} onChange={handleSearch} />
            <div className="bg-main-white border border-main-whiteMarble common-rounded overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-main-luxuryWhite border-b border-main-whiteMarble hover:bg-main-luxuryWhite">
                            <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">User</TableHead>
                            <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">Contact</TableHead>
                            <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">Status</TableHead>
                            <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">Total Trips</TableHead>
                            <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">Join Date</TableHead>
                            <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginated.length > 0 ? (
                            paginated.map((user) => <UserRow key={user.id} user={user} />)
                        ) : (
                            <EmptyRow colSpan={6} />
                        )}
                    </TableBody>
                </Table>
                <TablePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
        </div>
    );
};

const UserRow = ({ user }: { user: IUser }) => {
    const initials = user.name
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
                        <span className="text-main-mirage font-semibold text-sm">{user.name}</span>
                        <span className="text-main-sharkGray text-xs">{user.email}</span>
                    </div>
                </div>
            </TableCell>
            <TableCell className="py-4 px-6 text-main-hydrocarbon text-sm">{user.phone}</TableCell>
            <TableCell className="py-4 px-6"><StatusBadge status={user.status} /></TableCell>
            <TableCell className="py-4 px-6 text-main-mirage font-bold text-sm">{user.totalTrips}</TableCell>
            <TableCell className="py-4 px-6 text-main-sharkGray text-sm">{user.joinDate}</TableCell>
            <TableCell className="py-4 px-6 text-right">
                <button className="text-main-primary font-semibold text-sm hover:underline">View Details</button>
            </TableCell>
        </TableRow>
    );
};

const StatusBadge = ({ status }: { status: TUserStatus }) => {
    const { bg, text, label } = statusStyles[status];
    return <span className={clsx("px-3 py-1 rounded-full text-xs font-medium", bg, text)}>{label}</span>;
};

export default UsersTable;