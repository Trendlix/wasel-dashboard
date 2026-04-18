import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
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
import { inviteSchema, type InviteFormValues } from "./schemas";
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
    const { inviteUser, loading } = useUserManagementStore();
    const { roles, fetchRoles } = useRolesStore();

    const form = useForm<InviteFormValues>({
        resolver: zodResolver(inviteSchema),
        defaultValues: { email: "", role_id: 0 },
    });

    useEffect(() => {
        if (open) {
            fetchRoles();
            form.reset({ email: "", role_id: 0 });
        }
    }, [open]);

    const onSubmit = async (values: InviteFormValues) => {
        await inviteUser(values, { showToast: true, toastType: "success" });
        onOpenChange(false);
    };

    return (
        <CommonModal open={open} onOpenChange={onOpenChange} loading={loading}>
            <CommonModalHeader
                title="Invite User"
                description="Send an invitation email to onboard a new admin user."
            />

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
                                            label="Email address"
                                            placeholder="user@wasel.com"
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
                                    <p className="text-sm font-semibold text-main-mirage mb-2">Assign Role</p>
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
                    Cancel
                </Button>
                <Button
                    form="invite-form"
                    type="submit"
                    disabled={loading}
                    className="bg-main-vividMint hover:bg-main-vividMint/90 text-white font-bold h-11 px-8 common-rounded shadow-lg shadow-main-vividMint/20"
                >
                    {loading ? "Sending..." : "Send Invitation"}
                </Button>
            </CommonModalFooter>
        </CommonModal>
    );
};

export default InviteModal;
