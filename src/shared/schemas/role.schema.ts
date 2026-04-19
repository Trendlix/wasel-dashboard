import { z } from "zod";

/** Single-key lookups only; avoids `t()` overload ambiguity with Zod message factories. */
type RolesT = (key: string) => string;

export const createRoleSchema = (t: RolesT) =>
    z.object({
        name: z.string().min(3, t("validation.roleNameMin")).max(50, t("validation.roleNameMax")),
        description: z.string().max(200, t("validation.descriptionMax")).optional(),
        pages: z.array(z.string()).min(1, t("validation.pagesMin")),
    });

export type RoleFormValues = z.infer<ReturnType<typeof createRoleSchema>>;
