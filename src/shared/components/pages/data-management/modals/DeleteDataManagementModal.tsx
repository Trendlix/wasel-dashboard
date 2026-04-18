import { CommonModal, CommonModalBody, CommonModalFooter } from "@/shared/components/common/CommonModal";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface DeleteDataManagementModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => Promise<void>;
    title: string;
    loading?: boolean;
}

const DeleteDataManagementModal = ({ open, onOpenChange, onConfirm, title, loading }: DeleteDataManagementModalProps) => {
    const handleConfirm = async () => {
        try {
            await onConfirm();
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    return (
        <CommonModal open={open} onOpenChange={onOpenChange} maxWidth="sm:max-w-[400px]">
            {/* <CommonModalHeader
                title="Delete Confirmation"
                className="pb-2"
            /> */}
            <CommonModalBody className="flex flex-col items-center text-center space-y-4 pt-6">
                <div className="w-16 h-16 bg-main-remove/10 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-main-remove" />
                </div>
                <div className="space-y-1">
                    <p className="text-main-mirage font-bold text-lg">Are you sure?</p>
                    <p className="text-main-sharkGray text-sm">
                        You are about to delete <span className="text-main-mirage font-bold">{title}</span>. This action cannot be undone and may fail if there are associated records.
                    </p>
                </div>
            </CommonModalBody>
            <CommonModalFooter className="justify-center gap-4">
                <Button
                    variant="ghost"
                    onClick={() => onOpenChange(false)}
                    className="font-bold text-main-sharkGray h-11 w-32 common-rounded hover:bg-main-titaniumWhite"
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleConfirm}
                    disabled={loading}
                    className="bg-main-remove hover:bg-main-remove/90 text-white font-bold h-11 w-32 common-rounded shadow-lg shadow-main-remove/20"
                >
                    {loading ? "Deleting..." : "Delete"}
                </Button>
            </CommonModalFooter>
        </CommonModal>
    );
};

export default DeleteDataManagementModal;
