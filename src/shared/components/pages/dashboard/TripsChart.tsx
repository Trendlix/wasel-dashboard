import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
import type { TooltipContentProps, TooltipIndex, TooltipValueType } from "recharts";

/** Matches Recharts `NameType` (not exported from package root). */
type TooltipName = number | string;
import ChartHeader from "./ChartHeader";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

const data = [
    { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
    { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
    { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
    { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
    { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
    { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
    { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
];

const TripsChart = ({
    isAnimationActive,
    defaultIndex,
}: {
    isAnimationActive?: boolean;
    defaultIndex?: TooltipIndex;
}) => {
    const { t } = useTranslation("dashboard");

    const renderTooltip = (props: TooltipContentProps<TooltipValueType, TooltipName>) => {
        const { active, payload, label } = props;
        const isVisible = active && payload && payload.length;
        const val = payload?.[0]?.value;
        return (
            <div className="custom-tooltip" style={{ visibility: isVisible ? "visible" : "hidden" }}>
                {isVisible && (
                    <>
                        <p className="label">{t("charts.tooltipValue", { label, value: val != null ? String(val) : "" })}</p>
                        <p className="intro text-main-sharkGray text-xs">{t("charts.tooltipHint")}</p>
                    </>
                )}
            </div>
        );
    };

    return (
        <div className={clsx("space-y-4", "bg-main-white border border-main-whiteMarble common-rounded p-6 overflow-hidden")}>
            <ChartHeader title={t("charts.tripsOverTime")} />
            <BarChart
                style={{ width: "100%", maxHeight: "350px", aspectRatio: 1.618 }}
                responsive
                data={data}
                margin={{
                    top: 5,
                    right: 0,
                    left: 0,
                    bottom: 0,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--main-sharkGray)" />
                <XAxis dataKey="name" stroke="var(--main-sharkGray)" tickCount={5} niceTicks="snap125" />
                <YAxis width="auto" stroke="var(--main-sharkGray)" niceTicks="snap125" />
                <Tooltip content={renderTooltip} isAnimationActive={isAnimationActive} defaultIndex={defaultIndex} />
                <Legend />
                <Bar dataKey="pv" barSize={87} fill="var(--main-primary)" radius={10} isAnimationActive={isAnimationActive} />
            </BarChart>
        </div>
    );
};

export default TripsChart;
