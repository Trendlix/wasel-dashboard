import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import DashboardPage from "@/pages/dashboard";
import ProtectLoading from "@/shared/components/pages/protect/ProtectLoading";
import useAuthStore from "@/shared/hooks/store/useAuthStore";
import { resolveFirstAccessiblePath } from "@/shared/utils/rolePages";

const HomeIndexRedirect = () => {
    const [loading, setLoading] = useState(true);
    const { userProfile } = useAuthStore();

    useEffect(() => {
        setLoading(!userProfile);
    }, [userProfile]);

    if (loading) return <ProtectLoading />;

    const currentProfile = useAuthStore.getState().userProfile;
    const targetPath = resolveFirstAccessiblePath(currentProfile?.role);

    if (targetPath === "/") {
        return <DashboardPage />;
    }

    return <Navigate to={targetPath} replace />;
};

export default HomeIndexRedirect;
