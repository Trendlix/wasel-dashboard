import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import clsx from "clsx";
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
}: {
    tags: string[];
    onChange: (next: string[]) => void;
    disabled?: boolean;
    placeholder?: string;
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
                placeholder={tags.length === 0 ? (placeholder ?? "Type a keyword and press comma or Enter…") : ""}
                className="flex-1 min-w-[120px] bg-transparent outline-none placeholder:text-main-trueBlack/50"
                disabled={disabled}
            />
            {input.trim() && (
                <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); commit(input); }}
                    className="shrink-0 rounded-md bg-main-primary px-2.5 py-1 text-xs font-semibold text-main-white transition-colors hover:bg-main-primary/90"
                >
                    Add
                </button>
            )}
        </div>
    );
};

// ─── Schema Scripts Editor ────────────────────────────────────────────────────

const getLiveJsonError = (raw: string): string | null => {
    const value = raw.trim();
    if (!value) return null;
    try { JSON.parse(value); return null; }
    catch { return "Invalid JSON format. Please enter valid JSON."; }
};

const SchemaScriptsEditor = ({
    scripts,
    onChange,
    disabled,
    getError,
}: {
    scripts: string[];
    onChange: (next: string[]) => void;
    disabled?: boolean;
    getError: (path: string) => string | undefined;
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
                    Add Script
                </Button>
            </div>

            {safeScripts.map((script, index) => (
                <div key={`schema-script-${index}`} className="space-y-1.5 rounded-lg border border-main-whiteMarble p-3">
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-semibold text-main-lightSlate">Script #{index + 1}</p>
                        <Button
                            type="button"
                            variant="outline"
                            className="border-main-remove text-main-remove hover:bg-main-remove/10 hover:text-main-remove text-xs h-7 px-3"
                            disabled={disabled || safeScripts.length <= 1}
                            onClick={() => onChange(safeScripts.filter((_, i) => i !== index))}
                        >
                            Remove
                        </Button>
                    </div>
                    <Textarea
                        placeholder='{"@context":"https://schema.org","@type":"Organization","name":"Wasel"}'
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
                    <InputError message={getError(`schema_scripts.${index}`) ?? getLiveJsonError(script) ?? undefined} />
                </div>
            ))}
            <InputError message={getError("schema_scripts")} />
        </div>
    );
};

// ─── Page Labels ──────────────────────────────────────────────────────────────

const PAGE_LABELS: Record<SeoPage, string> = {
    home:           "SEO / Home",
    about:          "SEO / About",
    contact:        "SEO / Contact",
    services:       "SEO / Services",
    blogs:          "SEO / Blogs",
    order_tracking: "SEO / Order Tracking",
    faqs:           "SEO / FAQs",
    terms:          "SEO / Terms",
    privacy:        "SEO / Privacy",
};

const PAGE_DESCRIPTIONS: Record<SeoPage, string> = {
    home: "Controls how the homepage appears in search results and social previews for each language.",
    about: "Meta tags and structured data for the About page. Keep titles and descriptions unique per page.",
    contact: "SEO for the contact page. Align wording with visible contact content when possible.",
    services: "How the services landing page is summarized in search engines.",
    blogs: "Default SEO hints for the blogs listing; individual posts can override in the blog editor.",
    order_tracking: "Helps customers find the order-tracking page from search. Use clear, action-oriented wording.",
    faqs: "Improves discoverability of the FAQ hub. Reflect the main questions users ask.",
    terms: "Legal index page SEO. Use precise language; avoid misleading claims in snippets.",
    privacy: "Privacy hub SEO. Match the page purpose so expectations match the click.",
};

// ─── Section Page ─────────────────────────────────────────────────────────────

interface SeoSectionPageProps {
    page: SeoPage;
}

