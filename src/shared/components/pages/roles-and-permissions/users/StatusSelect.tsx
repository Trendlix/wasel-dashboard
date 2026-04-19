import clsx from "clsx";
import { useTranslation } from "react-i18next";
import type { AdminUser } from "@/shared/hooks/store/useUserManagementStore";

interface StatusSelectProps {
    value: AdminUser["status"];
    onChange: (v: AdminUser["status"]) => void;
}

const StatusSelect = ({ value, onChange }: StatusSelectProps) => {
    const { t } = useTranslation("roles");
    const options: { value: AdminUser["status"]; labelKey: string; descKey: string }[] = [
        { value: "active", labelKey: "users.statusActiveLabel", descKey: "users.statusActiveDesc" },
        { value: "blocked", labelKey: "users.statusBlockedLabel", descKey: "users.statusBlockedDesc" },
        { value: "twofa", labelKey: "users.statusTwofaLabel", descKey: "users.statusTwofaDesc" },
    ];

    return (
        <div className="flex flex-col gap-2">
            {options.map((opt) => (
                <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange(opt.value)}
                    className={clsx(
                        "flex items-start gap-3 p-3 common-rounded border text-start transition-all",
                        value === opt.value
                            ? "border-main-primary/30 bg-main-primary/[0.04]"
                            : "border-main-whiteMarble bg-main-titaniumWhite hover:border-main-primary/20",
                    )}
                >
                    <div
                        className={clsx(
                            "w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center",
                            value === opt.value ? "border-main-primary" : "border-main-sharkGray/40",
                        )}
                    >
                        {value === opt.value ? <div className="w-2 h-2 rounded-full bg-main-primary" /> : null}
                    </div>
                    <div>
                        <p className={clsx("text-sm font-semibold", value === opt.value ? "text-main-primary" : "text-main-mirage")}>
                            {t(opt.labelKey)}
                        </p>
                        <p className="text-xs text-main-sharkGray mt-0.5">{t(opt.descKey)}</p>
                    </div>
                </button>
            ))}
        </div>
    );
};

export default StatusSelect;
