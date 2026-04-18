import { useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    CommonModal,
    CommonModalBody,
    CommonModalFooter,
    CommonModalHeader,
} from "../../common/CommonModal";
import useTicketStore from "@/shared/hooks/store/useTicketStore";
import NoDataFound from "../../common/NoDataFound";

interface ManageCategoriesModalProps {
    open: boolean;
    onOpenChange: (v: boolean) => void;
}

const ManageCategoriesModal = ({ open, onOpenChange }: ManageCategoriesModalProps) => {
    const {
        categories,
        categoriesLoading,
        categorySaving,
        fetchCategories,
        createCategory,
        deleteCategory,
    } = useTicketStore();

    const [newName, setNewName] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open) fetchCategories();
    }, [open]);

    const handleAdd = async () => {
        const name = newName.trim();
        if (!name) return;
        try {
            await createCategory(name);
            setNewName("");
            inputRef.current?.focus();
        } catch {
            // error toast handled by axios interceptor
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleAdd();
    };

    return (
        <CommonModal open={open} onOpenChange={onOpenChange} maxWidth="sm:max-w-[560px]">
            <CommonModalHeader
                title="Manage Ticket Categories"
                description="Add or remove categories to organize your support tickets"
            />

            <CommonModalBody>
                {/* Add new */}
                <div className="mb-5">
                    <p className="text-sm font-semibold text-main-mirage mb-2">Add New Category</p>
                    <div className="flex gap-2">
                        <Input
                            ref={inputRef}
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="e.g., Billing Issues"
                            className="flex-1 h-11 border-main-whiteMarble focus-visible:ring-main-primary/30"
                        />
                        <Button
                            onClick={handleAdd}
                            disabled={categorySaving || !newName.trim()}
                            className="h-11 px-5 bg-main-primary text-main-white font-semibold shrink-0"
                        >
                            + Add
                        </Button>
                    </div>
                    <p className="text-xs text-main-sharkGray mt-1.5">
                        Press Enter or click Add to create a new category
                    </p>
                </div>

                {/* Existing categories */}
                <div>
                    <p className="text-sm font-semibold text-main-mirage mb-3">
                        Existing Categories{" "}
                        <span className="text-main-sharkGray font-normal">
                            ({categories.length})
                        </span>
                    </p>

                    {categoriesLoading ? (
                        <div className="space-y-2">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-12 rounded-xl bg-main-whiteMarble animate-pulse"
                                />
                            ))}
                        </div>
                    ) : categories.length === 0 ? (
                        <NoDataFound
                            title="No categories found"
                            description="We couldn't find any categories."
                        />
                    ) : (
                        <div className="space-y-2">
                            {categories.map((cat, idx) => (
                                <div
                                    key={cat.id}
                                    className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-main-whiteMarble hover:bg-main-luxuryWhite transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={clsx(
                                                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-main-white shrink-0",
                                                "bg-main-primary"
                                            )}
                                        >
                                            {idx + 1}
                                        </span>
                                        <span className="text-sm font-medium text-main-mirage">
                                            {cat.name}
                                        </span>
                                        {cat.ticket_count !== undefined && (
                                            <span className="text-xs text-main-sharkGray">
                                                ({cat.ticket_count} ticket{cat.ticket_count !== 1 ? "s" : ""})
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => deleteCategory(cat.id)}
                                        className="p-1.5 text-main-remove hover:bg-main-remove/10 rounded-lg transition-colors shrink-0"
                                        title="Delete category"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CommonModalBody>

            <CommonModalFooter>
                <Button
                    onClick={() => onOpenChange(false)}
                    className="h-11 px-8 bg-main-primary text-main-white font-semibold"
                >
                    Done
                </Button>
            </CommonModalFooter>
        </CommonModal>
    );
};

export default ManageCategoriesModal;
