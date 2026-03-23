import { IDashboardAnalytics } from "../../../core/pages/dashboard"
import AnalyticsCard from "../../common/AnalyticsCard"

const Analytics = () => {
    return (<div className="flex items-center *:flex-1 gap-6">
        {
            IDashboardAnalytics?.map((card) => (
                <AnalyticsCard key={card.id} {...card} />
            ))
        }</div>)
}

export default Analytics;