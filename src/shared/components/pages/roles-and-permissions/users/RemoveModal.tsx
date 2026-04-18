import { Button } from "@/components/ui/button";
import useUserManagementStore, { type AdminUser } from "@/shared/hooks/store/useUserManagementStore";
import {
    CommonModal,
    CommonModalHeader,
    CommonModalFooter,
} from "@/shared/components/common/CommonModal";

interface RemoveModalProps {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    user: AdminUser | null;
}

const RemoveModal = ({ open, onOpenChange, user }: RemoveModalProps) => {
    const { removeUser, loading } = useUserManagementStore();

    const handleConfirm = async () => {
        if (!user) return;
        await removeUser(user.id, { showToast: true, toastType: "success" });
        onOpenChange(false);
    };

    return (
        <CommonModal open={open} onOpenChange={onOpenChange} loading={loading} maxWidth="sm:max-w-[420px]">
            <CommonModalHeader
                title="Remove User"
                description={
                    <>
                        Are you sure you want to remove{" "}
                        <span className="font-semibold text-main-mirage">{user?.name ?? "this user"}</span>?
                        This action cannot be undone and will revoke their access immediately.
                    </>
                }
            />

            <CommonModalFooter className="mt-0 py-6">
                <Button
                    type="button"
                    variant="ghost"
                    className="text-main-sharkGray hover:text-main-mirage hover:bg-main-titaniumWhite px-6 h-11 common-rounded"
                    onClick={() => onOpenChange(false)}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    disabled={loading}
                    onClick={handleConfirm}
                    className="bg-main-remove hover:bg-main-remove/90 text-white font-bold h-11 px-8 common-rounded shadow-lg shadow-main-remove/20"
                >
                    {loading ? "Removing..." : "Yes, Remove"}
                </Button>
            </CommonModalFooter>
        </CommonModal>
    );
};

export default RemoveModal;
