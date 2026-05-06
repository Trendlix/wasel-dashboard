import clsx from "clsx";
import { Bell, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import useLanguageStore from "@/shared/hooks/store/useLanguageStore";
import useFcmTopBannerStore from "@/shared/hooks/store/useFcmTopBannerStore";

const categoryStyles: Record<string, { dot: string; badge: string }> = {
  SUPPORT: { dot: "bg-main-primary", badge: "bg-main-primary/10 text-main-primary" },
  CHAT: { dot: "bg-main-vividAmber", badge: "bg-main-vividAmber/15 text-main-vividAmber" },
  OFFERS: { dot: "bg-main-vividMint", badge: "bg-main-vividMint/15 text-main-vividMint" },
  UPDATES: { dot: "bg-main-ladyBlue", badge: "bg-main-ladyBlue/15 text-main-ladyBlue" },
  ADMIN_EVENT: { dot: "bg-main-mustardGold", badge: "bg-main-mustardGold/15 text-main-mustardGold" },
};

const FcmTopBanner = () => {
  const { t } = useTranslation("notifications");
  const isRTL = useLanguageStore((s) => s.isRTL);
  const { visible, payload, dismiss } = useFcmTopBannerStore();

  if (!visible || !payload) return null;

  const category = String(payload.category ?? "ADMIN_EVENT").toUpperCase();
  const style = categoryStyles[category] ?? categoryStyles.ADMIN_EVENT;
  const title = payload.title?.trim() || t("topBanner.fallbackTitle");
  const body = payload.body?.trim() || t("topBanner.fallbackBody");

  return (
    <div
      className={clsx(
        "fixed top-4 w-[min(92vw,720px)]",
        isRTL ? "left-4" : "right-4",
      )}
      style={{ zIndex: 1200 }}
      role="status"
      aria-live="polite"
    >
      <div className="rounded-xl border border-main-whiteMarble bg-main-white shadow-lg p-3">
        <div className="flex items-start gap-3">
          <span className={clsx("mt-1.5 h-2.5 w-2.5 rounded-full shrink-0", style.dot)} />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Bell size={14} className="text-main-sharkGray shrink-0" />
              <p className="text-main-mirage text-sm font-semibold truncate">{title}</p>
              <span className={clsx("ms-auto px-2 py-0.5 rounded-full text-[10px] font-semibold", style.badge)}>
                {category}
              </span>
            </div>
            <p className="text-main-sharkGray text-xs leading-5 wrap-break-word">{body}</p>
          </div>

          <button
            type="button"
            onClick={dismiss}
            aria-label={t("topBanner.dismiss")}
            className="shrink-0 rounded-md p-1 text-main-sharkGray hover:bg-main-whiteMarble"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FcmTopBanner;
