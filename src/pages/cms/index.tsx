import PageTransition from "@/shared/components/common/PageTransition";
import Tabs from "@/shared/components/pages/cms/layout/tabs";
import { Outlet } from "react-router-dom";

const CmsPage = () => {
    return (
        <PageTransition>
            <div className="space-y-5">
                <div className="rounded-2xl border border-main-whiteMarble bg-gradient-to-r from-main-white to-main-titaniumWhite/60 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-main-lightSlate">
                        Content Management
                    </p>
                    <h1 className="mt-1 text-2xl font-bold text-main-mirage">CMS Layout Builder</h1>
                    <p className="mt-1 text-sm text-main-coolGray">
                        Manage nested CMS sections with clear structure and publish-ready content blocks.
                    </p>
                </div>

                <Tabs />
                <Outlet />
            </div>
        </PageTransition>
    );
};
export default CmsPage;
