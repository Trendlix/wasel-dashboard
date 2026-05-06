import { initializeApp, getApps, type FirebaseApp, type FirebaseOptions } from "firebase/app";

let app: FirebaseApp | null = null;

export const getFirebaseApp = (): FirebaseApp => {
    if (app) return app;
    const existing = getApps()[0];
    if (existing) {
        app = existing;
        return app;
    }
    const cfg: FirebaseOptions = {
        apiKey: import.meta.env.VITE_FCM_API_KEY,
        authDomain: import.meta.env.VITE_FCM_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FCM_PROJECT_ID,
        messagingSenderId: import.meta.env.VITE_FCM_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FCM_APP_ID,
    };
    const bucket = import.meta.env.VITE_FCM_STORAGE_BUCKET;
    if (bucket) {
        cfg.storageBucket = bucket;
    }
    if (!cfg.apiKey || !cfg.projectId) {
        throw new Error("Missing VITE_FCM_* env; set VITE_FCM_ENABLED=false to skip FCM.");
    }
    app = initializeApp(cfg);
    return app;
};
