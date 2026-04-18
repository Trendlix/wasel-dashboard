import ProtectLoading from "@/shared/components/pages/protect/ProtectLoading";
import useAuthStore from "@/shared/hooks/store/useAuthStore";
import useJsCookie from "@/shared/hooks/utils/useJsCookie";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Protect = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(true);
    const { getTokenStoredInCookie } = useJsCookie();
    const { refineAccessToken, fetchMe } = useAuthStore();
    const navigate = useNavigate();

    const checkAuthentication = useCallback(async () => {
        try {
            const accessToken = getTokenStoredInCookie("wasel_admin_access_token");
            const refreshToken = getTokenStoredInCookie("wasel_admin_refresh_token");

            if (!refreshToken.isValid && !accessToken.isValid) {
                navigate("/account");
                return;
            }

            if (refreshToken.isValid && !accessToken.isValid) {
                try {
                    await refineAccessToken();
                } catch {
                    navigate("/account");
                    return;
                }
            }

            await fetchMe();
            const profile = useAuthStore.getState().userProfile;

            if (!profile) {
                navigate("/account");
                return;
            }
        } finally {
            setLoading(false);
        }
    }, [fetchMe, getTokenStoredInCookie, navigate, refineAccessToken]);

    useEffect(() => {
        checkAuthentication();
    }, [checkAuthentication]);

    if (loading) return <ProtectLoading />;

    return <>{children}</>;
};

export default Protect;
