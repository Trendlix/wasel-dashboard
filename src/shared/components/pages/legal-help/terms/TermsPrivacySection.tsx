import { useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import useLegalHelpStore, {
    type IContentPoint,
    type ISection,
} from "@/shared/hooks/store/useLegalHelpStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const labelClass = "text-xs font-semibold uppercase tracking-[0.12em] text-main-lightSlate";

const normalizeSection = (s: ISection): ISection => ({
    introduction: {
        title: s.introduction.title.trim(),
        description: s.introduction.description.trim(),
    },
    points: s.points.map((p, i) => ({
        title: p.title.trim(),
        description: p.description.trim(),
        sort_order: i,
    })),
});

const SectionEditor = ({
    heading,
    section,
    onChange,
}: {
    heading: string;
    section: ISection;
    onChange: (s: ISection) => void;
}) => {
    const setIntro = (field: "title" | "description", value: string) => {
        onChange({
            ...section,
            introduction: { ...section.introduction, [field]: value },
        });
    };

    const setPoint = (index: number, field: keyof IContentPoint, value: string | number) => {
        const points = section.points.map((p, i) =>
            i === index ? { ...p, [field]: value } : p,
        );
        onChange({ ...section, points });
    };

    const addPoint = () => {
        onChange({
            ...section,
            points: [
                ...section.points,
                { title: "", description: "", sort_order: section.points.length },
            ],
        });
    };

    const removePoint = (index: number) => {
        onChange({
            ...section,
            points: section.points.filter((_, i) => i !== index),
        });
    };

    return (
        <div className="rounded-2xl border border-main-whiteMarble bg-main-luxuryWhite/30 p-5 space-y-5">
            <h3 className="text-main-mirage font-bold text-lg">{heading}</h3>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <p className={labelClass}>Introduction title</p>
                    <Input
                        className="mt-1.5"
                        value={section.introduction.title}
                        onChange={(e) => setIntro("title", e.target.value)}
                    />
                </div>
                <div className="md:col-span-2">
                    <p className={labelClass}>Introduction description</p>
                    <Textarea
                        className="mt-1.5 min-h-[80px]"
                        value={section.introduction.description}
                        onChange={(e) => setIntro("description", e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <p className={labelClass}>Content points</p>
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="font-bold border-main-whiteMarble"
                        onClick={addPoint}
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Add point
                    </Button>
                </div>
                {section.points.length === 0 && (
                    <p className="text-main-sharkGray text-sm">No points yet — optional.</p>
                )}
                {section.points.map((pt, idx) => (
                    <div
                        key={idx}
                        className="rounded-xl border border-main-whiteMarble bg-main-white p-4 space-y-3"
                    >
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-main-sharkGray">
                                Point {idx + 1}
                            </span>
                            <button
                                type="button"
                                className="text-main-remove p-1"
                                onClick={() => removePoint(idx)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        <Input
                            placeholder="Title"
                            value={pt.title}
                            onChange={(e) => setPoint(idx, "title", e.target.value)}
                        />
                        <Textarea
                            placeholder="Description"
                            className="min-h-[72px]"
                            value={pt.description}
                            onChange={(e) => setPoint(idx, "description", e.target.value)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

const TermsPrivacySection = () => {
    const {
        termsDoc,
        termsDraft,
        termsLoading,
        termsSaving,
        error,
        clearError,
        fetchTerms,
        setTermsDraft,
        createTerms,
        updateTerms,
    } = useLegalHelpStore();

    useEffect(() => {
        fetchTerms();
    }, [fetchTerms]);

    useEffect(() => {
        if (!termsLoading && !termsDoc && termsDraft === null) {
            setTermsDraft({
                terms: {
                    introduction: { title: "", description: "" },
                    points: [],
                },
                privacy: {
                    introduction: { title: "", description: "" },
                    points: [],
                },
            });
        }
    }, [termsLoading, termsDoc, termsDraft, setTermsDraft]);

    const draft = termsDraft;

    const updateTermsPart = (key: "terms" | "privacy", s: ISection) => {
        if (!draft) return;
        setTermsDraft({ ...draft, [key]: s });
    };

    const handleSave = async () => {
        if (!draft) return;
        const terms = normalizeSection(draft.terms);
        const privacy = normalizeSection(draft.privacy);
        const payload = { terms, privacy_and_policy: privacy };
        if (termsDoc) {
            await updateTerms(payload);
        } else {
            await createTerms(payload);
        }
    };

    if (termsLoading && !draft) {
        return (
            <div className="p-10 flex justify-center text-main-sharkGray text-sm">Loading…</div>
        );
    }

    if (!draft) {
        return null;
    }

    return (
        <div className="space-y-6 p-6">
            {error && (
                <div className="flex items-center justify-between gap-3 rounded-lg bg-main-remove/10 px-3 py-2 text-sm text-main-remove">
                    <span>{error}</span>
                    <button type="button" className="font-bold underline" onClick={clearError}>
                        Dismiss
                    </button>
                </div>
            )}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-main-mirage font-bold text-xl">Terms & privacy</h2>
                    <p className="text-main-sharkGray text-sm mt-1">
                        JSON document consumed by user and driver apps (introduction + bullet
                        points).
                    </p>
                    {termsDoc && (
                        <p className="text-main-sharkGray text-xs mt-2">
                            Last updated: {new Date(termsDoc.updated_at).toLocaleString()}
                        </p>
                    )}
                </div>
                <Button
                    type="button"
                    className="bg-main-primary text-main-white font-bold hover:bg-main-primary/90 shrink-0"
                    disabled={termsSaving}
                    onClick={() => void handleSave()}
                >
                    {termsSaving ? "Saving…" : termsDoc ? "Save changes" : "Create document"}
                </Button>
            </div>

            <SectionEditor
                heading="Terms & conditions"
                section={draft.terms}
                onChange={(s) => updateTermsPart("terms", s)}
            />
            <SectionEditor
                heading="Privacy & policy"
                section={draft.privacy}
                onChange={(s) => updateTermsPart("privacy", s)}
            />
        </div>
    );
};

export default TermsPrivacySection;
