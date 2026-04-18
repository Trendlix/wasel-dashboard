import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import PageHeader from "@/shared/components/common/PageHeader";
import PageTransition from "@/shared/components/common/PageTransition";
import GeneralSettings from "@/shared/components/pages/settings/GeneralSettings";
import RolesAndPermissions from "@/shared/components/pages/settings/RolesAndPermissions";
import NotificationPreferences from "@/shared/components/pages/settings/NotificationPreferences";
import useSettingsStore from "@/shared/hooks/store/useSettingsStore";

const SettingsPage = () => {
    const { fetchAll, saveAll, saving, loading } = useSettingsStore();

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const handleSaveAll = async () => {
        await saveAll();
    };

    return (
        <PageTransition>
            <PageHeader title="Settings" description="Configure platform settings and preferences" />
            <div className="grid grid-cols-2 gap-6 *:h-fit">
                <GeneralSettings />
                <NotificationPreferences />
                <RolesAndPermissions />
            </div>
            <div className="flex justify-end mt-2">
                <button
                    onClick={handleSaveAll}
                    disabled={saving || loading}
                    className="h-11 px-8 bg-main-primary text-main-white text-sm font-semibold common-rounded hover:bg-main-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {saving && <Loader2 size={16} className="animate-spin" />}
                    {saving ? "Saving..." : "Save All Changes"}
                </button>
            </div>
        </PageTransition>
    );
};

export default SettingsPage;
