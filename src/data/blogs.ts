export type TBlogStatus = "published" | "draft";

export interface IBlog {
    id: number;
    coverImage: string | null;
    coverImageAlt: string;
    title: string;
    category: string;
    slug: string;
    keywords: string[];
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string[];
    description: string;
    status: TBlogStatus;
    scheduledAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export const BLOG_CATEGORIES: string[] = [
    "Technology",
    "Business",
    "Travel",
    "Lifestyle",
    "Design",
    "Marketing",
];

export const BLOGS: IBlog[] = [
    {
        id: 1,
        coverImage: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800",
        coverImageAlt: "Modern web development setup",
        title: "Getting Started with Modern Web Development",
        category: "Technology",
        slug: "getting-started-with-modern-web-development",
        keywords: ["react", "typescript", "vite", "frontend"],
        metaTitle: "Getting Started with Modern Web Development | Blog",
        metaDescription: "A comprehensive guide to modern web development using React, TypeScript, and Vite.",
        metaKeywords: ["react", "typescript", "vite", "web development", "frontend"],
        description: "<p>Modern web development has evolved significantly over the past decade. Tools like React, TypeScript, and Vite have made it easier than ever to build fast, maintainable applications.</p><p>In this guide, we will walk through the essentials of setting up a modern web project from scratch.</p>",
        status: "published",
        scheduledAt: null,
        createdAt: "2026-01-10",
        updatedAt: "2026-01-15",
    },
    {
        id: 2,
        coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
        coverImageAlt: "Business growth chart",
        title: "Building a Scalable SaaS Business",
        category: "Business",
        slug: "building-a-scalable-saas-business",
        keywords: ["saas", "business", "growth", "scaling"],
        metaTitle: "Building a Scalable SaaS Business | Blog",
        metaDescription: "Key principles and strategies for scaling a SaaS business from zero to enterprise.",
        metaKeywords: ["saas", "business", "startup", "growth", "scaling"],
        description: "<p>Scaling a SaaS business requires careful planning around infrastructure, pricing, and customer success. The decisions you make early on will shape your growth trajectory.</p><p>Here are the key principles that successful SaaS founders follow when scaling from zero to enterprise.</p>",
        status: "published",
        scheduledAt: null,
        createdAt: "2026-01-20",
        updatedAt: "2026-02-01",
    },
    {
        id: 3,
        coverImage: null,
        coverImageAlt: "",
        title: "Top Travel Destinations for Remote Workers",
        category: "Travel",
        slug: "top-travel-destinations-for-remote-workers",
        keywords: ["travel", "remote work", "digital nomad"],
        metaTitle: "Top Travel Destinations for Remote Workers | Blog",
        metaDescription: "Discover the best cities around the world for remote workers and digital nomads.",
        metaKeywords: ["travel", "remote work", "digital nomad", "destinations"],
        description: "<p>Remote work has opened up a world of possibilities for those who want to combine work and travel. From Bali to Lisbon, the world is full of vibrant cities that cater to digital nomads.</p>",
        status: "draft",
        scheduledAt: null,
        createdAt: "2026-02-05",
        updatedAt: "2026-02-05",
    },
    {
        id: 4,
        coverImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
        coverImageAlt: "UI design principles illustration",
        title: "UI Design Principles Every Developer Should Know",
        category: "Design",
        slug: "ui-design-principles-every-developer-should-know",
        keywords: ["design", "ui", "ux", "principles"],
        metaTitle: "UI Design Principles Every Developer Should Know | Blog",
        metaDescription: "Core UI design principles that will help developers create better, more intuitive interfaces.",
        metaKeywords: ["ui design", "ux", "developer", "interface", "principles"],
        description: "<p>Great UI design is not just about aesthetics — it is about creating experiences that feel intuitive and effortless. Understanding core principles like visual hierarchy, spacing, and contrast can dramatically improve your interfaces.</p>",
        status: "draft",
        scheduledAt: null,
        createdAt: "2026-02-18",
        updatedAt: "2026-03-01",
    },
];
