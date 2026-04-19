import { useEffect } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import useCmsAboutStore from "@/shared/hooks/store/useCmsAboutStore";
import {
    PageShell,
    BilingualStringArrayEditor,
    SectionVisibilityToggle,
    sectionCardClass,
    CmsFieldLabel,
} from "./_shared";

const AboutFoundedPage = () => {
    const { t } = useTranslation("cms");
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
            title={t("aboutEditor.founded.pageTitle")}
            subtitle={t("aboutEditor.founded.subtitle")}
            description={t("aboutEditor.founded.description")}
            hint={t("aboutEditor.founded.hint")}
            onSave={() => savePart("founded")}
            saving={savingPart === "founded"}
            loading={loading}
            error={error}
        >
            <div className={clsx(sectionCardClass, "space-y-4")}>
                <div className="space-y-2">
                    <CmsFieldLabel
                            label={t("aboutEditor.founded.visibility")}
                            hint={t("aboutEditor.founded.visibilityHint")}
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
                    label={t("aboutEditor.founded.titles")}
                    hint={t("aboutEditor.founded.titlesHint")}
                    enValues={founded.en.titles}
                    arValues={founded.ar.titles}
                    placeholder={t("aboutEditor.founded.titlePlaceholder")}
                    onEnChange={(titles) => setFounded("en", { titles })}
                    onArChange={(titles) => setFounded("ar", { titles })}
                    enTopError={getEnError("titles")}
                    arTopError={getArError("titles")}
                    enItemErrorAt={(i) => getEnError(`titles.${i}`)}
                    arItemErrorAt={(i) => getArError(`titles.${i}`)}
                />

                <BilingualStringArrayEditor
                    label={t("aboutEditor.founded.descriptions")}
                    hint={t("aboutEditor.founded.descriptionsHint")}
                    enValues={founded.en.descriptions}
                    arValues={founded.ar.descriptions}
                    placeholder={t("aboutEditor.founded.descriptionPlaceholder")}
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
