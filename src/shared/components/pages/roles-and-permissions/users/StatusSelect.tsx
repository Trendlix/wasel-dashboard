import clsx from "clsx";
import type { AdminUser } from "@/shared/hooks/store/useUserManagementStore";

const STATUS_OPTIONS: { value: AdminUser["status"]; label: string; desc: string }[] = [
    { value: "active", label: "Active", desc: "User can log in normally" },
    { value: "blocked", label: "Blocked", desc: "User is suspended from the panel" },
    { value: "twofa", label: "2FA Required", desc: "User must enable two-factor auth" },
];

interface StatusSelectProps {
    value: AdminUser["status"];
    onChange: (v: AdminUser["status"]) => void;
}

const StatusSelect = ({ value, onChange }: StatusSelectProps) => (
    <div className="flex flex-col gap-2">
        {STATUS_OPTIONS.map((opt) => (
            <button
                key={opt.value}
                type="button"
                onClick={() => onChange(opt.value)}
                className={clsx(
                    "flex items-start gap-3 p-3 common-rounded border text-left transition-all",
                    value === opt.value
                        ? "border-main-primary/30 bg-main-primary/[0.04]"
                        : "border-main-whiteMarble bg-main-titaniumWhite hover:border-main-primary/20"
                )}
            >
                <div className={clsx(
                    "w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center",
                    value === opt.value ? "border-main-primary" : "border-main-sharkGray/40"
                )}>
                    {value === opt.value && <div className="w-2 h-2 rounded-full bg-main-primary" />}
                </div>
                <div>
                    <p className={clsx("text-sm font-semibold", value === opt.value ? "text-main-primary" : "text-main-mirage")}>
                        {opt.label}
                    </p>
                    <p className="text-xs text-main-sharkGray mt-0.5">{opt.desc}</p>
                </div>
            </button>
        ))}
    </div>
);

export default StatusSelect;
