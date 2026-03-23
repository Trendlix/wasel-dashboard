import { useState, useMemo } from "react";

export const useTableSearch = <T extends object>(
    data: T[],
    keys: (keyof T)[]
) => {
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return data;
        return data.filter((item) =>
            keys.some((key) => {
                const val = item[key];
                return String(val ?? "").toLowerCase().includes(q);
            })
        );
    }, [data, keys, query]);

    return { query, setQuery, filtered };
};