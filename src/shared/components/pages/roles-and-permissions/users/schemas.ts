import { z } from "zod";

/** Single-key lookups only; avoids `t()` overload ambiguity with Zod message factories. */
type RolesT = (key: string) => string;

export const createInviteSchema = (t: RolesT) =>
    z.object({
        email: z.string().email(t("validation.inviteEmailInvalid")),
        role_id: z.number({ message: t("validation.selectRole") }).min(1, t("validation.selectRole")),
    });

export const createEditSchema = (t: RolesT) =>
    z.object({
        role_id: z.number().min(1, t("validation.selectRole")),
        status: z.enum(["active", "blocked", "twofa"]),
    });

export type InviteFormValues = z.infer<ReturnType<typeof createInviteSchema>>;
export type EditFormValues = z.infer<ReturnType<typeof createEditSchema>>;
