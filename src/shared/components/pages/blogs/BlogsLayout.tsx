import { Outlet } from "react-router-dom";
import BlogTabs from "./BlogTabs";

const BlogsLayout = () => {
    return (
        <section className="rounded-lg bg-white border border-main-whiteMarble">
            <BlogTabs />
            <div className="p-4 md:p-6">
                <Outlet />
            </div>
        </section>
    );
};

export default BlogsLayout;