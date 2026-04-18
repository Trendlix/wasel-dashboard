"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import MonacoEditor from "@monaco-editor/react";
import RichTextEditorLib from "reactjs-tiptap-editor";
import { BaseKit } from "reactjs-tiptap-editor";
import { Bold } from "reactjs-tiptap-editor/bold";
import { Italic } from "reactjs-tiptap-editor/italic";
import { TextUnderline } from "reactjs-tiptap-editor/textunderline";
import { Color } from "reactjs-tiptap-editor/color";
import { Highlight } from "reactjs-tiptap-editor/highlight";
import { FontSize } from "reactjs-tiptap-editor/fontsize";
import { FontFamily } from "reactjs-tiptap-editor/fontfamily";
import { FormatPainter } from "reactjs-tiptap-editor/formatpainter";
import { TextAlign } from "reactjs-tiptap-editor/textalign";
import { LineHeight } from "reactjs-tiptap-editor/lineheight";
import { Indent } from "reactjs-tiptap-editor/indent";
import { Heading } from "reactjs-tiptap-editor/heading";
import { Blockquote } from "reactjs-tiptap-editor/blockquote";
import { HorizontalRule } from "reactjs-tiptap-editor/horizontalrule";
import { ListItem } from "reactjs-tiptap-editor/listitem";
import { BulletList } from "reactjs-tiptap-editor/bulletlist";
import { OrderedList } from "reactjs-tiptap-editor/orderedlist";
import { TableOfContents } from "reactjs-tiptap-editor/tableofcontent";
import { Clear } from "reactjs-tiptap-editor/clear";
import { Image } from "reactjs-tiptap-editor/image";
import { Video } from "reactjs-tiptap-editor/video";
import { Iframe } from "reactjs-tiptap-editor/iframe";
import { Link } from "reactjs-tiptap-editor/link";
import { Code } from "reactjs-tiptap-editor/code";
import { CodeBlock } from "reactjs-tiptap-editor/codeblock";
import { ImportWord } from "reactjs-tiptap-editor/importword";
import { ExportWord } from "reactjs-tiptap-editor/exportword";
import { ExportPdf } from "reactjs-tiptap-editor/exportpdf";
import { Emoji } from "reactjs-tiptap-editor/emoji";
import { SearchAndReplace } from "reactjs-tiptap-editor/searchandreplace";
import { History } from "reactjs-tiptap-editor/history";
import { Document } from "reactjs-tiptap-editor/document";
import "react-image-crop/dist/ReactCrop.css";
import "prism-code-editor-lightweight/layout.css";
import "prism-code-editor-lightweight/themes/github-dark.css";
import "reactjs-tiptap-editor/style.css";
import { ImagePlus } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputClass =
    "w-full bg-main-titaniumWhite h-[48px] common-rounded px-3 py-2 text-sm text-main-mirage placeholder:text-main-silverSteel focus:outline-none focus:ring-2 focus:ring-main-primary/20 focus:bg-white transition-colors border-0";

// ─── CommonLabel ──────────────────────────────────────────────────────────────

export function CommonLabel({ label }: { label: string }) {
    return (
        <label className="text-sm font-medium text-main-sharkGray block">{label}</label>
    );
}

// ─── CommonInput ──────────────────────────────────────────────────────────────

type CommonInputProps = {
    label: string;
    placeholder?: string;
    field: any;
    type?: "text" | "slug" | "list" | "textarea";
    options?: string[];
    isSlug?: boolean;
};

const toSlugValue = (val: string) =>
    val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

