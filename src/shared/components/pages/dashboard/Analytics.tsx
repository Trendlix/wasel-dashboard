import { useTranslation } from "react-i18next";
import { IDashboardAnalytics } from "../../../core/pages/dashboard";
import AnalyticsCard from "../../common/AnalyticsCard";

const Analytics = () => {
    const { t } = useTranslation("dashboard");
    return (
        <div className="flex items-center *:flex-1 gap-6">
            {IDashboardAnalytics.map((card) => (
                <AnalyticsCard
                    key={card.id}
                    id={card.id}
                    title={t(`metrics.${card.metricKey}.title`)}
                    value={card.value}
                    description={t(`metrics.${card.metricKey}.subtitle`)}
                    icon={card.icon}
                    classname={card.classname}
                />
            ))}
        </div>
    );
};

export default Analytics;
