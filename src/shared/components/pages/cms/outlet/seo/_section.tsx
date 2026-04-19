import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useCmsSeoStore, type SeoPage } from "@/shared/hooks/store/useCmsSeoStore";
import {
    BilingualField,
    PageShell,
    InputError,
    sectionCardClass,
    CmsFieldLabel,
} from "../about/_shared";

// ─── Tag Input ────────────────────────────────────────────────────────────────

const TagInput = ({
    tags,
    onChange,
    disabled,
    placeholder,
    addLabel,
}: {
    tags: string[];
    onChange: (next: string[]) => void;
    disabled?: boolean;
    placeholder?: string;
    addLabel: string;
}) => {
    const [input, setInput] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const commit = (raw: string) => {
        const value = raw.trim().replace(/,$/, "").trim();
        if (value && !tags.includes(value)) {
            onChange([...tags, value]);
        }
        setInput("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "," || e.key === "Enter") {
            e.preventDefault();
            commit(input);
        } else if (e.key === "Backspace" && input === "" && tags.length > 0) {
            onChange(tags.slice(0, -1));
        }
    };

    return (
        <div
            className={clsx(
                "flex flex-wrap items-center gap-1.5 min-h-11 w-full common-rounded border border-main-whiteMarble bg-main-white px-3 py-2 text-sm text-main-hydrocarbon shadow-sm transition-[border-color,box-shadow,background-color] outline-none cursor-text",
                "focus-within:border-main-primary focus-within:ring-2 focus-within:ring-main-primary/40 focus-within:ring-offset-2 focus-within:ring-offset-main-primary/10",
                disabled && "pointer-events-none cursor-not-allowed bg-main-titaniumWhite text-main-sharkGray/70 opacity-90",
            )}
            onClick={() => inputRef.current?.focus()}
        >
            {tags.map((tag) => (
                <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-md bg-main-primary/10 px-2 py-0.5 text-xs font-medium text-main-primary"
                >
                    {tag}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onChange(tags.filter((t) => t !== tag));
                        }}
                        className="ml-0.5 rounded-sm opacity-60 hover:opacity-100 focus:outline-none"
                    >
                        <X size={11} />
                    </button>
                </span>
            ))}
            <input
                ref={inputRef}
                value={input}
                onChange={(e) => {
                    const val = e.target.value;
                    if (val.endsWith(",")) { commit(val); } else { setInput(val); }
                }}
                onKeyDown={handleKeyDown}
                onBlur={() => commit(input)}
                placeholder={tags.length === 0 ? (placeholder ?? "") : ""}
                className="flex-1 min-w-[120px] bg-transparent outline-none placeholder:text-main-trueBlack/50"
                disabled={disabled}
            />
            {input.trim() && (
                <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); commit(input); }}
                    className="shrink-0 rounded-md bg-main-primary px-2.5 py-1 text-xs font-semibold text-main-white transition-colors hover:bg-main-primary/90"
                >
                    {addLabel}
                </button>
            )}
        </div>
    );
};

// ─── Schema Scripts Editor ────────────────────────────────────────────────────

const getLiveJsonError = (raw: string, invalidJsonMessage: string): string | null => {
    const value = raw.trim();
    if (!value) return null;
    try { JSON.parse(value); return null; }
    catch { return invalidJsonMessage; }
};

