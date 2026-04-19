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

const CARD_TITLE_KEYS = [
    { key: "card_1_title" as const, n: 1 },
    { key: "card_2_title" as const, n: 2 },
    { key: "card_3_title" as const, n: 3 },
];

const PlatformPage = () => {
    const { t } = useTranslation("cms");
    const { platform, loading, savingPart, error, fieldErrors, fetchPart, savePart, setPlatform, setPlatformCard4 } =
        useCmsHomeStore();

    useEffect(() => { fetchPart("platform"); }, [fetchPart]);

    const getErr = (locale: "en" | "ar", field: string) =>
        fieldErrors[`platform.${locale}.${field}`];

    return (
        <PageShell
            title={t("home.platform.pageTitle")}
            subtitle={t("home.platform.subtitle")}
            description={t("home.platform.description")}
            onSave={() => savePart("platform")}
            saving={savingPart === "platform"}
            loading={loading}
            error={error}
        >
            <div className="space-y-5">
                <div className={clsx(sectionCardClass, "space-y-4")}>
                    <CmsFieldLabel label={t("home.platformFields.sectionTitle")} />
                    <BilingualField
                        label={t("home.platformFields.title")}
                        en={
                            <Input
                                placeholder={t("home.platformFields.placeholderEn")}
                                value={platform.en.title}
                                onChange={(e) => setPlatform("en", { title: e.target.value })}
                            />
                        }
                        ar={
                            <Input
                                placeholder={t("home.platformFields.placeholderAr")}
                                value={platform.ar.title}
                                onChange={(e) => setPlatform("ar", { title: e.target.value })}
                            />
                        }
                        enError={getErr("en", "title")}
                        arError={getErr("ar", "title")}
                    />
                </div>

                <div className={clsx(sectionCardClass, "space-y-4")}>
                    <CmsFieldLabel label={t("home.platformFields.cardTitlesGroup")} hint={t("home.platformFields.cardTitlesHint")} />
                    {CARD_TITLE_KEYS.map(({ key, n }) => {
                        const cardLabel = t("home.cardTitle", { n });
                        return (
                            <BilingualField
                                key={key}
                                label={cardLabel}
                                en={
                                    <Input
                                        placeholder={t("home.platformFields.placeholderCardTitleEn", { label: cardLabel })}
                                        value={platform.en[key]}
                                        onChange={(e) => setPlatform("en", { [key]: e.target.value })}
                                    />
                                }
                                ar={
                                    <Input
                                        placeholder={t("home.platformFields.placeholderCardTitleAr", { label: cardLabel })}
                                        value={platform.ar[key]}
                                        onChange={(e) => setPlatform("ar", { [key]: e.target.value })}
                                    />
                                }
                                enError={getErr("en", key)}
                                arError={getErr("ar", key)}
                            />
                        );
                    })}
                </div>

                <div className={clsx(sectionCardClass, "space-y-4")}>
                    <CmsFieldLabel label={t("home.platformFields.card4Group")} hint={t("home.platformFields.card4Hint")} />
                    <BilingualField
                        label={t("home.platformFields.card4Title")}
                        en={
                            <Input
                                placeholder={t("home.platformFields.placeholderEn")}
                                value={platform.en.card_4.title}
                                onChange={(e) => setPlatformCard4("en", { title: e.target.value })}
                            />
                        }
                        ar={
                            <Input
                                placeholder={t("home.platformFields.placeholderAr")}
                                value={platform.ar.card_4.title}
                                onChange={(e) => setPlatformCard4("ar", { title: e.target.value })}
                            />
                        }
                        enError={getErr("en", "card_4.title")}
                        arError={getErr("ar", "card_4.title")}
                    />
                    <BilingualField
                        label={t("home.platformFields.card4Description")}
                        en={
                            <Textarea
                                rows={4}
                                placeholder={t("home.platformFields.placeholderEn")}
                                value={platform.en.card_4.description}
                                onChange={(e) => setPlatformCard4("en", { description: e.target.value })}
                            />
                        }
                        ar={
                            <Textarea
                                rows={4}
                                placeholder={t("home.platformFields.placeholderAr")}
                                value={platform.ar.card_4.description}
                                onChange={(e) => setPlatformCard4("ar", { description: e.target.value })}
                            />
                        }
                        enError={getErr("en", "card_4.description")}
                        arError={getErr("ar", "card_4.description")}
                    />
                </div>
            </div>
        </PageShell>
    );
};

export default PlatformPage;
