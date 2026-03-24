import { voucherAnalytics } from "@/shared/core/pages/voucherAndPromo";
import AnalyticsCard from "../../common/AnalyticsCard";

const VoucherAnalytics = () => (
    <div className="flex items-stretch *:flex-1 gap-6">
        {voucherAnalytics.map((card) => (
            <AnalyticsCard key={card.id} {...card} />
        ))}
    </div>
);

export default VoucherAnalytics;
