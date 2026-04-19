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
import { CommonInput } from "@/shared/components/common/FormItems";
import useUserManagementStore from "@/shared/hooks/store/useUserManagementStore";
import useRolesStore from "@/shared/hooks/store/useRolesStore";
import RoleSelect from "./RoleSelect";
import { createInviteSchema, type InviteFormValues } from "./schemas";
import {
    CommonModal,
    CommonModalHeader,
    CommonModalBody,
    CommonModalFooter,
} from "@/shared/components/common/CommonModal";

interface InviteModalProps {
    open: boolean;
    onOpenChange: (v: boolean) => void;
}

const InviteModal = ({ open, onOpenChange }: InviteModalProps) => {
    const { t } = useTranslation(["roles", "common"]);
    const { inviteUser, loading } = useUserManagementStore();
    const { roles, fetchRoles } = useRolesStore();

    const inviteSchema = useMemo(() => createInviteSchema((key) => t(key)), [t]);

    const form = useForm<InviteFormValues>({
        resolver: zodResolver(inviteSchema),
        defaultValues: { email: "", role_id: 0 },
    });

    useEffect(() => {
        if (open) {
            fetchRoles();
            form.reset({ email: "", role_id: 0 });
        }
    }, [open, fetchRoles, form]);

    const onSubmit = async (values: InviteFormValues) => {
        await inviteUser(values, { showToast: true, toastType: "success" });
        onOpenChange(false);
    };

    return (
        <CommonModal open={open} onOpenChange={onOpenChange} loading={loading} variant="success">
            <CommonModalHeader title={t("users.inviteTitle")} description={t("users.inviteDescription")} />

            <CommonModalBody className="space-y-5">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} id="invite-form" className="space-y-5">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="space-y-0">
                                    <FormControl>
                                        <CommonInput
                                            label={t("users.emailLabel")}
                                            placeholder={t("users.emailPlaceholder")}
                                            field={field}
                                        />
                                    </FormControl>
                                    <FormMessage className="mt-1.5" />
                                </FormItem>
                            )}
                        />

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
                    form="invite-form"
                    type="submit"
                    disabled={loading}
                    className="bg-main-vividMint hover:bg-main-vividMint/90 text-white font-bold h-11 px-8 common-rounded shadow-lg shadow-main-vividMint/20"
                >
                    {loading ? t("users.sending") : t("users.sendInvitation")}
                </Button>
            </CommonModalFooter>
        </CommonModal>
    );
};

export default InviteModal;
