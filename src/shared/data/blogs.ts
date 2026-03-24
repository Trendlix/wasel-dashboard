export interface BlogCardItem {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    coverImage: string;
    content: string;
    tags: string[];
    seoTitle?: string;
    seoDescription?: string;
    schedule?: {
        publishDate: string;
        publishTime: string;
    };
}

export const BLOGS_DUMMY_DATA: BlogCardItem[] = [
    {
        id: "1",
        title: "How Heavy Transportation Is Construction",
        slug: "how-heavy-transportation-is-construction",
        excerpt: "From flatbeds to specialized vehicles, learn how on-demand heavy truck transport is changing the construction industry.",
        category: "Transportation",
        coverImage: "/images/blogs/blog-1.png",
        content: "<p>From flatbeds to specialized vehicles, learn how on-demand heavy truck transport is changing the construction industry.</p>",
        tags: ["transport", "construction"],
        seoTitle: "How Heavy Transportation Is Construction",
        seoDescription: "Learn how heavy truck transport is changing construction.",
        schedule: {
            publishDate: "2026-03-24",
            publishTime: "12:00",
        },
    },
    {
        id: "2",
        title: "Warehouse Storage Solutions: A Complete Guide",
        slug: "warehouse-storage-solutions-a-complete-guide",
        excerpt: "Everything you need to know about choosing the right warehouse storage solution for your business needs.",
        category: "Storage",
        coverImage: "/images/blogs/blog-2.png",
        content: "<p>Everything you need to know about choosing the right warehouse storage solution for your business needs.</p>",
        tags: ["warehouse", "storage"],
        seoTitle: "Warehouse Storage Solutions: A Complete Guide",
        seoDescription: "Choose the right warehouse storage solution for your business.",
    },
];