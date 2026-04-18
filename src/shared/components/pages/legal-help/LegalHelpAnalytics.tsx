import { useEffect } from "react";
import AnalyticsCard, { AnalyticsCardSkeleton } from "@/shared/components/common/AnalyticsCard";
import useLegalHelpStore from "@/shared/hooks/store/useLegalHelpStore";
import { CircleHelp, FolderTree, FileText, Shield } from "lucide-react";

const LegalHelpAnalytics = () => {
    const { analytics, fetchAnalytics, analyticsLoading } = useLegalHelpStore();

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    if (analyticsLoading && !analytics) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {Array.from({ length: 4 }).map((_, i) => (
                    <AnalyticsCardSkeleton key={i} notColorfull />
                ))}
            </div>
        );
    }

    const cards = [
        {
            id: 1,
            title: "FAQ entries",
            value: analytics?.faqs?.toString() ?? "0",
            icon: CircleHelp,
            classname: "bg-main-primary",
        },
        {
            id: 2,
            title: "FAQ categories",
            value: analytics?.faq_types?.toString() ?? "0",
            icon: FolderTree,
            classname: "bg-main-vividSubmarine",
        },
        {
            id: 3,
            title: "Terms document",
            value: (analytics?.terms_documents ?? 0) > 0 ? "Active" : "None",
            icon: FileText,
            classname: "bg-main-vividMint",
        },
        {
            id: 4,
            title: "Policy rows",
            value: analytics?.policies?.toString() ?? "0",
            icon: Shield,
            classname: "bg-main-primaryPurple",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map((card) => (
                <AnalyticsCard
                    key={card.id}
                    id={card.id}
                    title={card.title}
                    value={card.value}
                    icon={card.icon}
                    classname={card.classname}
                />
            ))}
        </div>
    );
};

export default LegalHelpAnalytics;
