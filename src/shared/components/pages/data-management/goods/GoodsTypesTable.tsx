import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { Pencil, Plus, Trash2 } from "lucide-react";
import useDataManagementStore, { IGoodsType } from "@/shared/hooks/store/useDataManagementStore";
import GoodsTypeModal from "../modals/GoodsTypeModal";
import DeleteDataManagementModal from "../modals/DeleteDataManagementModal";
import TablePagination from "@/shared/components/common/TablePagination";
import NoDataFound from "@/shared/components/common/NoDataFound";

const StatusBadge = ({ status }: { status: boolean }) => {
    const bg = status ? "bg-main-vividMint/10" : "bg-main-sharkGray/10";
    const text = status ? "text-main-vividMint" : "text-main-sharkGray";
    const label = status ? "Active" : "Inactive";

    return (
        <span className={clsx("px-3 py-1 rounded-full text-xs font-semibold", bg, text)}>
            {label}
        </span>
    );
};

const TH = ({ children }: { children: React.ReactNode }) => (
    <th className="text-main-hydrocarbon font-semibold text-xs uppercase tracking-wide py-4 px-6 text-left">
        {children}
    </th>
);

const RowSkeleton = () => (
    <tr className="border-b border-main-whiteMarble animate-pulse">
        <td className="py-5 px-6"><div className="h-4 bg-main-titaniumWhite rounded w-24"></div></td>
        <td className="py-5 px-6"><div className="h-4 bg-main-titaniumWhite rounded w-24"></div></td>
        <td className="py-5 px-6"><div className="h-4 bg-main-titaniumWhite rounded w-32"></div></td>
        <td className="py-5 px-6"><div className="h-4 bg-main-titaniumWhite rounded w-24"></div></td>
        <td className="py-5 px-6"><div className="h-6 bg-main-titaniumWhite rounded-full w-20"></div></td>
        <td className="py-5 px-6"><div className="flex gap-3"><div className="w-4 h-4 bg-main-titaniumWhite rounded"></div><div className="w-4 h-4 bg-main-titaniumWhite rounded"></div></div></td>
    </tr>
);

const GoodsTypesTable = () => {
    const { goodsTypes, loading, fetchGoodTypes, deleteGoodType, meta, submitting } = useDataManagementStore();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingGoods, setEditingGoods] = useState<IGoodsType | null>(null);
    const [deletingGoods, setDeletingGoods] = useState<IGoodsType | null>(null);

    useEffect(() => {
        fetchGoodTypes();
    }, [fetchGoodTypes]);

    const handleEdit = (goods: IGoodsType) => {
        setEditingGoods(goods);
    };

    const handleDelete = (goods: IGoodsType) => {
        setDeletingGoods(goods);
    };

    const confirmDelete = async () => {
        if (deletingGoods) {
            await deleteGoodType(deletingGoods.id);
            fetchGoodTypes(meta?.page, meta?.limit);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4 p-6">
                <div>
                    <h2 className="text-main-mirage font-bold text-xl">Goods Types</h2>
                    <p className="text-main-sharkGray text-sm mt-1">Used in dropdowns across driver and user apps</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-main-primary text-main-white font-bold text-sm px-5 h-10 rounded-lg hover:bg-main-primary/90 transition-colors shrink-0"
                >
                    <Plus className="w-4 h-4" />
                    Add Goods Type
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="border border-x-0 border-main-whiteMarble bg-main-luxuryWhite text-main-sharkGray">
                        <tr className="border-b border-main-whiteMarble">
                            <TH>Name (English)</TH>
                            <TH>Name (Arabic)</TH>
                            <TH>Description</TH>
                            <TH>Allowed Trucks</TH>
                            <TH>Status</TH>
                            <TH>Actions</TH>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
                        ) : (
                            goodsTypes.map((goods) => (
                                <tr key={goods.id} className="border-b border-main-whiteMarble last:border-0 hover:bg-main-luxuryWhite/50 transition-colors">
                                    <td className="py-5 px-6 text-main-mirage font-semibold text-sm">{goods.name}</td>
                                    <td className="py-5 px-6 text-main-mirage text-sm" dir="rtl">{goods.name_ar}</td>
                                    <td className="py-5 px-6 text-main-sharkGray text-sm max-w-[200px] truncate">{goods.description}</td>
                                    <td className="py-5 px-6 text-main-mirage text-sm">
                                        <div className="flex flex-wrap gap-1">
                                            {goods.truckTypeGoods.map(tg => (
                                                <span key={tg.truck_type_id} className="bg-main-primary/10 text-main-primary px-2 py-0.5 rounded text-[10px] font-medium">
                                                    {tg.type_of_truck.name}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="py-5 px-6"><StatusBadge status={goods.is_active} /></td>
                                    <td className="py-5 px-6">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleEdit(goods)}
                                                className="text-main-primary hover:opacity-70 transition-opacity"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(goods)}
                                                className="text-main-remove hover:opacity-70 transition-opacity"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        {!loading && goodsTypes.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-2">
                                    <NoDataFound
                                        title="No goods types found"
                                        description="Add a new goods type to get started."
                                    />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {meta && meta.total > meta.limit && (
                <TablePagination
                    currentPage={meta.page}
                    totalPages={Math.ceil(meta.total / meta.limit)}
                    onPageChange={(page) => fetchGoodTypes(page, meta.limit)}
                />
            )}

            <GoodsTypeModal
                open={isAddModalOpen || !!editingGoods}
                onOpenChange={(open) => {
                    setIsAddModalOpen(open);
                    if (!open) setEditingGoods(null);
                }}
                goodsType={editingGoods}
            />

            {deletingGoods && (
                <DeleteDataManagementModal
                    open={!!deletingGoods}
                    onOpenChange={(open) => !open && setDeletingGoods(null)}
                    onConfirm={confirmDelete}
                    title={deletingGoods.name}
                    loading={submitting}
                />
            )}
        </div>
    );
};

export default GoodsTypesTable;
