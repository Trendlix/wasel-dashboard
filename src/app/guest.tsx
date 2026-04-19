import ProtectLoading from "@/shared/components/pages/protect/ProtectLoading";
import NetworkStatusBanner from "@/shared/components/common/NetworkStatusBanner";
import useJsCookie from "@/shared/hooks/utils/useJsCookie";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Guest = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(true);
    const { getTokenStoredInCookie } = useJsCookie();
    const navigate = useNavigate();
    const location = useLocation();
    const reduceMotion = useReducedMotion();

    const checkAuthentication = useCallback(() => {
        const timer = setTimeout(() => {
            const accessToken = getTokenStoredInCookie("wasel_admin_access_token");
            const refreshToken = getTokenStoredInCookie("wasel_admin_refresh_token");

            if (accessToken.isValid || refreshToken.isValid) {
                navigate("/");
            } else {
                setLoading(false);
            }
        }, 800);
        return timer;
    }, [getTokenStoredInCookie, navigate]);

    useEffect(() => {
        const timer = checkAuthentication();
        return () => clearTimeout(timer);
    }, [checkAuthentication]);

    if (loading) return <ProtectLoading />;

    const transition = reduceMotion
        ? { duration: 0.12, ease: "easeOut" as const }
        : { duration: 0.28, ease: [0.16, 1, 0.3, 1] as const };
    const initial = reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 };
    const animate = reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 };
    const exit = reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial={initial}
                animate={animate}
                exit={exit}
                transition={transition}
                className="min-h-screen flex flex-col gap-3"
            >
                <NetworkStatusBanner />
                <div className="flex-1 min-h-0">{children}</div>
            </motion.div>
        </AnimatePresence>
    );
};

export default Guest;
