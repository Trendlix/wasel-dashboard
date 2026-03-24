import { Outlet } from "react-router-dom";
import BlogTabs from "@/shared/components/pages/blogs/BlogTabs";
import PageTransition from "@/shared/components/common/PageTransition";
import PageHeader from "@/shared/components/common/PageHeader";

const BlogsPage = () => {
    return (
        <PageTransition>
            <PageHeader title="Blog & SEO Management" description="Create, edit, and optimize blog content for search engines" />
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