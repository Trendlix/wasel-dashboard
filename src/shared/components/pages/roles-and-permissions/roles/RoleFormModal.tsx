import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { createRoleSchema, RoleFormValues } from "@/shared/schemas/role.schema";
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
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CommonInput } from "@/shared/components/common/FormItems";
import type { AdminRole } from "@/shared/hooks/store/useRolesStore";
import { ROLE_PAGE_CATALOG } from "@/shared/constants/rolePagesCatalog";
import { extractEnabledPageKeys } from "@/shared/utils/rolePages";
import {
    LayoutDashboard,
    Users,
    Car,
    BadgeCheck,
    Route,
    BarChart2,
    Bell,
    Settings2,
    Layers,
    FileText,
    ShieldCheck,
    BadgeDollarSign,
    Tag,
    Database,
    LifeBuoy,
    ShoppingCart,
    UserCircle,
    BookOpen,
    Wallet,
    Warehouse,
    Check,
    LucideIcon,
} from "lucide-react";

const PAGE_ICONS: Record<string, LucideIcon> = {
    dashboard: LayoutDashboard,
    users: Users,
    drivers: Car,
    verification: BadgeCheck,
    trips: Route,
    analytics: BarChart2,
    notifications: Bell,
    settings: Settings2,
    cms: Layers,
    "legal-help": FileText,
    "roles-and-permissions": ShieldCheck,
    "commission-and-pricing": BadgeDollarSign,
    "voucher-and-promo": Tag,
    "trucks-storages-data": Database,
    "support-tickets": LifeBuoy,
    orders: ShoppingCart,
    customers: UserCircle,
    blogs: BookOpen,
    "wallet-and-finance": Wallet,
    "storage-owners": Warehouse,
};

interface RoleFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: RoleFormValues) => Promise<void>;
    initialData?: AdminRole | null;
    loading?: boolean;
    /** Shown when save fails (e.g. network); cleared when `open` becomes true. */
    requestError?: string | null;
}

const AVAILABLE_PAGES = ROLE_PAGE_CATALOG;

