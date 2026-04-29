import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";

export type ToastType = "success" | "error" | "info" | "alert";

const TOAST_TOKENS = {
  dedupeWindowMs: 1500,
  durationBaseMs: 4000,
  durationPerCharsMs: 1000,
  durationCharsStep: 90,
  durationCapMs: 9000,
  errorMinMs: 6000,
};

const LAST_TOAST_AT = new Map<string, number>();

type ToastVariantSpec = {
  title: string;
  className: string;
  icon: ReactNode;
  role: "status" | "alert";
  ariaLive: "polite" | "assertive";
};

const VARIANT_SPECS: Record<ToastType, ToastVariantSpec> = {
  success: {
    title: "Success",
    className: "wasel-toast--success",
    icon: <CheckCircle2 size={18} aria-hidden="true" />,
    role: "status",
    ariaLive: "polite",
  },
  error: {
    title: "Error",
    className: "wasel-toast--error",
    icon: <XCircle size={18} aria-hidden="true" />,
    role: "alert",
    ariaLive: "assertive",
  },
  info: {
    title: "Info",
    className: "wasel-toast--info",
    icon: <Info size={18} aria-hidden="true" />,
    role: "status",
    ariaLive: "polite",
  },
  alert: {
    title: "Warning",
    className: "wasel-toast--alert",
    icon: <AlertTriangle size={18} aria-hidden="true" />,
    role: "status",
    ariaLive: "polite",
  },
};

const getDuration = (message: string, type: ToastType): number => {
  const normalized = message.trim();
  const charChunks = Math.ceil(normalized.length / TOAST_TOKENS.durationCharsStep);
  const computedDuration =
    TOAST_TOKENS.durationBaseMs + Math.max(0, charChunks - 1) * TOAST_TOKENS.durationPerCharsMs;
  const boundedDuration = Math.min(TOAST_TOKENS.durationCapMs, computedDuration);
  return type === "error" ? Math.max(TOAST_TOKENS.errorMinMs, boundedDuration) : boundedDuration;
};

const getToastKey = (message: string, type: ToastType): string =>
  `${type}:${message.trim().toLowerCase()}`;

const shouldSkipDuplicate = (message: string, type: ToastType): boolean => {
  const key = getToastKey(message, type);
  const now = Date.now();
  const lastAt = LAST_TOAST_AT.get(key);
  LAST_TOAST_AT.set(key, now);
  return lastAt !== undefined && now - lastAt < TOAST_TOKENS.dedupeWindowMs;
};

type ToastContentProps = {
  message: string;
  variant: ToastVariantSpec;
  toastId: string | number;
};

const ToastContent = ({ message, variant, toastId }: ToastContentProps) => (
  <div
    className={`wasel-toast ${variant.className}`}
    role={variant.role}
    aria-live={variant.ariaLive}
    aria-atomic="true"
  >
    <div className="wasel-toast__icon-wrap">{variant.icon}</div>
    <div className="wasel-toast__content">
      <p className="wasel-toast__title">{variant.title}</p>
      <p className="wasel-toast__message">{message}</p>
    </div>
    <button
      type="button"
      className="wasel-toast__dismiss"
      onClick={() => toast.dismiss(toastId)}
      aria-label="Dismiss notification"
    >
      <X size={16} aria-hidden="true" />
    </button>
  </div>
);

export const showToast = (message: string, type: ToastType = "info") => {
  const normalizedMessage = message?.trim();
  if (!normalizedMessage) return;
  if (shouldSkipDuplicate(normalizedMessage, type)) return;

  const variant = VARIANT_SPECS[type];
  const duration = getDuration(normalizedMessage, type);

  return toast.custom(
    (toastObj) => <ToastContent message={normalizedMessage} variant={variant} toastId={toastObj} />,
    {
      duration,
      className: "wasel-toast-shell",
    },
  );
};

export const toastHandler = (message: string, status?: number, type?: ToastType) => {
  if (type) return showToast(message, type);
  if (status !== undefined) {
    if (status >= 200 && status < 300) return showToast(message, "success");
    if (status >= 400 && status < 600) return showToast(message, "error");
  }
  return showToast(message, "info");
};
