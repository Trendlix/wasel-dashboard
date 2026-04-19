import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CommonModal, CommonModalBody, CommonModalFooter } from "@/shared/components/common/CommonModal";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { axiosRequestErrorMessage } from "@/shared/utils/networkErrors";

interface DeleteDataManagementModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => Promise<void>;
    title: string;
    loading?: boolean;
}

const DeleteDataManagementModal = ({ open, onOpenChange, onConfirm, title, loading }: DeleteDataManagementModalProps) => {
    const { t } = useTranslation(["dataManagement", "common"]);
    const [requestError, setRequestError] = useState<string | null>(null);

    useEffect(() => {
        if (open) setRequestError(null);
    }, [open]);

    const handleConfirm = async () => {
        setRequestError(null);
        try {
            await onConfirm();
            onOpenChange(false);
        } catch (error) {
            if (import.meta.env.DEV) console.error("Failed to delete", error);
            setRequestError(axiosRequestErrorMessage(error));
        }
    };

    return (
        <CommonModal open={open} onOpenChange={onOpenChange} maxWidth="sm:max-w-[400px]" variant="danger">
            <CommonModalBody className="flex flex-col items-center text-center space-y-4 pt-6">
                <div className="w-16 h-16 bg-main-remove/10 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-main-remove" />
                </div>
                <div className="space-y-1">
                    <p className="text-main-mirage font-bold text-lg">{t("dataManagement:delete.confirmTitle")}</p>
                    <p className="text-main-sharkGray text-sm">{t("dataManagement:delete.confirmBody", { name: title })}</p>
                </div>
                {requestError ? (
                    <p className="text-xs font-medium text-main-red text-center" role="alert">
                        {requestError}
                    </p>
                ) : null}
            </CommonModalBody>
            <CommonModalFooter className="justify-center gap-4">
                <Button
                    variant="ghost"
                    onClick={() => onOpenChange(false)}
                    className="font-bold text-main-sharkGray h-11 w-32 common-rounded hover:bg-main-titaniumWhite"
                    disabled={loading}
                >
                    {t("common:cancel")}
                </Button>
                <Button
                    onClick={handleConfirm}
                    disabled={loading}
                    className="bg-main-remove hover:bg-main-remove/90 text-white font-bold h-11 w-32 common-rounded shadow-lg shadow-main-remove/20"
                >
                    {loading ? t("dataManagement:delete.deleting") : t("dataManagement:delete.delete")}
                </Button>
            </CommonModalFooter>
        </CommonModal>
    );
};

export default DeleteDataManagementModal;
