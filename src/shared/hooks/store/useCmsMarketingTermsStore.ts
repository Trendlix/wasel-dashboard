import { createCmsMarketingLegalStore } from "./createCmsMarketingLegalStore";

const useCmsMarketingTermsStore = createCmsMarketingLegalStore({
    fetchPath: "/dashboard/cms/marketing-terms",
    heroPath: "/dashboard/cms/marketing-terms/hero",
    alertPath: "/dashboard/cms/marketing-terms/alert",
    contentPath: "/dashboard/cms/marketing-terms/content",
    categoriesPath: "/dashboard/cms/marketing-terms/categories",
    saveErrorPrefix: "marketing terms",
});

export default useCmsMarketingTermsStore;
