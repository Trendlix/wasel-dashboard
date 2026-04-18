import { Search } from "lucide-react";

interface NoDataFoundProps {
    title?: string;
    description?: string;
    className?: string;
}

const NoDataFound = ({
    title = "No data found",
    description = "We couldn't find what you're looking for.",
    className = ""
}: NoDataFoundProps) => {
    return (
        <div className={`flex flex-col items-center justify-center p-12 bg-main-luxuryWhite border border-dashed border-main-whiteMarble common-rounded w-full text-center ${className}`}>
            <div className="w-12 h-12 rounded-full bg-main-whiteMarble flex items-center justify-center mb-4 text-main-sharkGray animate-pulse">
                <Search className="w-6 h-6" />
            </div>
            <h3 className="text-main-mirage font-bold text-lg">{title}</h3>
            <p className="text-main-sharkGray text-sm mt-1 max-w-xs mx-auto">
                {description}
            </p>
        </div>
    );
};

export default NoDataFound;