const SeoSectionPage = ({ page }: SeoSectionPageProps) => {
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
            title={PAGE_LABELS[page]}
            subtitle="SEO Section"
            description={PAGE_DESCRIPTIONS[page]}
            hint="These fields map to HTML meta tags and optional JSON-LD. Save after edits; invalid schema JSON blocks publish on some pages."
            onSave={() => savePage(page)}
            saving={saving}
            loading={loading}
            error={error}
        >
            <div className={clsx(sectionCardClass, "space-y-6")}>

                {/* Meta Title */}
                <BilingualField
                    label="Meta Title"
                    hint="Shown in the browser tab and often as the blue link in Google. Aim for roughly 50–60 characters."
                    en={
                        <Input
                            placeholder="Page title for search engines"
                            value={seoByLocale.en.title}
                            onChange={(e) => setPage(page, "en", { title: e.target.value })}
                            disabled={saving}
                        />
                    }
                    ar={
                        <Input
                            placeholder="عنوان الصفحة لمحركات البحث"
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
                    label="Meta Description"
                    hint="The gray snippet under the title in search results. About 150–160 characters works well for most engines."
                    en={
                        <Textarea
                            placeholder="Brief description shown in search results"
                            value={seoByLocale.en.description}
                            onChange={(e) => setPage(page, "en", { description: e.target.value })}
                            disabled={saving}
                            rows={3}
                        />
                    }
                    ar={
                        <Textarea
                            placeholder="وصف موجز يظهر في نتائج البحث"
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
                    label="Alt Image Text"
                    hint="Describes the page’s representative image for accessibility and when the image cannot load."
                    en={
                        <Input
                            placeholder="Descriptive alt text for the page image"
                            value={seoByLocale.en.alt_img}
                            onChange={(e) => setPage(page, "en", { alt_img: e.target.value })}
                            disabled={saving}
                        />
                    }
                    ar={
                        <Input
                            placeholder="نص بديل لصورة الصفحة"
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
                    label="Keywords"
                    hint="Type a word or phrase, then comma or Enter. Use relevant terms; avoid stuffing. Some engines ignore this, but it helps internal consistency."
                    en={
                        <TagInput
                            tags={seoByLocale.en.keywords}
                            onChange={(next) => setKeywords(page, "en", next)}
                            disabled={saving}
                            placeholder="Type a keyword and press comma or Enter…"
                        />
                    }
                    ar={
                        <TagInput
                            tags={seoByLocale.ar.keywords}
                            onChange={(next) => setKeywords(page, "ar", next)}
                            disabled={saving}
                            placeholder="اكتب كلمة مفتاحية واضغط فاصلة أو Enter…"
                        />
                    }
                    enError={getEnError("keywords")}
                    arError={getArError("keywords")}
                />

                {/* Schema Scripts — bilingual (shown one above the other for readability) */}
                <div className="space-y-4">
                    <CmsFieldLabel
                        label="Schema JSON-LD Scripts"
                        hint="Structured data objects as JSON. Must parse as valid JSON. Add multiple blocks for Article, Organization, FAQ, etc. Wrong syntax may be skipped by crawlers."
                    />
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        <div className="space-y-2 rounded-xl border border-main-whiteMarble bg-main-titaniumWhite/20 p-3">
                            <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border bg-blue-50 text-blue-600 border-blue-200">EN</span>
                            <SchemaScriptsEditor
                                scripts={seoByLocale.en.schema_scripts}
                                onChange={(next) => setPage(page, "en", { schema_scripts: next })}
                                disabled={saving}
                                getError={(path) => getEnError(path)}
                            />
                        </div>
                        <div className="space-y-2 rounded-xl border border-main-whiteMarble bg-main-titaniumWhite/20 p-3" dir="rtl">
                            <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border bg-emerald-50 text-emerald-600 border-emerald-200">AR</span>
                            <SchemaScriptsEditor
                                scripts={seoByLocale.ar.schema_scripts}
                                onChange={(next) => setPage(page, "ar", { schema_scripts: next })}
                                disabled={saving}
                                getError={(path) => getArError(path)}
                            />
                        </div>
                    </div>
                </div>

            </div>
        </PageShell>
    );
};

export default SeoSectionPage;
