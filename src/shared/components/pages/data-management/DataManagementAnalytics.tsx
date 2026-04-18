import { useEffect } from "react";
import AnalyticsCard, { AnalyticsCardSkeleton } from "../../common/AnalyticsCard";
import useDataManagementStore from "@/shared/hooks/store/useDataManagementStore";
import { Truck, Box } from "lucide-react";

const DataManagementAnalytics = () => {
    const { analytics, fetchAnalytics, analyticsLoading } = useDataManagementStore();

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    // Show skeleton while loading or if analytics hasn't been fetched yet
    if (analyticsLoading && !analytics) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <AnalyticsCardSkeleton notColorfull />
                <AnalyticsCardSkeleton notColorfull />
            </div>
        );
    }

    const cards = [
        {
            id: 1,
            title: "Truck Types",
            value: analytics?.truckTypes?.total?.toString() || "0",
            icon: Truck,
            classname: "bg-main-primary",
        },
        {
            id: 2,
            title: "Active Goods Types",
            value: analytics?.goodsTypes?.active?.toString() || "0",
            icon: Box,
            classname: "bg-main-vividSubmarine",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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

export default DataManagementAnalytics;
