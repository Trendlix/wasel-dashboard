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
                        className="overflow-hidden rounded-[12px] bg-white text-left shadow-sm transition hover:shadow-md"
                    >
                        <img
                            src={blog.coverImage}
                            alt={blog.title}
                            className="h-[180px] w-full object-cover"
                        />

                        <div className="p-4">
                            <div className="mb-2 text-xs font-semibold text-main-primary">
                                {blog.category}
                            </div>

                            <h3 className="mb-2 text-base font-bold text-main-mirage">
                                {blog.title}
                            </h3>

                            <p className="text-sm text-main-sharkGray">
                                {blog.excerpt}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
