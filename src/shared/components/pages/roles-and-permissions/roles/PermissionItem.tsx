import clsx from "clsx";
import { CheckCircle2, Circle } from "lucide-react";

interface IPermissionItemProps {
    label: string;
    enabled: boolean;
}

const PermissionItem = ({ label, enabled }: IPermissionItemProps) => (
    <div className={clsx("flex items-center gap-2 text-sm", enabled ? "text-main-mirage" : "text-main-sharkGray/50")}>
        {enabled
            ? <CheckCircle2 className="w-4 h-4 text-main-vividMint shrink-0" />
            : <Circle className="w-4 h-4 text-main-sharkGray/30 shrink-0" />
        }
        <span>{label}</span>
    </div>
);

export default PermissionItem;
