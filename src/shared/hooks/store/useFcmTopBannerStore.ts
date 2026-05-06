import { create } from "zustand";
import type { IFcmNotificationPayload } from "@/shared/core/notifications/fcm/fcm-payload";

const AUTO_HIDE_MS = 5000;

type BannerState = {
  visible: boolean;
  payload: IFcmNotificationPayload | null;
  timeoutId: number | null;
  show: (payload: IFcmNotificationPayload) => void;
  dismiss: () => void;
};

const useFcmTopBannerStore = create<BannerState>((set, get) => ({
  visible: false,
  payload: null,
  timeoutId: null,

  show: (payload) => {
    const prevTimeoutId = get().timeoutId;
    if (prevTimeoutId) {
      window.clearTimeout(prevTimeoutId);
    }

    const timeoutId = window.setTimeout(() => {
      set({ visible: false, timeoutId: null });
    }, AUTO_HIDE_MS);

    set({
      visible: true,
      payload,
      timeoutId,
    });
  },

  dismiss: () => {
    const timeoutId = get().timeoutId;
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
    set({
      visible: false,
      timeoutId: null,
    });
  },
}));

export default useFcmTopBannerStore;
