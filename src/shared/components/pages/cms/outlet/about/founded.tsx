import { useEffect } from "react";
import clsx from "clsx";
import useCmsAboutStore from "@/shared/hooks/store/useCmsAboutStore";
import {
    PageShell,
    BilingualStringArrayEditor,
    SectionVisibilityToggle,
    sectionCardClass,
    CmsFieldLabel,
} from "./_shared";

const AboutFoundedPage = () => {
    const {
        founded,
        loading,
        savingPart,
        error,
        fieldErrors,
        fetchPart,
        setFounded,
        savePart,
    } = useCmsAboutStore();

    useEffect(() => { fetchPart("founded"); }, [fetchPart]);

    const getEnError = (path: string) => fieldErrors[`founded.en.${path}`];
    const getArError = (path: string) => fieldErrors[`founded.ar.${path}`];

    return (
        <PageShell
            title="About / Founded"
            subtitle="About Section"
            description="Company origin story: title lines and supporting copy in English and Arabic."
            hint="Hide removes the whole section from the live site. Titles and descriptions are independent lists per language."
            onSave={() => savePart("founded")}
            saving={savingPart === "founded"}
            loading={loading}
            error={error}
        >
            <div className={clsx(sectionCardClass, "space-y-4")}>
                <div className="space-y-2">
                    <CmsFieldLabel
                        label="Section visibility"
                        hint="When hidden, the Founded block is omitted on the public About page for every locale."
                    />
                    <SectionVisibilityToggle
                        checked={founded.en.hide}
                        onCheckedChange={(checked) => {
                            setFounded("en", { hide: checked });
                            setFounded("ar", { hide: checked });
                        }}
                    />
                </div>

                <BilingualStringArrayEditor
                    label="Founded Titles"
                    hint="Short lines that introduce how the company started. Order matches the visual stack on the site."
                    enValues={founded.en.titles}
                    arValues={founded.ar.titles}
                    placeholder="Founded title"
                    onEnChange={(titles) => setFounded("en", { titles })}
                    onArChange={(titles) => setFounded("ar", { titles })}
                    enTopError={getEnError("titles")}
                    arTopError={getArError("titles")}
                    enItemErrorAt={(i) => getEnError(`titles.${i}`)}
                    arItemErrorAt={(i) => getArError(`titles.${i}`)}
                />

                <BilingualStringArrayEditor
                    label="Founded Descriptions"
                    hint="Longer paragraphs paired with the titles. Use multiline rows for each paragraph block."
                    enValues={founded.en.descriptions}
                    arValues={founded.ar.descriptions}
                    placeholder="Founded description"
                    multiline
                    onEnChange={(descriptions) => setFounded("en", { descriptions })}
                    onArChange={(descriptions) => setFounded("ar", { descriptions })}
                    enTopError={getEnError("descriptions")}
                    arTopError={getArError("descriptions")}
                    enItemErrorAt={(i) => getEnError(`descriptions.${i}`)}
                    arItemErrorAt={(i) => getArError(`descriptions.${i}`)}
                />
            </div>
        </PageShell>
    );
};

export default AboutFoundedPage;
