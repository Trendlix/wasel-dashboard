import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    CommonModal,
    CommonModalBody,
    CommonModalFooter,
    CommonModalHeader,
} from "@/shared/components/common/CommonModal";
import { RichTextEditor } from "@/shared/components/common/FormItems";
import useCmsMarketingFaqStore from "@/shared/hooks/store/useCmsMarketingFaqStore";
import { formInputClass, formSelectTriggerClass } from "@/shared/components/common/formStyles";
import SectionCard from "./SectionCard";
import Field from "./Field";
import NoDataFound from "@/shared/components/common/NoDataFound";
import { BilingualField } from "../about/_shared";

type CategoryModalTab = "add" | "all";
type CategoryAudienceFilter = "all" | "user" | "driver";

const MarketingFaqItemsPage = () => {
    const {
        draft,
        saving,
        categorySaving,
        addPairedItem,
        removePairedItem,
        setPairedItem,
        uploadRichTextMedia,
        saveCategoryItems,
        createCategory,
        deleteCategory,
    } = useCmsMarketingFaqStore();

    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [categoryModalTab, setCategoryModalTab] = useState<CategoryModalTab>("add");
    const [pendingDeleteCategory, setPendingDeleteCategory] = useState<{
        key: string;
        name: string;
    } | null>(null);

    const [newCategoryEn, setNewCategoryEn] = useState("");
    const [newCategoryAr, setNewCategoryAr] = useState("");
    const [newCategoryAudience, setNewCategoryAudience] = useState<"all" | "user" | "driver">("all");
    const [categoryAudienceFilter, setCategoryAudienceFilter] = useState<CategoryAudienceFilter>("all");
    const [addFaqAudienceFilter, setAddFaqAudienceFilter] = useState<CategoryAudienceFilter>("all");
    const [addFaqCategoryKey, setAddFaqCategoryKey] = useState("");

    const categories = useMemo(
        () =>
            draft.en.items.map((enGroup, index) => {
                const arGroup = draft.ar.items[index];
                const key = enGroup.categoryKey || `category-${index + 1}`;
                return {
                    index,
                    key,
                    enName: enGroup.category.trim(),
                    arName: arGroup?.category?.trim() ?? "",
                    audience: enGroup.audience ?? "all",
                    itemsCount: Math.max(enGroup.items.length, arGroup?.items.length ?? 0),
                };
            }),
        [draft.en.items, draft.ar.items],
    );

    const filteredCategories = useMemo(
        () =>
            categories.filter((category) =>
                categoryAudienceFilter === "all" ? true : category.audience === categoryAudienceFilter,
            ),
        [categories, categoryAudienceFilter],
    );

    const addFaqFilteredCategories = useMemo(
        () =>
            categories.filter((category) =>
                addFaqAudienceFilter === "all" ? true : category.audience === addFaqAudienceFilter,
            ),
        [categories, addFaqAudienceFilter],
    );

    // Derive the effective selected key: keep user's choice if still valid, else fall back to first
    const effectiveCategoryKey = useMemo(() => {
        if (addFaqFilteredCategories.length === 0) return "";
        const stillValid = addFaqFilteredCategories.some((c) => c.key === addFaqCategoryKey);
        return stillValid ? addFaqCategoryKey : addFaqFilteredCategories[0].key;
    }, [addFaqCategoryKey, addFaqFilteredCategories]);

    const selectedCategoryIndex = useMemo(() => {
        if (!effectiveCategoryKey) return null;
        const selected = categories.find((category) => category.key === effectiveCategoryKey);
        return typeof selected?.index === "number" ? selected.index : null;
    }, [effectiveCategoryKey, categories]);

    const resetNewCategoryForm = () => {
        setNewCategoryEn("");
        setNewCategoryAr("");
        setNewCategoryAudience("all");
    };

    const handleCreateCategory = async () => {
        const en = newCategoryEn.trim();
        const ar = newCategoryAr.trim();
        if (!en || !ar) return;

        const created = await createCategory(en, ar, newCategoryAudience);
        if (!created) return;

        resetNewCategoryForm();
        setCategoryModalTab("all");
    };

    const handleConfirmDeleteCategory = async () => {
        if (!pendingDeleteCategory) return;

        const deleted = await deleteCategory(pendingDeleteCategory.key);
        if (!deleted) return;
        setPendingDeleteCategory(null);
    };

    const handleSaveFaqs = async () => {
        if (!effectiveCategoryKey) return;
        await saveCategoryItems(effectiveCategoryKey);
    };

    const handleAddFaqItemToSelectedCategory = () => {
        if (!effectiveCategoryKey) return;
        const category = categories.find((item) => item.key === effectiveCategoryKey);
        if (!category) return;
        addPairedItem(category.index);
    };

    return (
        <div className="space-y-5">
            <SectionCard
                title="Categories and questions"
                description="Every category, question, and answer must exist in English and Arabic."
                hint="Category key is generated automatically from English category name to link EN/AR groups."
                actions={
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="border-main-whiteMarble font-semibold text-main-sharkGray"
                            onClick={() => setIsCategoryModalOpen(true)}
                        >
                            <Plus className="mr-1 h-4 w-4" />
                            Categories
                        </Button>
                        <Button
                            type="button"
                            className="bg-main-primary text-main-white"
                            onClick={() => void handleSaveFaqs()}
                            disabled={saving || !effectiveCategoryKey}
                        >
                            {saving ? "Saving..." : "Save FAQs"}
                        </Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <div className="rounded-xl border border-main-whiteMarble bg-main-white p-4">
                        <p className="mb-3 text-sm font-semibold text-main-mirage">Add FAQ item to category</p>
                        <div className="grid gap-3 lg:grid-cols-[220px_1fr_auto]">
                            <Field
                                label="Audience filter"
                                hint="Filter categories by audience first."
                            >
                                <Select
                                    value={addFaqAudienceFilter}
                                    onValueChange={(value) => {
                                        setAddFaqAudienceFilter(value as CategoryAudienceFilter);
                                        setAddFaqCategoryKey("");
                                    }}
                                >
                                    <SelectTrigger className={`${formSelectTriggerClass} h-10 min-h-10`}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All audiences</SelectItem>
                                        <SelectItem value="user">Users only</SelectItem>
                                        <SelectItem value="driver">Drivers only</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field
                                label="Category"
                                hint="Choose the category to append a new bilingual FAQ item."
                                required
                            >
                                <Select
                                    value={effectiveCategoryKey}
                                    onValueChange={setAddFaqCategoryKey}
                                >
                                    <SelectTrigger className={`${formSelectTriggerClass} h-10 min-h-10`}>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {addFaqFilteredCategories.map((category) => (
                                            <SelectItem key={category.key} value={category.key}>
                                                {(category.enName || "Untitled")} /{" "}
                                                {category.arName || "بدون اسم"}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>

                            <div className="flex items-end">
                                <Button
                                    type="button"
                                    className="h-10 bg-main-primary px-6 text-main-white"
                                    disabled={!effectiveCategoryKey}
                                    onClick={handleAddFaqItemToSelectedCategory}
                                >
                                    <Plus className="mr-1 h-4 w-4" />
                                    Add item
                                </Button>
                            </div>
                        </div>
                        {addFaqFilteredCategories.length === 0 ? (
                            <p className="mt-2 text-xs text-main-coolGray">
                                No categories available for this audience filter. Change filter to{" "}
                                <span className="font-semibold text-main-mirage">All audiences</span> or add a new
                                category.
                            </p>
                        ) : null}
                    </div>

                    {selectedCategoryIndex === null ? (
                        <div className="rounded-xl border border-dashed border-main-whiteMarble bg-main-white px-4 py-8 text-center">
                            <NoDataFound
                                title="Select a category first"
                                description="Choose a category from the selector above to display and edit its FAQ items."
                            />
                        </div>
                    ) : (
                        draft.en.items.map((enGroup, groupIndex) => {
                            if (groupIndex !== selectedCategoryIndex) return null;
                        const arGroup = draft.ar.items[groupIndex] ?? enGroup;
                        const maxItems = Math.max(enGroup.items.length, arGroup.items.length);

                        return (
                            <div
                                key={`${enGroup.categoryKey || "group"}-${groupIndex}`}
                                className="space-y-4 rounded-xl border border-main-whiteMarble bg-main-titaniumWhite/30 p-4"
                            >
                                <div className="flex items-center justify-between rounded-xl border border-main-whiteMarble bg-main-white px-4 py-3">
                                    <div>
                                        <p className="text-sm font-bold text-main-mirage">
                                            {enGroup.category || "Untitled category"} /{" "}
                                            {arGroup.category || "بدون اسم"}
                                        </p>
                                        <p className="text-xs text-main-coolGray">
                                            Audience: {enGroup.audience ?? "all"}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {Array.from({ length: maxItems }).map((_, itemIndex) => {
                                        const enItem = enGroup.items[itemIndex] ?? {
                                            question: "",
                                            answer: "",
                                        };
                                        const arItem = arGroup.items[itemIndex] ?? {
                                            question: "",
                                            answer: "",
                                        };

                                        return (
                                            <div
                                                key={`${groupIndex}-${itemIndex}`}
                                                className="space-y-3 rounded-xl border border-main-whiteMarble bg-main-white p-4"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-bold text-main-mirage">
                                                        FAQ item #{itemIndex + 1}
                                                    </p>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        className="h-8 px-2 text-main-remove"
                                                        onClick={() =>
                                                            removePairedItem(groupIndex, itemIndex)
                                                        }
                                                    >
                                                        <Trash2 className="mr-1 h-4 w-4" />
                                                        Remove
                                                    </Button>
                                                </div>

                                                <BilingualField
                                                    label="Question"
                                                    required
                                                    en={
                                                        <Input
                                                            className={formInputClass}
                                                            value={enItem.question}
                                                            onChange={(e) =>
                                                                setPairedItem(
                                                                    groupIndex,
                                                                    itemIndex,
                                                                    "en",
                                                                    "question",
                                                                    e.target.value,
                                                                )
                                                            }
                                                            placeholder="English question"
                                                        />
                                                    }
                                                    ar={
                                                        <Input
                                                            className={formInputClass}
                                                            value={arItem.question}
                                                            onChange={(e) =>
                                                                setPairedItem(
                                                                    groupIndex,
                                                                    itemIndex,
                                                                    "ar",
                                                                    "question",
                                                                    e.target.value,
                                                                )
                                                            }
                                                            placeholder="السؤال بالعربية"
                                                        />
                                                    }
                                                />

                                                <BilingualField
                                                    label="Answer"
                                                    hint="Rich text supports formatting and media uploads."
                                                    required
                                                    en={
                                                        <RichTextEditor
                                                            value={enItem.answer}
                                                            onChange={(value) =>
                                                                setPairedItem(
                                                                    groupIndex,
                                                                    itemIndex,
                                                                    "en",
                                                                    "answer",
                                                                    value,
                                                                )
                                                            }
                                                            onUploadFile={uploadRichTextMedia}
                                                        />
                                                    }
                                                    ar={
                                                        <RichTextEditor
                                                            value={arItem.answer}
                                                            onChange={(value) =>
                                                                setPairedItem(
                                                                    groupIndex,
                                                                    itemIndex,
                                                                    "ar",
                                                                    "answer",
                                                                    value,
                                                                )
                                                            }
                                                            onUploadFile={uploadRichTextMedia}
                                                        />
                                                    }
                                                />
                                            </div>
                                        );
                                    })}
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-main-whiteMarble font-semibold text-main-sharkGray"
                                    onClick={() => addPairedItem(groupIndex)}
                                >
                                    <Plus className="mr-1 h-4 w-4" />
                                    Add FAQ item
                                </Button>
                            </div>
                        );
                    }))}
                </div>
            </SectionCard>

            <CommonModal
                open={isCategoryModalOpen}
                onOpenChange={setIsCategoryModalOpen}
                maxWidth="sm:max-w-[1120px]"
            >
                <CommonModalHeader
                    title="Manage categories"
                    description="Create categories in Arabic and English, or view and delete existing categories."
                    className="border-b border-main-whiteMarble bg-main-titaniumWhite/35"
                />

                <CommonModalBody className="max-h-[70vh]! space-y-5 mt-5">
                    <div className="inline-flex items-center gap-1 rounded-xl border border-main-whiteMarble bg-main-titaniumWhite/55 p-1.5">
                        <button
                            type="button"
                            className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${categoryModalTab === "add"
                                    ? "bg-main-primary text-main-white shadow-[0_8px_18px_rgba(0,0,0,0.12)]"
                                    : "text-main-sharkGray hover:bg-main-white"
                                }`}
                            onClick={() => setCategoryModalTab("add")}
                        >
                            Add category
                        </button>
                        <button
                            type="button"
                            className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${categoryModalTab === "all"
                                    ? "bg-main-primary text-main-white shadow-[0_8px_18px_rgba(0,0,0,0.12)]"
                                    : "text-main-sharkGray hover:bg-main-white"
                                }`}
                            onClick={() => setCategoryModalTab("all")}
                        >
                            All categories
                        </button>
                    </div>

                    {categoryModalTab === "add" ? (
                        <div className="rounded-2xl border border-main-whiteMarble bg-main-titaniumWhite/30 p-5">
                            <div className="mb-4 rounded-xl border border-main-whiteMarble bg-main-white px-4 py-3">
                                <p className="text-sm font-semibold text-main-mirage">New category details</p>
                                <p className="text-xs text-main-coolGray">
                                    Fill both language names. Category key is generated automatically from English.
                                </p>
                            </div>

                            <BilingualField
                                label="Category name"
                                hint="Category key is generated automatically from the English name."
                                required
                                en={
                                    <Input
                                        className={formInputClass}
                                        value={newCategoryEn}
                                        onChange={(e) => setNewCategoryEn(e.target.value)}
                                        placeholder="e.g. Account and security"
                                    />
                                }
                                ar={
                                    <Input
                                        className={formInputClass}
                                        value={newCategoryAr}
                                        onChange={(e) => setNewCategoryAr(e.target.value)}
                                        placeholder="مثال: الحساب والأمان"
                                    />
                                }
                            />

                            <div className="mt-4 grid gap-4 lg:grid-cols-[260px_1fr]">
                                <Field
                                    label="Audience"
                                    hint="Who sees this category on /faqs."
                                    required
                                >
                                    <Select
                                        value={newCategoryAudience}
                                        onValueChange={(value) =>
                                            setNewCategoryAudience(value as "all" | "user" | "driver")
                                        }
                                    >
                                        <SelectTrigger className={formSelectTriggerClass}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            <SelectItem value="user">User</SelectItem>
                                            <SelectItem value="driver">Driver</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>

                                <div className="rounded-xl border border-main-whiteMarble bg-main-white px-4 py-3">
                                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-main-lightSlate">
                                        What will happen
                                    </p>
                                    <p className="mt-1 text-sm text-main-coolGray">
                                        After adding, the category appears in the list tab and you can start
                                        adding FAQ items under it immediately.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-main-whiteMarble bg-main-titaniumWhite/30 p-5">
                            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-main-whiteMarble bg-main-white px-4 py-3">
                                <div>
                                    <p className="text-sm font-semibold text-main-mirage">
                                        Existing categories
                                    </p>
                                    <p className="text-xs text-main-coolGray">
                                        Deleting a category will delete all FAQ items inside it.
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <Select
                                        value={categoryAudienceFilter}
                                        onValueChange={(value) =>
                                            setCategoryAudienceFilter(value as CategoryAudienceFilter)
                                        }
                                    >
                                        <SelectTrigger className={`${formSelectTriggerClass} h-9 min-h-9 w-[170px]`}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All audiences</SelectItem>
                                            <SelectItem value="user">Users only</SelectItem>
                                            <SelectItem value="driver">Drivers only</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <span className="rounded-full border border-main-whiteMarble bg-main-titaniumWhite px-3 py-1 text-xs font-semibold text-main-sharkGray">
                                        {filteredCategories.length} shown
                                    </span>
                                </div>
                            </div>

                            <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
                                {filteredCategories.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-main-whiteMarble bg-main-white px-4 py-8 text-center">
                                        <NoDataFound
                                            title="No categories found"
                                            description="We couldn't find categories for the selected audience."
                                        />
                                    </div>
                                ) : (
                                    filteredCategories.map((category) => (
                                        <div
                                            key={category.key}
                                            className="flex items-center justify-between rounded-xl border border-main-whiteMarble bg-main-white px-4 py-3"
                                        >
                                            <div className="space-y-1">
                                                <p className="font-semibold text-main-mirage">
                                                    {category.enName || "Untitled"} /{" "}
                                                    {category.arName || "بدون اسم"}
                                                </p>
                                                <div className="flex flex-wrap items-center gap-2 text-xs text-main-coolGray">
                                                    <span className="rounded-full bg-main-titaniumWhite px-2 py-0.5">
                                                        Audience: {category.audience}
                                                    </span>
                                                    <span className="rounded-full bg-main-titaniumWhite px-2 py-0.5">
                                                        {category.itemsCount} FAQ item(s)
                                                    </span>
                                                </div>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                className="text-main-remove"
                                                onClick={() =>
                                                    setPendingDeleteCategory({
                                                        key: category.key,
                                                        name:
                                                            category.enName ||
                                                            category.arName ||
                                                            "this category",
                                                    })
                                                }
                                            >
                                                <Trash2 className="mr-1 h-4 w-4" />
                                                Delete
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </CommonModalBody>

                <CommonModalFooter>
                    <Button
                        type="button"
                        variant="ghost"
                        className="h-11 common-rounded px-6 text-main-sharkGray hover:bg-main-titaniumWhite hover:text-main-mirage"
                        onClick={() => setIsCategoryModalOpen(false)}
                    >
                        Close
                    </Button>
                    {categoryModalTab === "add" ? (
                        <Button
                            type="button"
                            className="h-11 common-rounded bg-main-primary px-8 font-bold text-main-white shadow-lg shadow-main-primary/20"
                            onClick={() => void handleCreateCategory()}
                            disabled={categorySaving || !newCategoryEn.trim() || !newCategoryAr.trim()}
                        >
                            Add category
                        </Button>
                    ) : null}
                </CommonModalFooter>
            </CommonModal>

            <CommonModal
                open={Boolean(pendingDeleteCategory)}
                onOpenChange={(open) => !open && setPendingDeleteCategory(null)}
                maxWidth="sm:max-w-[520px]"
            >
                <CommonModalHeader
                    title="Delete category?"
                    description={
                        <>
                            Deleting <strong>{pendingDeleteCategory?.name}</strong> will cascade delete all FAQ
                            items inside this category in both English and Arabic.
                        </>
                    }
                />
                <CommonModalFooter>
                    <Button
                        type="button"
                        variant="ghost"
                        className="h-11 common-rounded px-6 text-main-sharkGray hover:bg-main-titaniumWhite hover:text-main-mirage"
                        onClick={() => setPendingDeleteCategory(null)}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        className="h-11 common-rounded bg-main-remove px-8 font-bold text-main-white hover:bg-main-remove/90"
                        onClick={() => void handleConfirmDeleteCategory()}
                        disabled={categorySaving}
                    >
                        Yes, delete category
                    </Button>
                </CommonModalFooter>
            </CommonModal>
        </div>
    );
};

export default MarketingFaqItemsPage;
