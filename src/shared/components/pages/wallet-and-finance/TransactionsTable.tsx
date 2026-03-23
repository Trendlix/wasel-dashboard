import clsx from "clsx";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    transactions,
    transactionStatusStyles,
    type ITransaction,
    type TTransactionStatus,
} from "@/shared/core/pages/walletFinance";

const TransactionsTable = () => {
    return (
        <div className="bg-main-white border border-main-whiteMarble common-rounded overflow-hidden">
            <div className="p-4 flex items-center justify-between border-b border-main-whiteMarble">
                <h3 className="text-main-mirage font-semibold">Recent Transactions</h3>
                <Button className="h-9 bg-main-primary hover:bg-main-primary/90 text-main-white">
                    <Download size={14} className="mr-2" />
                    Export CSV
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow className="bg-main-luxuryWhite border-b border-main-whiteMarble hover:bg-main-luxuryWhite">
                        <TableHead className="py-4 px-6">Transaction ID</TableHead>
                        <TableHead className="py-4 px-6">Type</TableHead>
                        <TableHead className="py-4 px-6">User/Driver</TableHead>
                        <TableHead className="py-4 px-6">Amount</TableHead>
                        <TableHead className="py-4 px-6">Status</TableHead>
                        <TableHead className="py-4 px-6">Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((row) => <TransactionRow key={row.id} row={row} />)}
                </TableBody>
            </Table>
        </div>
    );
};

const TransactionRow = ({ row }: { row: ITransaction }) => (
    <TableRow className="border-b border-main-whiteMarble hover:bg-main-luxuryWhite/50 transition-colors">
        <TableCell className="py-4 px-6 text-main-primary font-bold">{row.transactionId}</TableCell>
        <TableCell className="py-4 px-6 text-main-hydrocarbon">{row.type}</TableCell>
        <TableCell className="py-4 px-6 text-main-hydrocarbon">{row.userOrDriver}</TableCell>
        <TableCell className="py-4 px-6 text-main-vividMint font-semibold">EGP {row.amount.toLocaleString()}</TableCell>
        <TableCell className="py-4 px-6"><StatusBadge status={row.status} /></TableCell>
        <TableCell className="py-4 px-6 text-main-sharkGray">{row.date}</TableCell>
    </TableRow>
);

const StatusBadge = ({ status }: { status: TTransactionStatus }) => {
    const { bg, text, label } = transactionStatusStyles[status];
    return <span className={clsx("px-3 py-1 rounded-full text-xs font-medium", bg, text)}>{label}</span>;
};

export default TransactionsTable;