import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { Bell, PanelRightClose, PanelRightOpen } from "lucide-react";
import PageHeader from "@/shared/components/common/PageHeader";
import PageTransition from "@/shared/components/common/PageTransition";
import SessionTicketsTable from "@/shared/components/pages/support-tickets/SessionTicketsTable";
import SupportTicketsTabs from "@/shared/components/pages/support-tickets/SupportTicketsTabs";
import SupportNotificationsPanel from "@/shared/components/pages/support-tickets/SupportNotificationsPanel";
import useTicketStore from "@/shared/hooks/store/useTicketStore";

const SessionTicketsPage = () => {
    const { t } = useTranslation("support");
    const [isActivityOpen, setIsActivityOpen] = useState(false);
    const { supportUnreadCount, fetchSupportNotifications } = useTicketStore();

    useEffect(() => {
        fetchSupportNotifications();
    }, [fetchSupportNotifications]);

    return (
        <PageTransition>
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <PageHeader
                    title={t("sessions.pageTitle")}
                    description={t("sessions.pageDescription")}
                />
                <button
                    type="button"
                    onClick={() => setIsActivityOpen((prev) => !prev)}
                    className={clsx(
                        "inline-flex items-center gap-2.5 h-10 px-4 rounded-full border text-sm font-semibold transition-all",
                        "bg-linear-to-r from-main-primary/10 via-main-vividMint/10 to-main-mustardGold/15 border-main-primary/30 text-main-mirage",
                        "hover:shadow-sm hover:border-main-primary/40"
                    )}
                    aria-label={t(isActivityOpen ? "notifications.closeDrawer" : "notifications.openDrawer")}
                >
                    <Bell className="w-4 h-4 text-main-primary" />
                    <span>{t("notifications.title")}</span>
                    {supportUnreadCount > 0 && (
                        <span className="min-w-5 h-5 px-1.5 rounded-full bg-main-remove text-main-white text-[10px] font-bold inline-flex items-center justify-center">
                            {supportUnreadCount > 99 ? "99+" : supportUnreadCount}
                        </span>
                    )}
                    {isActivityOpen ? (
                        <PanelRightClose className="w-4 h-4 text-main-sharkGray" />
                    ) : (
                        <PanelRightOpen className="w-4 h-4 text-main-sharkGray" />
                    )}
                </button>
            </div>

            <SupportTicketsTabs />

            <div className="flex flex-col xl:flex-row items-start gap-6">
                <div className="min-w-0 flex-1 space-y-6">
                    <SessionTicketsTable />
                </div>
                <aside
                    className={clsx(
                        "shrink-0 transition-all duration-300 ease-out overflow-hidden",
                        isActivityOpen
                            ? "w-full max-w-full xl:w-[380px] xl:max-w-[42vw] opacity-100 translate-x-0"
                            : "w-0 max-w-0 opacity-0 translate-x-8 pointer-events-none"
                    )}
                >
                    <SupportNotificationsPanel className="sticky top-7" />
                </aside>
            </div>
        </PageTransition>
    );
};

export default SessionTicketsPage;