const SchemaScriptsEditor = ({
    scripts,
    onChange,
    disabled,
    getError,
    addScriptLabel,
    removeLabel,
    scriptLabel,
    invalidJsonMessage,
    jsonPlaceholder,
}: {
    scripts: string[];
    onChange: (next: string[]) => void;
    disabled?: boolean;
    getError: (path: string) => string | undefined;
    addScriptLabel: string;
    removeLabel: string;
    scriptLabel: (index: number) => string;
    invalidJsonMessage: string;
    jsonPlaceholder: string;
}) => {
    const safeScripts = scripts.length > 0 ? scripts : [""];
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-end gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => onChange([...safeScripts, ""])}
                    disabled={disabled || safeScripts.length >= 20}
                    className="border-main-primary/30 text-main-primary hover:bg-main-primary/10 text-xs h-8 px-3"
                >
                    {addScriptLabel}
                </Button>
            </div>

            {safeScripts.map((script, index) => (
                <div key={`schema-script-${index}`} className="space-y-1.5 rounded-lg border border-main-whiteMarble p-3">
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-semibold text-main-lightSlate">{scriptLabel(index)}</p>
                        <Button
                            type="button"
                            variant="outline"
                            className="border-main-remove text-main-remove hover:bg-main-remove/10 hover:text-main-remove text-xs h-7 px-3"
                            disabled={disabled || safeScripts.length <= 1}
                            onClick={() => onChange(safeScripts.filter((_, i) => i !== index))}
                        >
                            {removeLabel}
                        </Button>
                    </div>
                    <Textarea
                        placeholder={jsonPlaceholder}
                        value={script}
                        onChange={(e) => {
                            const next = [...safeScripts];
                            next[index] = e.target.value;
                            onChange(next);
                        }}
                        disabled={disabled}
                        rows={7}
                        className="font-mono text-xs"
                    />
                    <InputError message={getError(`schema_scripts.${index}`) ?? getLiveJsonError(script, invalidJsonMessage) ?? undefined} />
                </div>
            ))}
            <InputError message={getError("schema_scripts")} />
        </div>
    );
};

// ─── Section Page ─────────────────────────────────────────────────────────────

interface SeoSectionPageProps {
    page: SeoPage;
}

