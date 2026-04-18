"use client";

import * as React from "react";
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FormProvider, type Resolver, useForm, useFormContext } from "react-hook-form";
import * as z from "zod";
import {
    CommonInput,
    CommonFileInput,
    CreatableTagCombobox,
    TagsInput,
    RichEditorField,
} from "@/shared/components/common/FormItems";
import { Button } from "@/components/ui/button";
import { BLOG_CATEGORIES } from "@/data/blogs";
import { Flag, Save, Eye, ChevronLeft, ChevronRight, Clock, Globe } from "lucide-react";

// ─── Schema ───────────────────────────────────────────────────────────────────

const scheduleSchema = z
    .object({
        publishDate: z.string().min(1, "Date is required"),
        publishTime: z
            .string()
            .regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
    })
    .optional();

const blogFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    category: z.string().min(1, "Category is required"),
    slug: z.string().min(1, "Slug is required"),
    keywords: z.array(z.string()).default([]),
    metaTitle: z.string().optional().default(""),
    metaDescription: z.string().optional().default(""),
    metaKeywords: z.array(z.string()).default([]),
    paragraph: z.string().min(1, "Content is required"),
    coverImg: z.any().optional(),
    coverImgAlt: z.string().optional().default(""),
    isDraft: z.boolean().optional().default(false),
    schedule: scheduleSchema,
});

export type IBlogFormData = z.infer<typeof blogFormSchema>;

// ─── Grid rows config ─────────────────────────────────────────────────────────

interface IGridItem {
    label: string;
    name: keyof IBlogFormData;
    type: "text" | "slug" | "list" | "tags";
    options?: string[];
}

const gridRows: [IGridItem | null, IGridItem | null][] = [
    [
        { label: "Title (English)", name: "title", type: "text" },
        { label: "Category (English)", name: "category", type: "list", options: BLOG_CATEGORIES },
    ],
    [
        { label: "Slug (English)", name: "slug", type: "slug" },
        { label: "Blog Keywords (English)", name: "keywords", type: "tags" },
    ],
    [
        { label: "Meta Title (English)", name: "metaTitle", type: "text" },
        { label: "Meta Description (English)", name: "metaDescription", type: "text" },
    ],
    [
        { label: "Meta Keywords (English)", name: "metaKeywords", type: "tags" },
        null,
    ],
];

// ─── BlogFormItem ─────────────────────────────────────────────────────────────

function BlogFormItem({ item, field }: { item: IGridItem; field: any }) {
    if (item.type === "tags") {
        return (
            <TagsInput
                label={item.label}
                value={Array.isArray(field.value) ? field.value : []}
                onChange={field.onChange}
                placeholder={`Add ${item.label.split(" ")[0].toLowerCase()} and press Enter`}
            />
        );
    }
    if (item.name === "category") {
        return (
            <CreatableTagCombobox
                label={item.label}
                value={typeof field.value === "string" ? field.value : ""}
                onChange={field.onChange}
                options={item.options ?? []}
                placeholder="Select or type to add…"
            />
        );
    }

    return (
        <CommonInput
            label={item.label}
            placeholder={item.label}
            field={field}
            type={item.type === "slug" ? "slug" : item.type === "list" ? "list" : "text"}
            options={item.options}
            isSlug={item.type === "slug"}
        />
    );
}

// ─── Calendar helpers ─────────────────────────────────────────────────────────

const WEEK_DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];
const TIME_SLOTS = [
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
    "21:00", "21:30", "22:00", "22:30", "23:00", "23:30",
];

function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDayOffset(y: number, m: number) {
    const d = new Date(y, m, 1).getDay();
    return d === 0 ? 6 : d - 1;
}

// ─── BlogButtonsGroup ─────────────────────────────────────────────────────────

