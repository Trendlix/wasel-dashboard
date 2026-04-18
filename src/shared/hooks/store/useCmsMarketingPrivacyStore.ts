import { createCmsMarketingLegalStore } from "./createCmsMarketingLegalStore";

const useCmsMarketingPrivacyStore = createCmsMarketingLegalStore({
    fetchPath: "/dashboard/cms/marketing-privacy",
    heroPath: "/dashboard/cms/marketing-privacy/hero",
    alertPath: "/dashboard/cms/marketing-privacy/alert",
    contentPath: "/dashboard/cms/marketing-privacy/content",
    categoriesPath: "/dashboard/cms/marketing-privacy/categories",
    saveErrorPrefix: "marketing privacy",
});

export default useCmsMarketingPrivacyStore;
