import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formatAppDateTime } from "@/lib/formatLocaleDate";
import { Calendar, Mail, Phone, User, Hash } from "lucide-react";
import PageHeader from "@/shared/components/common/PageHeader";
import NoDataFound from "@/shared/components/common/NoDataFound";
import BackButton from "@/shared/components/common/BackButton";
import type {
    TDetailedNotificationType,
    IDetailedUserNotification,
    IDetailedDriverNotification,
    IDetailedTripNotification,
    TDetailedNotification,
} from "@/shared/hooks/store/useDetailedOpenedNotification";

const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex flex-col gap-1">
        <p className="text-xs uppercase tracking-wide text-main-sharkGray font-medium">{label}</p>
        <p className="text-sm text-main-hydrocarbon">{value ?? "—"}</p>
    </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-main-white border border-main-whiteMarble common-rounded p-6 space-y-4">
        <h3 className="text-base font-semibold text-main-mirage">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">{children}</div>
    </div>
);

const typeBackPath: Record<TDetailedNotificationType, string> = {
    user: "/notifications/user",
    driver: "/notifications/driver",
    trip: "/notifications/trip",
};

const typeTitleKey: Record<TDetailedNotificationType, "userNotification" | "driverNotification" | "tripNotification"> = {
    user: "userNotification",
    driver: "driverNotification",
    trip: "tripNotification",
};

interface Props {
    type: TDetailedNotificationType;
    loading: boolean;
    error: string | null;
    notification: TDetailedNotification | null;
}

