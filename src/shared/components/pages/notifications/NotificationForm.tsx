import { useState } from "react";
import { Send, Bell } from "lucide-react";
import clsx from "clsx";
import AudienceSelector from "./AudienceSelector";
import type { TNotificationAudience } from "@/shared/core/pages/notifications";

const NotificationForm = () => {
    const [audience, setAudience] = useState<TNotificationAudience>("all");
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");

    const isValid = title.trim().length > 0 && message.trim().length > 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;
        // TODO: wire to API
        console.log({ audience, title, message });
    };

    return (
        <div className="bg-main-white border border-main-whiteMarble common-rounded p-6 flex flex-col gap-6 h-full">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-main-primary/10 flex items-center justify-center">
                    <Bell size={18} className="text-main-primary" />
                </div>
                <h3 className="text-main-mirage font-bold text-lg">Send New Notification</h3>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1">
                {/* Audience */}
                <div className="flex flex-col gap-2">
                    <label className="text-main-mirage text-sm font-medium">Target Audience</label>
                    <AudienceSelector value={audience} onChange={setAudience} />
                </div>

                {/* Title */}
                <div className="flex flex-col gap-2">
                    <label className="text-main-mirage text-sm font-medium">Notification Title</label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter notification title..."
                        className="h-10 w-full border border-main-whiteMarble common-rounded px-3 text-sm outline-none placeholder:text-main-silverSteel focus:border-main-primary transition-colors"
                    />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-main-mirage text-sm font-medium">Message</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Enter your message..."
                        rows={5}
                        className="w-full border border-main-whiteMarble common-rounded px-3 py-2 text-sm outline-none placeholder:text-main-silverSteel focus:border-main-primary transition-colors resize-none flex-1"
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={!isValid}
                    className={clsx(
                        "h-11 w-full common-rounded flex items-center justify-center gap-2 text-sm font-semibold transition-all",
                        isValid
                            ? "bg-main-primary text-main-white hover:bg-main-primary/90"
                            : "bg-main-silverSteel/30 text-main-silverSteel cursor-not-allowed"
                    )}
                >
                    <Send size={16} />
                    Send Notification
                </button>
            </form>
        </div>
    );
};

export default NotificationForm;