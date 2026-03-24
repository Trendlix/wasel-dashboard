import clsx from "clsx";
import { Copy, DollarSign, Pencil, Percent, Trash2 } from "lucide-react";
import {
    targetGroupStyles,
    statusStyles,
    type IVoucher,
} from "@/shared/core/pages/voucherAndPromo";
import UsageBar from "./UsageBar";

// ─── Discount cell ────────────────────────────────────────────────────────────

const DiscountCell = ({ type, value }: { type: IVoucher["discountType"]; value: string }) => (
    <div className="flex items-center gap-1.5 text-sm font-medium text-main-mirage">
        {type === "percentage"
            ? <Percent className="w-3.5 h-3.5 text-main-vividMint" />
            : <DollarSign className="w-3.5 h-3.5 text-main-vividMint" />
        }
        <span>{value}</span>
    </div>
);

// ─── Target group badge ───────────────────────────────────────────────────────

const TargetGroupBadge = ({ group }: { group: IVoucher["targetGroup"] }) => {
    const { bg, text, label } = targetGroupStyles[group];
    return (
        <span className={clsx("px-3 py-1 rounded-full text-xs font-semibold", bg, text)}>
            {label}
        </span>
    );
};

// ─── Status badge ─────────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: IVoucher["status"] }) => {
    const { bg, text, label } = statusStyles[status];
    return (
        <span className={clsx("px-3 py-1 text-xs font-semibold", bg, text, bg && "rounded-full")}>
            {label}
        </span>
    );
};

// ─── Voucher row ──────────────────────────────────────────────────────────────

const VoucherRow = ({ voucher }: { voucher: IVoucher }) => (
    <tr className="border-b border-main-whiteMarble last:border-0 hover:bg-main-luxuryWhite/50 transition-colors">
        {/* Code */}
        <td className="py-5 px-6">
            <div className="flex items-center gap-2">
                <span className="text-main-mirage font-bold text-sm tracking-wide">{voucher.code}</span>
                <button className="text-main-sharkGray/50 hover:text-main-sharkGray transition-colors">
                    <Copy className="w-3.5 h-3.5" />
                </button>
            </div>
        </td>

        {/* Discount */}
        <td className="py-5 px-6">
            <DiscountCell type={voucher.discountType} value={voucher.discountValue} />
        </td>

        {/* Target group */}
        <td className="py-5 px-6">
            <TargetGroupBadge group={voucher.targetGroup} />
        </td>

        {/* Usage */}
        <td className="py-5 px-6 min-w-40">
            <UsageBar used={voucher.usageCount} limit={voucher.usageLimit} />
        </td>

        {/* Expiry date */}
        <td className="py-5 px-6 text-main-sharkGray text-sm">{voucher.expiryDate}</td>

        {/* Status */}
        <td className="py-5 px-6">
            <StatusBadge status={voucher.status} />
        </td>

        {/* Actions */}
        <td className="py-5 px-6">
            <div className="flex items-center gap-3">
                <button className="text-main-sharkGray/60 hover:text-main-sharkGray transition-colors">
                    <Pencil className="w-4 h-4" />
                </button>
                {voucher.status === "active" ? (
                    <button className="text-main-primary font-semibold text-sm hover:underline">Disable</button>
                ) : (
                    <button className="text-main-vividMint font-semibold text-sm hover:underline">Enable</button>
                )}
                <button className="text-main-remove hover:opacity-70 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </td>
    </tr>
);

export default VoucherRow;
