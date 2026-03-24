export enum IBlogTab {
    add = "Add New Blog",
    edit = "Edit Existing Blog",
    drafts = "Drafts",
}

export interface IBlogTabsProps {
    id: number;
    name: IBlogTab;
    to: string;
}

export const BLOG_TABS: IBlogTabsProps[] = [
    { id: 1, name: IBlogTab.add, to: "/blogs/add" },
    { id: 2, name: IBlogTab.edit, to: "/blogs/edit" },
    { id: 3, name: IBlogTab.drafts, to: "/blogs/drafts" },
];

export enum forWhat {
    ADD = 'add',
    EDIT = 'edit'
}