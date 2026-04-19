import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import HelpHint from "./HelpHint";

interface FieldProps {
    label: string;
    hint?: string;
    required?: boolean;
    children: ReactNode;
}

const Field = ({ label, hint, required = false, children }: FieldProps) => {
    const { t } = useTranslation("cms");
    return (
        <div className="space-y-1.5 overflow-visible">
            <div className="flex items-center gap-2 overflow-visible">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-main-lightSlate">
                    {label}
                </p>
                {required ? (
                    <span className="text-xs font-semibold uppercase tracking-widest text-main-remove">
                        {t("sharedEditor.required")}
                    </span>
                ) : null}
                {hint ? <HelpHint text={hint} /> : null}
            </div>
            {children}
        </div>
    );
};

export default Field;