const NotificationDetailPage = ({ type, loading, error, notification }: Props) => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation(["notifications", "common"]);
    const backPath = typeBackPath[type];
    const titleKey = typeTitleKey[type];

    const formatDate = (value: string | null | undefined) => formatAppDateTime(value, i18n.language);

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-8 w-48 rounded bg-main-whiteMarble" />
                <div className="bg-main-white border border-main-whiteMarble common-rounded p-6 space-y-4">
                    <div className="h-4 w-32 rounded bg-main-whiteMarble" />
                    <div className="grid grid-cols-2 gap-5">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <div className="h-3 w-16 rounded bg-main-whiteMarble" />
                                <div className="h-4 w-32 rounded bg-main-whiteMarble" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error || !notification) {
        return (
            <div className="space-y-6">
                <BackButton
                    label={t("common:back")}
                    onClick={() => navigate(backPath)}
                />
                <NoDataFound
                    title={t("notifications:notFoundTitle")}
                    description={error ?? t("notifications:notFoundDescription")}
                />
            </div>
        );
    }

    const renderRelatedEntity = () => {
        if (type === "user") {
            const { user } = notification as IDetailedUserNotification;
            return (
                <Section title={t("notifications:sectionUserDetails")}>
                    <Field label={t("notifications:fieldFullName")} value={<span className="inline-flex items-center gap-1.5"><User size={13} />{user?.full_name}</span>} />
                    <Field label={t("common:email")} value={<span className="inline-flex items-center gap-1.5"><Mail size={13} />{user?.email}</span>} />
                    <Field label={t("common:phone")} value={<span className="inline-flex items-center gap-1.5"><Phone size={13} />{user?.phone}</span>} />
                    <Field label={t("notifications:fieldAccountCreated")} value={<span className="inline-flex items-center gap-1.5"><Calendar size={13} />{formatDate(user?.created_at)}</span>} />
                    <Field label={t("common:status")} value={user?.is_deleted ? <span className="text-main-lightCoral font-medium">{t("notifications:statusDeleted")}</span> : <span className="text-main-primary font-medium">{t("notifications:statusActive")}</span>} />
                </Section>
            );
        }

        if (type === "driver") {
            const { driver } = notification as IDetailedDriverNotification;
            const deletedSuffix = driver?.deleted_at
                ? ` ${t("notifications:deletedOn", { date: formatDate(driver.deleted_at) })}`
                : "";
            return (
                <Section title={t("notifications:sectionDriverDetails")}>
                    <Field label={t("common:name")} value={<span className="inline-flex items-center gap-1.5"><User size={13} />{driver?.name ?? "—"}</span>} />
                    <Field label={t("common:email")} value={<span className="inline-flex items-center gap-1.5"><Mail size={13} />{driver?.email ?? "—"}</span>} />
                    <Field label={t("common:phone")} value={<span className="inline-flex items-center gap-1.5"><Phone size={13} />{driver?.phone}</span>} />
                    <Field label={t("notifications:fieldAccountCreated")} value={<span className="inline-flex items-center gap-1.5"><Calendar size={13} />{formatDate(driver?.created_at)}</span>} />
                    <Field label={t("common:status")} value={driver?.is_deleted ? <span className="text-main-lightCoral font-medium">{t("notifications:statusDeleted")}{deletedSuffix}</span> : <span className="text-main-primary font-medium">{t("notifications:statusActive")}</span>} />
                </Section>
            );
        }

        if (type === "trip") {
            const { trip } = notification as IDetailedTripNotification;
            const { user } = trip?.request ?? {};
            const { driver } = trip;
            const driverDeletedSuffix = driver?.deleted_at
                ? ` ${t("notifications:deletedOn", { date: formatDate(driver.deleted_at) })}`
                : "";
            return (
                <>
                    <Section title={t("notifications:sectionTripDetails")}>
                        <Field label={t("notifications:fieldBookingNumber")} value={<span className="inline-flex items-center gap-1.5"><Hash size={13} />{trip?.booking_number}</span>} />
                        <Field label={t("common:status")} value={<span className="capitalize font-medium">{trip?.status}</span>} />
                        <Field label={t("common:createdAt")} value={<span className="inline-flex items-center gap-1.5"><Calendar size={13} />{formatDate(trip?.created_at)}</span>} />
                        <Field label={t("notifications:fieldPickedUpAt")} value={formatDate(trip?.picked_up_at)} />
                        <Field label={t("notifications:fieldCompletedAt")} value={formatDate(trip?.completed_at)} />
                        <Field label={t("notifications:fieldCancelledAt")} value={formatDate(trip?.cancelled_at)} />
                        {trip?.cancelled_by && (
                            <Field
                                label={t("notifications:fieldCancelledBy")}
                                value={
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${trip?.cancelled_by === "user"
                                        ? "bg-blue-50 text-blue-700 border-blue-200"
                                        : "bg-red-50 text-red-700 border-red-200"}`}>
                                        {trip?.cancelled_by}
                                    </span>
                                }
                            />
                        )}

                    </Section>

                    <Section title={t("notifications:sectionUserDetails")}>
                        <Field label={t("notifications:fieldFullName")} value={<span className="inline-flex items-center gap-1.5"><User size={13} />{user?.full_name}</span>} />
                        <Field label={t("common:email")} value={<span className="inline-flex items-center gap-1.5"><Mail size={13} />{user?.email}</span>} />
                        <Field label={t("common:phone")} value={<span className="inline-flex items-center gap-1.5"><Phone size={13} />{user?.phone}</span>} />
                        <Field label={t("notifications:fieldAccountCreated")} value={<span className="inline-flex items-center gap-1.5"><Calendar size={13} />{formatDate(user?.created_at)}</span>} />
                        <Field label={t("common:status")} value={user?.is_deleted ? <span className="text-main-lightCoral font-medium">{t("notifications:statusDeleted")}</span> : <span className="text-main-primary font-medium">{t("notifications:statusActive")}</span>} />
                    </Section>

                    <Section title={t("notifications:sectionDriverDetails")}>
                        <Field label={t("common:name")} value={<span className="inline-flex items-center gap-1.5"><User size={13} />{driver?.name ?? "—"}</span>} />
                        <Field label={t("common:email")} value={<span className="inline-flex items-center gap-1.5"><Mail size={13} />{driver?.email ?? "—"}</span>} />
                        <Field label={t("common:phone")} value={<span className="inline-flex items-center gap-1.5"><Phone size={13} />{driver?.phone}</span>} />
                        <Field label={t("notifications:fieldAccountCreated")} value={<span className="inline-flex items-center gap-1.5"><Calendar size={13} />{formatDate(driver?.created_at)}</span>} />
                        <Field label={t("common:status")} value={driver?.is_deleted ? <span className="text-main-lightCoral font-medium">{t("notifications:statusDeleted")}{driverDeletedSuffix}</span> : <span className="text-main-primary font-medium">{t("notifications:statusActive")}</span>} />
                    </Section>
                </>
            );
        }

        return null;
    };

    return (
        <div className="space-y-6">
            <BackButton
                label={t("common:back")}
                onClick={() => navigate(backPath)}
            />
            <PageHeader title={t(`notifications:${titleKey}`)} description={t("notifications:detailPageDescription", { id: notification.id })} />

            <Section title={t("notifications:sectionNotification")}>
                <Field label={t("common:title")} value={notification.title} />
                <Field label={t("notifications:fieldSentAt")} value={formatDate(notification.created_at)} />
                <div className="col-span-2">
                    <Field label={t("common:description")} value={<p className="whitespace-pre-wrap leading-6">{notification.description}</p>} />
                </div>
            </Section>

            {renderRelatedEntity()}
        </div>
    );
};

export default NotificationDetailPage;
