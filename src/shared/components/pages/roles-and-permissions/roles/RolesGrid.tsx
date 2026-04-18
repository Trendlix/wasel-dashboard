import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import useRolesStore, { AdminRole } from "@/shared/hooks/store/useRolesStore";
import RoleCard from "./RoleCard";
import RoleCardSkeleton from "./RoleCardSkeleton";
import NoDataFound from "@/shared/components/common/NoDataFound";
import RoleFormModal from "./RoleFormModal";
import { RoleFormValues } from "@/shared/schemas/role.schema";

// ─── Section header ───────────────────────────────────────────────────────────

interface RolesGridHeaderProps {
    onNewRole: () => void;
}

const RolesGridHeader = ({ onNewRole }: RolesGridHeaderProps) => (
    <div className="flex items-start justify-between gap-4">
        <div>
            <h2 className="text-main-mirage font-bold text-xl">Roles Configuration</h2>
            <p className="text-main-sharkGray text-sm mt-1">Define roles and their access permissions</p>
        </div>
        <button
            onClick={onNewRole}
            className="flex items-center gap-2 bg-main-primary text-main-white font-bold text-sm px-5 h-10 rounded-lg hover:bg-main-primary/90 transition-colors shrink-0"
        >
            <Plus className="w-4 h-4" />
            New Role
        </button>
    </div>
);

// ─── Roles grid ───────────────────────────────────────────────────────────────

const RolesGrid = () => {
    const { roles, loading, fetchRoles, addRole, updateRole, deleteRole } = useRolesStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<AdminRole | null>(null);

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    const handleNewRole = () => {
        setSelectedRole(null);
        setIsModalOpen(true);
    };

    const handleEditRole = (role: AdminRole) => {
        setSelectedRole(role);
        setIsModalOpen(true);
    };

    const handleDeleteRole = async (id: number) => {
        if (confirm("Are you sure you want to delete this role? This action cannot be undone and will fail if the role is assigned to users.")) {
            try {
                await deleteRole(id);
            } catch (error) {
                // Error is already handled by the store/interceptor toast
                console.error(error);
            }
        }
    };

    const handleFormSubmit = async (values: RoleFormValues) => {
        try {
            if (selectedRole) {
                await updateRole(selectedRole.id, values);
            } else {
                await addRole(values);
            }
        } catch (error) {
            console.error(error);
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
                            onDelete={() => handleDeleteRole(role.id)}
                        />
                    ))
                ) : !loading && (
                    <div className="col-span-1 md:col-span-2">
                        <NoDataFound
                            title="No Roles Found"
                            description="Start by creating a new role to manage team permissions."
                        />
                    </div>
                )}
            </div>

            <RoleFormModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                onSubmit={handleFormSubmit}
                initialData={selectedRole}
                loading={loading}
            />
        </div>
    );
};

export default RolesGrid;
