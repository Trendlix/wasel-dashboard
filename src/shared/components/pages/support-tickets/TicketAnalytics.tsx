import { useEffect } from "react";
import { CheckCircle, Clock, MessageSquare, TicketCheck, XCircle } from "lucide-react";
import AnalyticsCard, { AnalyticsCardSkeleton } from "../../common/AnalyticsCard";
import useTicketStore from "@/shared/hooks/store/useTicketStore";

const TicketAnalytics = () => {
    const { stats, statsLoading, fetchStats } = useTicketStore();

    useEffect(() => { fetchStats(); }, []);

    if (statsLoading || !stats) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <AnalyticsCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <AnalyticsCard
                id={1}
                title="Total Tickets"
                value={String(stats.total)}
                icon={TicketCheck}
                classname="bg-main-primary"
            />
            <AnalyticsCard
                id={2}
                title="Open"
                value={String(stats.pending)}
                icon={Clock}
                classname="bg-main-vividMint"
            />
            <AnalyticsCard
                id={3}
                title="Pending Reply"
                value={String(stats.reply)}
                icon={MessageSquare}
                classname="bg-main-mustardGold"
            />
            <AnalyticsCard
                id={4}
                title="Closed"
                value={String(stats.closed)}
                icon={XCircle}
                classname="bg-main-sharkGray"
            />
            <AnalyticsCard
                id={5}
                title="Solved"
                value={String(stats.solved)}
                icon={CheckCircle}
                classname="bg-main-vividSubmarine"
            />
        </div>
    );
};

export default TicketAnalytics;
