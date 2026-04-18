import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Trash2 } from "lucide-react";
import clsx from "clsx";
import type { ReactNode } from "react";
import CmsHelpHint from "../../cms-help-hint";

export type CmsLocale = "en" | "ar";

const LocaleBadge = ({ locale }: { locale: CmsLocale }) => (
    <span
        className={clsx(
            "inline-block text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border",
            locale === "en"
                ? "bg-blue-50 text-blue-600 border-blue-200"
                : "bg-emerald-50 text-emerald-600 border-emerald-200",
        )}
    >
        {locale}
    </span>
);

/** Renders two columns: EN (ltr) on the left, AR (rtl) on the right, with a shared label above. */
export const BilingualField = ({
    label,
    hint,
    required,
    en,
    ar,
    enError,
    arError,
}: {
    label: string;
    hint?: string;
    required?: boolean;
    en: ReactNode;
    ar: ReactNode;
    enError?: string;
    arError?: string;
}) => (
    <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2 overflow-visible">
            <p className={fieldLabelClass}>{label}</p>
            {required ? (
                <span className="text-xs font-semibold uppercase tracking-widest text-main-remove">
                    Required
                </span>
            ) : null}
            {hint ? <CmsHelpHint text={hint} /> : null}
        </div>
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
            <div className="space-y-1.5">
                <LocaleBadge locale="en" />
                {en}
                {enError && <InputError message={enError} />}
            </div>
            <div className="space-y-1.5" dir="rtl">
                <LocaleBadge locale="ar" />
                {ar}
                {arError && <InputError message={arError} />}
            </div>
        </div>
    </div>
);

/**
 * Like StringArrayEditor but shows EN and AR arrays side-by-side.
 * Each locale's list is managed independently (independent add/remove).
 */
export const BilingualStringArrayEditor = ({
    label,
    hint,
    enValues,
    arValues,
    onEnChange,
    onArChange,
    placeholder,
    multiline = false,
    minRows = 1,
    itemClassName,
    enTopError,
    arTopError,
    enItemErrorAt,
    arItemErrorAt,
}: {
    label: string;
    hint?: string;
    enValues: string[];
    arValues: string[];
    onEnChange: (next: string[]) => void;
    onArChange: (next: string[]) => void;
    placeholder: string;
    multiline?: boolean;
    /** Remove is disabled while the list length is at or below this value (e.g. 2 for split hero titles). */
    minRows?: number;
    itemClassName?: string;
    enTopError?: string;
    arTopError?: string;
    enItemErrorAt?: (i: number) => string | undefined;
    arItemErrorAt?: (i: number) => string | undefined;
}) => {
    const renderList = (
        values: string[],
        onChange: (next: string[]) => void,
        itemErrorAt?: (i: number) => string | undefined,
    ) => {
        const display = values.length > 0 ? values : [""];
        return (
            <div className="space-y-2">
                {display.map((value, index) => (
                    <div key={index} className="space-y-1">
                        <div className="flex items-center gap-2">
                            {multiline ? (
                                <Textarea
                                    className={itemClassName}
                                    placeholder={placeholder}
                                    value={value}
                                    onChange={(e) => {
                                        const next = [...display];
                                        next[index] = e.target.value;
                                        onChange(next);
                                    }}
                                />
                            ) : (
                                <Input
                                    className={itemClassName}
                                    placeholder={placeholder}
                                    value={value}
                                    onChange={(e) => {
                                        const next = [...display];
                                        next[index] = e.target.value;
                                        onChange(next);
                                    }}
                                />
                            )}
                            <Button
                                type="button"
                                variant="outline"
                                className={destructiveButtonClass}
                                onClick={() => onChange(display.filter((_, i) => i !== index))}
                                disabled={display.length <= minRows}
                            >
                                <Trash2 size={14} />
                            </Button>
                        </div>
                        <InputError message={itemErrorAt?.(index)} />
                    </div>
                ))}
                <Button
                    type="button"
                    variant="outline"
                    className="h-8 border-main-primary/30 px-3 text-xs text-main-primary hover:bg-main-primary/10"
                    onClick={() => onChange([...display, ""])}
                >
                    Add Item
                </Button>
            </div>
        );
    };

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 overflow-visible">
                <p className={fieldLabelClass}>{label}</p>
                {hint ? <CmsHelpHint text={hint} /> : null}
            </div>
            <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                <div className="space-y-1.5">
                    <LocaleBadge locale="en" />
                    {renderList(enValues, onEnChange, enItemErrorAt)}
                    <InputError message={enTopError} />
                </div>
                <div className="space-y-1.5" dir="rtl">
                    <LocaleBadge locale="ar" />
                    {renderList(arValues, onArChange, arItemErrorAt)}
                    <InputError message={arTopError} />
                </div>
            </div>
        </div>
    );
};

export const LocaleTabs = ({
    locale,
    onLocaleChange,
}: {
    locale: CmsLocale;
    onLocaleChange: (locale: CmsLocale) => void;
}) => (
    <div className="inline-flex items-center rounded-xl border border-main-whiteMarble bg-main-white p-1">
        {(["en", "ar"] as CmsLocale[]).map((lang) => (
            <Button
                key={lang}
                type="button"
                variant="ghost"
                className={
                    locale === lang
                        ? "h-8 rounded-lg bg-main-primary px-3 text-xs font-semibold uppercase text-main-white hover:bg-main-primary/90"
                        : "h-8 rounded-lg px-3 text-xs font-semibold uppercase text-main-sharkGray hover:bg-main-titaniumWhite"
                }
                onClick={() => onLocaleChange(lang)}
            >
                {lang}
            </Button>
        ))}
    </div>
);

