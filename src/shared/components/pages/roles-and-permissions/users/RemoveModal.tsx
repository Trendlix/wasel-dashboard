import { UserX } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import useUserManagementStore, { type AdminUser } from "@/shared/hooks/store/useUserManagementStore";
import {
    CommonModal,
    CommonModalBody,
    CommonModalFooter,
} from "@/shared/components/common/CommonModal";

interface RemoveModalProps {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    user: AdminUser | null;
}

const RemoveModal = ({ open, onOpenChange, user }: RemoveModalProps) => {
    const { t } = useTranslation(["roles", "common"]);
    const { removeUser, loading } = useUserManagementStore();

    const handleConfirm = async () => {
        if (!user) return;
        await removeUser(user.id, { showToast: true, toastType: "success" });
        onOpenChange(false);
    };

    return (
        <CommonModal open={open} onOpenChange={onOpenChange} loading={loading} maxWidth="sm:max-w-[420px]" variant="danger">
            <CommonModalBody className="flex flex-col items-center text-center space-y-4 pt-6 pb-2">
                <div className="w-16 h-16 bg-main-remove/10 rounded-2xl flex items-center justify-center ring-8 ring-main-remove/5">
                    <UserX className="w-8 h-8 text-main-remove" />
                </div>
                <div className="space-y-1.5 max-w-[300px]">
                    <p className="text-xl font-bold text-main-mirage tracking-tight">{t("users.removeTitle")}</p>
                    <p className="text-sm text-main-sharkGray leading-relaxed">
                        {t("users.removeDescription", { name: user?.name ?? t("users.removeFallbackName") })}
                    </p>
                </div>
            </CommonModalBody>

            <CommonModalFooter className="justify-center gap-3 mt-2">
                <Button
                    type="button"
                    variant="ghost"
                    className="text-main-sharkGray hover:text-main-mirage hover:bg-main-titaniumWhite px-6 h-11 common-rounded font-semibold"
                    onClick={() => onOpenChange(false)}
                    disabled={loading}
                >
                    {t("common:cancel")}
                </Button>
                <Button
                    type="button"
                    disabled={loading}
                    onClick={handleConfirm}
                    className="bg-main-remove hover:bg-main-remove/90 text-white font-bold h-11 px-8 common-rounded shadow-lg shadow-main-remove/20"
                >
                    {loading ? t("users.removing") : t("users.removeConfirm")}
                </Button>
            </CommonModalFooter>
        </CommonModal>
    );
};

export default RemoveModal;
