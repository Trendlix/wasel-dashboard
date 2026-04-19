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
import { useTranslation } from "react-i18next";

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
    const { t } = useTranslation("cms");
    const { info, loadingInfo, savingInfo, error, fetchInfo, saveInfo } = useCmsBlogsStore();
    const [draft, setDraft] = useState<DraftInfo>(info);
    const [localError, setLocalError] = useState<string | null>(null);

    useEffect(() => { fetchInfo(); }, [fetchInfo]);

    useEffect(() => { setDraft(info); }, [info]);

    const validate = () => {
        if (!draft.en.title.trim()) return t("blogsInfoEditor.validationEnTitle");
        if (!draft.ar.title.trim()) return t("blogsInfoEditor.validationArTitle");
        if (!draft.en.description.trim()) return t("blogsInfoEditor.validationEnDescription");
        if (!draft.ar.description.trim()) return t("blogsInfoEditor.validationArDescription");
        for (const [index, card] of draft.en.cards.entries()) {
            if (!card.title.trim()) return t("blogsInfoEditor.validationCardEnTitle", { n: index + 1 });
            if (!draft.ar.cards[index]?.title.trim()) return t("blogsInfoEditor.validationCardArTitle", { n: index + 1 });
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
            title={t("blogsInfoEditor.pageTitle")}
            subtitle={t("blogsInfoEditor.subtitle")}
            description={t("blogsInfoEditor.description")}
            hint={t("blogsInfoEditor.hint")}
            onSave={onSave}
            saving={savingInfo}
            loading={loadingInfo}
            error={error || localError}
        >
            <div className="space-y-4">
                {/* Section header */}
                <div className={sectionCardClass}>
                    <BilingualField
                        label={t("blogsInfoEditor.sectionTitle")}
                        hint={t("blogsInfoEditor.sectionTitleHint")}
                        en={
                            <Input
                                value={draft.en.title}
                                onChange={(e) => setDraft((prev) => ({ ...prev, en: { ...prev.en, title: e.target.value } }))}
                                placeholder={t("blogsInfoEditor.sectionTitlePlaceholderEn")}
                            />
                        }
                        ar={
                            <Input
                                value={draft.ar.title}
                                onChange={(e) => setDraft((prev) => ({ ...prev, ar: { ...prev.ar, title: e.target.value } }))}
                                placeholder={t("blogsInfoEditor.sectionTitlePlaceholderAr")}
                            />
                        }
                    />

                    <div className="mt-5">
                        <BilingualField
                            label={t("blogsInfoEditor.sectionDescription")}
                            hint={t("blogsInfoEditor.sectionDescriptionHint")}
                            en={
                                <RichTextEditor
                                    value={draft.en.description}
                                    onChange={(value) => setDraft((prev) => ({ ...prev, en: { ...prev.en, description: value } }))}
                                    placeholder={t("blogsInfoEditor.sectionDescriptionPlaceholderEn")}
                                />
                            }
                            ar={
                                <RichTextEditor
                                    value={draft.ar.description}
                                    onChange={(value) => setDraft((prev) => ({ ...prev, ar: { ...prev.ar, description: value } }))}
                                    placeholder={t("blogsInfoEditor.sectionDescriptionPlaceholderAr")}
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
                                {t("blogsInfoEditor.card", { n: index + 1 })}
                            </p>
                            <Button
                                type="button"
                                variant="outline"
                                className={destructiveButtonClass}
                                onClick={() => removeCard(index)}
                            >
                                <Trash2 size={14} />
                                {t("blogsInfoEditor.removeCard")}
                            </Button>
                        </div>

                        {/* Shared fields (tag, time_to_read) */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                                <CmsFieldLabel
                                    label={t("blogsInfoEditor.tagShared")}
                                    hint={t("blogsInfoEditor.tagSharedHint")}
                                />
                                <Input
                                    value={draft.en.cards[index]?.tag ?? ""}
                                    onChange={(e) => {
                                        updateCard("en", index, { tag: e.target.value });
                                        updateCard("ar", index, { tag: e.target.value });
                                    }}
                                    placeholder={t("blogsInfoEditor.tagPlaceholder")}
                                />
                            </div>
                            <div className="space-y-2">
                                <CmsFieldLabel
                                    label={t("blogsInfoEditor.timeToReadShared")}
                                    hint={t("blogsInfoEditor.timeToReadSharedHint")}
                                />
                                <Input
                                    value={draft.en.cards[index]?.time_to_read ?? ""}
                                    onChange={(e) => {
                                        updateCard("en", index, { time_to_read: e.target.value });
                                        updateCard("ar", index, { time_to_read: e.target.value });
                                    }}
                                    placeholder={t("blogsInfoEditor.timeToReadPlaceholder")}
                                />
                            </div>
                        </div>

                        {/* Bilingual text fields */}
                        <div className="space-y-4">
                            <BilingualField
                                label={t("blogsInfoEditor.title")}
                                hint={t("blogsInfoEditor.titleHint")}
                                en={
                                    <Input
                                        value={draft.en.cards[index]?.title ?? ""}
                                        onChange={(e) => updateCard("en", index, { title: e.target.value })}
                                        placeholder={t("blogsInfoEditor.cardTitlePlaceholderEn")}
                                    />
                                }
                                ar={
                                    <Input
                                        value={draft.ar.cards[index]?.title ?? ""}
                                        onChange={(e) => updateCard("ar", index, { title: e.target.value })}
                                        placeholder={t("blogsInfoEditor.cardTitlePlaceholderAr")}
                                    />
                                }
                            />

                            <BilingualField
                                label={t("blogsInfoEditor.descriptionLabel")}
                                hint={t("blogsInfoEditor.descriptionHint")}
                                en={
                                    <Textarea
                                        value={draft.en.cards[index]?.description ?? ""}
                                        onChange={(e) => updateCard("en", index, { description: e.target.value })}
                                        placeholder={t("blogsInfoEditor.cardDescriptionPlaceholderEn")}
                                        rows={3}
                                    />
                                }
                                ar={
                                    <Textarea
                                        value={draft.ar.cards[index]?.description ?? ""}
                                        onChange={(e) => updateCard("ar", index, { description: e.target.value })}
                                        placeholder={t("blogsInfoEditor.cardDescriptionPlaceholderAr")}
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
                    {t("blogsInfoEditor.addCard")}
                </Button>

                <InputError message={localError ?? undefined} />
            </div>
        </PageShell>
    );
};

export default CmsBlogsInfoPage;
