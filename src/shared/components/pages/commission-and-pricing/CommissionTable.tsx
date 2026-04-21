import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { AlertTriangle, Pencil, Percent, Plus, Trash2 } from "lucide-react";
import useCommissionStore, {
    type ICommission,
    type TCommissionCategory,
    type TCommissionType,
} from "@/shared/hooks/store/useCommissionStore";
import CommissionModal from "./modals/CommissionModal";
import { axiosRequestErrorMessage } from "@/shared/utils/networkErrors";
import { Button } from "@/components/ui/button";
import {
    CommonModal,
    CommonModalBody,
    CommonModalFooter,
} from "@/shared/components/common/CommonModal";

const categoryStyles: Record<TCommissionCategory, { bg: string; text: string }> = {
    trip: { bg: "bg-main-primary", text: "text-main-white" },
    storage: { bg: "bg-main-vividMint", text: "text-main-white" },
    advertising: { bg: "bg-main-mustardGold", text: "text-main-white" },
};

const CategoryBadge = ({ category }: { category: TCommissionCategory }) => {
    const { t } = useTranslation("commission");
    const { bg, text } = categoryStyles[category];
    return (
        <span className={clsx("px-3 py-1 rounded-full text-xs font-semibold", bg, text)}>
            {t(`categories.${category}`)}
        </span>
    );
};

const StatusBadge = ({ active }: { active: boolean }) => {
    const { t } = useTranslation("commission");
    return (
        <span
            className={clsx(
                "px-3 py-1 rounded-full text-xs font-semibold",
                active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500",
            )}
        >
            {active ? t("statusActive") : t("statusInactive")}
        </span>
    );
};

const TH = ({ children }: { children: React.ReactNode }) => (
    <th className="text-main-hydrocarbon font-semibold text-xs uppercase tracking-wide py-4 px-6 text-start">
        {children}
    </th>
);

const CommissionRow = ({
    row,
    onEdit,
    onDelete,
}: {
    row: ICommission;
    onEdit: (row: ICommission) => void;
    onDelete: (row: ICommission) => void;
}) => {
    const { t } = useTranslation("commission");
    const raw = row.description?.toString() ?? "";
    const descriptionCell =
        raw.length > 0 ? (
            <span className="text-main-mirage font-semibold text-sm">
                {raw.length > 20 ? `${raw.slice(0, 20)}…` : raw}
            </span>
        ) : (
            <span className="text-main-sharkGray italic text-sm">{t("table.noDescription")}</span>
        );

    const typeKey = row.type as TCommissionType;
    const typeLabel = t(`types.${typeKey}`);

    return (
        <tr className="border-b border-main-whiteMarble last:border-0 hover:bg-main-luxuryWhite/50 transition-colors">
            <td className="py-5 px-6">
                <CategoryBadge category={row.category} />
            </td>
            <td className="py-5 px-6">{descriptionCell}</td>
            <td className="py-5 px-6 text-main-sharkGray text-sm">{typeLabel}</td>
            <td className="py-5 px-6 text-main-mirage font-bold text-sm">
                {row.type === "percentage" ? `${row.rate}%` : `${row.rate}`}
            </td>
            <td className="py-5 px-6">
                <StatusBadge active={row.is_active} />
            </td>
            <td className="py-5 px-6">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => onEdit(row)}
                        className="text-main-primary hover:opacity-70 transition-opacity"
                        aria-label={t("table.editAria")}
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(row)}
                        className="text-main-red hover:opacity-70 transition-opacity"
                        aria-label={t("table.deleteAria")}
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
};

const SkeletonRow = () => (
    <tr className="border-b border-main-whiteMarble">
        {Array.from({ length: 6 }).map((_, i) => (
            <td key={i} className="py-5 px-6">
                <div className="h-4 bg-main-titaniumWhite animate-pulse rounded-md w-3/4" />
            </td>
        ))}
    </tr>
);

