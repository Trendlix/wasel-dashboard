import clsx from "clsx";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { RotateCcw, Search } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import NoDataFound from "@/shared/components/common/NoDataFound";
import { formInputWrapperClass } from "@/shared/components/common/formStyles";

const CONTACT_SHEET_GET_URL = import.meta.env.VITE_GOOGLE_SPREADSHEET_LINK;

export type ContactMessageRow = {
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
};

const contactLinkClass =
    "text-main-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main-primary/35 rounded-sm";

const telHref = (phone: string) => phone.trim().replace(/\s+/g, "");

const SkeletonRow = () => (
    <TableRow className="border-b border-main-whiteMarble animate-pulse">
        <TableCell className="py-4 px-6 w-14">
            <div className="h-3.5 w-6 rounded bg-main-whiteMarble" />
        </TableCell>
        <TableCell className="py-4 px-6">
            <div className="h-3.5 w-32 rounded bg-main-whiteMarble" />
        </TableCell>
        <TableCell className="py-4 px-6">
            <div className="h-3.5 w-40 rounded bg-main-whiteMarble" />
        </TableCell>
        <TableCell className="py-4 px-6">
            <div className="h-3.5 w-28 rounded bg-main-whiteMarble" />
        </TableCell>
        <TableCell className="py-4 px-6">
            <div className="h-3.5 w-full max-w-md rounded bg-main-whiteMarble" />
        </TableCell>
    </TableRow>
);

