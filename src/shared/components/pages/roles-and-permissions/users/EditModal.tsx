import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import useUserManagementStore, { type AdminUser } from "@/shared/hooks/store/useUserManagementStore";
import useRolesStore from "@/shared/hooks/store/useRolesStore";
import RoleSelect from "./RoleSelect";
import StatusSelect from "./StatusSelect";
import { createEditSchema, type EditFormValues } from "./schemas";
import {
    CommonModal,
    CommonModalHeader,
    CommonModalBody,
    CommonModalFooter,
} from "@/shared/components/common/CommonModal";

interface EditModalProps {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    user: AdminUser | null;
}

const EditModal = ({ open, onOpenChange, user }: EditModalProps) => {
    const { t } = useTranslation(["roles", "common"]);
    const { updateUser, loading } = useUserManagementStore();
    const { roles, fetchRoles } = useRolesStore();
    const isSuperAdmin = user?.role?.slug === "super-admin";

    const editSchema = useMemo(() => createEditSchema((key) => t(key)), [t]);

    const form = useForm<EditFormValues>({
        resolver: zodResolver(editSchema),
        defaultValues: { role_id: 0, status: "active" },
    });

    useEffect(() => {
        if (open && user) {
            fetchRoles();
            form.reset({
                role_id: user.role?.id || 0,
                status: user.status,
            });
        }
    }, [open, user, fetchRoles, form]);

    const onSubmit = async (values: EditFormValues) => {
        if (!user) return;
        await updateUser(
            user.id,
            {
                role_id: Number(values.role_id),
                status: values.status as "active" | "blocked" | "twofa",
            },
            { showToast: true, toastType: "success" },
        );
        onOpenChange(false);
    };

    return (
        <CommonModal open={open} onOpenChange={onOpenChange} loading={loading}>
            <CommonModalHeader
                title={t("users.editTitle")}
                description={t("users.editDescription", {
                    name: user?.name ?? t("users.editFallbackName"),
                })}
            />

            <CommonModalBody>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} id="edit-user-form" className="space-y-6">
                        {!isSuperAdmin && (
                            <FormField
                                control={form.control}
                                name="role_id"
                                render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <p className="text-sm font-semibold text-main-mirage mb-2">{t("users.assignRole")}</p>
                                        <FormControl>
                                            <RoleSelect
                                                value={field.value}
                                                onChange={field.onChange}
                                                roles={roles.filter((r) => r.slug !== "super-admin")}
                                            />
                                        </FormControl>
                                        <FormMessage className="mt-1.5" />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem className="space-y-0">
                                    <p className="text-sm font-semibold text-main-mirage mb-2">{t("users.accountStatus")}</p>
                                    <FormControl>
                                        <StatusSelect value={field.value} onChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage className="mt-1.5" />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            </CommonModalBody>

            <CommonModalFooter>
                <Button
                    type="button"
                    variant="ghost"
                    className="text-main-sharkGray hover:text-main-mirage hover:bg-main-titaniumWhite px-6 h-11 common-rounded"
                    onClick={() => onOpenChange(false)}
                    disabled={loading}
                >
                    {t("common:cancel")}
                </Button>
                <Button
                    form="edit-user-form"
                    type="submit"
                    disabled={loading}
                    className="bg-main-primary hover:bg-main-primary/90 text-white font-bold h-11 px-8 common-rounded shadow-lg shadow-main-primary/20"
                >
                    {loading ? t("users.saving") : t("users.saveChanges")}
                </Button>
            </CommonModalFooter>
        </CommonModal>
    );
};

export default EditModal;
