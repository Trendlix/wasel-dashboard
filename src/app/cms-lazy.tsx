import { lazy } from "react";

export const CmsPage = lazy(() => import("@/pages/cms"));
export const CommonPage = lazy(() => import("@/shared/components/pages/cms/outlet/common"));
export const AboutPage = lazy(() => import("@/shared/components/pages/cms/outlet/about"));
export const CommonAppPage = lazy(() => import("@/shared/components/pages/cms/outlet/common/app"));
export const CommonBrandPage = lazy(() => import("@/shared/components/pages/cms/outlet/common/brand"));
export const CommonFaqsPage = lazy(() => import("@/shared/components/pages/cms/outlet/common/faqs"));
export const AboutHeroPage = lazy(() => import("@/shared/components/pages/cms/outlet/about/hero"));
export const AboutFoundedPage = lazy(() => import("@/shared/components/pages/cms/outlet/about/founded"));
export const AboutStandForPage = lazy(() => import("@/shared/components/pages/cms/outlet/about/stand-for"));
export const AboutFuturePage = lazy(() => import("@/shared/components/pages/cms/outlet/about/future"));
export const ServicesPage = lazy(() => import("@/shared/components/pages/cms/outlet/services"));
export const ServicesHeroPage = lazy(() => import("@/shared/components/pages/cms/outlet/services/hero"));
export const ServicesWarehousePage = lazy(() => import("@/shared/components/pages/cms/outlet/services/warehouse"));
export const ServicesAdvertisingPage = lazy(() => import("@/shared/components/pages/cms/outlet/services/advertising"));
export const ContactPage = lazy(() => import("@/shared/components/pages/cms/outlet/contact"));
export const SeoPage = lazy(() => import("@/shared/components/pages/cms/outlet/seo"));
export const SeoHomePage = lazy(() => import("@/shared/components/pages/cms/outlet/seo/home"));
export const SeoAboutPage = lazy(() => import("@/shared/components/pages/cms/outlet/seo/about"));
export const SeoContactPage = lazy(() => import("@/shared/components/pages/cms/outlet/seo/contact"));
export const SeoServicesPage = lazy(() => import("@/shared/components/pages/cms/outlet/seo/services"));
export const SeoBlogsPage = lazy(() => import("@/shared/components/pages/cms/outlet/seo/blogs"));
export const SeoOrderTrackingPage = lazy(() => import("@/shared/components/pages/cms/outlet/seo/order-tracking"));
export const SeoFaqsPage = lazy(() => import("@/shared/components/pages/cms/outlet/seo/faqs"));
export const SeoTermsPage = lazy(() => import("@/shared/components/pages/cms/outlet/seo/terms"));
export const SeoPrivacyPage = lazy(() => import("@/shared/components/pages/cms/outlet/seo/privacy"));
export const CmsBlogsInfoPage = lazy(() => import("@/shared/components/pages/cms/outlet/blogs-info"));
export const CmsBlogsItemsLayout = lazy(() => import("@/shared/components/pages/cms/outlet/blogs-items-layout"));
export const CmsBlogsItemsAllPage = lazy(() => import("@/shared/components/pages/cms/outlet/blogs-items-all"));
export const CmsBlogsItemsNewPage = lazy(() => import("@/shared/components/pages/cms/outlet/blogs-items-new"));
export const CmsBlogsItemsEditPage = lazy(() => import("@/shared/components/pages/cms/outlet/blogs-items-edit"));
export const MarketingFaqHeroPage = lazy(() => import("@/shared/components/pages/cms/outlet/marketing-faq/hero"));
export const MarketingFaqItemsPage = lazy(() => import("@/shared/components/pages/cms/outlet/marketing-faq/faqs"));
export const MarketingTermsHeroPage = lazy(() => import("@/shared/components/pages/cms/outlet/marketing-terms/hero"));
export const MarketingTermsItemsPage = lazy(() => import("@/shared/components/pages/cms/outlet/marketing-terms/faqs"));
export const MarketingPrivacyHeroPage = lazy(() => import("@/shared/components/pages/cms/outlet/marketing-privacy/hero"));
export const MarketingPrivacyItemsPage = lazy(() => import("@/shared/components/pages/cms/outlet/marketing-privacy/faqs"));

const loadBlogsOutlet = () => import("@/shared/components/pages/cms/outlet/blogs");
export const CmsBlogsLayout = lazy(() => loadBlogsOutlet().then((m) => ({ default: m.default })));
export const CmsBlogsIndexRedirect = lazy(() =>
    loadBlogsOutlet().then((m) => ({ default: m.CmsBlogsIndexRedirect })),
);

const loadLegalHelp = () => import("@/shared/components/pages/cms/outlet/legal-help");
export const CmsLegalHelpLayout = lazy(() => loadLegalHelp().then((m) => ({ default: m.default })));
export const CmsLegalHelpIndexRedirect = lazy(() =>
    loadLegalHelp().then((m) => ({ default: m.CmsLegalHelpIndexRedirect })),
);

const loadMarketingFaqLayout = () => import("@/shared/components/pages/cms/outlet/marketing-faq/layout");
export const MarketingFaqLayout = lazy(() => loadMarketingFaqLayout().then((m) => ({ default: m.default })));
export const MarketingFaqIndexRedirect = lazy(() =>
    loadMarketingFaqLayout().then((m) => ({ default: m.MarketingFaqIndexRedirect })),
);

const loadMarketingTermsLayout = () => import("@/shared/components/pages/cms/outlet/marketing-terms/layout");
export const MarketingTermsLayout = lazy(() => loadMarketingTermsLayout().then((m) => ({ default: m.default })));
export const MarketingTermsIndexRedirect = lazy(() =>
    loadMarketingTermsLayout().then((m) => ({ default: m.MarketingTermsIndexRedirect })),
);

const loadMarketingPrivacyLayout = () => import("@/shared/components/pages/cms/outlet/marketing-privacy/layout");
export const MarketingPrivacyLayout = lazy(() => loadMarketingPrivacyLayout().then((m) => ({ default: m.default })));
export const MarketingPrivacyIndexRedirect = lazy(() =>
    loadMarketingPrivacyLayout().then((m) => ({ default: m.MarketingPrivacyIndexRedirect })),
);