function BlogButtonsGroup() {
    const { formState, setValue, reset } = useFormContext<IBlogFormData>();
    const { isValid, isSubmitting } = formState;

    return (
        <div className="border-t border-main-whiteMarble px-6 py-4 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
                <Button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    onClick={() => {
                        setValue("isDraft", false);
                        setValue("schedule", undefined);
                    }}
                    className="bg-main-primary hover:bg-main-primary/90 text-white disabled:opacity-50 px-5 py-5"
                >
                    <Flag className="h-4 w-4" />
                    Publish Now
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    disabled={isSubmitting}
                    className="text-main-hydrocarbon px-5 py-5"
                    onClick={() => reset()}
                >
                    Cancel
                </Button>
            </div>

            <div className="flex items-center gap-3">
                <Button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    onClick={() => {
                        setValue("isDraft", true);
                        setValue("schedule", undefined);
                    }}
                    variant="outline"
                    className="border-main-whiteMarble text-main-hydrocarbon hover:bg-main-luxuryWhite disabled:opacity-50 px-5 py-5"
                >
                    <Save className="h-4 w-4" />
                    Draft
                </Button>
                <Button
                    type="button"
                    disabled={!isValid || isSubmitting}
                    className="bg-main-gunmetalBlue text-white hover:bg-main-gunmetalBlue/90 disabled:opacity-50 px-5 py-5"
                >
                    <Eye className="h-4 w-4" />
                    Preview
                </Button>
            </div>
        </div>
    );
}

// ─── BlogSchedule ─────────────────────────────────────────────────────────────

