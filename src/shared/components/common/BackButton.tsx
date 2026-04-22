import clsx from "clsx";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
    label: string;
    onClick: () => void;
    className?: string;
    ariaLabel?: string;
}

const BackButton = ({ label, onClick, className, ariaLabel }: BackButtonProps) => {
    return (
        <Button
            type="button"
            variant="outline"
            onClick={onClick}
            aria-label={ariaLabel}
            className={clsx(
                "h-10 px-4 border-main-whiteMarble text-main-hydrocarbon hover:bg-main-titaniumWhite rounded-xl font-semibold gap-2",
                className,
            )}
        >
            <ArrowLeft size={15} />
            {label}
        </Button>
    );
};

export default BackButton;
