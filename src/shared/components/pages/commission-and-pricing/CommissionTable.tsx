import clsx from "clsx";
import { Percent, Save } from "lucide-react";
import {
    commissionRates,
    categoryStyles,
    type ICommissionRate,
    type TCommissionCategory,
} from "@/shared/core/pages/commissionAndPricing";

// ─── Category badge ───────────────────────────────────────────────────────────

const CategoryBadge = ({ category }: { category: TCommissionCategory }) => {
    const { bg, text, label } = categoryStyles[category];
    return (
        <span className={clsx("px-3 py-1 rounded-full text-xs font-semibold", bg, text)}>
            {label}
        </span>
    );
};

// ─── Table header cell ────────────────────────────────────────────────────────

const TH = ({ children }: { children: React.ReactNode }) => (
    <th className="text-main-hydrocarbon font-semibold text-xs uppercase tracking-wide py-4 px-6 text-left">
        {children}
    </th>
);

// ─── Table row ────────────────────────────────────────────────────────────────

const CommissionRow = ({ row }: { row: ICommissionRate }) => (
    <tr className="border-b border-main-whiteMarble last:border-0 hover:bg-main-luxuryWhite/50 transition-colors">
        <td className="py-5 px-6">
            <CategoryBadge category={row.category} />
        </td>
        <td className="py-5 px-6 text-main-mirage font-semibold text-sm">{row.description}</td>
        <td className="py-5 px-6 text-main-sharkGray text-sm">{row.type}</td>
        <td className="py-5 px-6 text-main-mirage font-bold text-sm">{row.rate}</td>
        <td className="py-5 px-6">
            <button className="text-main-primary font-semibold text-sm hover:underline">Edit</button>
        </td>
    </tr>
);

// ─── Section header ───────────────────────────────────────────────────────────

const CommissionTableHeader = () => (
    <div className="flex items-center justify-between gap-4 p-6 border-b border-main-whiteMarble">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-main-primary flex items-center justify-center shrink-0">
                <Percent className="w-6 h-6 text-main-white" />
            </div>
            <div>
                <p className="text-main-mirage font-bold text-lg">Commission Rates</p>
                <p className="text-main-sharkGray text-sm mt-0.5">Manage platform commission structure</p>
            </div>
        </div>
        <button className="flex items-center gap-2 bg-main-primary text-main-white font-bold text-sm px-5 h-10 rounded-lg hover:bg-main-primary/90 transition-colors shrink-0">
            <Save className="w-4 h-4" />
            Save Changes
        </button>
    </div>
);

// ─── Commission table ─────────────────────────────────────────────────────────

const CommissionTable = () => (
    <div className="bg-main-white border border-main-whiteMarble common-rounded overflow-hidden">
        <CommissionTableHeader />
        <table className="w-full">
            <thead>
                <tr className="border-b border-main-whiteMarble bg-main-luxuryWhite">
                    <TH>Category</TH>
                    <TH>Description</TH>
                    <TH>Type</TH>
                    <TH>Rate</TH>
                    <TH>Actions</TH>
                </tr>
            </thead>
            <tbody>
                {commissionRates.map((row) => (
                    <CommissionRow key={row.id} row={row} />
                ))}
            </tbody>
        </table>
    </div>
);

export default CommissionTable;
