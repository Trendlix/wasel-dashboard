import { useTranslation } from "react-i18next";
import PageTransition from "@/shared/components/common/PageTransition";
import Tabs from "@/shared/components/pages/cms/layout/tabs";
import { Outlet } from "react-router-dom";

const CmsPage = () => {
    const { t } = useTranslation("cms");
    return (
        <PageTransition>
            <div className="space-y-5">
                <div className="rounded-2xl border border-main-whiteMarble bg-gradient-to-r from-main-white to-main-titaniumWhite/60 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-main-lightSlate">
                        {t("layout.eyebrow")}
                    </p>
                    <h1 className="mt-1 text-2xl font-bold text-main-mirage">{t("layout.title")}</h1>
                    <p className="mt-1 text-sm text-main-coolGray">
                        {t("layout.subtitle")}
                    </p>
                </div>

                <Tabs />
                <Outlet />
            </div>
        </PageTransition>
    );
};
export default CmsPage;
