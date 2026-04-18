import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/shared/components/common/FormItems";
import {
    BilingualField,
    InputError,
    PageShell,
    destructiveButtonClass,
    sectionCardClass,
    CmsFieldLabel,
} from "@/shared/components/pages/cms/outlet/about/_shared";
import { useCmsBlogsStore, type BlogInfoCard } from "@/shared/hooks/store/useCmsBlogsStore";
import { Trash2 } from "lucide-react";

type Localized<T> = { en: T; ar: T };

const createEmptyCard = (): BlogInfoCard => ({
    id: `card-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    tag: "",
    title: "",
    description: "",
    created_at: new Date().toISOString(),
    time_to_read: "",
});

type DraftInfo = Localized<{ title: string; description: string; cards: BlogInfoCard[] }>;

const CmsBlogsInfoPage = () => {
    const { info, loadingInfo, savingInfo, error, fetchInfo, saveInfo } = useCmsBlogsStore();
    const [draft, setDraft] = useState<DraftInfo>(info);
    const [localError, setLocalError] = useState<string | null>(null);

    useEffect(() => { fetchInfo(); }, [fetchInfo]);

    useEffect(() => { setDraft(info); }, [info]);

    const validate = () => {
        if (!draft.en.title.trim()) return "EN info title is required.";
        if (!draft.ar.title.trim()) return "AR info title is required.";
        if (!draft.en.description.trim()) return "EN info description is required.";
        if (!draft.ar.description.trim()) return "AR info description is required.";
        for (const [index, card] of draft.en.cards.entries()) {
            if (!card.title.trim()) return `Card #${index + 1} EN title is required.`;
            if (!draft.ar.cards[index]?.title.trim()) return `Card #${index + 1} AR title is required.`;
        }
        return null;
    };

    const onSave = async () => {
        const validationError = validate();
        setLocalError(validationError);
        if (validationError) return;
        await saveInfo(draft);
    };

    /** Add a card to both EN and AR simultaneously */
    const addCard = () => {
        const card = createEmptyCard();
        const arCard: BlogInfoCard = { ...card, id: card.id + "-ar" };
        setDraft((prev) => ({
            en: { ...prev.en, cards: [...prev.en.cards, card] },
            ar: { ...prev.ar, cards: [...prev.ar.cards, arCard] },
        }));
    };

    /** Remove card at index from both locales */
    const removeCard = (index: number) => {
        setDraft((prev) => ({
            en: { ...prev.en, cards: prev.en.cards.filter((_, i) => i !== index) },
            ar: { ...prev.ar, cards: prev.ar.cards.filter((_, i) => i !== index) },
        }));
    };

    /** Update a card field for a specific locale */
    const updateCard = (locale: "en" | "ar", index: number, patch: Partial<BlogInfoCard>) => {
        setDraft((prev) => ({
            ...prev,
            [locale]: {
                ...prev[locale],
                cards: prev[locale].cards.map((c, i) => (i === index ? { ...c, ...patch } : c)),
            },
        }));
    };

    return (
        <PageShell
            title="Blogs / Info"
            subtitle="Blogs Section"
            description="Landing copy above the article grid: bilingual section title, rich intro, and highlight cards."
            hint="Cards are paired by index—adding or removing syncs EN and AR. Shared fields apply to both locales."
            onSave={onSave}
            saving={savingInfo}
            loading={loadingInfo}
            error={error || localError}
        >
            <div className="space-y-4">
                {/* Section header */}
                <div className={sectionCardClass}>
                    <BilingualField
                        label="Section Title"
                        hint="H1-style heading for the blogs landing area."
                        en={
                            <Input
                                value={draft.en.title}
                                onChange={(e) => setDraft((prev) => ({ ...prev, en: { ...prev.en, title: e.target.value } }))}
                                placeholder="Blogs info title"
                            />
                        }
                        ar={
                            <Input
                                value={draft.ar.title}
                                onChange={(e) => setDraft((prev) => ({ ...prev, ar: { ...prev.ar, title: e.target.value } }))}
                                placeholder="عنوان قسم المدونة"
                            />
                        }
                    />

                    <div className="mt-5">
                        <BilingualField
                            label="Section Description"
                            hint="Rich intro under the title. Supports formatting and media like the blog editor."
                            en={
                                <RichTextEditor
                                    value={draft.en.description}
                                    onChange={(value) => setDraft((prev) => ({ ...prev, en: { ...prev.en, description: value } }))}
                                    placeholder="Blogs info description"
                                />
                            }
                            ar={
                                <RichTextEditor
                                    value={draft.ar.description}
                                    onChange={(value) => setDraft((prev) => ({ ...prev, ar: { ...prev.ar, description: value } }))}
                                    placeholder="وصف قسم المدونة"
                                />
                            }
                        />
                    </div>
                </div>

                {/* Cards — EN and AR are paired; add/remove is synchronized */}
                {draft.en.cards.map((_, index) => (
                    <div key={`info-card-${index}`} className={sectionCardClass}>
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-main-lightSlate">
                                Info Card #{index + 1}
                            </p>
                            <Button
                                type="button"
                                variant="outline"
                                className={destructiveButtonClass}
                                onClick={() => removeCard(index)}
                            >
                                <Trash2 size={14} />
                                Remove Card
                            </Button>
                        </div>

                        {/* Shared fields (tag, time_to_read) */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                                <CmsFieldLabel
                                    label="Tag (shared)"
                                    hint="Badge text on the card; stored once and mirrored to AR for layout parity."
                                />
                                <Input
                                    value={draft.en.cards[index]?.tag ?? ""}
                                    onChange={(e) => {
                                        updateCard("en", index, { tag: e.target.value });
                                        updateCard("ar", index, { tag: e.target.value });
                                    }}
                                    placeholder="Tag"
                                />
                            </div>
                            <div className="space-y-2">
                                <CmsFieldLabel
                                    label="Time To Read (shared)"
                                    hint="Display string such as “5 min read”. Not validated as minutes—purely cosmetic."
                                />
                                <Input
                                    value={draft.en.cards[index]?.time_to_read ?? ""}
                                    onChange={(e) => {
                                        updateCard("en", index, { time_to_read: e.target.value });
                                        updateCard("ar", index, { time_to_read: e.target.value });
                                    }}
                                    placeholder="5 min read"
                                />
                            </div>
                        </div>

                        {/* Bilingual text fields */}
                        <div className="space-y-4">
                            <BilingualField
                                label="Title"
                                hint="Card headline in each language."
                                en={
                                    <Input
                                        value={draft.en.cards[index]?.title ?? ""}
                                        onChange={(e) => updateCard("en", index, { title: e.target.value })}
                                        placeholder="Card title"
                                    />
                                }
                                ar={
                                    <Input
                                        value={draft.ar.cards[index]?.title ?? ""}
                                        onChange={(e) => updateCard("ar", index, { title: e.target.value })}
                                        placeholder="عنوان البطاقة"
                                    />
                                }
                            />

                            <BilingualField
                                label="Description"
                                hint="Short teaser body for the card. Plain textarea; keep under a few sentences."
                                en={
                                    <Textarea
                                        value={draft.en.cards[index]?.description ?? ""}
                                        onChange={(e) => updateCard("en", index, { description: e.target.value })}
                                        placeholder="Card description"
                                        rows={3}
                                    />
                                }
                                ar={
                                    <Textarea
                                        value={draft.ar.cards[index]?.description ?? ""}
                                        onChange={(e) => updateCard("ar", index, { description: e.target.value })}
                                        placeholder="وصف البطاقة"
                                        rows={3}
                                    />
                                }
                            />
                        </div>
                    </div>
                ))}

                <Button
                    type="button"
                    variant="outline"
                    className="border-main-primary/30 text-main-primary hover:bg-main-primary/10"
                    onClick={addCard}
                >
                    Add Info Card
                </Button>

                <InputError message={localError ?? undefined} />
            </div>
        </PageShell>
    );
};

export default CmsBlogsInfoPage;
