import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { tripsRevenueData } from "@/shared/core/pages/analytics";

const TripsRevenueChart = () => {
    const { t } = useTranslation("analytics");

    const data = useMemo(
        () =>
            tripsRevenueData.map((row) => ({
                month: t(`months.${row.monthKey}`),
                trips: row.trips,
                revenue: row.revenue,
            })),
        [t],
    );

    return (
        <div className="bg-main-white border border-main-whiteMarble common-rounded p-4 h-[320px]">
            <h3 className="font-semibold text-main-mirage mb-3">{t("tripsRevenueTitle")}</h3>
            <ResponsiveContainer width="100%" height="90%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="trips" name={t("legendTrips")} fill="#004AAD" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="revenue" name={t("legendRevenue")} fill="#14C38E" radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TripsRevenueChart;
