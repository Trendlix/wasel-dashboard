import { create } from "zustand";
import i18n from "@/i18n";

export type AppLang = "en" | "ar";

interface LanguageState {
    lang: AppLang;
    isRTL: boolean;
    setLang: (lang: AppLang) => void;
    /** Call once after i18n init — reads localStorage then navigator fallback, applies dir/font/i18n. */
    init: () => void;
}

const STORAGE_KEY = "wasel_lang";

const applyLang = (lang: AppLang) => {
    void i18n.changeLanguage(lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    document.documentElement.classList.toggle("rtl-font", lang === "ar");
    localStorage.setItem(STORAGE_KEY, lang);
};

const useLanguageStore = create<LanguageState>((set, get) => ({
    lang: "en",
    isRTL: false,

    setLang: (lang) => {
        applyLang(lang);
        set({ lang, isRTL: lang === "ar" });
    },

    init: () => {
        const stored = localStorage.getItem(STORAGE_KEY) as AppLang | null;
        let lang: AppLang = "en";
        if (stored === "ar" || stored === "en") {
            lang = stored;
        } else if (typeof navigator !== "undefined" && navigator.language.toLowerCase().startsWith("ar")) {
            lang = "ar";
        }
        get().setLang(lang);
    },
}));

export default useLanguageStore;