function BlogSchedule() {
    const { control, watch, setValue } = useFormContext<IBlogFormData>();
    const existingSchedule = watch("schedule");

    const today = React.useMemo(() => new Date(), []);

    const [scheduleEnabled, setScheduleEnabled] = React.useState(Boolean(existingSchedule));
    const [calYear, setCalYear] = React.useState(today.getFullYear());
    const [calMonth, setCalMonth] = React.useState(today.getMonth());
    const [selectedDay, setSelectedDay] = React.useState<number | null>(today.getDate());
    const [selectedTime, setSelectedTime] = React.useState<string | null>("12:00");

    React.useEffect(() => {
        if (!existingSchedule) return;

        const parsed = new Date(existingSchedule.publishDate);
        if (!Number.isNaN(parsed.getTime())) {
            setCalYear(parsed.getFullYear());
            setCalMonth(parsed.getMonth());
            setSelectedDay(parsed.getDate());
        }

        if (existingSchedule.publishTime) {
            setSelectedTime(existingSchedule.publishTime);
        }

        setScheduleEnabled(true);
    }, [existingSchedule]);

    const daysInMonth = getDaysInMonth(calYear, calMonth);
    const offset = getFirstDayOffset(calYear, calMonth);
    const calCells = [
        ...Array(offset).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];

    const prevMonth = () => {
        if (calMonth === 0) {
            setCalMonth(11);
            setCalYear((prev) => prev - 1);
            return;
        }
        setCalMonth((prev) => prev - 1);
    };

    const nextMonth = () => {
        if (calMonth === 11) {
            setCalMonth(0);
            setCalYear((prev) => prev + 1);
            return;
        }
        setCalMonth((prev) => prev + 1);
    };

    const isToday = (day: number) =>
        day === today.getDate() &&
        calMonth === today.getMonth() &&
        calYear === today.getFullYear();



    const getDateLabel = () => {
        if (!selectedDay) return "Select a date";

        const d = new Date(calYear, calMonth, selectedDay);
        const dayNames = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];

        return `${dayNames[d.getDay()]}, ${MONTH_NAMES[calMonth]} ${selectedDay}`;
    };

    const toggleSchedule = () => {
        setScheduleEnabled((prev) => {
            const next = !prev;

            if (!next) {
                setValue("schedule", undefined);
            }

            return next;
        });
    };

    const handleScheduleSubmit = () => {
        if (!selectedDay || !selectedTime) return;

        const date = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(
            selectedDay
        ).padStart(2, "0")}`;

        setValue("schedule", {
            publishDate: date,
            publishTime: selectedTime,
        });
    };

    return (
        <div className="mt-2 space-y-4">
            <h3 className="text-base font-semibold text-main-mirage">Schedule</h3>

            <div className="flex items-center gap-2.5">
                <Controller
                    control={control}
                    name="schedule"
                    render={() => (
                        <button
                            type="button"
                            role="checkbox"
                            aria-checked={scheduleEnabled}
                            onClick={toggleSchedule}
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${scheduleEnabled
                                ? "border-main-primary bg-main-primary"
                                : "border-main-sharkGray/40 bg-white hover:border-main-primary/60"
                                }`}
                        >
                            {scheduleEnabled && (
                                <svg
                                    viewBox="0 0 12 10"
                                    fill="none"
                                    className="h-3 w-3"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="1,5 4.5,8.5 11,1" />
                                </svg>
                            )}
                        </button>
                    )}
                />

                <span
                    onClick={toggleSchedule}
                    className="cursor-pointer select-none text-sm text-main-hydrocarbon"
                >
                    Schedule Post
                </span>
            </div>

            {scheduleEnabled && (
                <div className="w-full max-w-[1002px] rounded-[12px] border border-main-whiteMarble bg-white px-8 py-7 shadow-sm">
                    <h4 className="mb-6 text-[18px] font-bold leading-[150%] text-main-mirage">
                        Select a Date & Time
                    </h4>

                    <div className="grid grid-cols-1 gap-[40px] xl:grid-cols-[330px_minmax(0,1fr)]">
                        <div className="w-full max-w-[330px]">
                            <div className="mb-[14px] flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={prevMonth}
                                    className="flex h-[36px] w-[36px] items-center justify-center rounded-full text-[#6B7280] transition-colors hover:bg-[#F7F8FA]"
                                >
                                    <ChevronLeft className="h-[18px] w-[18px]" />
                                </button>

                                <span
                                    className="text-[#111827]"
                                    style={{
                                        fontFamily: "Roc Grotesk, sans-serif",
                                        fontWeight: 500,
                                        fontSize: "16px",
                                        lineHeight: "150%",
                                        letterSpacing: "0%",
                                        verticalAlign: "middle",
                                    }}
                                >
                                    {MONTH_NAMES[calMonth]} {calYear}
                                </span>

                                <button
                                    type="button"
                                    onClick={nextMonth}
                                    className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[#F4F7FB] text-main-primary transition-colors hover:bg-[#EAF1FC]"
                                >
                                    <ChevronRight className="h-[18px] w-[18px]" />
                                </button>
                            </div>

                            <div className="mb-[10px] grid grid-cols-7 gap-[6px] select-none">
                                {WEEK_DAYS.map((day) => (
                                    <div
                                        key={day}
                                        className="flex h-[24px] select-none items-center justify-center text-center text-[#2C2C2C]"
                                        style={{
                                            fontFamily: "Proxima Nova, sans-serif",
                                            fontWeight: 400,
                                            fontSize: "12px",
                                            lineHeight: "150%",
                                            letterSpacing: "0%",
                                            userSelect: "none",
                                        }}
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-[6px]">
                                {calCells.map((day, idx) => {
                                    if (!day) {
                                        return (
                                            <div
                                                key={`empty-${idx}`}
                                                style={{
                                                    width: "43.89px",
                                                    height: "50px",
                                                }}
                                            />
                                        );
                                    }

                                    const todayDot = isToday(day);
                                    const isSelected = day === selectedDay;

                                    return (
                                        <div
                                            key={idx}
                                            className="flex flex-col items-center"
                                            style={{
                                                width: "43.89px",
                                                height: "50px",
                                            }}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => setSelectedDay(day)}
                                                className="flex cursor-pointer items-center justify-center rounded-full transition-colors"
                                                style={{
                                                    width: "43.88999938964844px",
                                                    height: "43.88999938964844px",
                                                    borderRadius: "996.5px",
                                                    backgroundColor: isSelected ? "#EEF4FF" : "transparent",
                                                    color: isSelected ? "#1453B8" : "#666666",
                                                    fontFamily: "Proxima Nova, sans-serif",
                                                    fontWeight: isSelected ? 700 : 400,
                                                    fontSize: "16px",
                                                    lineHeight: "150%",
                                                    letterSpacing: "0%",
                                                    textAlign: "center",
                                                    verticalAlign: "middle",
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (!isSelected) {
                                                        e.currentTarget.style.backgroundColor = "#F7F8FA";
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (!isSelected) {
                                                        e.currentTarget.style.backgroundColor = "transparent";
                                                    }
                                                }}
                                            >
                                                {day}
                                            </button>

                                            <div className="mt-[2px] flex h-[4px] items-center justify-center">
                                                {todayDot ? (
                                                    <span className="h-[4px] w-[4px] rounded-full bg-main-primary" />
                                                ) : null}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="min-w-0">
                            <p className="mb-3 text-[14px] font-medium leading-[150%] text-main-mirage">
                                {getDateLabel()}
                            </p>

                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                                {TIME_SLOTS.slice(0, 24).map((time) => (
                                    <button
                                        key={time}
                                        type="button"
                                        onClick={() => setSelectedTime(time)}
                                        className={`h-[32px] rounded-[8px] border text-[12px] font-medium transition-colors ${selectedTime === time
                                            ? "border-main-primary bg-main-primary text-white"
                                            : "border-[#B9BDC7] bg-white text-main-hydrocarbon hover:border-main-primary/50"
                                            }`}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-7 flex flex-wrap items-end justify-between gap-4">
                                <div className="space-y-1">
                                    <p className="text-[12px] leading-[150%] text-main-sharkGray">
                                        Time zone
                                    </p>
                                    <button
                                        type="button"
                                        className="flex items-center gap-1 text-[12px] font-medium text-main-hydrocarbon transition-colors hover:text-main-mirage"
                                    >
                                        <Globe className="h-3.5 w-3.5" />
                                        Cairo Time (8:11pm)
                                        <span className="text-[10px]">▾</span>
                                    </button>
                                </div>

                                <Button
                                    type="button"
                                    disabled={!selectedDay || !selectedTime}
                                    onClick={handleScheduleSubmit}
                                    className="h-[36px] rounded-[10px] bg-main-primary px-4 text-white hover:bg-main-primary/90 disabled:opacity-50"
                                >
                                    <Clock className="mr-1 h-4 w-4" />
                                    Schedule Post
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── BlogForm ─────────────────────────────────────────────────────────────────

export interface BlogFormProps {
    mode?: "add" | "edit";
    initialValues?: Partial<IBlogFormData>;
    onCancel?: () => void;
    onSubmit?: (values: IBlogFormData) => void;
}

export default function BlogForm({
    initialValues,
    onSubmit,
}: BlogFormProps) {
    const form = useForm<IBlogFormData>({
        resolver: zodResolver(blogFormSchema) as unknown as Resolver<IBlogFormData>,
        defaultValues: {
            title: "",
            category: "",
            slug: "",
            keywords: [],
            metaTitle: "",
            metaDescription: "",
            metaKeywords: [],
            paragraph: "",
            coverImg: undefined,
            coverImgAlt: "",
            isDraft: false,
            schedule: undefined,
            ...initialValues,
        },
    });

    React.useEffect(() => {
        if (!initialValues) return;

        form.reset({
            title: "",
            category: "",
            slug: "",
            keywords: [],
            metaTitle: "",
            metaDescription: "",
            metaKeywords: [],
            paragraph: "",
            coverImgAlt: "",
            isDraft: false,
            schedule: undefined,
            ...initialValues,
        });
    }, [initialValues, form]);

    const handleSubmit = (values: IBlogFormData) => {
        onSubmit?.(values);
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                {/* ── Main card ── */}
                <div className="overflow-hidden">
                    <div className="p-6 space-y-5">

                        {/* Cover Image + Alt row */}
                        <div className="flex gap-5 items-end">
                            <FormField
                                name="coverImg"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <FormControl>
                                            <CommonFileInput
                                                label="Cover Image"
                                                field={field}
                                                onChange={(e) =>
                                                    field.onChange(e.target.files?.[0] ?? null)
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs mt-1" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="coverImgAlt"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormControl>
                                            <CommonInput
                                                label="Cover Image Alt (English)"
                                                placeholder="Cover Image Alt (English)"
                                                field={field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Grid rows: Title/Category, Slug/Keywords, MetaTitle/MetaDesc, MetaKeywords */}
                        {gridRows.map((row, rowIdx) => (
                            <div key={rowIdx} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {row.map((item, colIdx) =>
                                    item ? (
                                        <FormField
                                            key={item.name}
                                            name={item.name as any}
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <BlogFormItem item={item} field={field} />
                                                    </FormControl>
                                                    <FormMessage className="text-xs" />
                                                </FormItem>
                                            )}
                                        />
                                    ) : (
                                        <div key={`empty-${colIdx}`} />
                                    )
                                )}
                            </div>
                        ))}

                        {/* Tags field (kept for backwards compat / extra keywords as chips) */}
                        {/* Content — Rich text editor */}
                        <FormField
                            name="paragraph"
                            control={form.control}
                            render={() => (
                                <FormItem>
                                    <FormControl>
                                        <RichEditorField
                                            name="paragraph"
                                            label="Content (English)"
                                            placeholder="Write your blog content here..."
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Action buttons */}
                    <BlogButtonsGroup />
                </div>

                {/* Schedule section */}
                <BlogSchedule />
            </form>
        </FormProvider>
    );
}
