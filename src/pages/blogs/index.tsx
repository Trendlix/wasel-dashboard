import { Outlet } from "react-router-dom";
import BlogTabs from "@/shared/components/pages/blogs/BlogTabs";
import PageTransition from "@/shared/components/common/PageTransition";
import { useTranslation } from "react-i18next";
import PageHeader from "@/shared/components/common/PageHeader";

const BlogsPage = () => {
    const { t } = useTranslation("blogs");
    return (
        <PageTransition>
            <PageHeader title={t("pageTitle")} description={t("pageDescription")} />
            <div className="rounded-lg bg-white border border-main-whiteMarble">
                <BlogTabs />
                <div className="p-4 md:p-6">
                    <Outlet />
                </div>
            </div>
        </PageTransition>
    );
};

export default BlogsPage;