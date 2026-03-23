import { AnimatePresence } from "framer-motion";
import { useLocation, Outlet } from "react-router-dom";

const AnimatedOutlet = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Outlet key={location.pathname} />
        </AnimatePresence>
    );
};

export default AnimatedOutlet;