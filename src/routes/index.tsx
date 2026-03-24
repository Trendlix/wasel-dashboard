import { Navigate, Route } from "react-router-dom";
import BlogsLayout from "@/shared/components/pages/blogs/BlogsLayout";
import AddBlogPage from "@/pages/blogs/AddBlogPage";
import EditBlogPage from "@/pages/blogs/EditBlogPage";
import DraftsBlogPage from "@/pages/blogs/DraftsBlogPage";

<Route path="/blogs" element={<BlogsLayout />}>
    <Route index element={<Navigate to="add" replace />} />
    <Route path="add" element={<AddBlogPage />} />
    <Route path="edit" element={<EditBlogPage />} />
    <Route path="drafts" element={<DraftsBlogPage />} />
</Route>