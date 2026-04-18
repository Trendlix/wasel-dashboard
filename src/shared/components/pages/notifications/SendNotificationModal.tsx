import { useEffect, useMemo, useState } from "react";
import { CalendarClock, Search, TicketPercent, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
    CommonModal,
    CommonModalBody,
    CommonModalFooter,
    CommonModalHeader,
} from "@/shared/components/common/CommonModal";
import { formInputClass, formSelectTriggerClass } from "@/shared/components/common/formStyles";
import axiosNormalApiClient from "@/shared/utils/axios";
import { showToast } from "@/shared/utils/toast";
import type { TNotificationManagementTab } from "@/shared/core/pages/notifications";

type TNotificationAudienceMode = "all" | "specific";
type TNotificationColor = "blue" | "green" | "yellow" | "red" | "gray";

interface IUserLite {
    id: number;
    full_name: string;
    email: string;
    phone: string;
}

interface IVoucherLite {
    id: number;
    code: string;
    discount_type?: string | null;
    voucher_type?: string | null;
    description?: string | null;
    status?: string;
    valid_to?: string;
}

const getVoucherType = (voucher: IVoucherLite) =>
    voucher.discount_type?.trim() || voucher.voucher_type?.trim() || "";

const normalizeVoucher = (voucher: IVoucherLite): IVoucherLite => ({
    ...voucher,
    discount_type: getVoucherType(voucher),
});

interface ISendNotificationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSent: () => Promise<void>;
    initialTab?: TNotificationManagementTab;
    initialTitle?: string;
    initialMessage?: string;
}

const notificationColorOptions: { value: TNotificationColor; label: string }[] = [
    { value: "blue", label: "Blue" },
    { value: "green", label: "Green" },
    { value: "yellow", label: "Yellow" },
    { value: "red", label: "Red" },
    { value: "gray", label: "Gray" },
];

