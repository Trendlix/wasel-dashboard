import { useNavigate } from "react-router-dom";
import BlogItemForm from "@/shared/components/pages/cms/outlet/blogs-item-form";

const CmsBlogsItemsNewPage = () => {
    const navigate = useNavigate();
    return (
        <BlogItemForm
            mode="create"
            onBack={() => navigate("/cms/blogs/blog-items")}
        />
    );
};

export default CmsBlogsItemsNewPage;
