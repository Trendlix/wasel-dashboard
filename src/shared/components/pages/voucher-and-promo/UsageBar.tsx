interface IUsageBarProps {
    used: number;
    limit: number;
}

const UsageBar = ({ used, limit }: IUsageBarProps) => {
    const percent = Math.min((used / limit) * 100, 100);

    return (
        <div className="flex flex-col gap-1.5">
            <span className="text-main-mirage text-sm font-medium">
                {used} / {limit}
            </span>
            <div className="w-full h-1.5 bg-main-whiteMarble rounded-full overflow-hidden">
                <div
                    className="h-full bg-main-vividMint rounded-full"
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
};

export default UsageBar;
