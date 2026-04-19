import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BlogItemForm from "@/shared/components/pages/cms/outlet/blogs-item-form";
import { useCmsBlogsStore, type BlogItem } from "@/shared/hooks/store/useCmsBlogsStore";

const CmsBlogsItemsEditPage = () => {
    const { t } = useTranslation("cms");
    const navigate = useNavigate();
    const { id } = useParams();
    const { fetchItemById } = useCmsBlogsStore();
    const [item, setItem] = useState<BlogItem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const run = async () => {
            if (!id) {
                navigate("/cms/blogs/blog-items");
                return;
            }
            setLoading(true);
            const payload = await fetchItemById(id);
            setItem(payload);
            setLoading(false);
        };
        void run();
    }, [fetchItemById, id, navigate]);

    if (loading) {
        return (
            <div className="rounded-2xl border border-main-whiteMarble bg-main-white p-6">
                <div className="space-y-2 animate-pulse">
                    <div className="h-8 rounded bg-main-titaniumWhite" />
                    <div className="h-8 rounded bg-main-titaniumWhite" />
                    <div className="h-52 rounded bg-main-titaniumWhite" />
                </div>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="rounded-2xl border border-main-whiteMarble bg-main-white p-6 text-sm text-main-coolGray">
                {t("blogsItemsEdit.notFound")}
            </div>
        );
    }

    return (
        <BlogItemForm
            mode="edit"
            initialItem={item}
            onBack={() => navigate("/cms/blogs/blog-items")}
        />
    );
};

export default CmsBlogsItemsEditPage;
