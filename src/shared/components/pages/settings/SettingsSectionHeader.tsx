import clsx from "clsx";
import type { LucideIcon } from "lucide-react";

interface ISettingsSectionHeader {
    icon: LucideIcon;
    title: string;
    iconBg: string;
    iconColor: string;
}

const SettingsSectionHeader = ({ icon: Icon, title, iconBg, iconColor }: ISettingsSectionHeader) => {
    return (
        <div className="flex items-center gap-3 mb-6">
            <div className={clsx("w-11 h-11 rounded-xl flex items-center justify-center", iconBg)}>
                <Icon size={20} className={iconColor} />
            </div>
            <h3 className="text-main-mirage font-bold text-lg">{title}</h3>
        </div>
    );
};

export default SettingsSectionHeader;