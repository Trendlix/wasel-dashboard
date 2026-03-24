import { Plus } from "lucide-react";
import { roles } from "@/shared/core/pages/rolesAndPermissions";
import RoleCard from "./RoleCard";

// ─── Section header ───────────────────────────────────────────────────────────

const RolesGridHeader = () => (
    <div className="flex items-start justify-between gap-4">
        <div>
            <h2 className="text-main-mirage font-bold text-xl">Roles Configuration</h2>
            <p className="text-main-sharkGray text-sm mt-1">Define roles and their access permissions</p>
        </div>
        <button className="flex items-center gap-2 bg-main-primary text-main-white font-bold text-sm px-5 h-10 rounded-lg hover:bg-main-primary/90 transition-colors shrink-0">
            <Plus className="w-4 h-4" />
            New Role
        </button>
    </div>
);

// ─── Roles grid ───────────────────────────────────────────────────────────────

const RolesGrid = () => (
    <div className="space-y-6">
        <RolesGridHeader />
        <div className="grid grid-cols-2 gap-6">
            {roles.map((role) => (
                <RoleCard key={role.id} role={role} />
            ))}
        </div>
    </div>
);

export default RolesGrid;
