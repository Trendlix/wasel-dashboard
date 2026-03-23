import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { vehicleDistributionData } from "@/shared/core/pages/analytics";

const VehicleTypeChart = () => {
    return (
        <div className="bg-main-white border border-main-whiteMarble common-rounded p-4 h-[320px]">
            <h3 className="font-semibold text-main-mirage mb-3">Vehicle Type Distribution</h3>
            <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                    <Pie
                        data={vehicleDistributionData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={0}
                        outerRadius={95}
                        cx="50%"
                        cy="52%"
                    />
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default VehicleTypeChart;