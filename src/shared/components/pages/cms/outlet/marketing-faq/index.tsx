import MarketingFaqLayout from "./layout";

export default MarketingFaqLayout;
import { useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    CreatableTagCombobox,
    RichTextEditor,
} from "@/shared/components/common/FormItems";
import useCmsMarketingFaqStore, {
    type MarketingFaqLocale,
} from "@/shared/hooks/store/useCmsMarketingFaqStore";
import { Plus, Trash2 } from "lucide-react";

const labelClass =
    "text-xs font-semibold uppercase tracking-[0.12em] text-main-lightSlate";

const LocaleBlock = ({
    title,
    loc,
    onSetTitle,
    onRemoveTitle,
    onAddTitle,
    onDescriptionChange,
}: {
    title: string;
    loc: MarketingFaqLocale;
    onSetTitle: (index: number, value: string) => void;
    onRemoveTitle: (index: number) => void;
    onAddTitle: () => void;
    onDescriptionChange: (value: string) => void;
}) => (
    <div className="rounded-2xl border border-main-whiteMarble bg-main-luxuryWhite/40 p-5 space-y-4">
        <h4 className="font-bold text-main-mirage">{title}</h4>
        <div>
            <p className={labelClass}>Hero titles (min 2 lines)</p>
            <div className="mt-2 space-y-2">
                {loc.titles.map((line, idx) => (
                    <div key={idx} className="flex gap-2">
                        <Input
                            value={line}
                            onChange={(e) => onSetTitle(idx, e.target.value)}
                            placeholder={`Line ${idx + 1}`}
                        />
                        {loc.titles.length > 2 && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-main-remove shrink-0"
                                onClick={() => onRemoveTitle(idx)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                ))}
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="font-bold border-main-whiteMarble"
                    onClick={onAddTitle}
                >
                    <Plus className="w-4 h-4 mr-1" />
                    Add title line
                </Button>
            </div>
        </div>
        <div>
            <p className={labelClass}>Intro description</p>
            <Textarea
                className="mt-1.5 min-h-[80px]"
                value={loc.description}
                onChange={(e) => onDescriptionChange(e.target.value)}
            />
        </div>
    </div>
);

const MarketingFaqEditor = () => {
    const {
        draft,
        loading,
        saving,
        error,
        clearError,
        fetchMarketingFaq,
        addTitleLine,
        removeTitleLine,
        setTitleLine,
        addGroup,
        removeGroup,
        setGroupField,
        setGroupCategory,
        addItem,
        removeItem,
        setItem,
        uploadRichTextMedia,
        save,
        setDraft,
    } = useCmsMarketingFaqStore();

    const initialEmptyHandled = useRef(false);

    useEffect(() => {
        void fetchMarketingFaq();
    }, [fetchMarketingFaq]);

    useEffect(() => {
        if (loading) {
            initialEmptyHandled.current = false;
            return;
        }
        if (
            !initialEmptyHandled.current &&
            draft.en.items.length === 0 &&
            draft.ar.items.length === 0
        ) {
            initialEmptyHandled.current = true;
            addGroup();
        }
    }, [loading, draft.en.items.length, draft.ar.items.length, addGroup]);

    const categoryOptions = useMemo(() => {
        const values = [
            ...draft.en.items.map((g) => g.category.trim()),
            ...draft.ar.items.map((g) => g.category.trim()),
        ].filter(Boolean);
        return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
    }, [draft.en.items, draft.ar.items]);

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h2 className="text-xl font-bold text-main-mirage">Marketing FAQ (/faqs)</h2>
                    <p className="text-sm text-main-sharkGray mt-1">
                        Public site FAQ for application users and drivers: hero copy, category
                        groups, and rich-text answers.
                    </p>
                </div>
                <Button
                    type="button"
                    className="bg-main-primary text-main-white font-bold shrink-0"
                    disabled={saving}
                    onClick={() => void save()}
                >
                    {saving ? "Saving…" : "Save"}
                </Button>
            </div>

            {error && (
                <div className="flex items-center justify-between gap-3 rounded-lg bg-main-remove/10 px-3 py-2 text-sm text-main-remove">
                    <span>{error}</span>
                    <button type="button" className="font-bold underline" onClick={clearError}>
                        Dismiss
                    </button>
                </div>
            )}

            {loading ? (
                <p className="text-main-sharkGray text-sm py-8">Loading…</p>
            ) : (
                <>
                    <div className="grid gap-6 lg:grid-cols-2">
                        <LocaleBlock
                            title="English"
                            loc={draft.en}
                            onSetTitle={(idx, value) => setTitleLine("en", idx, value)}
                            onRemoveTitle={(idx) => removeTitleLine("en", idx)}
                            onAddTitle={() => addTitleLine("en")}
                            onDescriptionChange={(value) =>
                                setDraft({ en: { ...draft.en, description: value } })
                            }
                        />
                        <LocaleBlock
                            title="Arabic"
                            loc={draft.ar}
                            onSetTitle={(idx, value) => setTitleLine("ar", idx, value)}
                            onRemoveTitle={(idx) => removeTitleLine("ar", idx)}
                            onAddTitle={() => addTitleLine("ar")}
                            onDescriptionChange={(value) =>
                                setDraft({ ar: { ...draft.ar, description: value } })
                            }
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-main-mirage">FAQ groups</h3>
                            <Button
                                type="button"
                                variant="outline"
                                className="font-bold border-main-whiteMarble"
                                onClick={() => addGroup()}
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Add group
                            </Button>
                        </div>

                        {draft.en.items.map((enGroup, gi) => {
                            const arGroup = draft.ar.items[gi] ?? enGroup;
                            return (
                                <div
                                    key={`${enGroup.categoryKey}-${gi}`}
                                    className="rounded-2xl border border-main-whiteMarble bg-main-white p-5 space-y-4"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div className="grid gap-3 sm:grid-cols-2 flex-1">
                                            <div>
                                                <p className={labelClass}>Category key (slug)</p>
                                                <Input
                                                    className="mt-1"
                                                    value={enGroup.categoryKey}
                                                    onChange={(e) =>
                                                        setGroupField(gi, "categoryKey", e.target.value)
                                                    }
                                                    placeholder="e.g. account-and-security"
                                                />
                                            </div>
                                            <div>
                                                <p className={labelClass}>Audience</p>
                                                <Select
                                                    value={enGroup.audience ?? "all"}
                                                    onValueChange={(v) =>
                                                        setGroupField(
                                                            gi,
                                                            "audience",
                                                            v as "all" | "user" | "driver",
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger className="mt-1">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">All</SelectItem>
                                                        <SelectItem value="user">User</SelectItem>
                                                        <SelectItem value="driver">Driver</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="text-main-remove"
                                            onClick={() => removeGroup(gi)}
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" />
                                            Remove group
                                        </Button>
                                    </div>

                                    <div className="grid gap-4 lg:grid-cols-2">
                                        <div>
                                            <p className={labelClass}>Category (EN)</p>
                                            <div className="mt-1">
                                                <CreatableTagCombobox
                                                    value={enGroup.category}
                                                    onChange={(next) => setGroupCategory(gi, "en", next)}
                                                    options={categoryOptions}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <p className={labelClass}>Category (AR)</p>
                                            <div className="mt-1" dir="rtl">
                                                <CreatableTagCombobox
                                                    value={arGroup.category}
                                                    onChange={(next) => setGroupCategory(gi, "ar", next)}
                                                    options={categoryOptions}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {(["en", "ar"] as const).map((lng) => (
                                        <div
                                            key={lng}
                                            className="rounded-xl border border-main-whiteMarble/80 bg-main-luxuryWhite/30 p-4 space-y-3"
                                        >
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-bold text-main-mirage">
                                                    Items ({lng.toUpperCase()})
                                                </p>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    className="font-bold"
                                                    onClick={() => addItem(gi, lng)}
                                                >
                                                    <Plus className="w-3 h-3 mr-1" />
                                                    Add item
                                                </Button>
                                            </div>
                                            {(lng === "en" ? enGroup : arGroup).items.map(
                                                (item, itemIndex) => (
                                                    <div
                                                        key={itemIndex}
                                                        className="rounded-lg border border-main-whiteMarble bg-main-white p-3 space-y-3"
                                                    >
                                                        <div className="flex justify-end">
                                                            <button
                                                                type="button"
                                                                className="text-main-remove text-xs font-bold"
                                                                onClick={() =>
                                                                    removeItem(gi, lng, itemIndex)
                                                                }
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                        <Input
                                                            placeholder="Question"
                                                            value={item.question}
                                                            onChange={(e) =>
                                                                setItem(
                                                                    gi,
                                                                    lng,
                                                                    itemIndex,
                                                                    "question",
                                                                    e.target.value,
                                                                )
                                                            }
                                                            dir={lng === "ar" ? "rtl" : "ltr"}
                                                        />
                                                        <RichTextEditor
                                                            label="Answer"
                                                            value={item.answer}
                                                            onChange={(value) =>
                                                                setItem(
                                                                    gi,
                                                                    lng,
                                                                    itemIndex,
                                                                    "answer",
                                                                    value,
                                                                )
                                                            }
                                                            onUploadFile={uploadRichTextMedia}
                                                        />
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export { MarketingFaqEditor };
