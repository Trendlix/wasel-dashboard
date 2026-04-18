import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreatableTagCombobox, RichTextEditor } from "@/shared/components/common/FormItems";
import {
    InputError,
    PageShell,
    destructiveButtonClass,
    sectionCardClass,
    CmsFieldLabel,
} from "@/shared/components/pages/cms/outlet/about/_shared";
import {
    createEmptyBlogForm,
    useCmsBlogsStore,
    type BlogFormPayload,
    type BlogItem,
} from "@/shared/hooks/store/useCmsBlogsStore";
import { Trash2, X } from "lucide-react";
import { CommonModal, CommonModalFooter, CommonModalHeader } from "@/shared/components/common/CommonModal";

// ─── Schema Scripts Editor (same pattern as SEO forms) ───────────────────────

const getLiveJsonError = (raw: string): string | null => {
    if (!raw.trim()) return null;
    try { JSON.parse(raw); return null; }
    catch { return "Invalid JSON"; }
};

const SchemaEditor = ({
    rawSchemas,
    onChange,
}: {
    rawSchemas: string[];
    onChange: (next: string[]) => void;
}) => {
    const safe = rawSchemas.length > 0 ? rawSchemas : [""];
    return (
        <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <CmsFieldLabel
                    label="Schema JSON-LD Scripts"
                    hint="Optional structured data for this article. Each block must be valid JSON (object). Used for rich results."
                />
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => onChange([...safe, ""])}
                    disabled={safe.length >= 20}
                    className="border-main-primary/30 text-main-primary hover:bg-main-primary/10 text-xs h-8 px-3"
                >
                    Add Script
                </Button>
            </div>
            {safe.map((script, index) => (
                <div key={`schema-${index}`} className="space-y-1.5 rounded-xl border border-main-whiteMarble p-3 bg-main-titaniumWhite/30">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-main-sharkGray">Script #{index + 1}</p>
                        <Button
                            type="button"
                            variant="outline"
                            className="border-main-remove text-main-remove hover:bg-main-remove/10 hover:text-main-remove text-xs h-7 px-3"
                            disabled={safe.length <= 1}
                            onClick={() => onChange(safe.filter((_, i) => i !== index))}
                        >
                            Remove
                        </Button>
                    </div>
                    <Textarea
                        placeholder='{"@context":"https://schema.org","@type":"Organization","name":"Wasel"}'
                        value={script}
                        onChange={(e) => {
                            const next = [...safe];
                            next[index] = e.target.value;
                            onChange(next);
                        }}
                        rows={7}
                        className="font-mono text-xs"
                    />
                    <InputError message={getLiveJsonError(script) ?? undefined} />
                </div>
            ))}
        </div>
    );
};

// ─── Main Form ────────────────────────────────────────────────────────────────

interface BlogItemFormProps {
    mode: "create" | "edit";
    initialItem?: BlogItem | null;
    onBack: () => void;
}

type PublishChoice = "draft" | "published" | "scheduled";

