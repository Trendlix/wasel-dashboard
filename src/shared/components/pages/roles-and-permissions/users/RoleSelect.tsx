import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface RoleSelectProps {
    value: number;
    onChange: (v: number) => void;
    roles: { id: number; name: string }[];
}

const RoleSelect = ({ value, onChange, roles }: RoleSelectProps) => (
    <Select
        value={value ? String(value) : ""}
        onValueChange={(v) => onChange(Number(v))}
    >
        <SelectTrigger className="w-full h-[48px] bg-main-titaniumWhite border-none common-rounded px-4 text-sm text-main-mirage font-medium focus:ring-2 focus:ring-main-primary/20 transition-all data-placeholder:text-main-sharkGray/50">
            <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent className="bg-white border border-main-whiteMarble common-rounded shadow-xl z-999">
            {roles.map((r) => (
                <SelectItem
                    key={r.id}
                    value={String(r.id)}
                    className="text-sm text-main-mirage font-medium rounded-lg cursor-pointer focus:bg-main-primary/5 focus:text-main-primary py-2.5 px-3"
                >
                    {r.name}
                </SelectItem>
            ))}
        </SelectContent>
    </Select>
);

export default RoleSelect;
