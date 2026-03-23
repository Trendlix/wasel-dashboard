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
    return (
        <div className="bg-main-white border border-main-whiteMarble common-rounded p-4 h-[320px]">
            <h3 className="font-semibold text-main-mirage mb-3">Trips & Revenue Trends</h3>
            <ResponsiveContainer width="100%" height="90%">
                <BarChart data={tripsRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="trips" name="Trips" fill="#004AAD" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="revenue" name="Revenue (EGP)" fill="#14C38E" radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TripsRevenueChart;