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

const TransportPage = () => {
    const { t } = useTranslation("cms");
    const { transport, loading, savingPart, error, fieldErrors, fetchPart, savePart, setTransportCard } =
        useCmsHomeStore();

    useEffect(() => { fetchPart("transport"); }, [fetchPart]);

    const getErr = (locale: "en" | "ar", card: string, field: string) =>
        fieldErrors[`transport.${locale}.${card}.${field}`];

    return (
        <PageShell
            title={t("home.transport.pageTitle")}
            subtitle={t("home.transport.subtitle")}
            description={t("home.transport.description")}
            onSave={() => savePart("transport")}
            saving={savingPart === "transport"}
            loading={loading}
            error={error}
        >
            <div className="space-y-5">
                {CARDS.map(({ key, n }) => {
                    const cardHeading = t("home.transportFields.cardTitle", { n });
                    return (
                        <div key={key} className={clsx(sectionCardClass, "space-y-4")}>
                            <CmsFieldLabel label={cardHeading} />
                            <BilingualField
                                label={t("home.transportFields.fieldTitle")}
                                en={
                                    <Input
                                        placeholder={t("home.transportFields.placeholderTitleEn", { n })}
                                        value={transport.en[key].title}
                                        onChange={(e) => setTransportCard("en", key, { title: e.target.value })}
                                    />
                                }
                                ar={
                                    <Input
                                        placeholder={t("home.transportFields.placeholderTitleAr", { n })}
                                        value={transport.ar[key].title}
                                        onChange={(e) => setTransportCard("ar", key, { title: e.target.value })}
                                    />
                                }
                                enError={getErr("en", key, "title")}
                                arError={getErr("ar", key, "title")}
                            />
                            <BilingualField
                                label={t("home.transportFields.description")}
                                en={
                                    <Textarea
                                        rows={4}
                                        placeholder={t("home.transportFields.placeholderDescEn", { n })}
                                        value={transport.en[key].description}
                                        onChange={(e) => setTransportCard("en", key, { description: e.target.value })}
                                    />
                                }
                                ar={
                                    <Textarea
                                        rows={4}
                                        placeholder={t("home.transportFields.placeholderDescAr", { n })}
                                        value={transport.ar[key].description}
                                        onChange={(e) => setTransportCard("ar", key, { description: e.target.value })}
                                    />
                                }
                                enError={getErr("en", key, "description")}
                                arError={getErr("ar", key, "description")}
                            />
                        </div>
                    );
                })}
            </div>
        </PageShell>
    );
};

export default TransportPage;
