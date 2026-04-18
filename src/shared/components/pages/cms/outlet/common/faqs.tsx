import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import clsx from "clsx";
import { Trash2 } from "lucide-react";
import useCmsCommonStore from "@/shared/hooks/store/useCmsCommonStore";
import {
    BilingualField,
    InputError,
    destructiveButtonClass,
    sectionCardClass,
} from "../about/_shared";
import CmsHelpHint from "../../cms-help-hint";

const FaqsPage = () => {
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
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-main-lightSlate">Common Layout</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold text-main-mirage">Common / FAQs Section</h3>
                        <CmsHelpHint text="Compact FAQ list embedded in shared layouts (not the full Marketing FAQ page)." />
                    </div>
                    <p className="mt-1 max-w-3xl text-sm text-main-coolGray">
                        Section heading plus paired Q&amp;A rows in English and Arabic.
                    </p>
                </div>
                <Button
                    type="button"
                    onClick={() => savePart("faqs")}
                    disabled={savingPart === "faqs" || loading}
                    className="bg-main-primary hover:bg-main-primary/90 text-main-white min-w-[140px]"
                >
                    {savingPart === "faqs" ? "Saving..." : "Save Section"}
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
                            label="FAQs Title"
                            hint="Heading above the FAQ accordion on pages that include this block."
                            en={
                                <Input
                                    placeholder="FAQs section title"
                                    value={common.en.faqs.title}
                                    onChange={(e) => setFaqs("en", { title: e.target.value })}
                                />
                            }
                            ar={
                                <Input
                                    dir="rtl"
                                    placeholder="عنوان قسم الأسئلة"
                                    value={common.ar.faqs.title}
                                    onChange={(e) => setFaqs("ar", { title: e.target.value })}
                                />
                            }
                            enError={getEnError("title")}
                            arError={getArError("title")}
                        />

                        <BilingualField
                            label="FAQs Description"
                            hint="Optional intro sentence under the title. Plain text; keep it short."
                            en={
                                <Textarea
                                    placeholder="FAQs section description"
                                    value={common.en.faqs.description}
                                    onChange={(e) => setFaqs("en", { description: e.target.value })}
                                    rows={3}
                                />
                            }
                            ar={
                                <Textarea
                                    dir="rtl"
                                    placeholder="وصف قسم الأسئلة"
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
                                        FAQ #{index + 1}
                                    </p>
                                    <Button
                                        variant="outline"
                                        type="button"
                                        onClick={() => removeFaqItem(index)}
                                        className={destructiveButtonClass}
                                    >
                                        <Trash2 size={14} />
                                        Remove
                                    </Button>
                                </div>

                                <BilingualField
                                    label="Question"
                                    hint="Visible question label. Should match meaning in both languages."
                                    en={
                                        <Input
                                            placeholder="Question"
                                            value={common.en.faqs.items[index]?.question ?? ""}
                                            onChange={(e) => updateFaqItem("en", index, { question: e.target.value })}
                                        />
                                    }
                                    ar={
                                        <Input
                                            dir="rtl"
                                            placeholder="السؤال"
                                            value={common.ar.faqs.items[index]?.question ?? ""}
                                            onChange={(e) => updateFaqItem("ar", index, { question: e.target.value })}
                                        />
                                    }
                                    enError={getEnError(`items.${index}.question`)}
                                    arError={getArError(`items.${index}.question`)}
                                />

                                <BilingualField
                                    label="Answer"
                                    hint="Plain text answer body. For rich layouts use the Marketing FAQ CMS instead."
                                    en={
                                        <Textarea
                                            placeholder="Answer"
                                            value={common.en.faqs.items[index]?.answer ?? ""}
                                            onChange={(e) => updateFaqItem("en", index, { answer: e.target.value })}
                                            rows={3}
                                        />
                                    }
                                    ar={
                                        <Textarea
                                            dir="rtl"
                                            placeholder="الإجابة"
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
                        Add FAQ Item
                    </Button>

                    <InputError message={getEnError("items") ?? getArError("items")} />
                </div>
            )}
        </div>
    );
};

export default FaqsPage;
