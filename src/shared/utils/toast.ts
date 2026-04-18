import toast from "react-hot-toast";

export type ToastType = "success" | "error" | "info" | "alert";

const baseStyle = {
  minWidth: "320px",
  maxWidth: "460px",
  borderRadius: "14px",
  backgroundColor: "#ffffff",
  fontWeight: "600",
  fontSize: "14px",
  lineHeight: "1.45",
  padding: "14px 16px",
  boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)",
  borderWidth: "1px",
  borderStyle: "solid",
};

const styles = {
  success: { ...baseStyle, color: "#0f5132", borderColor: "#9adabf" },
  error: { ...baseStyle, color: "#842029", borderColor: "#f2a7b0" },
  info: { ...baseStyle, color: "#0c5460", borderColor: "#9fd8e8" },
  alert: { ...baseStyle, color: "#7d4f00", borderColor: "#f3d6a3" },
};

export const showToast = (message: string, type?: ToastType) => {
  if (!message) return;

  switch (type) {
    case "success":
      return toast.success(message, { style: styles.success, icon: "OK" });
    case "error":
      return toast.error(message, { style: styles.error, icon: "X" });
    case "alert":
      return toast(message, { style: styles.alert, icon: "!" });
    case "info":
      return toast(message, { style: styles.info, icon: "i" });
    default:
      return toast(message, { style: baseStyle, icon: "i" });
  }
};

export const toastHandler = (message: string, status?: number, type?: ToastType) => {
  if (type) return showToast(message, type);
  if (status !== undefined) {
    if (status >= 200 && status < 300) return showToast(message, "success");
    if (status >= 400 && status < 600) return showToast(message, "error");
  }
  return showToast(message, "info");
};
