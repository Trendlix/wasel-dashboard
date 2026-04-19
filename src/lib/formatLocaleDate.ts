/** Arabic locales default to Islamic calendar in some runtimes — force Gregorian (ميلادي). */
const GREGORY: Pick<Intl.DateTimeFormatOptions, "calendar"> = { calendar: "gregory" };

function resolveLocale(lang: string): string {
    return lang.startsWith("ar") ? "ar-SA" : "en-US";
}

export function formatWithGregorianCalendar(
    value: string | number | Date | null | undefined,
    lang: string,
    options: Intl.DateTimeFormatOptions,
    empty: string = "—",
): string {
    if (value === null || value === undefined) return empty;
    if (typeof value === "string" && value.trim() === "") return empty;
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return empty;
    const locale = resolveLocale(lang);
    return new Intl.DateTimeFormat(locale, {
        ...GREGORY,
        ...options,
    }).format(date);
}

export function formatAppDateShort(
    iso: string | number | Date | null | undefined,
    lang: string,
    empty = "—",
): string {
    return formatWithGregorianCalendar(iso, lang, { month: "short", day: "numeric", year: "numeric" }, empty);
}

export function formatAppDateLong(
    iso: string | number | Date | null | undefined,
    lang: string,
    empty = "—",
): string {
    return formatWithGregorianCalendar(iso, lang, { month: "long", day: "numeric", year: "numeric" }, empty);
}

export function formatAppDateTime(
    iso: string | number | Date | null | undefined,
    lang: string,
    empty = "—",
): string {
    return formatWithGregorianCalendar(
        iso,
        lang,
        { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" },
        empty,
    );
}

export function formatAppTime(
    iso: string | number | Date | null | undefined,
    lang: string,
    empty = "—",
): string {
    return formatWithGregorianCalendar(iso, lang, { hour: "2-digit", minute: "2-digit" }, empty);
}
