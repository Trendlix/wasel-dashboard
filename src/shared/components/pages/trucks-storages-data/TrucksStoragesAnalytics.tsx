import { trucksStoragesAnalytics } from "@/shared/core/pages/trucksStoragesData";
import AnalyticsCard from "../../common/AnalyticsCard";

const TrucksStoragesAnalytics = () => (
    <div className="flex items-stretch *:flex-1 gap-6">
        {trucksStoragesAnalytics.map((card) => (
            <AnalyticsCard key={card.id} {...card} />
        ))}
    </div>
);

export default TrucksStoragesAnalytics;
