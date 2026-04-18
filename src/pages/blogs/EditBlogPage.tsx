import * as React from "react";
import BlogForm from "@/shared/components/pages/blogs/BlogForm";
import { BLOGS_DUMMY_DATA, type BlogCardItem } from "@/shared/data/blogs";

export default function EditBlogPage() {
    const [blogs, setBlogs] = React.useState<BlogCardItem[]>(BLOGS_DUMMY_DATA);
    const [selectedBlog, setSelectedBlog] = React.useState<BlogCardItem | null>(null);

    const handleCardClick = (blog: BlogCardItem) => {
        setSelectedBlog(blog);
    };

    const handleCancelEdit = () => {
        setSelectedBlog(null);
    };

    const handleUpdateBlog = (values: any) => {
        if (!selectedBlog) return;

        setBlogs((prev) =>
            prev.map((blog) =>
                blog.id === selectedBlog.id
                    ? {
                        ...blog,
                        ...values,
                    }
                    : blog
            )
        );

        setSelectedBlog(null);
    };

    if (selectedBlog) {
        return (
            <BlogForm
                mode="edit"
                initialValues={{
                    title: selectedBlog.title,
                    slug: selectedBlog.slug,
                    paragraph: selectedBlog.content,
                    keywords: selectedBlog.tags,
                    metaTitle: selectedBlog.seoTitle || "",
                    metaDescription: selectedBlog.seoDescription || "",
                    schedule: selectedBlog.schedule,
                }}
                onCancel={handleCancelEdit}
                onSubmit={handleUpdateBlog}
            />
        );
    }

    return (
        <div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {blogs.map((blog) => (
                    <button
                        key={blog.id}
                        type="button"
                        onClick={() => handleCardClick(blog)}
                        className="overflow-hidden rounded-[26px] border border-main-whiteMarble bg-white text-left shadow-[0_14px_40px_rgba(17,24,39,0.08)] transition hover:shadow-[0_18px_46px_rgba(17,24,39,0.12)]"
                    >
                        <img
                            src={blog.coverImage}
                            alt={blog.title}
                            className="aspect-[16/9] w-full object-cover"
                        />

                        <div className="space-y-3 px-6 py-5">
                            <div className="inline-flex rounded-full bg-main-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-main-primary">
                                {blog.category}
                            </div>

                            <h3 className="line-clamp-2 text-[30px] font-bold leading-[1.15] text-main-mirage">
                                {blog.title}
                            </h3>

                            <p className="line-clamp-2 text-[17px] leading-[1.5] text-main-sharkGray">
                                {blog.excerpt}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
