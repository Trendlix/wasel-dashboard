import { usersAnalytics } from "../../../core/pages/users";
import AnalyticsCard from "../../common/AnalyticsCard"

const Analytics = () => {
    const iconClasses = ["bg-main-primary/10! text-main-primary!", "bg-main-vividMint/10! text-main-vividMint!", "bg-main-mustardGold/10! text-main-mustardGold!"];


    return (<div className="flex items-center *:flex-1 gap-6">
        {
            usersAnalytics?.map((card) => (
                <AnalyticsCard key={card.id} {...card} iconClass={iconClasses[card.id - 1]} notColorfull={true} />
            ))
        }</div>)
}

export default Analytics;