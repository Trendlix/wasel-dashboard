import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
    PageShell,
    BilingualField,
    InputError,
    sectionCardClass,
    CmsFieldLabel,
} from "../about/_shared";
import { useCmsHomeStore } from "@/shared/hooks/store/useCmsHomeStore";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

const SCREEN_1_LINE_INDEXES = [0, 1, 2, 3, 4] as const;

const HeroPage = () => {
    const { t } = useTranslation("cms");
    const { hero, loading, savingPart, error, fieldErrors, fetchPart, savePart, setHero, setHeroScreen1Line } =
        useCmsHomeStore();

    useEffect(() => { fetchPart("hero"); }, [fetchPart]);

    const getErr = (locale: "en" | "ar", field: string) =>
        fieldErrors[`hero.${locale}.${field}`];

    return (
        <PageShell
            title={t("home.hero.pageTitle")}
            subtitle={t("home.hero.subtitle")}
            description={t("home.hero.description")}
            hint={t("home.hero.hint")}
            onSave={() => savePart("hero")}
            saving={savingPart === "hero"}
            loading={loading}
            error={error}
        >
            <div className="space-y-6">
                <div className={clsx(sectionCardClass, "space-y-4")}>
                    <CmsFieldLabel label={t("home.hero.screen1Label")} hint={t("home.hero.screen1Hint")} />
                    {SCREEN_1_LINE_INDEXES.map((i) => (
                        <BilingualField
                            key={i}
                            label={t("home.hero.lineLabel", { n: i + 1 })}
                            en={
                                <Input
                                    placeholder={t("home.hero.placeholderEn", { n: i + 1 })}
                                    value={hero.en.screen_1[i] ?? ""}
                                    onChange={(e) => setHeroScreen1Line("en", i, e.target.value)}
                                />
                            }
                            ar={
                                <Input
                                    placeholder={t("home.hero.placeholderAr", { n: i + 1 })}
                                    value={hero.ar.screen_1[i] ?? ""}
                                    onChange={(e) => setHeroScreen1Line("ar", i, e.target.value)}
                                />
                            }
                            enError={getErr("en", `screen_1.${i}`)}
                            arError={getErr("ar", `screen_1.${i}`)}
                        />
                    ))}
                    <InputError message={getErr("en", "screen_1") ?? getErr("ar", "screen_1")} />
                </div>

                {(["screen_2", "screen_3", "screen_4", "screen_5", "screen_6"] as const).map((key) => {
                    const screenLabel = t(`home.hero.screens.${key}`);
                    return (
                        <div key={key} className={clsx(sectionCardClass, "space-y-4")}>
                            <BilingualField
                                label={screenLabel}
                                en={
                                    <Input
                                        placeholder={t("home.hero.placeholderScreenEn", { screen: screenLabel })}
                                        value={hero.en[key]}
                                        onChange={(e) => setHero("en", { [key]: e.target.value })}
                                    />
                                }
                                ar={
                                    <Input
                                        placeholder={t("home.hero.placeholderScreenAr", { screen: screenLabel })}
                                        value={hero.ar[key]}
                                        onChange={(e) => setHero("ar", { [key]: e.target.value })}
                                    />
                                }
                                enError={getErr("en", key)}
                                arError={getErr("ar", key)}
                            />
                        </div>
                    );
                })}
            </div>
        </PageShell>
    );
};

export default HeroPage;