const RoleFormModal = ({ open, onOpenChange, onSubmit, initialData, loading, requestError }: RoleFormModalProps) => {
    const { t } = useTranslation(["roles", "common"]);

    const roleSchema = useMemo(() => createRoleSchema((key) => t(key)), [t]);

    const form = useForm<RoleFormValues>({
        resolver: zodResolver(roleSchema),
        defaultValues: {
            name: "",
            description: "",
            pages: [],
        },
    });

    useEffect(() => {
        if (!open) return;
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
    }, [open, initialData, form]);

    const watchedPages = form.watch("pages") || [];
    const allSelected = watchedPages.length === AVAILABLE_PAGES.length;

    const onFormSubmit = async (values: RoleFormValues) => {
        await onSubmit(values);
        onOpenChange(false);
    };

    const pageLabel = (id: string, fallback: string) => String(t(`pages.${id}`, { defaultValue: fallback }));

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={!loading}
                onPointerDownOutside={(e) => loading && e.preventDefault()}
                onEscapeKeyDown={(e) => loading && e.preventDefault()}
                className="sm:max-w-[620px] bg-white p-0 border-0 ring-0 shadow-2xl rounded-3xl overflow-hidden outline-none"
            >
                <div className="flex flex-col h-full max-h-[85vh]">
                    <div className="px-8 py-6 bg-white shrink-0">
                        <DialogHeader className="gap-1">
                            <DialogTitle className="text-2xl font-bold text-main-mirage tracking-tight">
                                {initialData ? t("roleForm.editTitle") : t("roleForm.createTitle")}
                            </DialogTitle>
                            <DialogDescription className="text-main-sharkGray text-sm">
                                {initialData ? t("roleForm.editDescription") : t("roleForm.createDescription")}
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    <div className="flex-1 overflow-y-auto px-8 py-2 custom-scrollbar">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onFormSubmit)} id="role-form" className="space-y-8">
                                {requestError ? (
                                    <p className="text-xs font-medium text-red-600" role="alert">
                                        {requestError}
                                    </p>
                                ) : null}
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="space-y-0">
                                            <FormControl>
                                                <CommonInput
                                                    label={t("roleForm.roleName")}
                                                    placeholder={t("roleForm.roleNamePlaceholder")}
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
                                                    label={t("roleForm.description")}
                                                    placeholder={t("roleForm.descriptionPlaceholder")}
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
                                            <div className="flex items-center justify-between mb-4 gap-2">
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-main-mirage">{t("roleForm.systemAccess")}</p>
                                                    <p className="text-xs text-main-sharkGray mt-0.5">
                                                        {watchedPages.length === 0
                                                            ? t("roleForm.modulesSummaryNone")
                                                            : t("roleForm.modulesSummary", {
                                                                  count: watchedPages.length,
                                                                  total: AVAILABLE_PAGES.length,
                                                              })}
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    className={clsx(
                                                        "h-8 px-3.5 text-xs font-semibold rounded-lg border transition-all shrink-0",
                                                        allSelected
                                                            ? "bg-main-primary/10 text-main-primary border-main-primary/25 hover:bg-main-primary/20"
                                                            : "bg-main-titaniumWhite text-main-sharkGray border-main-whiteMarble hover:border-main-sharkGray/30 hover:text-main-mirage",
                                                    )}
                                                    onClick={() => {
                                                        if (allSelected) {
                                                            form.setValue("pages", [], { shouldValidate: true });
                                                        } else {
                                                            form.setValue(
                                                                "pages",
                                                                AVAILABLE_PAGES.map((p) => p.id),
                                                                { shouldValidate: true },
                                                            );
                                                        }
                                                    }}
                                                >
                                                    {allSelected ? t("roleForm.deselectAll") : t("roleForm.selectAll")}
                                                </button>
                                            </div>

                                            <div className="w-full h-1 rounded-full bg-main-whiteMarble mb-5 overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-main-primary transition-all duration-300"
                                                    style={{
                                                        width: `${(watchedPages.length / AVAILABLE_PAGES.length) * 100}%`,
                                                    }}
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-2.5">
                                                {AVAILABLE_PAGES.map((page) => (
                                                    <FormField
                                                        key={page.id}
                                                        control={form.control}
                                                        name="pages"
                                                        render={({ field }) => {
                                                            const isChecked = field.value?.includes(page.id);
                                                            const Icon = PAGE_ICONS[page.id] ?? Layers;
                                                            const label = pageLabel(page.id, page.label);
                                                            const toggle = () => {
                                                                const next = isChecked
                                                                    ? field.value?.filter((v) => v !== page.id)
                                                                    : [...(field.value || []), page.id];
                                                                field.onChange(next);
                                                            };
                                                            return (
                                                                <FormItem
                                                                    key={page.id}
                                                                    onClick={toggle}
                                                                    className={clsx(
                                                                        "relative flex items-center gap-3 p-3 rounded-xl border cursor-pointer select-none transition-all duration-150 space-y-0",
                                                                        isChecked
                                                                            ? "bg-main-primary/[0.04] border-main-primary/30 shadow-sm shadow-main-primary/5"
                                                                            : "bg-main-titaniumWhite/60 border-main-whiteMarble hover:border-main-sharkGray/20 hover:bg-main-titaniumWhite",
                                                                    )}
                                                                >
                                                                    <div
                                                                        className={clsx(
                                                                            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                                                                            isChecked ? "bg-main-primary/10" : "bg-main-whiteMarble/60",
                                                                        )}
                                                                    >
                                                                        <Icon
                                                                            className={clsx(
                                                                                "w-4 h-4",
                                                                                isChecked ? "text-main-primary" : "text-main-sharkGray/60",
                                                                            )}
                                                                        />
                                                                    </div>

                                                                    <span
                                                                        className={clsx(
                                                                            "text-sm font-medium leading-tight flex-1 transition-colors",
                                                                            isChecked ? "text-main-primary" : "text-main-mirage/80",
                                                                        )}
                                                                    >
                                                                        {label}
                                                                    </span>

                                                                    <div
                                                                        className={clsx(
                                                                            "w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-150",
                                                                            isChecked
                                                                                ? "bg-main-primary scale-100 opacity-100"
                                                                                : "border border-main-whiteMarble scale-90 opacity-60",
                                                                        )}
                                                                    >
                                                                        {isChecked ? <Check className="w-3 h-3 text-white stroke-3" /> : null}
                                                                    </div>

                                                                    <FormControl>
                                                                        <span className="sr-only">{label}</span>
                                                                    </FormControl>
                                                                </FormItem>
                                                            );
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                            <FormMessage className="mt-3" />
                                        </FormItem>
                                    )}
                                />
                            </form>
                        </Form>
                    </div>

                    <div className="px-8 py-6 bg-main-titaniumWhite/30 shrink-0 flex justify-end gap-3 mt-4 border-t border-main-whiteMarble">
                        <Button
                            type="button"
                            variant="ghost"
                            className="text-main-sharkGray hover:text-main-mirage hover:bg-main-titaniumWhite px-6 h-11 rounded-xl"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            {t("common:cancel")}
                        </Button>
                        <Button
                            form="role-form"
                            type="submit"
                            disabled={loading}
                            className="bg-main-primary hover:bg-main-primary/90 text-white font-bold h-11 px-10 rounded-xl shadow-lg shadow-main-primary/20 transition-all active:scale-[0.98]"
                        >
                            {loading
                                ? t("roleForm.processing")
                                : initialData
                                  ? t("roleForm.updateSubmit")
                                  : t("roleForm.createSubmit")}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default RoleFormModal;