const ContactMessagesTable = () => {
    const { t } = useTranslation("contactMessages");
    const [rows, setRows] = useState<ContactMessageRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchInput, setSearchInput] = useState("");
    const [fieldKey, setFieldKey] = useState<"all" | "name" | "email" | "phone" | "message">("all");
    const inputRef = useRef<HTMLInputElement>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(CONTACT_SHEET_GET_URL, { cache: "no-store" });
            const ct = res.headers.get("content-type") ?? "";
            const text = await res.text();

            if (!res.ok) {
                setError(`${res.status} ${res.statusText}`);
                setRows([]);
                return;
            }

            if (!ct.includes("application/json") && text.trim().startsWith("<")) {
                setError(t("contactMessages:errorTitle"));
                setRows([]);
                return;
            }

            const parsed = JSON.parse(text) as { data?: unknown };
            const data = Array.isArray(parsed.data) ? parsed.data : [];
            const normalized: ContactMessageRow[] = data.map((item) => {
                if (!item || typeof item !== "object") return {};
                const r = item as Record<string, unknown>;
                return {
                    name: typeof r.name === "string" ? r.name : String(r.name ?? ""),
                    email: typeof r.email === "string" ? r.email : String(r.email ?? ""),
                    phone: typeof r.phone === "string" ? r.phone : String(r.phone ?? ""),
                    message: typeof r.message === "string" ? r.message : String(r.message ?? ""),
                };
            });
            setRows(normalized);
        } catch {
            setError(t("contactMessages:errorTitle"));
            setRows([]);
        } finally {
            setLoading(false);
        }
    }, [t]);

    useEffect(() => {
        void load();
    }, [load]);

    const fieldOptions = useMemo(
        () => [
            { value: "all", label: t("contactMessages:filters.allFields") },
            { value: "name", label: t("contactMessages:filters.name") },
            { value: "email", label: t("contactMessages:filters.email") },
            { value: "phone", label: t("contactMessages:filters.phone") },
            { value: "message", label: t("contactMessages:filters.message") },
        ],
        [t],
    );

    const filteredRows = useMemo(() => {
        const q = searchInput.trim().toLowerCase();
        if (!q) return rows;

        return rows.filter((r) => {
            if (fieldKey === "all") {
                return Object.values(r).some((v) => String(v ?? "").toLowerCase().includes(q));
            }
            return String(r[fieldKey] ?? "").toLowerCase().includes(q);
        });
    }, [rows, searchInput, fieldKey]);

    return (
        <div className="space-y-6">
            {error && (
                <div className="rounded-xl border border-main-remove/25 bg-main-remove/5 px-4 py-3 text-sm text-main-remove flex flex-wrap items-center justify-between gap-3">
                    <span className="font-semibold">{error}</span>
                    <Button type="button" variant="outline" size="xs" onClick={() => void load()}>
                        {t("contactMessages:errorRetry")}
                    </Button>
                </div>
            )}

            <div className="bg-main-white border border-main-whiteMarble common-rounded p-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-4">
                <div
                    className={clsx("flex items-center gap-2 flex-1 cursor-text min-w-0", formInputWrapperClass)}
                    onClick={() => inputRef.current?.focus()}
                >
                    <Search className="text-main-trueBlack/50 shrink-0" size={16} />
                    <Input
                        type="search"
                        ref={inputRef}
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder={t("contactMessages:searchPlaceholder")}
                        className="border-0 shadow-none h-full p-0 placeholder:text-main-trueBlack/50 focus-visible:ring-0 bg-transparent"
                    />
                </div>

                <Select value={fieldKey} onValueChange={(v) => setFieldKey(v as typeof fieldKey)}>
                    <SelectTrigger className="h-11 w-full shrink-0 lg:w-48 border-main-whiteMarble bg-main-white text-main-hydrocarbon shadow-sm">
                        <SelectValue placeholder={t("contactMessages:filters.allFields")} />
                    </SelectTrigger>
                    <SelectContent position="popper">
                        {fieldOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-medium text-main-hydrocarbon whitespace-nowrap">
                        {t("contactMessages:countResults", { count: filteredRows.length })}
                    </span>
                    <Button
                        type="button"
                        variant="outline"
                        className="h-11 px-5 border-main-whiteMarble text-main-hydrocarbon font-semibold"
                        onClick={() => void load()}
                        disabled={loading}
                        aria-label={t("contactMessages:refresh")}
                    >
                        <RotateCcw size={16} className={clsx(loading && "animate-spin")} />
                        <span className="ms-2">{t("contactMessages:refresh")}</span>
                    </Button>
                </div>
            </div>

            <div className="bg-main-white border border-main-whiteMarble common-rounded overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-main-luxuryWhite border-b border-main-whiteMarble hover:bg-main-luxuryWhite">
                            <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6 w-14">
                                {t("contactMessages:table.index")}
                            </TableHead>
                            <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">
                                {t("contactMessages:table.name")}
                            </TableHead>
                            <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">
                                {t("contactMessages:table.email")}
                            </TableHead>
                            <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">
                                {t("contactMessages:table.phone")}
                            </TableHead>
                            <TableHead className="text-main-hydrocarbon font-semibold text-sm py-4 px-6">
                                {t("contactMessages:table.message")}
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading
                            ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                            : filteredRows.map((row, idx) => {
                                const emailTrim = row.email?.trim() ?? "";
                                const phoneDisplay = row.phone?.trim() ?? "";
                                const phoneDial = telHref(row.phone ?? "");
                                return (
                                    <TableRow
                                        key={`${row.email}-${idx}`}
                                        className="border-b border-main-whiteMarble hover:bg-main-titaniumWhite/40"
                                    >
                                        <TableCell className="py-4 px-6 text-sm text-main-sharkGray font-medium">
                                            {idx + 1}
                                        </TableCell>
                                        <TableCell className="py-4 px-6 text-sm text-main-mirage max-w-[200px] truncate" title={row.name}>
                                            {row.name || "—"}
                                        </TableCell>
                                        <TableCell className="py-4 px-6 text-sm max-w-[220px] truncate" title={emailTrim || undefined}>
                                            {emailTrim ? (
                                                <a href={`mailto:${emailTrim}`} className={contactLinkClass}>
                                                    {emailTrim}
                                                </a>
                                            ) : (
                                                <span className="text-main-sharkGray">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="py-4 px-6 text-sm max-w-[160px] truncate" title={phoneDisplay || undefined}>
                                            {phoneDial ? (
                                                <a href={`tel:${phoneDial}`} className={contactLinkClass}>
                                                    {phoneDisplay}
                                                </a>
                                            ) : (
                                                <span className="text-main-sharkGray">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell
                                            className="py-4 px-6 text-sm text-main-gunmetalBlue max-w-xl line-clamp-2"
                                            title={row.message}
                                        >
                                            {row.message || "—"}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}

                        {!loading && filteredRows.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="p-2">
                                    <NoDataFound
                                        title={t("contactMessages:emptyTitle")}
                                        description={t("contactMessages:emptyDescription")}
                                    />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default ContactMessagesTable;
