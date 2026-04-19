import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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

const getLiveJsonError = (raw: string, invalidMessage: string): string | null => {
    if (!raw.trim()) return null;
    try { JSON.parse(raw); return null; }
    catch { return invalidMessage; }
};

const SchemaEditor = ({
    rawSchemas,
    onChange,
    t,
}: {
    rawSchemas: string[];
    onChange: (next: string[]) => void;
    t: (key: string, options?: Record<string, unknown>) => string;
}) => {
    const safe = rawSchemas.length > 0 ? rawSchemas : [""];
    return (
        <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <CmsFieldLabel
                    label={t("cms:blogItemEditor.schemaLabel")}
                    hint={t("cms:blogItemEditor.schemaHint")}
                />
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => onChange([...safe, ""])}
                    disabled={safe.length >= 20}
                    className="border-main-primary/30 text-main-primary hover:bg-main-primary/10 text-xs h-8 px-3"
                >
                    {t("cms:blogItemEditor.addScript")}
                </Button>
            </div>
            {safe.map((script, index) => (
                <div key={`schema-${index}`} className="space-y-1.5 rounded-xl border border-main-whiteMarble p-3 bg-main-titaniumWhite/30">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-main-sharkGray">{t("cms:blogItemEditor.script", { n: index + 1 })}</p>
                        <Button
                            type="button"
                            variant="outline"
                            className="border-main-remove text-main-remove hover:bg-main-remove/10 hover:text-main-remove text-xs h-7 px-3"
                            disabled={safe.length <= 1}
                            onClick={() => onChange(safe.filter((_, i) => i !== index))}
                        >
                            {t("cms:blogItemEditor.remove")}
                        </Button>
                    </div>
                    <Textarea
                        placeholder={t("cms:blogItemEditor.schemaPlaceholder")}
                        value={script}
                        onChange={(e) => {
                            const next = [...safe];
                            next[index] = e.target.value;
                            onChange(next);
                        }}
                        rows={7}
                        className="font-mono text-xs"
                    />
                    <InputError message={getLiveJsonError(script, t("cms:blogItemEditor.invalidJson")) ?? undefined} />
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
    const { t } = useTranslation(["cms", "common"]);
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
        if (!draft.title.trim()) return t("cms:blogItemEditor.errors.titleRequired");
        if (!draft.category.trim()) return t("cms:blogItemEditor.errors.categoryRequired");
        if (isDescriptionEmpty(draft.description)) return t("cms:blogItemEditor.errors.descriptionRequired");
        const mins = Number(draft.time_to_read);
        if (!draft.time_to_read || isNaN(mins) || mins < 1) return t("cms:blogItemEditor.errors.timeToReadMin");
        return null;
    };

    const validatePayload = (payload: BlogFormPayload) => {
        const baseMsg = validateBaseFields();
        if (baseMsg) return baseMsg;
        if (!payload.cover_img.trim() && !coverFile && payload.status !== "draft") {
            return t("cms:blogItemEditor.errors.coverRequired");
        }
        if (payload.status === "scheduled") {
            if (!payload.release_date) return t("cms:blogItemEditor.errors.releaseDateRequired");
            if (new Date(payload.release_date).getTime() < Date.now()) return t("cms:blogItemEditor.errors.releaseDatePast");
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
            title={mode === "create" ? t("cms:blogItemEditor.createTitle") : t("cms:blogItemEditor.editTitle")}
            subtitle={t("cms:blogItemEditor.subtitle")}
            description={t("cms:blogItemEditor.description")}
            hint={t("cms:blogItemEditor.hint")}
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
                            label={t("cms:blogItemEditor.coverImage")}
                            hint={t("cms:blogItemEditor.coverImageHint")}
                        />
                        <div className="flex flex-col gap-4 items-start">
                            {/* Preview box */}
                            <div className="rounded-2xl border border-main-whiteMarble bg-main-titaniumWhite/30 p-3 w-1/4">
                                <p className="text-[10px] font-semibold uppercase tracking-widest text-main-sharkGray mb-2">{t("cms:blogItemEditor.preview")}</p>
                                <div className="h-44 w-full overflow-hidden rounded-xl border border-main-whiteMarble bg-main-white">
                                    {coverPreview ? (
                                        <img src={coverPreview} alt={t("cms:blogItemEditor.coverPreviewAlt")} className="h-full w-full object-contain" />
                                    ) : draft.cover_img ? (
                                        <img src={draft.cover_img} alt={t("cms:blogItemEditor.coverAlt")} className="h-full w-full object-contain" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-sm text-main-sharkGray">
                                            {t("cms:blogItemEditor.noCoverImage")}
                                        </div>
                                    )}
                                </div>
                                {coverPreview && (
                                    <p className="mt-2 text-xs text-main-primary">{t("cms:blogItemEditor.newImageSelected")}</p>
                                )}
                            </div>

                            {/* File input + remove */}
                            <div className="rounded-xl border border-main-whiteMarble bg-main-titaniumWhite/30 p-3 space-y-3 w-full">
                                <div className="space-y-1.5">
                                    <CmsFieldLabel
                                        label={t("cms:blogItemEditor.uploadCoverImage")}
                                        hint={t("cms:blogItemEditor.uploadCoverImageHint")}
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
                                        {t("cms:blogItemEditor.removeCover")}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="space-y-1.5">
                            <CmsFieldLabel
                                label={t("cms:blogItemEditor.locale")}
                                hint={t("cms:blogItemEditor.localeHint")}
                            />
                            <Select
                                value={draft.locale}
                                onValueChange={(value) =>
                                    setDraft((p) => ({ ...p, locale: value as "en" | "ar" }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={t("cms:blogItemEditor.selectLocale")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en">{t("cms:blogItemEditor.localeEnglish")}</SelectItem>
                                    <SelectItem value="ar">{t("cms:blogItemEditor.localeArabic")}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <CmsFieldLabel
                                label={t("cms:blogItemEditor.title")}
                                hint={t("cms:blogItemEditor.titleHint")}
                            />
                            <Input
                                value={draft.title}
                                onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
                                placeholder={t("cms:blogItemEditor.titlePlaceholder")}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="space-y-1.5">
                            <CmsFieldLabel
                                label={t("cms:blogItemEditor.category")}
                                hint={t("cms:blogItemEditor.categoryHint")}
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
                                label={t("cms:blogItemEditor.timeToRead")}
                                hint={t("cms:blogItemEditor.timeToReadHint")}
                            />
                            <Input
                                type="number"
                                min={1}
                                value={draft.time_to_read}
                                onChange={(e) => setDraft((p) => ({ ...p, time_to_read: e.target.value }))}
                                placeholder={t("cms:blogItemEditor.timeToReadPlaceholder")}
                                className="w-full"
                            />
                        </div>
                    </div>

                </div>

                {/* ── Rich text description ── */}
                <div className={sectionCardClass}>
                    <CmsFieldLabel
                        label={t("cms:blogItemEditor.descriptionLabel")}
                        hint={t("cms:blogItemEditor.descriptionHint")}
                    />
                    <div className="mt-3">
                        <RichTextEditor
                            value={draft.description}
                            onChange={(v) => setDraft((p) => ({ ...p, description: v }))}
                            placeholder={t("cms:blogItemEditor.descriptionPlaceholder")}
                            onUploadFile={(file, type) => uploadRichTextMedia(file, type)}
                        />
                    </div>
                </div>

                {/* ── SEO ── */}
                <div className={sectionCardClass}>
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-main-mirage">{t("cms:blogItemEditor.seoTitle")}</h3>
                    </div>
                    <p className="mb-4 text-xs text-main-coolGray">
                        {t("cms:blogItemEditor.seoDescription")}
                    </p>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                            {/* SEO title */}
                            <div className="space-y-1.5">
                                <CmsFieldLabel
                                    label={t("cms:blogItemEditor.metaTitle")}
                                    hint={t("cms:blogItemEditor.metaTitleHint")}
                                />
                                <Input
                                    value={draft.seo.title}
                                    onChange={(e) => setDraft((p) => ({ ...p, seo: { ...p.seo, title: e.target.value } }))}
                                    placeholder={t("cms:blogItemEditor.metaTitlePlaceholder")}
                                />
                            </div>
                            {/* SEO keywords */}
                            <div className="space-y-1.5">
                                <CmsFieldLabel
                                    label={t("cms:blogItemEditor.keywords")}
                                    hint={t("cms:blogItemEditor.keywordsHint")}
                                />
                                <KeywordTagInput
                                    tags={draft.seo.keyword}
                                    onChange={(next) => setDraft((p) => ({ ...p, seo: { ...p.seo, keyword: next } }))}
                                    placeholder={t("cms:blogItemEditor.keywordsPlaceholder")}
                                />
                            </div>
                        </div>

                        {/* SEO description */}
                        <div className="space-y-1.5">
                            <CmsFieldLabel
                                label={t("cms:blogItemEditor.metaDescription")}
                                hint={t("cms:blogItemEditor.metaDescriptionHint")}
                            />
                            <Textarea
                                value={draft.seo.description}
                                onChange={(e) => setDraft((p) => ({ ...p, seo: { ...p.seo, description: e.target.value } }))}
                                placeholder={t("cms:blogItemEditor.metaDescriptionPlaceholder")}
                                rows={3}
                            />
                        </div>

                        {/* Schema scripts */}
                                    <SchemaEditor rawSchemas={rawSchemas} onChange={handleSchemaChange} t={t} />
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
                        {savingItem ? t("sharedEditor.saving") : mode === "create" ? t("cms:blogItemEditor.createButton") : t("cms:blogItemEditor.updateButton")}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onBack}
                        className="border-main-whiteMarble text-main-hydrocarbon hover:bg-main-titaniumWhite px-6"
                    >
                        {t("cms:blogItemEditor.back")}
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
                    title={mode === "create" ? t("cms:blogForm.publishModal.createTitle") : t("cms:blogForm.publishModal.updateTitle")}
                    description={
                        mode === "create"
                            ? t("cms:blogForm.publishModal.createDescription")
                            : t("cms:blogForm.publishModal.updateDescription")
                    }
                />
                <div className="px-8 pb-3 space-y-4">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                        {([
                            { value: "draft" as const, labelKey: "saveDraft" as const },
                            { value: "published" as const, labelKey: "publishNow" as const },
                            { value: "scheduled" as const, labelKey: "scheduleRelease" as const },
                        ] as const).map((option) => (
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
                                {t(`cms:blogForm.publishModal.${option.labelKey}`)}
                            </button>
                        ))}
                    </div>

                    {publishChoice === "scheduled" && (
                        <div className="space-y-1.5">
                            <CmsFieldLabel
                                label={t("cms:blogForm.publishModal.releaseDate")}
                                hint={t("cms:blogForm.publishModal.releaseDateHint")}
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
                        {t("common:cancel")}
                    </Button>
                    <Button
                        type="button"
                        onClick={saveWithChoice}
                        disabled={savingItem}
                        className="h-10 px-5 bg-main-primary text-white hover:bg-main-primary/90"
                    >
                        {savingItem
                            ? (mode === "create" ? t("cms:blogForm.publishModal.creating") : t("cms:blogForm.publishModal.updating"))
                            : t("cms:blogForm.publishModal.confirm")}
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
    placeholder,
}: {
    tags: string[];
    onChange: (next: string[]) => void;
    placeholder: string;
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
                placeholder={tags.length === 0 ? placeholder : ""}
                className="flex-1 min-w-32 bg-transparent outline-none placeholder:text-main-silverSteel text-main-mirage"
            />
        </div>
    );
};
