import { useEffect, useState } from "react";
import clsx from "clsx";
import { Pencil, Percent, Plus, Trash2 } from "lucide-react";
import useCommissionStore, { type ICommission, type TCommissionCategory } from "@/shared/hooks/store/useCommissionStore";
import CommissionModal from "./modals/CommissionModal";


// ─── Helpers ──────────────────────────────────────────────────────────────────

const categoryStyles: Record<TCommissionCategory, { bg: string; text: string; label: string }> = {
    trip: { bg: "bg-main-primary", text: "text-main-white", label: "Trips" },
    storage: { bg: "bg-main-vividMint", text: "text-main-white", label: "Storage" },
    advertising: { bg: "bg-main-mustardGold", text: "text-main-white", label: "Advertising" },
};

const CategoryBadge = ({ category }: { category: TCommissionCategory }) => {
    const { bg, text, label } = categoryStyles[category];
    return (
        <span className={clsx("px-3 py-1 rounded-full text-xs font-semibold", bg, text)}>
            {label}
        </span>
    );
};

const StatusBadge = ({ active }: { active: boolean }) => (
    <span
        className={clsx(
            "px-3 py-1 rounded-full text-xs font-semibold",
            active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"
        )}
    >
        {active ? "Active" : "Inactive"}
    </span>
);

const TH = ({ children }: { children: React.ReactNode }) => (
    <th className="text-main-hydrocarbon font-semibold text-xs uppercase tracking-wide py-4 px-6 text-left">
        {children}
    </th>
);

// ─── Row ──────────────────────────────────────────────────────────────────────

const CommissionRow = ({
    row,
    onEdit,
    onDelete,
}: {
    row: ICommission;
    onEdit: (row: ICommission) => void;
    onDelete: (row: ICommission) => void;
}) => (
    <tr className="border-b border-main-whiteMarble last:border-0 hover:bg-main-luxuryWhite/50 transition-colors">
        <td className="py-5 px-6">
            <CategoryBadge category={row.category} />
        </td>
        <td className="py-5 px-6 text-main-mirage font-semibold text-sm">
            {(row.description)?.toString().slice(0, 20) + (row.description && row.description.length > 20 ? "..." : "") || <span className="text-main-sharkGray italic">—</span>}
        </td>
        <td className="py-5 px-6 text-main-sharkGray text-sm capitalize">{row.type}</td>
        <td className="py-5 px-6 text-main-mirage font-bold text-sm">
            {row.type === "percentage" ? `${row.rate}%` : `${row.rate}`}
        </td>
        <td className="py-5 px-6">
            <StatusBadge active={row.is_active} />
        </td>
        <td className="py-5 px-6">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => onEdit(row)}
                    className="text-main-primary hover:opacity-70 transition-opacity"
                >
                    <Pencil className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onDelete(row)}
                    className="text-main-red hover:opacity-70 transition-opacity"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </td>
    </tr>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const SkeletonRow = () => (
    <tr className="border-b border-main-whiteMarble">
        {Array.from({ length: 6 }).map((_, i) => (
            <td key={i} className="py-5 px-6">
                <div className="h-4 bg-main-titaniumWhite animate-pulse rounded-md w-3/4" />
            </td>
        ))}
    </tr>
);

// ─── Delete confirmation modal ────────────────────────────────────────────────

const DeleteConfirmModal = ({
    commission,
    onClose,
    onConfirm,
    loading,
}: {
    commission: ICommission;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
}) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-main-white common-rounded shadow-xl p-6 w-full max-w-sm mx-4 space-y-4">
            <p className="text-main-mirage font-bold text-base">Delete Commission Rate?</p>
            <p className="text-main-sharkGray text-sm">
                This will permanently delete the <span className="font-semibold">{categoryStyles[commission.category].label}</span> commission rate.
                This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2 border-t border-main-whiteMarble">
                <button
                    onClick={onClose}
                    className="font-bold text-main-sharkGray h-10 px-5 common-rounded hover:bg-main-titaniumWhite text-sm"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    disabled={loading}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold h-10 px-5 common-rounded text-sm disabled:opacity-60"
                >
                    {loading ? "Deleting..." : "Delete"}
                </button>
            </div>
        </div>
    </div>
);

// ─── Commission table ──────────────────────────────────────────────────────────

const CommissionTable = () => {
    const { commissions, loading, submitting, fetchCommissions, deleteCommission, fetchAnalytics } = useCommissionStore();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<ICommission | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<ICommission | null>(null);

    useEffect(() => {
        fetchCommissions();
    }, [fetchCommissions]);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deleteCommission(deleteTarget.id);
            fetchCommissions();
            fetchAnalytics();
            setDeleteTarget(null);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <>
            <div className="bg-main-white border border-main-whiteMarble common-rounded overflow-hidden">
                {/* Header */}
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
                    <button
                        onClick={() => { setEditTarget(null); setIsAddModalOpen(true); }}
                        className="flex items-center gap-2 bg-main-primary text-main-white font-bold text-sm px-5 h-10 rounded-lg hover:bg-main-primary/90 transition-colors shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        Add Rate
                    </button>
                </div>

                {/* Table */}
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-main-whiteMarble bg-main-luxuryWhite">
                            <TH>Category</TH>
                            <TH>Description</TH>
                            <TH>Type</TH>
                            <TH>Rate</TH>
                            <TH>Status</TH>
                            <TH>Actions</TH>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
                        ) : commissions.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-12 text-center text-main-sharkGray text-sm">
                                    No commission rates found. Click <strong>Add Rate</strong> to get started.
                                </td>
                            </tr>
                        ) : (
                            commissions.map((row) => (
                                <CommissionRow
                                    key={row.id}
                                    row={row}
                                    onEdit={(r) => { setEditTarget(r); setIsAddModalOpen(true); }}
                                    onDelete={(r) => setDeleteTarget(r)}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modals */}
            <CommissionModal
                open={isAddModalOpen}
                onOpenChange={setIsAddModalOpen}
                commission={editTarget}
            />

            {deleteTarget && (
                <DeleteConfirmModal
                    commission={deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    onConfirm={handleDelete}
                    loading={submitting}
                />
            )}
        </>
    );
};

export default CommissionTable;
