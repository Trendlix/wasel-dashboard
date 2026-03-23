import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search } from "lucide-react";
import { useRef } from "react";

interface ISearchbar {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
}

const Searchbar = ({ placeholder, value, onChange }: ISearchbar) => {
    const inputRef = useRef<HTMLInputElement>(null);
    return (
        <div className="bg-main-white border border-main-whiteMarble common-rounded p-6 flex items-center gap-4">
            {/* Input wrapper */}
            <div
                className="flex items-center gap-2 border border-main-whiteMarble common-rounded px-4 h-10 flex-1 cursor-text"
                onClick={() => inputRef.current?.focus()}
            >
                <Search className="text-main-trueBlack/50 shrink-0" size={16} />
                <Input
                    ref={inputRef}
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    placeholder={placeholder ?? "Search..."}
                    className="border-0 shadow-none h-full p-0 placeholder:text-main-trueBlack/50 focus-visible:ring-0"
                />
            </div>

            {/* Button */}
            <Button className="h-10 px-6 border border-main-whiteMarble text-main-trueBlack/50 shrink-0">
                Search
            </Button>

            {/* Button */}
            <Button className="h-10 px-6 bg-main-primary text-main-white shrink-0 font-bold">
                <Download />
                <span>Export</span>
            </Button>
        </div>
    );
};

export default Searchbar;