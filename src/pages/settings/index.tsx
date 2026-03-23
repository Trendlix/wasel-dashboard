import PageHeader from "@/shared/components/common/PageHeader";
import PageTransition from "@/shared/components/common/PageTransition";
import GeneralSettings from "@/shared/components/pages/settings/GeneralSettings";
import FinanceSettings from "@/shared/components/pages/settings/FinanceSettings";
import RolesAndPermissions from "@/shared/components/pages/settings/RolesAndPermissions";
import NotificationPreferences from "@/shared/components/pages/settings/NotificationPreferences";

const SettingsPage = () => {
    return (
        <PageTransition>
            <PageHeader title="Settings" description="Configure platform settings and preferences" />
            <div className="grid grid-cols-2 gap-6">
                <GeneralSettings />
                <FinanceSettings />
                <RolesAndPermissions />
                <NotificationPreferences />
            </div>
            <div className="flex justify-end">
                <button className="h-11 px-8 bg-main-primary text-main-white text-sm font-semibold common-rounded hover:bg-main-primary/90 transition-colors">
                    Save All Changes
                </button>
            </div>
        </PageTransition>
    );
};

export default SettingsPage;