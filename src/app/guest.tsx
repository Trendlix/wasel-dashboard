import ProtectLoading from "@/shared/components/pages/protect/ProtectLoading";
import useJsCookie from "@/shared/hooks/utils/useJsCookie";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Guest = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(true);
    const { getTokenStoredInCookie } = useJsCookie();
    const navigate = useNavigate();

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

    return <>{children}</>;
}

export default Guest;
