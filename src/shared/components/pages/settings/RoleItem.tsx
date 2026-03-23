import clsx from "clsx";
import type { IRole } from "@/shared/core/pages/settings";

const RoleItem = ({ role }: { role: IRole }) => {
    return (
        <div className="flex items-start justify-between p-4 border border-main-whiteMarble common-rounded">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <span className={clsx("w-3 h-3 rounded-full shrink-0", role.color)} />
                    <span className="text-main-mirage font-bold text-sm">{role.name}</span>
                </div>
                <span className="text-main-sharkGray text-sm pl-5">{role.description}</span>
            </div>
            <span className="text-main-sharkGray text-sm shrink-0">{role.users} users</span>
        </div>
    );
};

export default RoleItem;