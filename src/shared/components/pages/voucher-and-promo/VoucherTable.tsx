import { useState } from "react";
import { Download } from "lucide-react";
import {
    vouchers,
    STATUS_OPTIONS,
    TARGET_GROUP_OPTIONS,
    type TVoucherStatus,
    type TVoucherTargetGroup,
} from "@/shared/core/pages/voucherAndPromo";
import VoucherRow from "./VoucherRow";

// ─── Filter select ────────────────────────────────────────────────────────────

interface IFilterSelectProps {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[];
}

const FilterSelect = ({ label, value, onChange, options }: IFilterSelectProps) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-main-sharkGray text-xs font-medium">{label}</label>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-10 px-3 border border-main-whiteMarble common-rounded text-sm text-main-mirage bg-main-white focus:outline-none focus:ring-1 focus:ring-main-primary min-w-44"
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    </div>
);

// ─── Table header cell ────────────────────────────────────────────────────────

const TH = ({ children }: { children: React.ReactNode }) => (
    <th className="text-main-hydrocarbon font-semibold text-xs uppercase tracking-wide py-4 px-6 text-left">
        {children}
    </th>
);

// ─── Voucher table ────────────────────────────────────────────────────────────

const VoucherTable = () => {
    const [statusFilter,      setStatusFilter]      = useState<TVoucherStatus | "">("");
    const [targetGroupFilter, setTargetGroupFilter] = useState<TVoucherTargetGroup | "">("");

    const filtered = vouchers.filter((v) => {
        const matchStatus = !statusFilter      || v.status      === statusFilter;
        const matchGroup  = !targetGroupFilter || v.targetGroup === targetGroupFilter;
        return matchStatus && matchGroup;
    });

    return (
        <div className="bg-main-white border border-main-whiteMarble common-rounded overflow-hidden">
            {/* Section header */}
            <div className="flex items-start justify-between gap-4 p-6 border-b border-main-whiteMarble">
                <div>
                    <h2 className="text-main-mirage font-bold text-lg">Voucher Management</h2>
                    <p className="text-main-sharkGray text-sm mt-0.5">Create and track promotional codes</p>
                </div>
                <button className="flex items-center gap-2 bg-main-primary text-main-white font-bold text-sm px-5 h-10 rounded-lg hover:bg-main-primary/90 transition-colors shrink-0">
                    <Download className="w-4 h-4" />
                    Export List
                </button>
            </div>

            {/* Filters */}
            <div className="flex items-end gap-4 px-6 py-4 border-b border-main-whiteMarble">
                <FilterSelect
                    label="Status"
                    value={statusFilter}
                    onChange={(v) => setStatusFilter(v as TVoucherStatus | "")}
                    options={STATUS_OPTIONS}
                />
                <FilterSelect
                    label="Target Group"
                    value={targetGroupFilter}
                    onChange={(v) => setTargetGroupFilter(v as TVoucherTargetGroup | "")}
                    options={TARGET_GROUP_OPTIONS}
                />
            </div>

            {/* Table */}
            <table className="w-full">
                <thead>
                    <tr className="border-b border-main-whiteMarble bg-main-luxuryWhite">
                        <TH>Code</TH>
                        <TH>Discount</TH>
                        <TH>Target Group</TH>
                        <TH>Usage</TH>
                        <TH>Expiry Date</TH>
                        <TH>Status</TH>
                        <TH>Actions</TH>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((voucher) => (
                        <VoucherRow key={voucher.id} voucher={voucher} />
                    ))}
                    {filtered.length === 0 && (
                        <tr>
                            <td colSpan={7} className="py-12 text-center text-main-sharkGray text-sm">
                                No vouchers match the selected filters.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default VoucherTable;
