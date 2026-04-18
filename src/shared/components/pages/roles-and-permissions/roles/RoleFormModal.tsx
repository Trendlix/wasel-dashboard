import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { roleSchema, RoleFormValues } from "@/shared/schemas/role.schema";
import clsx from "clsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CommonInput } from "@/shared/components/common/FormItems";
import type { AdminRole } from "@/shared/hooks/store/useRolesStore";
import { ROLE_PAGE_CATALOG } from "@/shared/constants/rolePagesCatalog";
import { extractEnabledPageKeys } from "@/shared/utils/rolePages";

interface RoleFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: RoleFormValues) => Promise<void>;
    initialData?: AdminRole | null;
    loading?: boolean;
}

const AVAILABLE_PAGES = ROLE_PAGE_CATALOG;

const RoleFormModal = ({
    open,
    onOpenChange,
    onSubmit,
    initialData,
    loading,
}: RoleFormModalProps) => {
    const form = useForm<RoleFormValues>({
        resolver: zodResolver(roleSchema),
        defaultValues: {
            name: "",
            description: "",
            pages: [],
        },
    });

    useEffect(() => {
        if (open) {
            if (initialData) {
                form.reset({
                    name: initialData.name,
                    description: initialData.description || "",
                    pages: extractEnabledPageKeys(initialData.pages),
                });
            } else {
                form.reset({
                    name: "",
                    description: "",
                    pages: [],
                });
            }
        }
    }, [open, initialData, form]);

    const watchedPages = form.watch("pages") || [];
    const allSelected = watchedPages.length === AVAILABLE_PAGES.length;

    const onFormSubmit = async (values: RoleFormValues) => {
        await onSubmit(values);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={!loading}
                onPointerDownOutside={(e) => loading && e.preventDefault()}
                onEscapeKeyDown={(e) => loading && e.preventDefault()}
                className="sm:max-w-[620px] bg-white p-0 border-0 ring-0 shadow-2xl rounded-3xl overflow-hidden outline-none"
            >
                <div className="flex flex-col h-full max-h-[85vh]">
                    {/* Header - Fixed */}
                    <div className="px-8 py-6 bg-white shrink-0">
                        <DialogHeader className="gap-1">
                            <DialogTitle className="text-2xl font-bold text-main-mirage tracking-tight">
                                {initialData ? "Edit Role" : "Create New Role"}
                            </DialogTitle>
                            <DialogDescription className="text-main-sharkGray text-sm">
                                {initialData
                                    ? "Refine the permissions for this role. Changes propagate instantly."
                                    : "Define access levels and system capabilities for this role."}
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    {/* Scrollable Form Content */}
                    <div className="flex-1 overflow-y-auto px-8 py-2 custom-scrollbar">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onFormSubmit)} id="role-form" className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="space-y-0">
                                            <FormControl>
                                                <CommonInput
                                                    label="Role name"
                                                    placeholder="Enter a descriptive role name"
                                                    field={field}
                                                />
                                            </FormControl>
                                            <FormMessage className="mt-1.5" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem className="space-y-0">
                                            <FormControl>
                                                <CommonInput
                                                    type="textarea"
                                                    label="Description"
                                                    placeholder="What responsibilities does this role have?"
                                                    field={field}
                                                />
                                            </FormControl>
                                            <FormMessage className="mt-1.5" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="pages"
                                    render={() => (
                                        <FormItem>
                                            <div className="flex items-center justify-between mb-5">
                                                <div>
                                                    <FormLabel className="text-sm font-semibold text-main-mirage">System Access</FormLabel>
                                                    <p className="text-xs text-main-sharkGray mt-1">Select the modules this role can access.</p>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className={clsx(
                                                        "h-8 px-3 text-xs font-medium rounded-lg transition-colors",
                                                        allSelected
                                                            ? "bg-main-primary/10 text-main-primary border-main-primary/20 hover:bg-main-primary/20"
                                                            : "hover:bg-main-titaniumWhite"
                                                    )}
                                                    onClick={() => {
                                                        if (allSelected) {
                                                            form.setValue("pages", [], { shouldValidate: true });
                                                        } else {
                                                            form.setValue("pages", AVAILABLE_PAGES.map(p => p.id), { shouldValidate: true });
                                                        }
                                                    }}
                                                >
                                                    {allSelected ? "Deselect All" : "Select All"}
                                                </Button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                {AVAILABLE_PAGES.map((page) => (
                                                    <FormField
                                                        key={page.id}
                                                        control={form.control}
                                                        name="pages"
                                                        render={({ field }) => {
                                                            const isChecked = field.value?.includes(page.id);
                                                            return (
                                                                <FormItem
                                                                    key={page.id}
                                                                    className={clsx(
                                                                        "flex flex-row items-center space-x-3 space-y-0 p-3 rounded-2xl transition-all duration-200 cursor-pointer border",
                                                                        isChecked
                                                                            ? "bg-main-primary/[0.03] border-main-primary/20 shadow-sm"
                                                                            : "bg-main-titaniumWhite border-transparent hover:border-main-whiteMarble"
                                                                    )}
                                                                >
                                                                    <FormControl>
                                                                        <Checkbox
                                                                            checked={isChecked}
                                                                            onCheckedChange={(checked) => {
                                                                                const newValue = checked
                                                                                    ? [...(field.value || []), page.id]
                                                                                    : field.value?.filter((value) => value !== page.id);
                                                                                field.onChange(newValue);
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel className={clsx(
                                                                        "font-medium text-sm cursor-pointer flex-1 py-1 transition-colors mt-0",
                                                                        isChecked ? "text-main-primary" : "text-main-mirage"
                                                                    )}>
                                                                        {page.label}
                                                                    </FormLabel>
                                                                </FormItem>
                                                            );
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </form>
                        </Form>
                    </div>

                    {/* Footer - Fixed */}
                    <div className="px-8 py-6 bg-main-titaniumWhite/30 shrink-0 flex justify-end gap-3 mt-4 border-t border-main-whiteMarble">
                        <Button
                            type="button"
                            variant="ghost"
                            className="text-main-sharkGray hover:text-main-mirage hover:bg-main-titaniumWhite px-6 h-11 rounded-xl"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Discard
                        </Button>
                        <Button
                            form="role-form"
                            type="submit"
                            disabled={loading}
                            className="bg-main-primary hover:bg-main-primary/90 text-white font-bold h-11 px-10 rounded-xl shadow-lg shadow-main-primary/20 transition-all active:scale-[0.98]"
                        >
                            {loading ? "Processing..." : initialData ? "Update Role" : "Create Role"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default RoleFormModal;