export function CommonInput({
    label,
    placeholder,
    field,
    type,
    options,
    isSlug,
}: CommonInputProps) {
    const ph = placeholder || label;
    const isSlugType = isSlug || type === "slug";

    if (type === "list" && options) {
        return (
            <div className="space-y-2">
                <CommonLabel label={label} />
                <Select value={field.value ?? ""} onValueChange={field.onChange}>
                    <SelectTrigger className={inputClass}>
                        <SelectValue placeholder={ph} />
                    </SelectTrigger>
                    <SelectContent position="popper">
                        {options.map((o) => (
                            <SelectItem key={o} value={o}>
                                {o}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        );
    }

    if (type === "textarea") {
        return (
            <div className="space-y-2">
                <CommonLabel label={label} />
                <textarea
                    {...field}
                    placeholder={ph}
                    className={`${inputClass} min-h-[100px] resize-y`}
                />
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <CommonLabel label={label} />
            <input
                {...field}
                type="text"
                placeholder={ph}
                autoComplete="off"
                value={field.value ?? ""}
                className={inputClass}
                onChange={(e) => {
                    field.onChange(isSlugType ? toSlugValue(e.target.value) : e);
                }}
                onBlur={(e) => {
                    if (isSlugType) field.onChange(toSlugValue(e.target.value));
                    field.onBlur?.();
                }}
            />
        </div>
    );
}

// ─── CommonFileInput ──────────────────────────────────────────────────────────

type CommonFileInputProps = {
    label: string;
    field: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function CommonFileInput({ label, field, onChange }: CommonFileInputProps) {
    const [preview, setPreview] = React.useState<string | null>(null);

    React.useEffect(() => {
        let url: string | undefined;
        if (!field.value) {
            setPreview(null);
        } else if (field.value instanceof File) {
            url = URL.createObjectURL(field.value);
            setPreview(url);
        } else if (typeof field.value === "string" && field.value.length > 0) {
            setPreview(field.value);
        } else {
            setPreview(null);
        }
        return () => {
            if (url) URL.revokeObjectURL(url);
        };
    }, [field.value]);

    const handleBlur = React.useCallback(() => {
        if (typeof field?.onBlur === "function") {
            field.onBlur();
        }
    }, [field]);

    const handleRef = React.useCallback((node: HTMLInputElement | null) => {
        if (typeof field?.ref === "function") {
            field.ref(node);
        }
    }, [field]);

    return (
        <div className="space-y-2">
            <CommonLabel label={label} />
            <label
                htmlFor={`file-${label}`}
                className="block w-36 h-36 border-2 border-dashed border-main-sharkGray/30 rounded-2xl bg-main-titaniumWhite cursor-pointer hover:border-main-primary/50 hover:bg-main-luxuryWhite overflow-hidden relative transition-colors group"
            >
                {preview ? (
                    <img src={preview} alt="Cover preview" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                        <ImagePlus className="h-10 w-10 text-main-sharkGray/60 group-hover:text-main-primary/60 transition-colors" strokeWidth={1.5} />
                        <span className="text-xs text-main-sharkGray/70 text-center px-2 leading-snug">
                            Upload cover<br />image
                        </span>
                    </div>
                )}
            </label>
            <input
                id={`file-${label}`}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onChange}
                onBlur={handleBlur}
                ref={handleRef}
            />
        </div>
    );
}

// ─── TagsInput ────────────────────────────────────────────────────────────────

export function TagsInput({
    label,
    value = [],
    onChange,
    placeholder,
}: {
    label: string;
    value: string[];
    onChange: (val: string[]) => void;
    placeholder?: string;
}) {
    const [inputValue, setInputValue] = React.useState("");

    const addTag = (raw: string) => {
        const tag = raw.trim();
        if (!tag || value.includes(tag)) return;
        onChange([...value, tag]);
        setInputValue("");
    };

    const removeTag = (tag: string) => onChange(value.filter((t) => t !== tag));

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag(inputValue);
        } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
            removeTag(value[value.length - 1]);
        }
    };

    return (
        <div className="space-y-2">
            <CommonLabel label={label} />
            <div className="flex min-h-[52px] flex-wrap gap-2 common-rounded bg-main-titaniumWhite px-3 py-2 focus-within:bg-white focus-within:ring-2 focus-within:ring-main-primary/20 transition-colors">
                {value.map((tag) => (
                    <span
                        key={tag}
                        className="bg-main-primary/10 text-main-primary px-2.5 py-0.5 rounded-full flex items-center gap-1.5 text-xs font-medium"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:text-main-primary/60 leading-none"
                        >
                            ×
                        </button>
                    </span>
                ))}
                <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={() => addTag(inputValue)}
                    placeholder={value.length === 0 ? (placeholder || "Type and press Enter") : ""}
                    className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-main-mirage placeholder:text-main-silverSteel"
                />
            </div>
        </div>
    );
}


// ─── CreatableTagCombobox (single value as tag) ─────────────────────────────

export function CreatableTagCombobox({
    label,
    value,
    onChange,
    options,
    placeholder = "Select or type to add…",
    disabled = false,
}: {
    label?: string;
    value: string;
    onChange: (next: string) => void;
    options: string[];
    placeholder?: string;
    disabled?: boolean;
}) {
    const wrapperRef = React.useRef<HTMLDivElement | null>(null);
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    const [query, setQuery] = React.useState("");
    const [open, setOpen] = React.useState(false);

    const normalized = React.useMemo(() => {
        const seen = new Set<string>();
        const out: string[] = [];
        for (const raw of options) {
            const v = String(raw ?? "").trim();
            if (!v) continue;
            const key = v.toLowerCase();
            if (seen.has(key)) continue;
            seen.add(key);
            out.push(v);
        }
        return out;
    }, [options]);

    const filtered = React.useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return normalized;
        return normalized.filter((o) => o.toLowerCase().includes(q));
    }, [normalized, query]);

    const canCreate = React.useMemo(() => {
        const q = query.trim();
        if (!q) return false;
        const qLower = q.toLowerCase();
        return !normalized.some((o) => o.toLowerCase() === qLower);
    }, [normalized, query]);

    const commit = (raw: string) => {
        const next = raw.trim();
        if (!next) return;
        onChange(next);
        setQuery("");
        setOpen(false);
        inputRef.current?.blur();
    };

    React.useEffect(() => {
        if (!open) return;
        const onMouseDown = (e: MouseEvent) => {
            if (!wrapperRef.current) return;
            if (wrapperRef.current.contains(e.target as Node)) return;
            setOpen(false);
            setQuery("");
        };
        document.addEventListener("mousedown", onMouseDown);
        return () => document.removeEventListener("mousedown", onMouseDown);
    }, [open]);

    return (
        <div className="space-y-2">
            {label ? <CommonLabel label={label} /> : null}

            <div ref={wrapperRef} className="relative">
                <div
                    className="flex flex-wrap items-center gap-1.5 min-h-11 w-full common-rounded border border-main-whiteMarble bg-main-white px-3 py-2 text-sm cursor-text focus-within:border-main-primary focus-within:ring-2 focus-within:ring-main-primary/40"
                    onClick={() => {
                        if (disabled) return;
                        inputRef.current?.focus();
                        setOpen(true);
                    }}
                >
                    {value?.trim() ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-main-primary/10 px-2.5 py-0.5 text-xs font-medium text-main-primary">
                            {value}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onChange("");
                                    setQuery("");
                                    setOpen(false);
                                }}
                                className="hover:text-main-primary/60 leading-none"
                                aria-label="Remove"
                                disabled={disabled}
                            >
                                ×
                            </button>
                        </span>
                    ) : null}

                    <input
                        ref={inputRef}
                        value={query}
                        disabled={disabled}
                        onFocus={() => {
                            if (disabled) return;
                            setOpen(true);
                        }}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setOpen(true);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                if (query.trim()) commit(query);
                                return;
                            }
                            if (e.key === "Escape") {
                                setOpen(false);
                                setQuery("");
                                (e.target as HTMLInputElement).blur();
                                return;
                            }
                            if (e.key === "Backspace" && !query && value) {
                                onChange("");
                            }
                        }}
                        placeholder={value?.trim() ? "" : placeholder}
                        className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-main-hydrocarbon placeholder:text-main-trueBlack/50"
                    />
                </div>

                {open && !disabled ? (
                    <div className="absolute z-50 mt-2 w-full overflow-hidden common-rounded border border-main-whiteMarble bg-main-white shadow-xl">
                        <div className="max-h-56 overflow-auto p-1">
                            {canCreate ? (
                                <button
                                    type="button"
                                    className="w-full text-left common-rounded px-3 py-2 text-sm outline-none transition-colors hover:bg-main-titaniumWhite"
                                    onClick={() => commit(query)}
                                >
                                    Add “{query.trim()}”
                                </button>
                            ) : null}

                            {filtered.length > 0 ? (
                                filtered.map((opt) => (
                                    <button
                                        key={opt}
                                        type="button"
                                        className="w-full text-left common-rounded px-3 py-2 text-sm outline-none transition-colors hover:bg-main-titaniumWhite"
                                        onClick={() => commit(opt)}
                                    >
                                        {opt}
                                    </button>
                                ))
                            ) : (
                                <p className="px-3 py-2 text-sm text-main-sharkGray">No results</p>
                            )}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

// ─── RichEditorField — integrates RichTextEditor with react-hook-form ─────────

export function RichEditorField({
    name,
    label,
    placeholder = "Write here...",
}: {
    name: string;
    label?: string;
    placeholder?: string;
}) {
    const { register, setValue, watch } = useFormContext();
    const content: string = watch(name) || "";

    React.useEffect(() => {
        register(name);
    }, [register, name]);

    return (
        <RichTextEditor
            label={label}
            value={content}
            placeholder={placeholder}
            onChange={(v) => setValue(name, v, { shouldValidate: true, shouldDirty: true })}
        />
    );
}

// ─── RichTextEditor ───────────────────────────────────────────────────────────

type RichTextEditorProps = {
    label?: string;
    value?: string;
    placeholder?: string;
    onChange?: (value: string) => void;
    onUploadFile?: (file: File, type: "image" | "video") => Promise<string | null>;
};

export function RichTextEditor({
    label,
    value = "",
    onChange,
    onUploadFile,
}: RichTextEditorProps) {
    const [isCode, setIsCode] = React.useState(false);

    const extensions = React.useMemo(
        () => [
            BaseKit.configure({
                placeholder: { showOnlyCurrent: true },
                characterCount: { limit: 100_000 },
            }),
            Bold, Italic, TextUnderline, Color, Highlight, FontSize, FontFamily,
            FormatPainter,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            LineHeight, Indent,
            Heading, Blockquote, HorizontalRule, ListItem, BulletList, OrderedList, TableOfContents, Clear,
            Image.configure({
                upload: async (file: File): Promise<string> => {
                    if (!onUploadFile) return "";
                    const url = await onUploadFile(file, "image");
                    return url ?? "";
                },
            }),
            Video.configure({
                upload: async (file: File): Promise<string> => {
                    if (!onUploadFile) return "";
                    const url = await onUploadFile(file, "video");
                    return url ?? "";
                },
            }),
            Iframe,
            Link.extend({
                renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
                    const attrs = Object.fromEntries(
                        Object.entries(HTMLAttributes).filter(([key]) => key !== "rel"),
                    );
                    return ["a", attrs, 0];
                },
            }).configure({
                HTMLAttributes: { target: "_blank", class: "link" },
            }),
            Code, CodeBlock,
            ImportWord, ExportWord, ExportPdf,
            Emoji, SearchAndReplace, History, Document,
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [onUploadFile],
    );

    return (
        <div className="space-y-2">
            {label && <CommonLabel label={label} />}
            <div className="relative">
                {isCode ? (
                    <MonacoEditor
                        height="400px"
                        defaultLanguage="html"
                        value={value}
                        onChange={(val) => onChange?.(val ?? "")}
                        beforeMount={(monaco) => {
                            monaco.editor.defineTheme("wasel-code", {
                                base: "vs",
                                inherit: true,
                                rules: [
                                    { token: "tag", foreground: "004aad", fontStyle: "bold" },
                                    { token: "attribute.name", foreground: "0969da" },
                                    { token: "attribute.value", foreground: "0a7a30" },
                                    { token: "comment", foreground: "99A1AF", fontStyle: "italic" },
                                    { token: "string", foreground: "0a7a30" },
                                    { token: "delimiter", foreground: "4A5565" },
                                ],
                                colors: {
                                    "editor.background": "#F9FAFB",
                                    "editor.foreground": "#101828",
                                    "editorLineNumber.foreground": "#99A1AF",
                                    "editorLineNumber.activeForeground": "#4A5565",
                                    "editor.lineHighlightBackground": "#F3F4F6",
                                    "editor.selectionBackground": "#004aad26",
                                    "editorCursor.foreground": "#004aad",
                                    "editorGutter.background": "#F9FAFB",
                                    "editorIndentGuide.background1": "#E5E7EB",
                                    "editorIndentGuide.activeBackground1": "#004aad44",
                                    "editor.findMatchBackground": "#004aad26",
                                    "editor.findMatchHighlightBackground": "#004aad14",
                                    "scrollbar.shadow": "#00000008",
                                    "scrollbarSlider.background": "#E5E7EB99",
                                    "scrollbarSlider.hoverBackground": "#99A1AF88",
                                    "minimap.background": "#F9FAFB",
                                },
                            });
                        }}
                        options={{
                            theme: "wasel-code",
                            minimap: { enabled: false },
                            wordWrap: "on",
                            fontSize: 13,
                            lineHeight: 22,
                            fontFamily: "'Geist Mono', 'Fira Code', 'Cascadia Code', monospace",
                            fontLigatures: true,
                            lineNumbers: "on",
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            tabSize: 2,
                            padding: { top: 16, bottom: 16 },
                            overviewRulerBorder: false,
                            hideCursorInOverviewRuler: true,
                            renderLineHighlight: "line",
                            bracketPairColorization: { enabled: true },
                            guides: { bracketPairs: true, indentation: true },
                            scrollbar: {
                                verticalScrollbarSize: 6,
                                horizontalScrollbarSize: 6,
                                useShadows: true,
                            },
                        }}
                        className="overflow-hidden rounded-xl border border-main-whiteMarble"
                    />
                ) : (
                    <div className="wasel-richtext">
                        <RichTextEditorLib
                            output="html"
                            contentClass="min-h-[270px]"
                            content={value}
                            onChangeContent={(val) => onChange?.(val)}
                            extensions={extensions}
                            dark={false}
                        />
                    </div>
                )}
                <div className="absolute -top-7 right-5 rtl:left-5 rtl:right-auto">
                    <button
                        type="button"
                        onClick={() => setIsCode((v) => !v)}
                        className="bg-main-primary/10 text-main-primary py-[0.36rem] px-5 rounded-md rounded-b-none text-xs cursor-pointer hover:bg-main-primary/20 duration-300 transition-colors"
                    >
                        {isCode ? "Switch to editor" : "Switch to code"}
                    </button>
                </div>
            </div>
        </div>
    );
}

/** @deprecated Use RichTextEditor */
export function TextAreaField(props: RichTextEditorProps) {
    return <RichTextEditor {...props} />;
}

/** @deprecated Use TagsInput */
export function SlugInput({
    label,
    value = "",
    placeholder = "post-title",
    onChange,
}: {
    label?: string;
    value?: string;
    placeholder?: string;
    onChange?: (slug: string) => void;
}) {
    const [slug, setSlug] = React.useState(value);
    React.useEffect(() => { setSlug(value); }, [value]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const next = toSlugValue(e.target.value);
        setSlug(next);
        onChange?.(next);
    };
    return (
        <>
            {label && <CommonLabel label={label} />}
            <input
                value={slug}
                onChange={handleChange}
                placeholder={placeholder}
                className={inputClass}
            />
        </>
    );
}
