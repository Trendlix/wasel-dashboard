import { z } from "zod";
import type { Graph, Thing, WithContext } from "schema-dts";
import type { SeoPage } from "@/shared/hooks/store/useCmsSeoStore";

export type JsonLdScript = Graph | WithContext<Thing> | Record<string, unknown>;

const parseSchemaScript = (
    raw: string
): { ok: true; value: JsonLdScript } | { ok: false; message: string } => {
    const trimmed = raw.trim();
    if (!trimmed) {
        return { ok: false, message: "Schema script is required." };
    }

    let parsed: unknown;
    try {
        parsed = JSON.parse(trimmed);
    } catch {
        return { ok: false, message: "Schema must be valid JSON." };
    }

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        return { ok: false, message: "Schema must be a JSON object." };
    }

    const schemaObj = parsed as JsonLdScript;
    const schemaRecord = schemaObj as Record<string, unknown>;
    const typeValue = schemaRecord["@type"];
    const graphValue = schemaRecord["@graph"];
    const hasType = typeof typeValue === "string" && typeValue.trim().length > 0;
    const hasGraph = Array.isArray(graphValue) && graphValue.length > 0;

    if (!hasType && !hasGraph) {
        return { ok: false, message: "Schema should include @type or non-empty @graph." };
    }

    return { ok: true, value: schemaObj };
};

export const schemaValueToScripts = (value: unknown): string[] => {
    if (!value) return [""];

    const normalizeObject = (obj: unknown): JsonLdScript | null => {
        if (!obj || typeof obj !== "object" || Array.isArray(obj)) return null;
        return obj as JsonLdScript;
    };

    if (typeof value === "string") {
        try {
            const parsed = JSON.parse(value);
            return schemaValueToScripts(parsed);
        } catch {
            return [value];
        }
    }

    if (Array.isArray(value)) {
        const scripts = value
            .map((item) => normalizeObject(item))
            .filter((item): item is JsonLdScript => item !== null)
            .map((item) => JSON.stringify(item, null, 2));
        return scripts.length > 0 ? scripts : [""];
    }

    const obj = normalizeObject(value);
    return obj ? [JSON.stringify(obj, null, 2)] : [""];
};

export const parseSchemaScriptsForApi = (scripts: string[]): JsonLdScript[] =>
    scripts
        .map((item) => parseSchemaScript(item))
        .filter((result): result is { ok: true; value: JsonLdScript } => result.ok)
        .map((result) => result.value);

export const seoPageSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Meta title is required")
        .max(160, "Meta title must be 160 characters or less"),
    description: z
        .string()
        .trim()
        .min(1, "Meta description is required")
        .max(320, "Meta description must be 320 characters or less"),
    keywords: z
        .array(z.string().trim().min(1, "Keyword must not be empty"))
        .min(1, "At least one keyword is required")
        .max(30, "Maximum 30 keywords allowed"),
    alt_img: z
        .string()
        .trim()
        .max(255, "Alt image text must be 255 characters or less"),
    schema_scripts: z
        .array(z.string())
        .min(1, "At least one schema script is required")
        .max(20, "Maximum 20 schema scripts are allowed"),
}).superRefine((value, ctx) => {
    value.schema_scripts.forEach((script, index) => {
        const result = parseSchemaScript(script);
        if (!result.ok) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "message" in result ? result.message : "Invalid schema JSON.",
                path: ["schema_scripts", index],
            });
        }
    });
});

/** Produces error keys in the form `${page}.en.field` / `${page}.ar.keywords.0`. */
export const mapSeoZodErrors = (
    page: SeoPage,
    error: z.ZodError,
): Record<string, string> => {
    const next: Record<string, string> = {};
    for (const issue of error.issues) {
        const [locale, ...rest] = issue.path;
        const key = `${page}.${String(locale)}.${rest.map(String).join(".")}`;
        if (!next[key]) next[key] = issue.message;
    }
    return next;
};

export const bilingualSeoPageSchema = z.object({
    en: seoPageSchema,
    ar: seoPageSchema,
});