const toLocalDateTimeInputValue = (date: Date) => {
    const pad = (value: number) => String(value).padStart(2, "0");
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const isDescriptionEmpty = (value: string) => {
    const lowered = value.toLowerCase();
    if (lowered.includes("<img") || lowered.includes("<video") || lowered.includes("<iframe")) return false;
    return value.replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").replace(/\s+/g, "").trim().length === 0;
};

const BlogItemForm = ({ mode, initialItem, onBack }: BlogItemFormProps) => {
    const {
        categories,
        loadingCategories,
        fetchCategories,
        savingItem,
        error,
        uploadRichTextMedia,
        createItem,
        updateItem,
    } = useCmsBlogsStore();

    const [draft, setDraft] = useState<BlogFormPayload>(
        initialItem
            ? {
                category: initialItem.category,
                locale: initialItem.locale ?? "en",
                title: initialItem.title,
                description: initialItem.description,
                time_to_read: initialItem.time_to_read,
                cover_img: initialItem.cover_img,
                is_schedualed: initialItem.is_schedualed,
                release_date: initialItem.release_date,
                status: initialItem.status,
                seo: initialItem.seo,
            }
            : createEmptyBlogForm(),
    );

    const [validationError, setValidationError] = useState<string | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [publishModalOpen, setPublishModalOpen] = useState(false);
    const [publishChoice, setPublishChoice] = useState<PublishChoice>("draft");
    const [scheduledAt, setScheduledAt] = useState(toLocalDateTimeInputValue(new Date()));

    const coverPreview = useMemo(
        () => (coverFile ? URL.createObjectURL(coverFile) : ""),
        [coverFile],
    );

    // Raw JSON strings for the schema editor (keep in sync with draft.seo.schema)
    const [rawSchemas, setRawSchemas] = useState<string[]>(() =>
        draft.seo.schema.length > 0
            ? draft.seo.schema.map((e) => JSON.stringify(e, null, 2))
            : [""],
    );

    useEffect(() => { void fetchCategories(); }, [fetchCategories]);

    const handleSchemaChange = (next: string[]) => {
        setRawSchemas(next);
        const parsed = next
            .map((raw) => { try { const d = JSON.parse(raw); return (d && typeof d === "object" && !Array.isArray(d)) ? d as Record<string, unknown> : null; } catch { return null; } })
            .filter(Boolean) as Record<string, unknown>[];
        setDraft((prev) => ({ ...prev, seo: { ...prev.seo, schema: parsed } }));
    };

    // Categories list — include current value if it's not in the fetched list
    const categoryOptions = [
        ...categories,
        ...(draft.category && !categories.includes(draft.category) ? [draft.category] : []),
    ];

    const validateBaseFields = () => {
        if (!draft.title.trim()) return "Title is required.";
        if (!draft.category.trim()) return "Category is required.";
        if (isDescriptionEmpty(draft.description)) return "Description is required.";
        const mins = Number(draft.time_to_read);
        if (!draft.time_to_read || isNaN(mins) || mins < 1) return "Time to read must be at least 1 minute.";
        return null;
    };

    const validatePayload = (payload: BlogFormPayload) => {
        const baseMsg = validateBaseFields();
        if (baseMsg) return baseMsg;
        if (!payload.cover_img.trim() && !coverFile && payload.status !== "draft") {
            return "Cover image is required for publish or schedule actions.";
        }
        if (payload.status === "scheduled") {
            if (!payload.release_date) return "Release date is required for scheduled posts.";
            if (new Date(payload.release_date).getTime() < Date.now()) return "Release date cannot be in the past.";
        }
        return null;
    };

    const openActionModal = () => {
        const msg = validateBaseFields();
        setValidationError(msg);
        if (msg) return;
        const initialChoice: PublishChoice =
            draft.status === "published" ? "published" : draft.status === "scheduled" ? "scheduled" : "draft";
        setPublishChoice(initialChoice);
        if (draft.release_date) {
            setScheduledAt(toLocalDateTimeInputValue(new Date(draft.release_date)));
        } else {
            setScheduledAt(toLocalDateTimeInputValue(new Date()));
        }
        setPublishModalOpen(true);
    };

    const saveWithChoice = async () => {
        const nextStatus: BlogFormPayload["status"] =
            publishChoice === "draft" ? "draft" : publishChoice === "published" ? "published" : "scheduled";
        const releaseDate = publishChoice === "scheduled"
            ? (scheduledAt ? new Date(scheduledAt).toISOString() : null)
            : null;
        const payload: BlogFormPayload = {
            ...draft,
            status: nextStatus,
            is_schedualed: publishChoice === "scheduled",
            release_date: releaseDate,
        };

        const msg = validatePayload(payload);
        setValidationError(msg);
        if (msg) return;

        if (mode === "create") {
            const created = await createItem(payload, coverFile);
            if (!created) return;
        } else {
            if (!initialItem) return;
            const updated = await updateItem(initialItem.id, payload, coverFile);
            if (!updated) return;
        }

        if (mode === "create" || mode === "edit") {
            setPublishModalOpen(false);
            onBack();
        }
    };

    return (
        <PageShell
            title={mode === "create" ? "Blogs / Add Blog Item" : "Blogs / Edit Blog Item"}
            subtitle="Blogs Items"
            description="One article per locale: pick language, write rich content, tune SEO, then publish or schedule."
            hint="Use Save to open the publish modal. Drafts may omit cover; publishing or scheduling usually requires a cover image."
            onSave={openActionModal}
            saving={savingItem}
            loading={false}
            error={error || validationError}
        >
            <div className="space-y-4">


                {/* ── Core fields ── */}
                <div className={sectionCardClass}>

                    {/* Cover image */}
                    <div className="space-y-3 mb-4">
                        <CmsFieldLabel
                            label="Cover Image"
                            hint="Shown in listings and at the top of the article. Required when publishing or scheduling (not for drafts)."
                        />
                        <div className="flex flex-col gap-4 items-start">
                            {/* Preview box */}
                            <div className="rounded-2xl border border-main-whiteMarble bg-main-titaniumWhite/30 p-3 w-1/4">
                                <p className="text-[10px] font-semibold uppercase tracking-widest text-main-sharkGray mb-2">Preview</p>
                                <div className="h-44 w-full overflow-hidden rounded-xl border border-main-whiteMarble bg-main-white">
                                    {coverPreview ? (
                                        <img src={coverPreview} alt="Cover preview" className="h-full w-full object-contain" />
                                    ) : draft.cover_img ? (
                                        <img src={draft.cover_img} alt="Cover" className="h-full w-full object-contain" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-sm text-main-sharkGray">
                                            No cover image
                                        </div>
                                    )}
                                </div>
                                {coverPreview && (
                                    <p className="mt-2 text-xs text-main-primary">New image selected — will upload on save.</p>
                                )}
                            </div>

                            {/* File input + remove */}
                            <div className="rounded-xl border border-main-whiteMarble bg-main-titaniumWhite/30 p-3 space-y-3 w-full">
                                <div className="space-y-1.5">
                                    <CmsFieldLabel
                                        label="Upload Cover Image"
                                        hint="PNG, JPG, WebP, or SVG. Replaces the stored URL after save."
                                    />
                                    <Input
                                        type="file"
                                        accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                                        onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
                                    />
                                </div>
                                {(draft.cover_img || coverFile) && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className={destructiveButtonClass}
                                        onClick={() => {
                                            setCoverFile(null);
                                            setDraft((p) => ({ ...p, cover_img: "" }));
                                        }}
                                    >
                                        <Trash2 size={14} />
                                        Remove Cover
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="space-y-1.5">
                            <CmsFieldLabel
                                label="Locale"
                                hint="This post is stored for one language. Create a second item for the other locale if needed."
                            />
                            <Select
                                value={draft.locale}
                                onValueChange={(value) =>
                                    setDraft((p) => ({ ...p, locale: value as "en" | "ar" }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select locale" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="ar">Arabic</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <CmsFieldLabel
                                label="Title"
                                hint="Public article headline and default H1 unless the template overrides it."
                            />
                            <Input
                                value={draft.title}
                                onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
                                placeholder="Blog title"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="space-y-1.5">
                            <CmsFieldLabel
                                label="Category"
                                hint="Type to filter or add a label. Used for grouping and filters on the blogs page."
                            />
                            {loadingCategories ? (
                                <div className="h-11 w-full common-rounded border border-main-whiteMarble bg-main-titaniumWhite animate-pulse" />
                            ) : (
                                <CreatableTagCombobox
                                    value={draft.category}
                                    onChange={(cat) => setDraft((p) => ({ ...p, category: cat }))}
                                    options={categoryOptions}
                                />
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <CmsFieldLabel
                                label="Time To Read (minutes)"
                                hint="Integer minutes for “X min read” badges. Minimum 1 when validating before publish."
                            />
                            <Input
                                type="number"
                                min={1}
                                value={draft.time_to_read}
                                onChange={(e) => setDraft((p) => ({ ...p, time_to_read: e.target.value }))}
                                placeholder="8"
                                className="w-full"
                            />
                        </div>
                    </div>

                </div>

                {/* ── Rich text description ── */}
                <div className={sectionCardClass}>
                    <CmsFieldLabel
                        label="Description (Rich Text)"
                        hint="Full article body. Images and videos upload to storage; use the toolbar for formatting."
                    />
                    <div className="mt-3">
                        <RichTextEditor
                            value={draft.description}
                            onChange={(v) => setDraft((p) => ({ ...p, description: v }))}
                            placeholder="Write blog content here…"
                            onUploadFile={(file, type) => uploadRichTextMedia(file, type)}
                        />
                    </div>
                </div>

                {/* ── SEO ── */}
                <div className={sectionCardClass}>
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-main-mirage">SEO</h3>
                    </div>
                    <p className="mb-4 text-xs text-main-coolGray">
                        Search snippet overrides for this post. Leave blank only if your frontend falls back to the article title.
                    </p>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                            {/* SEO title */}
                            <div className="space-y-1.5">
                                <CmsFieldLabel
                                    label="Meta Title"
                                    hint="Override for the HTML title tag and link text in Google. Shorter is better on mobile."
                                />
                                <Input
                                    value={draft.seo.title}
                                    onChange={(e) => setDraft((p) => ({ ...p, seo: { ...p.seo, title: e.target.value } }))}
                                    placeholder="SEO title"
                                />
                            </div>
                            {/* SEO keywords */}
                            <div className="space-y-1.5">
                                <CmsFieldLabel
                                    label="Keywords"
                                    hint="Comma or Enter separated tags for this article’s meta keywords list."
                                />
                                <KeywordTagInput
                                    tags={draft.seo.keyword}
                                    onChange={(next) => setDraft((p) => ({ ...p, seo: { ...p.seo, keyword: next } }))}
                                />
                            </div>
                        </div>

                        {/* SEO description */}
                        <div className="space-y-1.5">
                            <CmsFieldLabel
                                label="Meta Description"
                                hint="Search snippet summary. Aim for a clear value proposition in ~150 characters."
                            />
                            <Textarea
                                value={draft.seo.description}
                                onChange={(e) => setDraft((p) => ({ ...p, seo: { ...p.seo, description: e.target.value } }))}
                                placeholder="Brief description shown in search results"
                                rows={3}
                            />
                        </div>

                        {/* Schema scripts */}
                        <SchemaEditor rawSchemas={rawSchemas} onChange={handleSchemaChange} />
                    </div>
                </div>

                {/* ── Actions ── */}
                <div className="flex items-center gap-3 pt-1">
                    <Button
                        type="button"
                        onClick={openActionModal}
                        disabled={savingItem}
                        className="bg-main-primary hover:bg-main-primary/90 text-white px-6"
                    >
                        {savingItem ? "Saving…" : mode === "create" ? "Create Blog Item" : "Update Blog Item"}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onBack}
                        className="border-main-whiteMarble text-main-hydrocarbon hover:bg-main-titaniumWhite px-6"
                    >
                        Back
                    </Button>
                </div>

            </div>

            <CommonModal
                open={publishModalOpen}
                onOpenChange={setPublishModalOpen}
                loading={savingItem}
                maxWidth="sm:max-w-[520px]"
            >
                <CommonModalHeader
                    title={mode === "create" ? "Create Blog Item" : "Update Blog Item"}
                    description={
                        mode === "create"
                            ? "Choose how you want this blog item to be saved."
                            : "Choose the status for this blog update."
                    }
                />
                <div className="px-8 pb-3 space-y-4">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                        {([
                            { value: "draft", label: "Save as Draft" },
                            { value: "published", label: "Publish Now" },
                            { value: "scheduled", label: "Schedule Release" },
                        ] as Array<{ value: PublishChoice; label: string }>).map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => setPublishChoice(option.value)}
                                className={
                                    publishChoice === option.value
                                        ? "rounded-xl border border-main-primary bg-main-primary/10 px-3 py-2 text-sm font-semibold text-main-primary"
                                        : "rounded-xl border border-main-whiteMarble bg-main-white px-3 py-2 text-sm font-semibold text-main-sharkGray hover:border-main-primary/40 hover:text-main-primary"
                                }
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>

                    {publishChoice === "scheduled" && (
                        <div className="space-y-1.5">
                            <CmsFieldLabel
                                label="Release Date"
                                hint="Local datetime when the post should go live. Must be in the future when you confirm."
                            />
                            <Input
                                type="datetime-local"
                                value={scheduledAt}
                                onChange={(e) => setScheduledAt(e.target.value)}
                                min={toLocalDateTimeInputValue(new Date())}
                            />
                        </div>
                    )}
                </div>
                <CommonModalFooter className="mt-0 py-5">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setPublishModalOpen(false)}
                        disabled={savingItem}
                        className="h-10 px-5 text-main-sharkGray hover:bg-main-titaniumWhite"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={saveWithChoice}
                        disabled={savingItem}
                        className="h-10 px-5 bg-main-primary text-white hover:bg-main-primary/90"
                    >
                        {savingItem ? (mode === "create" ? "Creating..." : "Updating...") : "Confirm"}
                    </Button>
                </CommonModalFooter>
            </CommonModal>
        </PageShell>
    );
};


export default BlogItemForm;

// ─── Keyword tag input (same pattern as SEO forms) ───────────────────────────

const KeywordTagInput = ({
    tags,
    onChange,
}: {
    tags: string[];
    onChange: (next: string[]) => void;
}) => {
    const [input, setInput] = useState("");

    const commit = (raw: string) => {
        const value = raw.trim().replace(/,$/, "").trim();
        if (value && !tags.includes(value)) onChange([...tags, value]);
        setInput("");
    };

    return (
        <div
            className="flex flex-wrap items-center gap-1.5 min-h-11 w-full common-rounded border border-main-whiteMarble bg-main-white px-3 py-2 text-sm cursor-text focus-within:border-main-primary focus-within:ring-2 focus-within:ring-main-primary/40"
        >
            {tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 rounded-md bg-main-primary/10 px-2 py-0.5 text-xs font-medium text-main-primary">
                    {tag}
                    <button type="button" onClick={() => onChange(tags.filter((t) => t !== tag))} className="opacity-60 hover:opacity-100">
                        <X size={11} />
                    </button>
                </span>
            ))}
            <input
                value={input}
                onChange={(e) => { const v = e.target.value; if (v.endsWith(",")) commit(v); else setInput(v); }}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); commit(input); } else if (e.key === "Backspace" && !input && tags.length > 0) onChange(tags.slice(0, -1)); }}
                onBlur={() => commit(input)}
                placeholder={tags.length === 0 ? "Type a keyword and press comma or Enter…" : ""}
                className="flex-1 min-w-32 bg-transparent outline-none placeholder:text-main-silverSteel text-main-mirage"
            />
        </div>
    );
};
