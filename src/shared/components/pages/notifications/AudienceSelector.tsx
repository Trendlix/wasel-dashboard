import clsx from "clsx";
import { Users, UsersRound, Truck } from "lucide-react";
import type { TNotificationAudience } from "@/shared/core/pages/notifications";

interface IAudienceSelector {
    value: TNotificationAudience;
    onChange: (value: TNotificationAudience) => void;
}

const options: {
    value: TNotificationAudience;
    label: string;
    Icon: React.ElementType;
}[] = [
        { value: "all", label: "All", Icon: UsersRound },
        { value: "users", label: "Users", Icon: Users },
        { value: "drivers", label: "Drivers", Icon: Truck },
    ];

const AudienceSelector = ({ value, onChange }: IAudienceSelector) => {
    return (
        <div className="grid grid-cols-3 gap-3">
            {options.map(({ value: opt, label, Icon }) => {
                const isActive = value === opt;
                return (
                    <button
                        key={opt}
                        type="button"
                        onClick={() => onChange(opt)}
                        className={clsx(
                            "flex flex-col items-center justify-center gap-2 py-4 common-rounded border transition-all",
                            isActive
                                ? "border-main-primary bg-main-primary/5 text-main-primary"
                                : "border-main-whiteMarble text-main-sharkGray hover:border-main-primary/50"
                        )}
                    >
                        <Icon size={22} />
                        <span className="text-sm font-medium">{label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default AudienceSelector;