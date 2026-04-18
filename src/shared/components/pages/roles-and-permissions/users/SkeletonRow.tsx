const SkeletonRow = () => (
    <tr className="border-b border-main-whiteMarble">
        {Array.from({ length: 6 }).map((_, i) => (
            <td key={i} className="py-4 px-6">
                <div className="h-4 bg-main-whiteMarble rounded-lg animate-pulse w-3/4" />
                {i === 0 && <div className="h-3 bg-main-whiteMarble rounded-lg animate-pulse w-1/2 mt-2" />}
            </td>
        ))}
    </tr>
);

export default SkeletonRow;
