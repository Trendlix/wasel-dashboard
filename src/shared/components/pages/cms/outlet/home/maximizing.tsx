import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    PageShell,
    BilingualField,
    sectionCardClass,
    CmsFieldLabel,
} from "../about/_shared";
import { useCmsHomeStore } from "@/shared/hooks/store/useCmsHomeStore";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

const CARDS = [
    { key: "card_1" as const, n: 1 },
    { key: "card_2" as const, n: 2 },
    { key: "card_3" as const, n: 3 },
];

const MaximizingPage = () => {
    const { t } = useTranslation("cms");
    const { maximizing, loading, savingPart, error, fieldErrors, fetchPart, savePart, setMaximizing, setMaximizingCard } =
        useCmsHomeStore();

    useEffect(() => { fetchPart("maximizing"); }, [fetchPart]);

    const getErr = (locale: "en" | "ar", field: string) =>
        fieldErrors[`maximizing.${locale}.${field}`];

    return (
        <PageShell
            title={t("home.maximizing.pageTitle")}
            subtitle={t("home.maximizing.subtitle")}
            description={t("home.maximizing.description")}
            onSave={() => savePart("maximizing")}
            saving={savingPart === "maximizing"}
            loading={loading}
            error={error}
        >
            <div className="space-y-5">
                <div className={clsx(sectionCardClass, "space-y-4")}>
                    <CmsFieldLabel label={t("home.maximizingFields.sectionHeader")} />
                    <BilingualField
                        label={t("home.maximizingFields.sectionTitle")}
                        en={
                            <Input
                                placeholder={t("home.maximizingFields.placeholderSectionTitleEn")}
                                value={maximizing.en.title}
                                onChange={(e) => setMaximizing("en", { title: e.target.value })}
                            />
                        }
                        ar={
                            <Input
                                placeholder={t("home.maximizingFields.placeholderSectionTitleAr")}
                                value={maximizing.ar.title}
                                onChange={(e) => setMaximizing("ar", { title: e.target.value })}
                            />
                        }
                        enError={getErr("en", "title")}
                        arError={getErr("ar", "title")}
                    />
                    <BilingualField
                        label={t("home.maximizingFields.sectionDescription")}
                        en={
                            <Textarea
                                rows={4}
                                placeholder={t("home.maximizingFields.placeholderSectionDescEn")}
                                value={maximizing.en.description}
                                onChange={(e) => setMaximizing("en", { description: e.target.value })}
                            />
                        }
                        ar={
                            <Textarea
                                rows={4}
                                placeholder={t("home.maximizingFields.placeholderSectionDescAr")}
                                value={maximizing.ar.description}
                                onChange={(e) => setMaximizing("ar", { description: e.target.value })}
                            />
                        }
                        enError={getErr("en", "description")}
                        arError={getErr("ar", "description")}
                    />
                </div>

                {CARDS.map(({ key, n }) => (
                    <div key={key} className={clsx(sectionCardClass, "space-y-4")}>
                        <CmsFieldLabel label={t("home.maximizingFields.benefitCard", { n })} />
                        <BilingualField
                            label={t("home.maximizingFields.cardTitle")}
                            en={
                                <Input
                                    placeholder={t("home.maximizingFields.placeholderCardTitleEn", { n })}
                                    value={maximizing.en.cards[key].title}
                                    onChange={(e) => setMaximizingCard("en", key, { title: e.target.value })}
                                />
                            }
                            ar={
                                <Input
                                    placeholder={t("home.maximizingFields.placeholderCardTitleAr", { n })}
                                    value={maximizing.ar.cards[key].title}
                                    onChange={(e) => setMaximizingCard("ar", key, { title: e.target.value })}
                                />
                            }
                            enError={getErr("en", `cards.${key}.title`)}
                            arError={getErr("ar", `cards.${key}.title`)}
                        />
                        <BilingualField
                            label={t("home.maximizingFields.cardDescription")}
                            en={
                                <Textarea
                                    rows={4}
                                    placeholder={t("home.maximizingFields.placeholderCardDescEn", { n })}
                                    value={maximizing.en.cards[key].description}
                                    onChange={(e) => setMaximizingCard("en", key, { description: e.target.value })}
                                />
                            }
                            ar={
                                <Textarea
                                    rows={4}
                                    placeholder={t("home.maximizingFields.placeholderCardDescAr", { n })}
                                    value={maximizing.ar.cards[key].description}
                                    onChange={(e) => setMaximizingCard("ar", key, { description: e.target.value })}
                                />
                            }
                            enError={getErr("en", `cards.${key}.description`)}
                            arError={getErr("ar", `cards.${key}.description`)}
                        />
                    </div>
                ))}
            </div>
        </PageShell>
    );
};

export default MaximizingPage;