const SendNotificationModal = ({
    open,
    onOpenChange,
    onSent,
    initialTab = "offers-updates",
    initialTitle = "",
    initialMessage = "",
}: ISendNotificationModalProps) => {
    const [title, setTitle] = useState(initialTitle);
    const [message, setMessage] = useState(initialMessage);
    const [audienceMode, setAudienceMode] = useState<TNotificationAudienceMode>("all");
    const [usersQuery, setUsersQuery] = useState("");
    const [usersLoading, setUsersLoading] = useState(false);
    const [userOptions, setUserOptions] = useState<IUserLite[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<IUserLite[]>([]);
    const [scheduleAt, setScheduleAt] = useState("");
    const [deepLink, setDeepLink] = useState("");
    const [priority, setPriority] = useState<"normal" | "high">("normal");
    const [notificationColor, setNotificationColor] = useState<TNotificationColor>("blue");
    const [kind, setKind] = useState<"offer" | "update">("offer");
    const [offerType, setOfferType] = useState<"offer" | "voucher">("offer");
    const [voucherCode, setVoucherCode] = useState("");
    const [voucherType, setVoucherType] = useState("");
    const [voucherModalOpen, setVoucherModalOpen] = useState(false);
    const [voucherQuery, setVoucherQuery] = useState("");
    const [vouchersLoading, setVouchersLoading] = useState(false);
    const [vouchers, setVouchers] = useState<IVoucherLite[]>([]);
    const [selectedVoucher, setSelectedVoucher] = useState<IVoucherLite | null>(null);
    const [sending, setSending] = useState(false);

    const isValid = title.trim().length > 0 && message.trim().length > 0;
    const scheduleDateIso = useMemo(() => {
        if (!scheduleAt) return null;
        const parsed = new Date(scheduleAt);
        if (Number.isNaN(parsed.getTime())) return null;
        return parsed.toISOString();
    }, [scheduleAt]);

    useEffect(() => {
        if (!open) return;
        setKind(initialTab === "offers-updates" ? "offer" : "update");
        setTitle(initialTitle);
        setMessage(initialMessage);
        setAudienceMode("all");
        setUsersQuery("");
        setUserOptions([]);
        setSelectedUsers([]);
        setScheduleAt("");
        setDeepLink("");
        setPriority("normal");
        setNotificationColor("blue");
        setOfferType("offer");
        setVoucherCode("");
        setVoucherType("");
        setVoucherModalOpen(false);
        setVoucherQuery("");
        setVouchers([]);
        setSelectedVoucher(null);
    }, [open, initialTab, initialTitle, initialMessage]);

    useEffect(() => {
        if (!open || audienceMode !== "specific") return;

        const timer = setTimeout(async () => {
            try {
                setUsersLoading(true);
                const response = await axiosNormalApiClient.get("/dashboard/users", {
                    params: {
                        page: 1,
                        limit: 8,
                        search: usersQuery.trim() || undefined,
                        order: "desc",
                    },
                });
                const users = (response.data?.data ?? []) as IUserLite[];
                setUserOptions(users);
            } catch {
                setUserOptions([]);
            } finally {
                setUsersLoading(false);
            }
        }, 350);

        return () => clearTimeout(timer);
    }, [open, audienceMode, usersQuery]);

    useEffect(() => {
        if (!open || !voucherModalOpen || kind !== "offer" || offerType !== "voucher") {
            return;
        }

        const timer = setTimeout(async () => {
            try {
                setVouchersLoading(true);
                const response = await axiosNormalApiClient.get("/vouchers/get-vouchers", {
                    params: {
                        page: 1,
                        limit: 10,
                        search: voucherQuery.trim() || undefined,
                        status: "active",
                        order: "desc",
                    },
                });

                const vouchersData = (response.data?.data ?? []) as IVoucherLite[];
                setVouchers(vouchersData.map(normalizeVoucher));
            } catch {
                setVouchers([]);
            } finally {
                setVouchersLoading(false);
            }
        }, 350);

        return () => clearTimeout(timer);
    }, [open, voucherModalOpen, kind, offerType, voucherQuery]);

    const applyVoucherCode = (voucher: IVoucherLite) => {
        const normalizedVoucher = normalizeVoucher(voucher);
        setSelectedVoucher(normalizedVoucher);
        setVoucherCode(normalizedVoucher.code);
        setVoucherType(normalizedVoucher.discount_type || "");
    };

    const toggleUser = (user: IUserLite) => {
        setSelectedUsers((prev) => {
            const exists = prev.some((u) => u.id === user.id);
            if (exists) return prev.filter((u) => u.id !== user.id);
            return [...prev, user];
        });
    };

    const sendNotification = async (asScheduled: boolean) => {
        if (!isValid || sending) return;

        if (asScheduled && !scheduleDateIso) {
            showToast("Please choose a valid date and time for scheduling.", "alert");
            return;
        }

        if (audienceMode === "specific" && selectedUsers.length === 0) {
            showToast("Please select at least one user.", "alert");
            return;
        }

        if (kind === "offer" && offerType === "voucher" && !voucherCode.trim()) {
            showToast("Please provide a voucher code for voucher offers.", "alert");
            return;
        }

        try {
            setSending(true);

            const users_ids = selectedUsers.map((user) => String(user.id));
            const payload = {
                deep_link: deepLink.trim() || undefined,
                priority,
                scheduled_at: asScheduled ? scheduleDateIso : undefined,
            };

            if (kind === "update") {
                await axiosNormalApiClient.post("/dashboard/updates-notifications", {
                    title: title.trim(),
                    description: message.trim(),
                    icon: "megaphone",
                    label: "update",
                    color: notificationColor,
                    for_all: audienceMode === "all",
                    users_ids: audienceMode === "specific" ? users_ids : undefined,
                    payload,
                });
            } else {
                await axiosNormalApiClient.post("/dashboard/offers-notifications", {
                    title: title.trim(),
                    description: message.trim(),
                    type: offerType,
                    voucher: offerType === "voucher" ? voucherCode.trim() : undefined,
                    voucher_type: offerType === "voucher" ? offerType : undefined,
                    color: notificationColor,
                    for_all: audienceMode === "all",
                    users_ids: audienceMode === "specific" ? users_ids : undefined,
                    payload: {
                        ...payload,
                        ...(offerType === "voucher" && selectedVoucher
                            ? { voucher_id: selectedVoucher.id, voucher_code: selectedVoucher.code }
                            : {}),
                    },
                });
            }

            await onSent();
            onOpenChange(false);
        } finally {
            setSending(false);
        }
    };

    return (
        <>
            <CommonModal open={open} onOpenChange={onOpenChange} maxWidth="sm:max-w-[760px]" loading={sending}>
                <CommonModalHeader
                    title="Send New Notification"
                    description="Create and send a new notification with audience targeting."
                />

                <CommonModalBody className="space-y-6 px-2 sm:px-3 pb-6 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-main-mirage">Type</label>
                            <Select
                                value={kind}
                                onValueChange={(value) => setKind(value as "offer" | "update")}
                            >
                                <SelectTrigger className={`${formSelectTriggerClass} w-full`}>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="offer">Offer</SelectItem>
                                    <SelectItem value="update">Update</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-main-mirage">Priority</label>
                            <Select value={priority} onValueChange={(value) => setPriority(value as "normal" | "high")}>
                                <SelectTrigger className={`${formSelectTriggerClass} w-full`}>
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {kind === "offer" && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-main-mirage">Offer Type</label>
                            <Select value={offerType} onValueChange={(value) => setOfferType(value as "offer" | "voucher")}>
                                <SelectTrigger className={`${formSelectTriggerClass} w-full`}>
                                    <SelectValue placeholder="Select offer type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="offer">General Offer</SelectItem>
                                    <SelectItem value="voucher">Voucher Offer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {kind === "offer" && offerType === "voucher" && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-main-mirage">Voucher Code</label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        value={voucherCode}
                                        onChange={(event) => {
                                            setVoucherCode(event.target.value);
                                            setVoucherType("");
                                        }}
                                        placeholder="Enter voucher code or choose from list..."
                                        className={formInputClass}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setVoucherModalOpen(true)}
                                        className="h-11 px-3 common-rounded border border-main-whiteMarble text-main-primary hover:bg-main-primary/10 text-xs font-semibold inline-flex items-center gap-1.5 shrink-0"
                                        title="Choose voucher code"
                                    >
                                        <TicketPercent size={14} />
                                        Choose
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-main-mirage">Voucher Type</label>
                                <Input
                                    value={voucherType}
                                    readOnly
                                    className={formInputClass}
                                />
                            </div>
                        </>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-main-mirage">Color</label>
                        <Select
                            value={notificationColor}
                            onValueChange={(value) => setNotificationColor(value as TNotificationColor)}
                        >
                            <SelectTrigger className={`${formSelectTriggerClass} w-full`}>
                                <SelectValue placeholder="Select color" />
                            </SelectTrigger>
                            <SelectContent>
                                {notificationColorOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-main-mirage">Title</label>
                        <Input
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            placeholder="Enter notification title..."
                            className={formInputClass}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-main-mirage">Message</label>
                        <Textarea
                            value={message}
                            onChange={(event) => setMessage(event.target.value)}
                            placeholder="Write your notification message..."
                            className="min-h-[120px] border-main-whiteMarble focus-visible:ring-main-primary/30"
                        />
                        {selectedVoucher && kind === "offer" && offerType === "voucher" && (
                            <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-main-primary/10 text-main-primary text-xs font-semibold w-fit">
                                <TicketPercent size={12} />
                                {selectedVoucher.code}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedVoucher(null);
                                        setVoucherCode("");
                                        setVoucherType("");
                                    }}
                                    className="hover:text-main-primary/70"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-main-mirage">Schedule (optional)</label>
                            <div className="relative">
                                <CalendarClock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-main-sharkGray" />
                                <Input
                                    type="datetime-local"
                                    value={scheduleAt}
                                    onChange={(event) => setScheduleAt(event.target.value)}
                                    className="pl-9 h-11 border-main-whiteMarble focus-visible:ring-main-primary/30"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-main-mirage">Deep Link (optional)</label>
                            <Input
                                value={deepLink}
                                onChange={(event) => setDeepLink(event.target.value)}
                                placeholder="e.g. wasel://offers/latest"
                                className={formInputClass}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-main-mirage">Target Audience</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setAudienceMode("all")}
                                    className={`h-10 w-full px-4 common-rounded text-sm font-semibold border transition-colors ${audienceMode === "all"
                                        ? "bg-main-primary text-main-white border-main-primary"
                                        : "border-main-whiteMarble text-main-hydrocarbon hover:bg-main-luxuryWhite"
                                        }`}
                                >
                                    All Users
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setAudienceMode("specific")}
                                    className={`h-10 w-full px-4 common-rounded text-sm font-semibold border transition-colors ${audienceMode === "specific"
                                        ? "bg-main-primary text-main-white border-main-primary"
                                        : "border-main-whiteMarble text-main-hydrocarbon hover:bg-main-luxuryWhite"
                                        }`}
                                >
                                    Specific Users
                                </button>
                            </div>
                        </div>

                        {audienceMode === "specific" && (
                            <div className="space-y-2">
                                <div className="relative">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-main-sharkGray" />
                                    <Input
                                        value={usersQuery}
                                        onChange={(event) => setUsersQuery(event.target.value)}
                                        placeholder="Search by name, email, or phone..."
                                        className="pl-9 h-11 border-main-whiteMarble focus-visible:ring-main-primary/30"
                                    />
                                </div>
                                <div className="max-h-[180px] overflow-y-auto border border-main-whiteMarble common-rounded divide-y divide-main-whiteMarble">
                                    {usersLoading && (
                                        <div className="px-3 py-3 text-sm text-main-sharkGray">Searching users...</div>
                                    )}

                                    {!usersLoading && userOptions.length === 0 && (
                                        <div className="px-3 py-3 text-sm text-main-sharkGray">No users found.</div>
                                    )}

                                    {!usersLoading && userOptions.map((user) => {
                                        const checked = selectedUsers.some((selected) => selected.id === user.id);
                                        return (
                                            <button
                                                type="button"
                                                key={user.id}
                                                onClick={() => toggleUser(user)}
                                                className={`w-full px-3 py-3 text-left transition-colors ${checked ? "bg-main-primary/10" : "hover:bg-main-luxuryWhite"}`}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <p className="text-sm font-semibold text-main-mirage">{user.full_name}</p>
                                                        <p className="text-xs text-main-sharkGray">{user.email}</p>
                                                        <p className="text-xs text-main-sharkGray">{user.phone}</p>
                                                    </div>
                                                    <input type="checkbox" checked={checked} readOnly className="mt-1" />
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>

                                {selectedUsers.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {selectedUsers.map((user) => (
                                            <span
                                                key={user.id}
                                                className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-main-primary/10 text-main-primary text-xs font-semibold"
                                            >
                                                {user.full_name}
                                                <button
                                                    type="button"
                                                    onClick={() => toggleUser(user)}
                                                    className="text-main-primary hover:text-main-primary/70"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </CommonModalBody>

                <CommonModalFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="h-11 px-5 border-main-whiteMarble text-main-hydrocarbon"
                        disabled={sending}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => sendNotification(true)}
                        className="h-11 px-5 border-main-primary text-main-primary hover:bg-main-primary/10"
                        disabled={!isValid || sending}
                    >
                        {sending ? "Scheduling..." : "Schedule"}
                    </Button>
                    <Button
                        type="button"
                        onClick={() => sendNotification(false)}
                        className="h-11 px-5 bg-main-primary text-main-white hover:bg-main-primary/90"
                        disabled={!isValid || sending}
                    >
                        {sending ? "Sending..." : "Send Now"}
                    </Button>
                </CommonModalFooter>
            </CommonModal>

            <CommonModal
                open={voucherModalOpen}
                onOpenChange={setVoucherModalOpen}
                maxWidth="sm:max-w-[560px]"
            >
                <CommonModalHeader
                    title="Choose Voucher Code"
                    description="Select one voucher to insert automatically into the notification message."
                />
                <CommonModalBody className="space-y-4 px-2 sm:px-3 pb-6 pt-1">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-main-sharkGray" />
                        <Input
                            value={voucherQuery}
                            onChange={(event) => setVoucherQuery(event.target.value)}
                            placeholder="Search by voucher code or description..."
                            className="pl-9 h-11 border-main-whiteMarble focus-visible:ring-main-primary/30"
                        />
                    </div>

                    <div className="max-h-[280px] overflow-y-auto border border-main-whiteMarble common-rounded divide-y divide-main-whiteMarble">
                        {vouchersLoading && (
                            <div className="px-3 py-3 text-sm text-main-sharkGray">Loading vouchers...</div>
                        )}

                        {!vouchersLoading && vouchers.length === 0 && (
                            <div className="px-3 py-3 text-sm text-main-sharkGray">No vouchers found.</div>
                        )}

                        {!vouchersLoading && vouchers.map((voucher) => (
                            <button
                                type="button"
                                key={voucher.id}
                                onClick={() => {
                                    applyVoucherCode(voucher);
                                    setVoucherModalOpen(false);
                                }}
                                className="w-full px-3 py-3 text-left hover:bg-main-luxuryWhite transition-colors"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-bold text-main-primary">{voucher.code}</p>
                                        <p className="text-xs text-main-sharkGray line-clamp-2">
                                            {voucher.description || "No description"}
                                        </p>
                                    </div>
                                    <span className="text-xs text-main-sharkGray">
                                        {voucher.valid_to
                                            ? new Date(voucher.valid_to).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })
                                            : "-"}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </CommonModalBody>
                <CommonModalFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setVoucherModalOpen(false)}
                        className="h-11 px-5 border-main-whiteMarble text-main-hydrocarbon"
                    >
                        Close
                    </Button>
                </CommonModalFooter>
            </CommonModal>
        </>
    );
};

export default SendNotificationModal;
