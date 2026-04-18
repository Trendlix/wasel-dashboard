import { z } from "zod";

export const roleSchema = z.object({
    name: z.string().min(3, "Role name must be at least 3 characters").max(50, "Role name too long"),
    description: z.string().max(200, "Description too long").optional(),
    pages: z.array(z.string()).min(1, "Slect at least one page"),
});

export type RoleFormValues = z.infer<typeof roleSchema>;