const SeoSectionPage = ({ page }: SeoSectionPageProps) => {
    const { t } = useTranslation("cms");
    const {
        [page]: seoByLocale,
        loading,
        savingPage,
        error,
        fieldErrors,
        fetchPage,
        setPage,
        setKeywords,
        savePage,
    } = useCmsSeoStore();

    useEffect(() => { fetchPage(page); }, [fetchPage, page]);

    const getEnError = (field: string) => fieldErrors[`${page}.en.${field}`];
    const getArError = (field: string) => fieldErrors[`${page}.ar.${field}`];
    const saving = savingPage === page;

    return (
        <PageShell
            title={t(`seoEditor.pageTitle.${page}`)}
            subtitle={t("seoEditor.subtitle")}
            description={t(`seoEditor.pageDescription.${page}`)}
            hint={t("seoEditor.hint")}
            onSave={() => savePage(page)}
            saving={saving}
            loading={loading}
            error={error}
        >
            <div className={clsx(sectionCardClass, "space-y-6")}>

                {/* Meta Title */}
                <BilingualField
                    label={t("seoEditor.metaTitle")}
                    hint={t("seoEditor.metaTitleHint")}
                    en={
                        <Input
                            placeholder={t("seoEditor.metaTitlePlaceholderEn")}
                            value={seoByLocale.en.title}
                            onChange={(e) => setPage(page, "en", { title: e.target.value })}
                            disabled={saving}
                        />
                    }
                    ar={
                        <Input
                            placeholder={t("seoEditor.metaTitlePlaceholderAr")}
                            value={seoByLocale.ar.title}
                            onChange={(e) => setPage(page, "ar", { title: e.target.value })}
                            disabled={saving}
                        />
                    }
                    enError={getEnError("title")}
                    arError={getArError("title")}
                />

                {/* Meta Description */}
                <BilingualField
                    label={t("seoEditor.metaDescription")}
                    hint={t("seoEditor.metaDescriptionHint")}
                    en={
                        <Textarea
                            placeholder={t("seoEditor.metaDescriptionPlaceholderEn")}
                            value={seoByLocale.en.description}
                            onChange={(e) => setPage(page, "en", { description: e.target.value })}
                            disabled={saving}
                            rows={3}
                        />
                    }
                    ar={
                        <Textarea
                            placeholder={t("seoEditor.metaDescriptionPlaceholderAr")}
                            value={seoByLocale.ar.description}
                            onChange={(e) => setPage(page, "ar", { description: e.target.value })}
                            disabled={saving}
                            rows={3}
                        />
                    }
                    enError={getEnError("description")}
                    arError={getArError("description")}
                />

                {/* Alt Image */}
                <BilingualField
                    label={t("seoEditor.altImage")}
                    hint={t("seoEditor.altImageHint")}
                    en={
                        <Input
                            placeholder={t("seoEditor.altImagePlaceholderEn")}
                            value={seoByLocale.en.alt_img}
                            onChange={(e) => setPage(page, "en", { alt_img: e.target.value })}
                            disabled={saving}
                        />
                    }
                    ar={
                        <Input
                            placeholder={t("seoEditor.altImagePlaceholderAr")}
                            value={seoByLocale.ar.alt_img}
                            onChange={(e) => setPage(page, "ar", { alt_img: e.target.value })}
                            disabled={saving}
                        />
                    }
                    enError={getEnError("alt_img")}
                    arError={getArError("alt_img")}
                />

                {/* Keywords */}
                <BilingualField
                    label={t("seoEditor.keywords")}
                    hint={t("seoEditor.keywordsHint")}
                    en={
                        <TagInput
                            tags={seoByLocale.en.keywords}
                            onChange={(next) => setKeywords(page, "en", next)}
                            disabled={saving}
                            placeholder={t("seoEditor.keywordsPlaceholderEn")}
                            addLabel={t("seoEditor.add")}
                        />
                    }
                    ar={
                        <TagInput
                            tags={seoByLocale.ar.keywords}
                            onChange={(next) => setKeywords(page, "ar", next)}
                            disabled={saving}
                            placeholder={t("seoEditor.keywordsPlaceholderAr")}
                            addLabel={t("seoEditor.add")}
                        />
                    }
                    enError={getEnError("keywords")}
                    arError={getArError("keywords")}
                />

                {/* Schema Scripts — bilingual (shown one above the other for readability) */}
                <div className="space-y-4">
                    <CmsFieldLabel
                        label={t("seoEditor.schemaLabel")}
                        hint={t("seoEditor.schemaHint")}
                    />
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        <div className="space-y-2 rounded-xl border border-main-whiteMarble bg-main-titaniumWhite/20 p-3">
                            <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border bg-blue-50 text-blue-600 border-blue-200">EN</span>
                            <SchemaScriptsEditor
                                scripts={seoByLocale.en.schema_scripts}
                                onChange={(next) => setPage(page, "en", { schema_scripts: next })}
                                disabled={saving}
                                getError={(path) => getEnError(path)}
                                addScriptLabel={t("seoEditor.addScript")}
                                removeLabel={t("seoEditor.remove")}
                                scriptLabel={(index) => t("seoEditor.script", { n: index + 1 })}
                                invalidJsonMessage={t("seoEditor.jsonInvalid")}
                                jsonPlaceholder={t("seoEditor.jsonPlaceholder")}
                            />
                        </div>
                        <div className="space-y-2 rounded-xl border border-main-whiteMarble bg-main-titaniumWhite/20 p-3" dir="rtl">
                            <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border bg-emerald-50 text-emerald-600 border-emerald-200">AR</span>
                            <SchemaScriptsEditor
                                scripts={seoByLocale.ar.schema_scripts}
                                onChange={(next) => setPage(page, "ar", { schema_scripts: next })}
                                disabled={saving}
                                getError={(path) => getArError(path)}
                                addScriptLabel={t("seoEditor.addScript")}
                                removeLabel={t("seoEditor.remove")}
                                scriptLabel={(index) => t("seoEditor.script", { n: index + 1 })}
                                invalidJsonMessage={t("seoEditor.jsonInvalid")}
                                jsonPlaceholder={t("seoEditor.jsonPlaceholder")}
                            />
                        </div>
                    </div>
                </div>

            </div>
        </PageShell>
    );
};

export default SeoSectionPage;
