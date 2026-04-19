import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { storageTypes, itemStatusStyles, type IStorageType, type TItemStatus } from "@/shared/core/pages/dataManagement";

const StatusBadge = ({ status }: { status: TItemStatus }) => {
    const { t } = useTranslation("dataManagement");
    const { bg, text } = itemStatusStyles[status];
    return (
        <span className={clsx("px-3 py-1 rounded-full text-xs font-semibold", bg, text)}>
            {t(`status.${status}`)}
        </span>
    );
};

const TH = ({ children }: { children: React.ReactNode }) => (
    <th className="text-main-hydrocarbon font-semibold text-xs uppercase tracking-wide py-4 px-6 text-start">
        {children}
    </th>
);

const StorageRow = ({ storage }: { storage: IStorageType }) => {
    const { t } = useTranslation("dataManagement");
    return (
        <tr className="border-b border-main-whiteMarble last:border-0 hover:bg-main-luxuryWhite/50 transition-colors">
            <td className="py-5 px-6 text-main-mirage font-semibold text-sm">{storage.nameEn}</td>
            <td className="py-5 px-6 text-main-mirage text-sm" dir="rtl">
                {storage.nameAr}
            </td>
            <td className="py-5 px-6 text-main-sharkGray text-sm">{storage.size}</td>
            <td className="py-5 px-6">
                <StatusBadge status={storage.status} />
            </td>
            <td className="py-5 px-6">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        className="text-main-primary hover:opacity-70 transition-opacity"
                        aria-label={t("storage.editAria")}
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        className="text-main-remove hover:opacity-70 transition-opacity"
                        aria-label={t("storage.deleteAria")}
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
};

const StorageTypesTable = () => {
    const { t } = useTranslation("dataManagement");
    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4 p-6">
                <div className="min-w-0">
                    <h2 className="text-main-mirage font-bold text-xl">{t("storage.sectionTitle")}</h2>
                    <p className="text-main-sharkGray text-sm mt-1">{t("storage.sectionSubtitle")}</p>
                </div>
                <button
                    type="button"
                    className="flex items-center gap-2 bg-main-primary text-main-white font-bold text-sm px-5 h-10 rounded-lg hover:bg-main-primary/90 transition-colors shrink-0"
                >
                    <Plus className="w-4 h-4 shrink-0" />
                    {t("storage.addButton")}
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-main-whiteMarble bg-main-luxuryWhite">
                            <TH>{t("storage.table.nameEn")}</TH>
                            <TH>{t("storage.table.nameAr")}</TH>
                            <TH>{t("storage.table.size")}</TH>
                            <TH>{t("storage.table.status")}</TH>
                            <TH>{t("storage.table.actions")}</TH>
                        </tr>
                    </thead>
                    <tbody>
                        {storageTypes.map((storage) => (
                            <StorageRow key={storage.id} storage={storage} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StorageTypesTable;
