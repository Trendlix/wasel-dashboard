import { useEffect, useState } from "react";
import { axiosRequestErrorMessage } from "@/shared/utils/networkErrors";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import useRolesStore, { AdminRole } from "@/shared/hooks/store/useRolesStore";
import RoleCard from "./RoleCard";
import RoleCardSkeleton from "./RoleCardSkeleton";
import NoDataFound from "@/shared/components/common/NoDataFound";
import RoleFormModal from "./RoleFormModal";
import { RoleFormValues } from "@/shared/schemas/role.schema";
import { Button } from "@/components/ui/button";
import {
    CommonModal,
    CommonModalHeader,
    CommonModalBody,
    CommonModalFooter,
} from "@/shared/components/common/CommonModal";

interface RolesGridHeaderProps {
    onNewRole: () => void;
}

const RolesGridHeader = ({ onNewRole }: RolesGridHeaderProps) => {
    const { t } = useTranslation("roles");
    return (
        <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
                <h2 className="text-main-mirage font-bold text-xl">{t("rolesGrid.sectionTitle")}</h2>
                <p className="text-main-sharkGray text-sm mt-1">{t("rolesGrid.sectionSubtitle")}</p>
            </div>
            <button
                type="button"
                onClick={onNewRole}
                className="flex items-center gap-2 bg-main-primary text-main-white font-bold text-sm px-5 h-10 rounded-lg hover:bg-main-primary/90 transition-colors shrink-0"
            >
                <Plus className="w-4 h-4 shrink-0" />
                {t("rolesGrid.newRole")}
            </button>
        </div>
    );
};

interface DeleteRoleModalProps {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    role: AdminRole | null;
    onConfirm: () => Promise<void>;
    loading: boolean;
    error?: string | null;
}

const DeleteRoleModal = ({ open, onOpenChange, role, onConfirm, loading, error }: DeleteRoleModalProps) => {
    const { t } = useTranslation(["roles", "common"]);
    const name = role?.name ?? t("roles:rolesDelete.fallbackName");
    return (
        <CommonModal open={open} onOpenChange={onOpenChange} loading={loading} variant="danger">
            <CommonModalHeader
                title={t("roles:rolesDelete.title")}
                description={
                    <>
                        {t("roles:rolesDelete.descriptionLead")}{" "}
                        <span className="font-semibold text-main-mirage">{name}</span>
                        {t("roles:rolesDelete.descriptionTrail")}
                    </>
                }
            />
            <CommonModalBody className="pb-0 flex flex-col items-center text-center space-y-4">

                <p className="text-sm text-main-remove font-medium">{t("roles:rolesDelete.warning")}</p>
                {error ? (
                    <p className="text-xs font-medium text-main-red mt-2" role="alert">
                        {error}
                    </p>
                ) : null}
            </CommonModalBody>
            <CommonModalFooter>
                <Button
                    type="button"
                    variant="ghost"
                    className="text-main-sharkGray hover:text-main-mirage hover:bg-main-titaniumWhite px-6 h-11 common-rounded"
                    onClick={() => onOpenChange(false)}
                    disabled={loading}
                >
                    {t("common:cancel")}
                </Button>
                <Button
                    type="button"
                    disabled={loading}
                    onClick={onConfirm}
                    className="bg-main-remove hover:bg-main-remove/90 text-white font-bold h-11 px-8 common-rounded shadow-lg shadow-main-remove/20"
                >
                    {loading ? t("roles:rolesDelete.deleting") : t("roles:rolesDelete.confirm")}
                </Button>
            </CommonModalFooter>
        </CommonModal>
    );
};

const RolesGrid = () => {
    const { t } = useTranslation("roles");
    const { roles, loading, fetchRoles, addRole, updateRole, deleteRole } = useRolesStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<AdminRole | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<AdminRole | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [roleFormError, setRoleFormError] = useState<string | null>(null);

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    const handleNewRole = () => {
        setRoleFormError(null);
        setSelectedRole(null);
        setIsModalOpen(true);
    };

    const handleEditRole = (role: AdminRole) => {
        setRoleFormError(null);
        setSelectedRole(role);
        setIsModalOpen(true);
    };

    const handleDeleteRole = (role: AdminRole) => {
        setDeleteError(null);
        setDeleteTarget(role);
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        setDeleteError(null);
        try {
            await deleteRole(deleteTarget.id);
            setDeleteTarget(null);
        } catch (error) {
            if (import.meta.env.DEV) console.error(error);
            setDeleteError(axiosRequestErrorMessage(error));
        }
    };

    const handleFormSubmit = async (values: RoleFormValues) => {
        setRoleFormError(null);
        try {
            if (selectedRole) {
                await updateRole(selectedRole.id, values);
            } else {
                await addRole(values);
            }
        } catch (error) {
            if (import.meta.env.DEV) console.error(error);
            setRoleFormError(axiosRequestErrorMessage(error));
            throw error;
        }
    };

    return (
        <div className="space-y-6">
            <RolesGridHeader onNewRole={handleNewRole} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading && roles.length === 0 ? (
                    [1, 2, 3, 4].map((i) => <RoleCardSkeleton key={i} />)
                ) : roles.length > 0 ? (
                    roles.map((role) => (
                        <RoleCard
                            key={role.id}
                            role={role}
                            onEdit={() => handleEditRole(role)}
                            onDelete={() => handleDeleteRole(role)}
                        />
                    ))
                ) : (
                    !loading && (
                        <div className="col-span-1 md:col-span-2">
                            <NoDataFound title={t("rolesGrid.emptyTitle")} description={t("rolesGrid.emptyDescription")} />
                        </div>
                    )
                )}
            </div>

            <RoleFormModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                onSubmit={handleFormSubmit}
                initialData={selectedRole}
                loading={loading}
                requestError={roleFormError}
            />

            <DeleteRoleModal
                open={!!deleteTarget}
                onOpenChange={(v) => {
                    if (!v) {
                        setDeleteTarget(null);
                        setDeleteError(null);
                    }
                }}
                role={deleteTarget}
                onConfirm={handleConfirmDelete}
                loading={loading}
                error={deleteError}
            />
        </div>
    );
};

export default RolesGrid;
