import { z } from "zod";

const mobileRegex = /^(\+201|01|00201)[0-2,5]{1}[0-9]{8}$/;
const landlineRegex =
    /^(?:\+20|0020)?0?(?:2|3|40|45|47|48|50|55|57|62|64|65|66|68|69|82|84|86|88|92|93|95|96|97)\d{7,8}$/;

const emailField = (label: string) =>
    z
        .string()
        .trim()
        .min(1, `${label} is required`)
        .email(`Invalid ${label.toLowerCase()}`);

export const cmsContactEmailsSchema = z.object({
    general_support: emailField("General support email"),
    legal_inquiries: emailField("Legal inquiries email"),
    privacy_concerns: emailField("Privacy concerns email"),
    business_partnerships: emailField("Business partnerships email"),
});

export const cmsContactSchema = z.object({
    mobile: z
        .string()
        .trim()
        .min(1, "Mobile is required")
        .regex(mobileRegex, "Invalid mobile number"),
    landline: z
        .string()
        .trim()
        .min(1, "Landline is required")
        .regex(landlineRegex, "Invalid landline number"),
    email: z.string().trim().min(1, "Email is required").email("Invalid email"),
    address: z.string().trim().max(2000, "Address is too long"),
    business_hours: z.string().trim().max(500, "Business hours are too long"),
    emails: cmsContactEmailsSchema,
});

export type CmsContactForm = z.infer<typeof cmsContactSchema>;

export const mapContactZodErrors = (error: z.ZodError): Record<string, string> => {
    const next: Record<string, string> = {};
    for (const issue of error.issues) {
        const path = issue.path.join(".");
        if (!next[path]) next[path] = issue.message;
    }
    return next;
};
