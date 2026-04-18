const RoleCardSkeleton = () => {
    return (
        <div className="bg-main-luxuryWhite border border-main-whiteMarble rounded-xl p-6 flex flex-col gap-4 animate-pulse">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 w-full">
                    <div className="w-10 h-10 rounded-xl bg-main-whiteMarble shrink-0" />
                    <div className="flex flex-col gap-2 w-1/2">
                        <div className="h-4 bg-main-whiteMarble rounded w-3/4" />
                        <div className="h-3 bg-main-whiteMarble rounded w-1/4" />
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="w-4 h-4 bg-main-whiteMarble rounded" />
                    <div className="w-4 h-4 bg-main-whiteMarble rounded" />
                </div>
            </div>

            {/* Description */}
            <div className="space-y-2 mt-2">
                <div className="h-3 bg-main-whiteMarble rounded w-full" />
                <div className="h-3 bg-main-whiteMarble rounded w-5/6" />
            </div>

            {/* Permissions */}
            <div className="mt-4">
                <div className="h-3 bg-main-whiteMarble rounded w-32 mb-4" />
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                    <div className="flex flex-col gap-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-main-whiteMarble" />
                                <div className="h-3 bg-main-whiteMarble rounded w-20" />
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col gap-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-main-whiteMarble" />
                                <div className="h-3 bg-main-whiteMarble rounded w-20" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="h-4 bg-main-whiteMarble rounded w-32 mt-4" />
        </div>
    );
};

export default RoleCardSkeleton;
