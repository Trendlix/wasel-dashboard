import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Mail, Phone, User, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/shared/components/common/PageHeader";
import NoDataFound from "@/shared/components/common/NoDataFound";
import type {
    TDetailedNotificationType,
    IDetailedUserNotification,
    IDetailedDriverNotification,
    IDetailedTripNotification,
    TDetailedNotification,
} from "@/shared/hooks/store/useDetailedOpenedNotification";

const formatDate = (value: string | null | undefined) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

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

const typeConfig: Record<TDetailedNotificationType, { label: string; backPath: string }> = {
    user: { label: "User Notification", backPath: "/notifications" },
    driver: { label: "Driver Notification", backPath: "/notifications" },
    trip: { label: "Trip Notification", backPath: "/notifications" },
};

interface Props {
    type: TDetailedNotificationType;
    loading: boolean;
    error: string | null;
    notification: TDetailedNotification | null;
}

const NotificationDetailPage = ({ type, loading, error, notification }: Props) => {
    const navigate = useNavigate();
    const config = typeConfig[type];

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
                <Button
                    variant="outline"
                    className="h-9 px-4 border-main-whiteMarble text-main-hydrocarbon gap-2"
                    onClick={() => navigate(config.backPath)}
                >
                    <ArrowLeft size={15} />
                    Back
                </Button>
                <NoDataFound
                    title="Notification not found"
                    description={error ?? "This notification could not be loaded."}
                />
            </div>
        );
    }

    const renderRelatedEntity = () => {
        if (type === "user") {
            const { user } = notification as IDetailedUserNotification;
            return (
                <Section title="User Details">
                    <Field label="Full Name" value={<span className="inline-flex items-center gap-1.5"><User size={13} />{user?.full_name}</span>} />
                    <Field label="Email" value={<span className="inline-flex items-center gap-1.5"><Mail size={13} />{user?.email}</span>} />
                    <Field label="Phone" value={<span className="inline-flex items-center gap-1.5"><Phone size={13} />{user?.phone}</span>} />
                    <Field label="Account Created" value={<span className="inline-flex items-center gap-1.5"><Calendar size={13} />{formatDate(user?.created_at)}</span>} />
                    <Field label="Status" value={user?.is_deleted ? <span className="text-main-lightCoral font-medium">Deleted</span> : <span className="text-main-primary font-medium">Active</span>} />
                </Section>
            );
        }

        if (type === "driver") {
            const { driver } = notification as IDetailedDriverNotification;
            return (
                <Section title="Driver Details">
                    <Field label="Name" value={<span className="inline-flex items-center gap-1.5"><User size={13} />{driver?.name ?? "—"}</span>} />
                    <Field label="Email" value={<span className="inline-flex items-center gap-1.5"><Mail size={13} />{driver?.email ?? "—"}</span>} />
                    <Field label="Phone" value={<span className="inline-flex items-center gap-1.5"><Phone size={13} />{driver?.phone}</span>} />
                    <Field label="Account Created" value={<span className="inline-flex items-center gap-1.5"><Calendar size={13} />{formatDate(driver?.created_at)}</span>} />
                    <Field label="Status" value={driver?.is_deleted ? <span className="text-main-lightCoral font-medium">Deleted {driver?.deleted_at ? `on ${formatDate(driver?.deleted_at)}` : ""}</span> : <span className="text-main-primary font-medium">Active</span>} />
                </Section>
            );
        }

        if (type === "trip") {
            const { trip } = notification as IDetailedTripNotification;
            const { user } = trip?.request ?? {};
            const { driver } = trip;
            return (
                <>
                    <Section title="Trip Details">
                        <Field label="Booking Number" value={<span className="inline-flex items-center gap-1.5"><Hash size={13} />{trip?.booking_number}</span>} />
                        <Field label="Status" value={<span className="capitalize font-medium">{trip?.status}</span>} />
                        <Field label="Created At" value={<span className="inline-flex items-center gap-1.5"><Calendar size={13} />{formatDate(trip?.created_at)}</span>} />
                        <Field label="Picked Up At" value={formatDate(trip?.picked_up_at)} />
                        <Field label="Completed At" value={formatDate(trip?.completed_at)} />
                        <Field label="Cancelled At" value={formatDate(trip?.cancelled_at)} />
                        {trip?.cancelled_by && (
                            <Field
                                label="Cancelled By"
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

                    <Section title="User Details">
                        <Field label="Full Name" value={<span className="inline-flex items-center gap-1.5"><User size={13} />{user?.full_name}</span>} />
                        <Field label="Email" value={<span className="inline-flex items-center gap-1.5"><Mail size={13} />{user?.email}</span>} />
                        <Field label="Phone" value={<span className="inline-flex items-center gap-1.5"><Phone size={13} />{user?.phone}</span>} />
                        <Field label="Account Created" value={<span className="inline-flex items-center gap-1.5"><Calendar size={13} />{formatDate(user?.created_at)}</span>} />
                        <Field label="Status" value={user?.is_deleted ? <span className="text-main-lightCoral font-medium">Deleted</span> : <span className="text-main-primary font-medium">Active</span>} />
                    </Section>

                    <Section title="Driver Details">
                        <Field label="Name" value={<span className="inline-flex items-center gap-1.5"><User size={13} />{driver?.name ?? "—"}</span>} />
                        <Field label="Email" value={<span className="inline-flex items-center gap-1.5"><Mail size={13} />{driver?.email ?? "—"}</span>} />
                        <Field label="Phone" value={<span className="inline-flex items-center gap-1.5"><Phone size={13} />{driver?.phone}</span>} />
                        <Field label="Account Created" value={<span className="inline-flex items-center gap-1.5"><Calendar size={13} />{formatDate(driver?.created_at)}</span>} />
                        <Field label="Status" value={driver?.is_deleted ? <span className="text-main-lightCoral font-medium">Deleted {driver?.deleted_at ? `on ${formatDate(driver?.deleted_at)}` : ""}</span> : <span className="text-main-primary font-medium">Active</span>} />
                    </Section>
                </>
            );
        }

        return null;
    };

    return (
        <div className="space-y-6">
            <Button
                variant="outline"
                className="h-9 px-4 border-main-whiteMarble text-main-hydrocarbon gap-2"
                onClick={() => navigate(config.backPath)}
            >
                <ArrowLeft size={15} />
                Back
            </Button>
            <PageHeader title={config.label} description={`Notification #${notification.id}`} />

            {/* Notification body */}
            <Section title="Notification">
                <Field label="Title" value={notification.title} />
                <Field label="Sent At" value={formatDate(notification.created_at)} />
                <div className="col-span-2">
                    <Field label="Message" value={<p className="whitespace-pre-wrap leading-6">{notification.description}</p>} />
                </div>
            </Section>

            {/* Related entity */}
            {renderRelatedEntity()}
        </div>
    );
};

export default NotificationDetailPage;
