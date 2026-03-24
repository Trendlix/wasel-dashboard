import clsx from "clsx";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { storageTypes, itemStatusStyles, type IStorageType, type TItemStatus } from "@/shared/core/pages/trucksStoragesData";

// ─── Status badge ─────────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: TItemStatus }) => {
    const { bg, text, label } = itemStatusStyles[status];
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

// ─── Storage row ──────────────────────────────────────────────────────────────

const StorageRow = ({ storage }: { storage: IStorageType }) => (
    <tr className="border-b border-main-whiteMarble last:border-0 hover:bg-main-luxuryWhite/50 transition-colors">
        <td className="py-5 px-6 text-main-mirage font-semibold text-sm">{storage.nameEn}</td>
        <td className="py-5 px-6 text-main-mirage text-sm" dir="rtl">{storage.nameAr}</td>
        <td className="py-5 px-6 text-main-sharkGray text-sm">{storage.size}</td>
        <td className="py-5 px-6"><StatusBadge status={storage.status} /></td>
        <td className="py-5 px-6">
            <div className="flex items-center gap-3">
                <button className="text-main-primary hover:opacity-70 transition-opacity">
                    <Pencil className="w-4 h-4" />
                </button>
                <button className="text-main-remove hover:opacity-70 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </td>
    </tr>
);

// ─── Storage types table ──────────────────────────────────────────────────────

const StorageTypesTable = () => (
    <div className="space-y-6">
        {/* Section header */}
        <div className="flex items-start justify-between gap-4">
            <div>
                <h2 className="text-main-mirage font-bold text-xl">Storage Types</h2>
                <p className="text-main-sharkGray text-sm mt-1">Used in storage booking across the platform</p>
            </div>
            <button className="flex items-center gap-2 bg-main-primary text-main-white font-bold text-sm px-5 h-10 rounded-lg hover:bg-main-primary/90 transition-colors shrink-0">
                <Plus className="w-4 h-4" />
                Add Storage Type
            </button>
        </div>

        {/* Table */}
        <table className="w-full">
            <thead>
                <tr className="border-b border-main-whiteMarble">
                    <TH>Name (English)</TH>
                    <TH>Name (Arabic)</TH>
                    <TH>Size</TH>
                    <TH>Status</TH>
                    <TH>Actions</TH>
                </tr>
            </thead>
            <tbody>
                {storageTypes.map((storage) => (
                    <StorageRow key={storage.id} storage={storage} />
                ))}
            </tbody>
        </table>
    </div>
);

export default StorageTypesTable;
