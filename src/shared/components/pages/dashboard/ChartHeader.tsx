const ChartHeader = ({ title, no }: { title: string, no?: number }) => {
    return (
        <div className="flex items-center justify-between">
            <h1 className="text-lg leading-[36px] font-bold text-main-black">{title}</h1>
            {no !== undefined &&
                <div className="rounded-full bg-main-mustardGold text-main-white text-sm font-medium flex items-center justify-center w-[23px] h-[23px] font-bold text-[12px] leading-4">
                    {no}
                </div>
            }
        </div>
    );
}

export default ChartHeader;