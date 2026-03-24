"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import { EditorContent, useEditor } from "@tiptap/react";
import MonacoEditor from "@monaco-editor/react";
import type { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import UnderlineExtension from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import {
    AlignLeft, AlignCenter, AlignRight,
    Bold, Italic, List, ListOrdered,
    Type, ChevronDown, Underline as UnderlineIcon,
    Code, ImagePlus,
} from "lucide-react";

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputClass =
    "w-full bg-main-titaniumWhite h-[52px] rounded-lg px-3 py-2 text-sm text-main-mirage placeholder:text-main-silverSteel focus:outline-none focus:ring-2 focus:ring-main-primary/20 focus:bg-white transition-colors border-0";

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
                <select
                    {...field}
                    value={field.value ?? ""}
                    className={`${inputClass} cursor-pointer`}
                >
                    <option value="" disabled>
                        {ph}
                    </option>
                    {options.map((o) => (
                        <option key={o} value={o}>
                            {o}
                        </option>
                    ))}
                </select>
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
            <div className="flex min-h-[52px] flex-wrap gap-2 rounded-lg bg-main-titaniumWhite px-3 py-2 focus-within:bg-white focus-within:ring-2 focus-within:ring-main-primary/20 transition-colors">
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
};

const HEADING_OPTIONS = [
    { label: "Paragraph", level: 0 as const },
    { label: "Heading 1", level: 1 as const },
    { label: "Heading 2", level: 2 as const },
    { label: "Heading 3", level: 3 as const },
];

function ToolbarBtn({
    onClick,
    active = false,
    title,
    children,
}: {
    onClick: () => void;
    active?: boolean;
    title?: string;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            title={title}
            onClick={onClick}
            className={`p-1.5 rounded transition-colors ${active
                ? "bg-main-primary/10 text-main-primary"
                : "text-main-hydrocarbon hover:bg-main-titaniumWhite"
                }`}
        >
            {children}
        </button>
    );
}