/** Uppercase label + optional info tooltip (Legal & Help field pattern). */
export const CmsFieldLabel = ({ label, hint }: { label: string; hint?: string }) => (
    <div className="flex flex-wrap items-center gap-2 overflow-visible">
        <p className={fieldLabelClass}>{label}</p>
        {hint ? <CmsHelpHint text={hint} /> : null}
    </div>
);

export const cmsImageUrl = (value: string): string => {
    if (!value) return "";
    return value.trim();
};

export const fieldLabelClass =
    "text-xs font-semibold uppercase tracking-[0.12em] text-main-lightSlate";

export const destructiveButtonClass =
    "h-9 w-fit border-main-remove text-main-remove hover:bg-main-remove/10 hover:text-main-remove text-[10px]";

export const sectionCardClass =
    "w-full overflow-visible rounded-2xl border border-main-whiteMarble bg-main-white p-5 shadow-[0_12px_30px_rgba(17,24,39,0.04)]";

const hideToggleClass =
    "flex items-center gap-2 rounded-xl border border-main-whiteMarble bg-main-titaniumWhite/35 px-3 py-2 text-sm font-medium text-main-mirage";

export const InputError = ({ message }: { message?: string }) =>
    message ? <p className="text-xs text-main-remove mt-1">{message}</p> : null;

export const SectionVisibilityToggle = ({
    checked,
    onCheckedChange,
}: {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
}) => (
    <div className={hideToggleClass}>
        <Switch checked={checked} onCheckedChange={onCheckedChange} />
        <span>{checked ? "Section Hidden" : "Section Visible"}</span>
    </div>
);

export const StringArrayEditor = ({
    label,
    hint,
    values,
    onChange,
    placeholder,
    multiline = false,
    topError,
    itemErrorAt,
}: {
    label: string;
    hint?: string;
    values: string[];
    onChange: (next: string[]) => void;
    placeholder: string;
    multiline?: boolean;
    topError?: string;
    itemErrorAt?: (index: number) => string | undefined;
}) => {
    const displayValues = values.length > 0 ? values : [""];

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 overflow-visible">
                <label className={fieldLabelClass}>{label}</label>
                {hint ? <CmsHelpHint text={hint} /> : null}
            </div>
            {displayValues.map((value, index) => (
                <div key={`${label}-${index}`} className="space-y-1">
                    <div className="flex items-center gap-2">
                        {multiline ? (
                            <Textarea
                                placeholder={placeholder}
                                value={value}
                                onChange={(e) => {
                                    const next = [...displayValues];
                                    next[index] = e.target.value;
                                    onChange(next);
                                }}
                            />
                        ) : (
                            <Input
                                placeholder={placeholder}
                                value={value}
                                onChange={(e) => {
                                    const next = [...displayValues];
                                    next[index] = e.target.value;
                                    onChange(next);
                                }}
                            />
                        )}
                        <Button
                            type="button"
                            variant="outline"
                            className={destructiveButtonClass}
                            onClick={() => onChange(displayValues.filter((_, i) => i !== index))}
                            disabled={displayValues.length === 1}
                        >
                            <Trash2 size={14} />
                            Remove
                        </Button>
                    </div>
                    <InputError message={itemErrorAt?.(index)} />
                </div>
            ))}
            <Button
                type="button"
                variant="outline"
                className="border-main-primary/30 text-main-primary hover:bg-main-primary/10"
                onClick={() => onChange([...displayValues, ""])}
            >
                Add Item
            </Button>
            <InputError message={topError} />
        </div>
    );
};

export const PageShell = ({
    title,
    subtitle,
    description,
    hint,
    onSave,
    saving,
    loading,
    error,
    children,
}: {
    title: string;
    subtitle?: string;
    /** Short visible explanation under the title (like Legal & Help section cards). */
    description?: string;
    /** Extra context in an info tooltip next to the title. */
    hint?: string;
    onSave: () => void;
    saving: boolean;
    loading: boolean;
    error?: string | null;
    children: React.ReactNode;
}) => (
    <div className="w-full overflow-visible rounded-2xl border border-main-whiteMarble bg-main-white p-6 space-y-5 shadow-[0_12px_32px_rgba(17,24,39,0.04)]">
        <div className="flex items-center justify-between gap-4 overflow-visible">
            <div className="min-w-0 flex-1 space-y-1 overflow-visible">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-main-lightSlate">
                    {subtitle ?? "About Section"}
                </p>
                <div className="flex flex-wrap items-center gap-2 overflow-visible">
                    <h2 className="text-xl font-bold text-main-mirage">{title}</h2>
                    {hint ? <CmsHelpHint text={hint} /> : null}
                </div>
                {description ? (
                    <p className="mt-1 max-w-3xl text-sm text-main-coolGray">{description}</p>
                ) : null}
            </div>
            <Button
                type="button"
                onClick={onSave}
                disabled={loading || saving}
                className="bg-main-primary hover:bg-main-primary/90 text-main-white"
            >
                {saving ? "Saving..." : "Save Section"}
            </Button>
        </div>

        {error && (
            <div className="text-sm text-main-remove bg-main-remove/10 rounded-lg px-3 py-2">
                {error}
            </div>
        )}

        {loading ? (
            <div className="space-y-4 animate-pulse">
                <div className="h-10 rounded-lg bg-main-titaniumWhite" />
                <div className="h-10 rounded-lg bg-main-titaniumWhite" />
                <div className="h-24 rounded-lg bg-main-titaniumWhite" />
            </div>
        ) : (
            children
        )}
    </div>
);
