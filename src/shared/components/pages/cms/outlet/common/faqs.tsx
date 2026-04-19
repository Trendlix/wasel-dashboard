import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import clsx from "clsx";
import { Trash2 } from "lucide-react";
import useCmsCommonStore from "@/shared/hooks/store/useCmsCommonStore";
import { useTranslation } from "react-i18next";
import {
    BilingualField,
    InputError,
    destructiveButtonClass,
    sectionCardClass,
} from "../about/_shared";
import CmsHelpHint from "../../cms-help-hint";

const FaqsPage = () => {
    const { t } = useTranslation("cms");
    const {
        common,
        loading,
        error,
        savingPart,
        fetchPart,
        setFaqs,
        addFaqItem,
        updateFaqItem,
        removeFaqItem,
        savePart,
        fieldErrors,
    } = useCmsCommonStore();

    useEffect(() => {
        fetchPart("faqs");
    }, [fetchPart]);

    const getEnError = (path: string) => fieldErrors[`faqs.en.${path}`];
    const getArError = (path: string) => fieldErrors[`faqs.ar.${path}`];

    return (
        <div className="rounded-2xl border border-main-whiteMarble bg-main-white p-6 space-y-5 shadow-[0_16px_40px_rgba(17,24,39,0.04)]">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-main-lightSlate">{t("commonEditor.layout")}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold text-main-mirage">{t("commonEditor.faqs.title")}</h3>
                        <CmsHelpHint text={t("commonEditor.faqs.hint")} />
                    </div>
                    <p className="mt-1 max-w-3xl text-sm text-main-coolGray">
                        {t("commonEditor.faqs.description")}
                    </p>
                </div>
                <Button
                    type="button"
                    onClick={() => savePart("faqs")}
                    disabled={savingPart === "faqs" || loading}
                    className="bg-main-primary hover:bg-main-primary/90 text-main-white min-w-[140px]"
                >
                    {savingPart === "faqs" ? t("commonEditor.saving") : t("commonEditor.saveSection")}
                </Button>
            </div>

            {error && <div className="text-sm text-main-remove bg-main-remove/10 rounded-lg px-3 py-2">{error}</div>}

            {loading ? (
                <div className="space-y-4 animate-pulse">
                    <div className="h-5 bg-main-titaniumWhite rounded-md w-40" />
                    <div className="h-48 bg-main-titaniumWhite rounded-xl" />
                </div>
            ) : (
                <div className="space-y-4">
                    <div className={clsx(sectionCardClass, "space-y-5")}>
                        <BilingualField
                            label={t("commonEditor.faqs.faqsTitle")}
                            hint={t("commonEditor.faqs.faqsTitleHint")}
                            en={
                                <Input
                                    placeholder={t("commonEditor.faqs.faqsTitlePlaceholderEn")}
                                    value={common.en.faqs.title}
                                    onChange={(e) => setFaqs("en", { title: e.target.value })}
                                />
                            }
                            ar={
                                <Input
                                    dir="rtl"
                                    placeholder={t("commonEditor.faqs.faqsTitlePlaceholderAr")}
                                    value={common.ar.faqs.title}
                                    onChange={(e) => setFaqs("ar", { title: e.target.value })}
                                />
                            }
                            enError={getEnError("title")}
                            arError={getArError("title")}
                        />

                        <BilingualField
                            label={t("commonEditor.faqs.faqsDescription")}
                            hint={t("commonEditor.faqs.faqsDescriptionHint")}
                            en={
                                <Textarea
                                    placeholder={t("commonEditor.faqs.faqsDescriptionPlaceholderEn")}
                                    value={common.en.faqs.description}
                                    onChange={(e) => setFaqs("en", { description: e.target.value })}
                                    rows={3}
                                />
                            }
                            ar={
                                <Textarea
                                    dir="rtl"
                                    placeholder={t("commonEditor.faqs.faqsDescriptionPlaceholderAr")}
                                    value={common.ar.faqs.description}
                                    onChange={(e) => setFaqs("ar", { description: e.target.value })}
                                    rows={3}
                                />
                            }
                            enError={getEnError("description")}
                            arError={getArError("description")}
                        />
                    </div>

                    {/* FAQ rows: list length follows EN; AR slots are padded to match so AR fields stay editable */}
                    <div className="space-y-3">
                        {common.en.faqs.items.map((_item: unknown, index: number) => (
                            <div key={`faq-pair-${index}`} className={clsx(sectionCardClass, "space-y-4")}>
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-main-lightSlate">
                                        {t("commonEditor.faqs.faq", { n: index + 1 })}
                                    </p>
                                    <Button
                                        variant="outline"
                                        type="button"
                                        onClick={() => removeFaqItem(index)}
                                        className={destructiveButtonClass}
                                    >
                                        <Trash2 size={14} />
                                        {t("commonEditor.faqs.remove")}
                                    </Button>
                                </div>

                                <BilingualField
                                    label={t("commonEditor.faqs.question")}
                                    hint={t("commonEditor.faqs.questionHint")}
                                    en={
                                        <Input
                                            placeholder={t("commonEditor.faqs.questionPlaceholderEn")}
                                            value={common.en.faqs.items[index]?.question ?? ""}
                                            onChange={(e) => updateFaqItem("en", index, { question: e.target.value })}
                                        />
                                    }
                                    ar={
                                        <Input
                                            dir="rtl"
                                            placeholder={t("commonEditor.faqs.questionPlaceholderAr")}
                                            value={common.ar.faqs.items[index]?.question ?? ""}
                                            onChange={(e) => updateFaqItem("ar", index, { question: e.target.value })}
                                        />
                                    }
                                    enError={getEnError(`items.${index}.question`)}
                                    arError={getArError(`items.${index}.question`)}
                                />

                                <BilingualField
                                    label={t("commonEditor.faqs.answer")}
                                    hint={t("commonEditor.faqs.answerHint")}
                                    en={
                                        <Textarea
                                            placeholder={t("commonEditor.faqs.answerPlaceholderEn")}
                                            value={common.en.faqs.items[index]?.answer ?? ""}
                                            onChange={(e) => updateFaqItem("en", index, { answer: e.target.value })}
                                            rows={3}
                                        />
                                    }
                                    ar={
                                        <Textarea
                                            dir="rtl"
                                            placeholder={t("commonEditor.faqs.answerPlaceholderAr")}
                                            value={common.ar.faqs.items[index]?.answer ?? ""}
                                            onChange={(e) => updateFaqItem("ar", index, { answer: e.target.value })}
                                            rows={3}
                                        />
                                    }
                                    enError={getEnError(`items.${index}.answer`)}
                                    arError={getArError(`items.${index}.answer`)}
                                />
                            </div>
                        ))}
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={addFaqItem}
                        className="h-10 border-main-primary/30 text-main-primary hover:bg-main-primary/10"
                    >
                        {t("commonEditor.faqs.addItem")}
                    </Button>

                    <InputError message={getEnError("items") ?? getArError("items")} />
                </div>
            )}
        </div>
    );
};

export default FaqsPage;
