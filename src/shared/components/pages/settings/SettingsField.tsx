import type { ReactNode } from "react";

interface ISettingsField {
    label: string;
    hint?: string;
    children: ReactNode;
    prefix?: ReactNode;
}

const SettingsField = ({ label, hint, children, prefix }: ISettingsField) => {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-main-mirage text-sm font-semibold flex items-center gap-2">
                {prefix}
                {label}
            </label>
            {children}
            {hint && <p className="text-main-silverSteel text-xs">{hint}</p>}
        </div>
    );
};

export default SettingsField;