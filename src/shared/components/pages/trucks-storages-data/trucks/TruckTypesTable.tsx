import clsx from "clsx";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { truckTypes, itemStatusStyles, type ITruckType, type TItemStatus } from "@/shared/core/pages/trucksStoragesData";

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

// ─── Truck row ────────────────────────────────────────────────────────────────

const TruckRow = ({ truck }: { truck: ITruckType }) => (
    <tr className="border-b border-main-whiteMarble last:border-0 hover:bg-main-luxuryWhite/50 transition-colors">
        <td className="py-5 px-6 text-main-mirage font-semibold text-sm">{truck.nameEn}</td>
        <td className="py-5 px-6 text-main-mirage text-sm" dir="rtl">{truck.nameAr}</td>
        <td className="py-5 px-6 text-main-sharkGray text-sm">{truck.capacity}</td>
        <td className="py-5 px-6 text-main-mirage font-bold text-sm">{truck.basePrice}</td>
        <td className="py-5 px-6"><StatusBadge status={truck.status} /></td>
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

// ─── Truck types table ────────────────────────────────────────────────────────

const TruckTypesTable = () => (
    <div className="space-y-6">
        {/* Section header */}
        <div className="flex items-start justify-between gap-4">
            <div>
                <h2 className="text-main-mirage font-bold text-xl">Truck Types</h2>
                <p className="text-main-sharkGray text-sm mt-1">Used in dropdowns across driver and user apps</p>
            </div>
            <button className="flex items-center gap-2 bg-main-primary text-main-white font-bold text-sm px-5 h-10 rounded-lg hover:bg-main-primary/90 transition-colors shrink-0">
                <Plus className="w-4 h-4" />
                Add Truck Type
            </button>
        </div>

        {/* Table */}
        <table className="w-full">
            <thead>
                <tr className="border-b border-main-whiteMarble">
                    <TH>Name (English)</TH>
                    <TH>Name (Arabic)</TH>
                    <TH>Capacity</TH>
                    <TH>Base Price (SAR)</TH>
                    <TH>Status</TH>
                    <TH>Actions</TH>
                </tr>
            </thead>
            <tbody>
                {truckTypes.map((truck) => (
                    <TruckRow key={truck.id} truck={truck} />
                ))}
            </tbody>
        </table>
    </div>
);

export default TruckTypesTable;