const DeleteConfirmModal = ({
    commission,
    onClose,
    onConfirm,
    loading,
    isLastActive,
    error,
}: {
    commission: ICommission;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
    loading: boolean;
    isLastActive: boolean;
    error?: string | null;
}) => {
    const { t } = useTranslation("commission");
    const catLabel = t(`categories.${commission.category}`);
    return (
        <CommonModal
            open
            onOpenChange={(value) => {
                if (!value) onClose();
            }}
            loading={loading}
            maxWidth="sm:max-w-[420px]"
            variant="danger"
        >
            <CommonModalBody className="flex flex-col items-center text-center space-y-4 pt-6 pb-2">
                <div className="w-16 h-16 bg-main-remove/10 rounded-2xl flex items-center justify-center ring-8 ring-main-remove/5">
                    <AlertTriangle className="w-8 h-8 text-main-remove" />
                </div>
                <div className="space-y-1.5 max-w-[300px]">
                    <p className="text-xl font-bold text-main-mirage tracking-tight">{t("delete.title")}</p>
                    <p className={clsx("text-sm leading-relaxed", isLastActive ? "text-main-red font-medium" : "text-main-sharkGray")}>
                        {isLastActive
                            ? t("delete.cannotDelete", { category: catLabel })
                            : t("delete.confirmBody", { category: catLabel })}
                    </p>
                    {error ? (
                        <p className="text-xs font-medium text-main-red" role="alert">
                            {error}
                        </p>
                    ) : null}
                </div>
            </CommonModalBody>
            <CommonModalFooter className="justify-center gap-3 mt-2">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                    disabled={loading}
                    className="h-11 px-6 text-main-sharkGray hover:bg-main-titaniumWhite font-semibold common-rounded"
                >
                    {t("delete.cancel")}
                </Button>
                <Button
                    type="button"
                    onClick={onConfirm}
                    disabled={loading || isLastActive}
                    className="h-11 px-8 bg-main-remove hover:bg-main-remove/90 text-white font-bold common-rounded shadow-lg shadow-main-remove/20 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    {loading ? t("delete.deleting") : t("delete.confirm")}
                </Button>
            </CommonModalFooter>
        </CommonModal>
    );
};

const CommissionTable = () => {
    const { t } = useTranslation("commission");
    const { commissions, loading, submitting, fetchCommissions, deleteCommission, fetchAnalytics } = useCommissionStore();

    const isLastActiveForCategory = (row: ICommission) =>
        row.is_active && commissions.filter((c) => c.category === row.category && c.is_active).length <= 1;
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<ICommission | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<ICommission | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    useEffect(() => {
        fetchCommissions();
    }, [fetchCommissions]);

    useEffect(() => {
        setDeleteError(null);
    }, [deleteTarget]);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleteError(null);
        try {
            await deleteCommission(deleteTarget.id);
            fetchCommissions();
            fetchAnalytics();
            setDeleteTarget(null);
        } catch (e) {
            if (import.meta.env.DEV) console.error(e);
            setDeleteError(axiosRequestErrorMessage(e));
        }
    };

    return (
        <>
            <div className="bg-main-white border border-main-whiteMarble common-rounded overflow-hidden">
                <div className="flex items-center justify-between gap-4 p-6 border-b border-main-whiteMarble">
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-main-primary flex items-center justify-center shrink-0">
                            <Percent className="w-6 h-6 text-main-white" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-main-mirage font-bold text-lg">{t("header.title")}</p>
                            <p className="text-main-sharkGray text-sm mt-0.5">{t("header.subtitle")}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            setEditTarget(null);
                            setIsAddModalOpen(true);
                        }}
                        className="flex items-center gap-2 bg-main-primary text-main-white font-bold text-sm px-5 h-10 rounded-lg hover:bg-main-primary/90 transition-colors shrink-0"
                    >
                        <Plus className="w-4 h-4 shrink-0" />
                        {t("header.addRate")}
                    </button>
                </div>

                <table className="w-full">
                    <thead>
                        <tr className="border-b border-main-whiteMarble bg-main-luxuryWhite">
                            <TH>{t("table.category")}</TH>
                            <TH>{t("table.description")}</TH>
                            <TH>{t("table.type")}</TH>
                            <TH>{t("table.rate")}</TH>
                            <TH>{t("table.status")}</TH>
                            <TH>{t("table.actions")}</TH>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
                        ) : commissions.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-12 text-center text-main-sharkGray text-sm">
                                    {t("empty")}
                                </td>
                            </tr>
                        ) : (
                            commissions.map((row) => (
                                <CommissionRow
                                    key={row.id}
                                    row={row}
                                    onEdit={(r) => {
                                        setEditTarget(r);
                                        setIsAddModalOpen(true);
                                    }}
                                    onDelete={(r) => setDeleteTarget(r)}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <CommissionModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} commission={editTarget} />

            {deleteTarget && (
                <DeleteConfirmModal
                    commission={deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    onConfirm={handleDelete}
                    loading={submitting}
                    isLastActive={isLastActiveForCategory(deleteTarget)}
                    error={deleteError}
                />
            )}
        </>
    );
};

export default CommissionTable;
