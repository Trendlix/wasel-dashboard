import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCmsBlogsStore, BlogInfoBanner } from "@/shared/hooks/store/useCmsBlogsStore";
import {
    BilingualField,
    CmsFieldLabel,
    destructiveButtonClass,
    fieldLabelClass,
    sectionCardClass,
    InputError,
} from "@/shared/components/pages/cms/outlet/about/_shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Save, AlertCircle } from "lucide-react";
import clsx from "clsx";

const BannerManagerPage = () => {
    const { t } = useTranslation("blogs");
    const { banner, bannerLoading, bannerSaving, fetchBanner, syncBanner } = useCmsBlogsStore();
    const [items, setItems] = useState<BlogInfoBanner[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchBanner();
    }, []);

    useEffect(() => {
        setItems(banner.en);
    }, [banner]);

    const handleAdd = () => {
        const newItem: BlogInfoBanner = {
            id: crypto.randomUUID(),
            tag_slug: "",
            slug: "",
            tag_en: "",
            tag_ar: "",
            title: "",
            description: "",
            created_at: new Date().toISOString(),
            time_to_read: "",
        };
        setItems([...items, newItem]);
        setError(null);
    };

    // Helper to generate tag_slug from tag_en
    const generateTagSlug = (tag: string): string => {
        return tag
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .substring(0, 50);
    };

    const handleDelete = (id: string) => {
        setItems(items.filter((item) => item.id !== id));
        if (editingId === id) {
            setEditingId(null);
        }
    };

    const handleUpdate = (id: string, field: keyof BlogInfoBanner, value: string) => {
        setItems(items.map((item) => {
            if (item.id !== id) return item;

            const updatedItem = { ...item, [field]: value };

            // Auto-generate tag_slug from tag_en if tag_en is being updated and tag_slug is empty or was auto-generated
            if (field === "tag_en" && value.trim()) {
                const currentTagSlug = item.tag_slug;
                const expectedTagSlug = generateTagSlug(value);
                // Only auto-update if tag_slug is empty or matches the old tag_en's expected tag_slug
                if (!currentTagSlug || currentTagSlug === generateTagSlug(item.tag_en)) {
                    updatedItem.tag_slug = expectedTagSlug;
                    updatedItem.slug = expectedTagSlug; // Keep legacy alias in sync
                }
            }

            // Keep slug alias in sync when tag_slug is manually edited
            if (field === "tag_slug") {
                updatedItem.slug = value;
            }

            return updatedItem;
        }));
        setError(null);
    };

    const handleSave = async () => {
        // Normalize items: ensure tag_slug is set (fallback to slug if needed)
        const normalizedItems = items.map(item => ({
            ...item,
            tag_slug: item.tag_slug?.trim() || item.slug?.trim() || "",
        }));

        // Validate: Each banner item must have a unique tag_slug
        const tagSlugs = normalizedItems.map(item => item.tag_slug.toLowerCase()).filter(ts => ts);
        const uniqueTagSlugs = new Set(tagSlugs);

        if (tagSlugs.length !== uniqueTagSlugs.size) {
            setError(t("banner.duplicateTagSlugError", "Each banner item must have a unique tag slug."));
            return;
        }

        // Validate: All items must have required fields
        for (const item of normalizedItems) {
            if (!item.tag_slug) {
                setError(t("banner.emptyTagSlugError", "Tag slug is required for all banner items."));
                return;
            }
            // At least one bilingual tag required
            if (!item.tag_en?.trim() && !item.tag_ar?.trim()) {
                setError(t("banner.emptyTagError", "At least one tag (EN or AR) is required for all banner items."));
                return;
            }
            if (!item.title?.trim()) {
                setError(t("banner.emptyTitleError", "Title is required for all banner items."));
                return;
            }
        }

        const success = await syncBanner(normalizedItems);
        if (success) {
            setEditingId(null);
            setError(null);
        }
    };

    return (
        <div className="w-full overflow-visible rounded-2xl border border-main-whiteMarble bg-main-white p-6 space-y-5 shadow-[0_12px_32px_rgba(17,24,39,0.04)]">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 overflow-visible">
                <div className="min-w-0 flex-1 space-y-1 overflow-visible">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-main-lightSlate">
                        {t("blogsInfoEditor.subtitle", "Blogs")}
                    </p>
                    <h2 className="text-xl font-bold text-main-mirage">
                        {t("banner.pageTitle", "Hero Banner")}
                    </h2>
                    <p className="mt-1 max-w-3xl text-sm text-main-coolGray">
                        {t("banner.pageDescription", "Manage featured banner items displayed in the hero section. Each item must have a unique tag.")}
                    </p>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

            {/* Add Button Header */}
            <div className="flex items-center justify-between">
                <p className={fieldLabelClass}>
                    {t("banner.itemsTitle", "Banner Items")} ({items.length})
                </p>
                <Button
                    type="button"
                    variant="outline"
                    className="h-9 border-main-primary/30 text-main-primary hover:bg-main-primary/10"
                    onClick={handleAdd}
                >
                    <Plus size={16} className="mr-1.5" />
                    {t("banner.add", "Add Banner")}
                </Button>
            </div>

            {bannerLoading ? (
                <div className="space-y-4 animate-pulse">
                    <div className="h-32 rounded-xl bg-main-titaniumWhite" />
                    <div className="h-32 rounded-xl bg-main-titaniumWhite" />
                </div>
            ) : (
                <div className="space-y-5">
                    {items.length === 0 ? (
                        <div className="text-center py-12 text-main-coolGray border-2 border-dashed border-main-whiteMarble rounded-xl bg-main-titaniumWhite/20">
                            {t("banner.emptyState", "No banner items yet. Click 'Add Banner' to create one.")}
                        </div>
                    ) : (
                        items.map((item, index) => (
                            <div key={item.id} className={clsx(sectionCardClass, "space-y-4")}>
                                {/* Card Header */}
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-main-lightSlate">
                                        {t("banner.cardLabel", "Banner Item #{{n}}", { n: index + 1 })}
                                    </p>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className={destructiveButtonClass}
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        <Trash2 size={14} />
                                        {t("banner.remove", "Remove")}
                                    </Button>
                                </div>

                                {/* Tag Slug */}
                                <div className="space-y-2">
                                    <CmsFieldLabel
                                        label={t("banner.tagSlug", "Tag Slug")}
                                        hint={t("banner.tagSlugHint", "Unique identifier used for tabs")}
                                    />
                                    <Input
                                        value={item.tag_slug}
                                        onChange={(e) => handleUpdate(item.id, "tag_slug", e.target.value)}
                                        placeholder={t("banner.tagSlugPlaceholder", "e.g., technology-news")}
                                    />
                                </div>

                                {/* Tags - Bilingual */}
                                <BilingualField
                                    label={t("banner.tagsLabel", "Display Tags")}
                                    hint={t("banner.tagsHint", "Shown in hero tab navigation")}
                                    en={
                                        <Input
                                            value={item.tag_en}
                                            onChange={(e) => handleUpdate(item.id, "tag_en", e.target.value)}
                                            placeholder={t("banner.tagEnPlaceholder", "e.g., Technology")}
                                        />
                                    }
                                    ar={
                                        <Input
                                            value={item.tag_ar}
                                            onChange={(e) => handleUpdate(item.id, "tag_ar", e.target.value)}
                                            placeholder={t("banner.tagArPlaceholder", "مثال: تكنولوجيا")}
                                        />
                                    }
                                />

                                {/* Title */}
                                <div className="space-y-2">
                                    <CmsFieldLabel
                                        label={t("banner.title", "Title")}
                                        hint={t("banner.titleHint", "Banner headline")}
                                    />
                                    <Input
                                        value={item.title}
                                        onChange={(e) => handleUpdate(item.id, "title", e.target.value)}
                                        placeholder={t("banner.titlePlaceholder", "Enter banner title")}
                                    />
                                </div>

                                {/* Time to Read & Created At */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <CmsFieldLabel
                                            label={t("banner.timeToRead", "Time to Read")}
                                            hint={t("banner.timeToReadHint", "e.g., 5 min read")}
                                        />
                                        <Input
                                            value={item.time_to_read}
                                            onChange={(e) => handleUpdate(item.id, "time_to_read", e.target.value)}
                                            placeholder={t("banner.timePlaceholder", "e.g., 5 min read")}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <CmsFieldLabel label={t("banner.createdAt", "Created At")} />
                                        <Input
                                            type="date"
                                            value={item.created_at ? item.created_at.split("T")[0] : ""}
                                            onChange={(e) => handleUpdate(item.id, "created_at", new Date(e.target.value).toISOString())}
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <CmsFieldLabel
                                        label={t("banner.description", "Description")}
                                        hint={t("banner.descriptionHint", "Short banner description")}
                                    />
                                    <Textarea
                                        value={item.description}
                                        onChange={(e) => handleUpdate(item.id, "description", e.target.value)}
                                        placeholder={t("banner.descriptionPlaceholder", "Enter banner description...")}
                                        rows={3}
                                    />
                                </div>
                            </div>
                        ))
                    )}

                    {/* Save Button */}
                    {items.length > 0 && (
                        <div className="flex justify-end pt-2">
                            <Button
                                type="button"
                                onClick={handleSave}
                                disabled={bannerSaving}
                                className="bg-main-primary hover:bg-main-primary/90 text-main-white"
                            >
                                {bannerSaving ? (
                                    <>
                                        <span className="animate-spin mr-2">⏳</span>
                                        {t("common.saving", "Saving...")}
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} className="mr-2" />
                                        {t("common.save", "Save Changes")}
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BannerManagerPage;
