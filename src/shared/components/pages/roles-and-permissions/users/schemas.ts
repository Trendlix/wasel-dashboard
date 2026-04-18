import { z } from "zod";

export const inviteSchema = z.object({
    email: z.string().email("Invalid email address"),
    role_id: z.number({ message: "Please select a role" }).min(1, "Please select a role"),
});

export const editSchema = z.object({
    role_id: z.number().min(1, "Please select a role"),
    status: z.enum(["active", "blocked", "twofa"]),
});

export type InviteFormValues = z.infer<typeof inviteSchema>;
export type EditFormValues = z.infer<typeof editSchema>;