export function RichTextEditor({ label, value = "", placeholder = "Write here...", onChange }: RichTextEditorProps) {
    const [viewMode, setViewMode] = React.useState<"visual" | "code">("visual");
    const [showHeadingMenu, setShowHeadingMenu] = React.useState(false);
    const [htmlSource, setHtmlSource] = React.useState(value);
    const headingMenuRef = React.useRef<HTMLDivElement>(null);

    const monacoBg = "#F5F7FA";

    const handleMonacoBeforeMount = (monaco: any) => {
        monaco.editor.defineTheme("wasel-editor", {
            base: "vs",
            inherit: true,
            rules: [],
            colors: {
                "editor.background": monacoBg,
                "editorGutter.background": monacoBg,
                "editorLineNumber.foreground": "#8A94A6",
                "editor.lineHighlightBackground": monacoBg,
                "minimap.background": monacoBg,
            },
        });
    };

    const editor = useEditor({
        extensions: [
            StarterKit,
            UnderlineExtension,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Placeholder.configure({ placeholder }),
        ],
        content: value || "",
        editorProps: {
            attributes: {
                class:
                    "ProseMirror min-h-[280px] w-full bg-main-titaniumWhite px-4 py-3 text-sm text-main-mirage outline-none",
            },
        },
        onUpdate: ({ editor }: { editor: Editor }) => {
            const html = editor.getHTML();
            setHtmlSource(html);
            onChange?.(html);
        },
        immediatelyRender: false,
    });

    React.useEffect(() => {
        if (!editor) return;
        const next = value || "";
        if (next !== editor.getHTML()) {
            editor.commands.setContent(next);
            setHtmlSource(next);
        }
    }, [value, editor]);

    React.useEffect(() => {
        const handleOutside = (e: MouseEvent) => {
            if (headingMenuRef.current && !headingMenuRef.current.contains(e.target as Node)) {
                setShowHeadingMenu(false);
            }
        };
        document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, []);

    const getCurrentHeadingLabel = () => {
        if (!editor) return "Paragraph";
        for (const o of HEADING_OPTIONS) {
            if (o.level > 0 && editor.isActive("heading", { level: o.level })) return o.label;
        }
        return "Paragraph";
    };

    const handleCodeChange = (html: string) => {
        setHtmlSource(html);
        editor?.commands.setContent(html);
        onChange?.(html);
    };

    return (
        <div className="space-y-2">
            {label && <CommonLabel label={label} />}

            <div className="overflow-hidden rounded-lg bg-main-titaniumWhite">
                <div className="flex items-center flex-wrap gap-0.5 px-2 py-1.5 bg-main-luxuryWhite">
                    <ToolbarBtn onClick={() => editor?.chain().focus().setTextAlign("left").run()} active={editor?.isActive({ textAlign: "left" }) ?? false} title="Align left">
                        <AlignLeft className="h-3.5 w-3.5" />
                    </ToolbarBtn>
                    <ToolbarBtn onClick={() => editor?.chain().focus().setTextAlign("center").run()} active={editor?.isActive({ textAlign: "center" }) ?? false} title="Align center">
                        <AlignCenter className="h-3.5 w-3.5" />
                    </ToolbarBtn>
                    <ToolbarBtn onClick={() => editor?.chain().focus().setTextAlign("right").run()} active={editor?.isActive({ textAlign: "right" }) ?? false} title="Align right">
                        <AlignRight className="h-3.5 w-3.5" />
                    </ToolbarBtn>

                    <div className="mx-1 h-4 w-px bg-main-whiteMarble" />

                    <ToolbarBtn onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive("bold") ?? false} title="Bold">
                        <Bold className="h-3.5 w-3.5" />
                    </ToolbarBtn>
                    <ToolbarBtn onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive("italic") ?? false} title="Italic">
                        <Italic className="h-3.5 w-3.5" />
                    </ToolbarBtn>

                    <div className="mx-1 h-4 w-px bg-main-whiteMarble" />

                    <ToolbarBtn onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive("bulletList") ?? false} title="Bullet list">
                        <List className="h-3.5 w-3.5" />
                    </ToolbarBtn>
                    <ToolbarBtn onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive("orderedList") ?? false} title="Ordered list">
                        <ListOrdered className="h-3.5 w-3.5" />
                    </ToolbarBtn>

                    <div className="mx-1 h-4 w-px bg-main-whiteMarble" />

                    <div className="relative" ref={headingMenuRef}>
                        <button
                            type="button"
                            onClick={() => setShowHeadingMenu((v) => !v)}
                            className="flex items-center gap-1 rounded border border-main-whiteMarble px-2 py-1 text-xs font-medium text-main-hydrocarbon transition-colors hover:bg-main-titaniumWhite"
                        >
                            <Type className="h-3.5 w-3.5" />
                            <span className="min-w-[58px]">{getCurrentHeadingLabel()}</span>
                            <ChevronDown className="h-3 w-3" />
                        </button>

                        {showHeadingMenu && (
                            <div className="absolute left-0 top-full z-20 mt-1 min-w-[140px] rounded-lg border border-main-whiteMarble bg-white py-1 shadow-lg">
                                {HEADING_OPTIONS.map((opt) => {
                                    const active =
                                        opt.level === 0
                                            ? editor?.isActive("paragraph")
                                            : editor?.isActive("heading", { level: opt.level });

                                    return (
                                        <button
                                            key={opt.label}
                                            type="button"
                                            onClick={() => {
                                                if (opt.level === 0) editor?.chain().focus().setParagraph().run();
                                                else editor?.chain().focus().toggleHeading({ level: opt.level }).run();
                                                setShowHeadingMenu(false);
                                            }}
                                            className={`w-full px-3 py-1.5 text-left text-sm transition-colors hover:bg-main-luxuryWhite ${active ? "font-medium text-main-primary" : "text-main-hydrocarbon"
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="mx-1 h-4 w-px bg-main-whiteMarble" />

                    <ToolbarBtn onClick={() => editor?.chain().focus().toggleUnderline().run()} active={editor?.isActive("underline") ?? false} title="Underline">
                        <UnderlineIcon className="h-3.5 w-3.5" />
                    </ToolbarBtn>
                    <ToolbarBtn onClick={() => editor?.chain().focus().toggleCodeBlock().run()} active={editor?.isActive("codeBlock") ?? false} title="Code block">
                        <Code className="h-3.5 w-3.5" />
                    </ToolbarBtn>

                    <div className="ml-auto flex overflow-hidden rounded border border-main-whiteMarble">
                        <button
                            type="button"
                            onClick={() => setViewMode("visual")}
                            className={`px-3 py-1 text-xs font-medium transition-colors ${viewMode === "visual" ? "bg-main-primary text-white" : "text-main-hydrocarbon hover:bg-main-titaniumWhite"
                                }`}
                        >
                            Visual
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode("code")}
                            className={`px-3 py-1 text-xs font-medium transition-colors ${viewMode === "code" ? "bg-main-primary text-white" : "text-main-hydrocarbon hover:bg-main-titaniumWhite"
                                }`}
                        >
                            Code
                        </button>
                    </div>
                </div>

                {viewMode === "visual" ? (
                    <div className="bg-main-titaniumWhite">
                        <EditorContent editor={editor} />
                    </div>
                ) : (
                    <div className="bg-main-titaniumWhite">
                        <MonacoEditor
                            beforeMount={handleMonacoBeforeMount}
                            height="400px"
                            defaultLanguage="html"
                            value={htmlSource}
                            onChange={(val) => handleCodeChange(val ?? "")}
                            theme="wasel-editor"
                            options={{
                                minimap: { enabled: false },
                                wordWrap: "on",
                                fontSize: 13,
                                lineNumbers: "on",
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                overviewRulerBorder: false,
                                hideCursorInOverviewRuler: true,
                                scrollbar: {
                                    verticalScrollbarSize: 8,
                                    horizontalScrollbarSize: 8,
                                },
                            }}
                        />
                    </div>
                )}
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
