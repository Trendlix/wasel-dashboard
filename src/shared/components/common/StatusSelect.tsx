import {
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import clsx from "clsx";

export type StatusOption = {
    value: string;
    label: string;
};

interface StatusSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: StatusOption[];
    statusStyles?: Record<string, { bg: string; text: string; label?: string }>;
    placeholder?: string;
    className?: string;
}

const StatusSelect = ({
    value,
    onChange,
    options,
    statusStyles,
    placeholder = "Select status",
    className = "",
}: StatusSelectProps) => (
    <Select value={value} onValueChange={onChange}>
        <SelectTrigger
            className={clsx(
                "w-40",
                value !== "all" && statusStyles?.[value]
                    ? [statusStyles[value].bg, statusStyles[value].text].join(" ")
                    : "",
                className,
            )}
        >
            <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent position="popper">
            {options.map((opt, index) => (
                <div key={opt.value}>
                    <SelectItem value={opt.value}>{opt.label}</SelectItem>
                    {index < options.length - 1 && <SelectSeparator />}
                </div>
            ))}
        </SelectContent>
    </Select>
);

export default StatusSelect;
