import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Outlet, useLocation, useMatches } from "react-router-dom";
import { getLayoutTransitionKey } from "@/lib/layoutTransition";
import NetworkStatusBanner from "@/shared/components/common/NetworkStatusBanner";
import Sidebar from "./Sidebar";

const Layout = () => {
    const location = useLocation();
    const matches = useMatches();
    const reduceMotion = useReducedMotion();
    const transitionKey = getLayoutTransitionKey(matches, location.pathname);

    const transition = reduceMotion
        ? { duration: 0.12, ease: "easeOut" as const }
        : { duration: 0.28, ease: [0.16, 1, 0.3, 1] as const };

    const initial = reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 };
    const animate = reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 };
    const exit = reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 };

    return (
        <div className="px-5 py-7 flex flex-col gap-3 min-h-screen bg-main-titaniumWhite">
            <NetworkStatusBanner />
            <div className={`flex gap-7 flex-1 min-h-0 flex-row`}>
                <Sidebar />
                <main className="flex-1 overflow-x-auto min-w-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={transitionKey}
                            initial={initial}
                            animate={animate}
                            exit={exit}
                            transition={transition}
                            className="flex flex-col gap-8"
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default Layout;
