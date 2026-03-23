import clsx from "clsx";
import ChartHeader from "./ChartHeader";
import { recentActivities, tagColors, type IRecentActivity } from "../../../core/pages/dashboard";

const RecentActivities = () => {
    return (
        <div className={clsx("space-y-4", "bg-main-white border border-main-whiteMarble common-rounded p-6 overflow-hidden")}>
            <ChartHeader title="Recent Activities" />
            <div className="space-y-2.5">
                {recentActivities.map((activity) => (
                    <Item key={activity.id} activity={activity} />
                ))}
            </div>
        </div>
    );
};

const Item = ({ activity }: { activity: IRecentActivity }) => {
    return (
        <div className="py-3 px-4 flex items-start gap-4 bg-main-luxuryWhite common-rounded">
            {/* dot indicator */}
            <span className="w-2 h-2 rounded-full bg-main-primary shrink-0 mt-2" />

            <div className="flex-1 space-y-1.5">
                <div className="text-main-mirage flex items-center gap-1.5">
                    <span className="font-medium text-sm leading-[20px]">{activity.title}</span>
                    <span className="font-normal leading-[20px] text-sm text-main-sharkGray">
                        — {activity.description}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Tag label={activity.tag} />
                    <span className="text-main-silverSteel text-[12px] font-normal leading-4">
                        {activity.time}
                    </span>
                </div>
            </div>
        </div>
    );
};

const Tag = ({ label }: { label: IRecentActivity["tag"] }) => {
    const { bg, text } = tagColors[label];
    return (
        <div className={clsx("rounded-full px-2 py-0.5 font-medium text-[12px] leading-4 capitalize", bg, text)}>
            {label}
        </div>
    );
};

export default RecentActivities;