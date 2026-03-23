import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import ChartHeader from './ChartHeader';
import clsx from 'clsx';

// #region Sample data
const data = [
    {
        name: 'Page A',
        uv: 4000,
        pv: 2400,
        amt: 2400,
    },
    {
        name: 'Page B',
        uv: 3000,
        pv: 1398,
        amt: 2210,
    },
    {
        name: 'Page C',
        uv: 2000,
        pv: 9800,
        amt: 2290,
    },
    {
        name: 'Page D',
        uv: 2780,
        pv: 3908,
        amt: 2000,
    },
    {
        name: 'Page E',
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        name: 'Page F',
        uv: 2390,
        pv: 3800,
        amt: 2500,
    },
    {
        name: 'Page G',
        uv: 3490,
        pv: 4300,
        amt: 2100,
    },
];
// #endregion

export default function RevenueChart() {
    return (
        <div className={clsx("space-y-4", "bg-main-white border border-main-whiteMarble common-rounded p-6 overflow-hidden")}>
            <ChartHeader title="Revenue Trends" />
            <LineChart
                style={{ width: '100%', maxHeight: '350px', aspectRatio: 1.618 }}
                responsive
                data={data}
                margin={{
                    top: 5,
                    right: 0,
                    left: 0,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="5 5" stroke="var(--main-sharkGray)" />
                <XAxis dataKey="name" stroke="var(--main-sharkGray)" />
                <YAxis width="auto" stroke="var(--main-sharkGray)" />
                <Tooltip
                    cursor={{
                        stroke: 'var(--main-sharkGray)',
                    }}
                    contentStyle={{
                        backgroundColor: 'var(--main-white)',
                        borderColor: 'var(--main-vividMint)',
                    }}
                />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="pv"
                    stroke="var(--main-vividMint)"
                    dot={{
                        fill: 'var(--main-white)',
                    }}
                    activeDot={{ r: 4, stroke: 'var(--main-vividMint)' }}
                />
            </LineChart>
        </div>
    );
}