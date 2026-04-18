import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { Pencil, Plus, Trash2 } from "lucide-react";
import useDataManagementStore, { ITruckType } from "@/shared/hooks/store/useDataManagementStore";
import TruckTypeModal from "../modals/TruckTypeModal";
import DeleteDataManagementModal from "../modals/DeleteDataManagementModal";
import TablePagination from "@/shared/components/common/TablePagination";
import NoDataFound from "@/shared/components/common/NoDataFound";

const StatusBadge = ({ status }: { status: boolean }) => {
    // TruckType doesn't have is_active in schema yet based on my previous view, 
    // but I added it to the store interface for consistency. 
    // The backend service treats all as active for now.
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

const TruckRowSkeleton = () => (
    <tr className="border-b border-main-whiteMarble animate-pulse">
        <td className="py-5 px-6"><div className="h-4 bg-main-titaniumWhite rounded w-24"></div></td>
        <td className="py-5 px-6"><div className="h-4 bg-main-titaniumWhite rounded w-24"></div></td>
        <td className="py-5 px-6"><div className="h-4 bg-main-titaniumWhite rounded w-16"></div></td>
        <td className="py-5 px-6"><div className="h-4 bg-main-titaniumWhite rounded w-16"></div></td>
        <td className="py-5 px-6"><div className="h-6 bg-main-titaniumWhite rounded-full w-20"></div></td>
        <td className="py-5 px-6"><div className="flex gap-3"><div className="w-4 h-4 bg-main-titaniumWhite rounded"></div><div className="w-4 h-4 bg-main-titaniumWhite rounded"></div></div></td>
    </tr>
);

const TruckTypesTable = () => {
    const { truckTypes, loading, fetchTruckTypes, deleteTruckType, meta, submitting } = useDataManagementStore();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingTruck, setEditingTruck] = useState<ITruckType | null>(null);
    const [deletingTruck, setDeletingTruck] = useState<ITruckType | null>(null);

    useEffect(() => {
        fetchTruckTypes();
    }, [fetchTruckTypes]);

    const handleEdit = (truck: ITruckType) => {
        setEditingTruck(truck);
    };

    const handleDelete = (truck: ITruckType) => {
        setDeletingTruck(truck);
    };

    const confirmDelete = async () => {
        if (deletingTruck) {
            await deleteTruckType(deletingTruck.id);
            fetchTruckTypes(meta?.page, meta?.limit);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4 p-6">
                <div>
                    <h2 className="text-main-mirage font-bold text-xl">Truck Types</h2>
                    <p className="text-main-sharkGray text-sm mt-1">Used in dropdowns across driver and user apps</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-main-primary text-main-white font-bold text-sm px-5 h-10 rounded-lg hover:bg-main-primary/90 transition-colors shrink-0"
                >
                    <Plus className="w-4 h-4" />
                    Add Truck Type
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="border border-x-0 border-main-whiteMarble bg-main-luxuryWhite text-main-sharkGray">
                        <tr className="border-b border-main-whiteMarble">
                            <TH>Name (English)</TH>
                            <TH>Name (Arabic)</TH>
                            <TH>Capacity</TH>
                            <TH>Price/KM</TH>
                            <TH>Status</TH>
                            <TH>Actions</TH>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => <TruckRowSkeleton key={i} />)
                        ) : (
                            truckTypes.map((truck) => (
                                <tr key={truck.id} className="border-b border-main-whiteMarble last:border-0 hover:bg-main-luxuryWhite/50 transition-colors">
                                    <td className="py-5 px-6 text-main-mirage font-semibold text-sm">{truck.name}</td>
                                    <td className="py-5 px-6 text-main-mirage text-sm" dir="rtl">{truck.name_ar}</td>
                                    <td className="py-5 px-6 text-main-sharkGray text-sm">{truck.capacity} {truck.capacity_unit}</td>
                                    <td className="py-5 px-6 text-main-mirage font-bold text-sm">{truck.price_per_km} EGP</td>
                                    <td className="py-5 px-6"><StatusBadge status={truck.is_active} /></td>
                                    <td className="py-5 px-6">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleEdit(truck)}
                                                className="text-main-primary hover:opacity-70 transition-opacity"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(truck)}
                                                className="text-main-remove hover:opacity-70 transition-opacity"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        {!loading && truckTypes.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-2">
                                    <NoDataFound
                                        title="No truck types found"
                                        description="Add a new truck type to get started."
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
                    onPageChange={(page) => fetchTruckTypes(page, meta.limit)}
                />
            )}

            <TruckTypeModal
                open={isAddModalOpen || !!editingTruck}
                onOpenChange={(open) => {
                    setIsAddModalOpen(open);
                    if (!open) setEditingTruck(null);
                }}
                truckType={editingTruck}
            />

            {deletingTruck && (
                <DeleteDataManagementModal
                    open={!!deletingTruck}
                    onOpenChange={(open) => !open && setDeletingTruck(null)}
                    onConfirm={confirmDelete}
                    title={deletingTruck.name}
                    loading={submitting}
                />
            )}
        </div>
    );
};

export default TruckTypesTable;
