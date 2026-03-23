import { useMemo, useState } from "react";
import clsx from "clsx";
import { FileText, Search } from "lucide-react";
import {
    verificationItems,
    verificationStatusStyles,
    type IVerificationItem,
    type TVerificationStatus,
} from "@/shared/core/pages/verification";

type TTab = TVerificationStatus;

const tabs: TTab[] = ["pending", "approved", "rejected"];

const VerificationList = () => {
    const [activeTab, setActiveTab] = useState<TTab>("pending");
    const [query, setQuery] = useState("");

    const counts = useMemo(
        () => ({
            pending: verificationItems.filter((i) => i.status === "pending").length,
            approved: verificationItems.filter((i) => i.status === "approved").length,
            rejected: verificationItems.filter((i) => i.status === "rejected").length,
        }),
        []
    );

    const filtered = useMemo(() => {
        return verificationItems.filter((item) => {
            const inTab = item.status === activeTab;
            const q = query.trim().toLowerCase();
            const inSearch =
                !q ||
                item.name.toLowerCase().includes(q) ||
                item.type.toLowerCase().includes(q) ||
                item.documents.some((d) => d.toLowerCase().includes(q));

            return inTab && inSearch;
        });
    }, [activeTab, query]);

    return (
        <div className="bg-main-white border border-main-whiteMarble common-rounded overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-main-whiteMarble px-4">
                <div className="flex items-center gap-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={clsx(
                                "h-10 text-sm font-semibold capitalize border-b-2 transition",
                                activeTab === tab ? "text-main-primary border-main-primary" : "text-main-hydrocarbon border-transparent"
                            )}
                        >
                            {tab} ({counts[tab]})
                        </button>
                    ))}
                </div>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-main-whiteMarble">
                <div className="h-10 border border-main-whiteMarble common-rounded px-3 flex items-center gap-2">
                    <Search size={16} className="text-main-silverSteel" />
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by name or type..."
                        className="w-full bg-transparent outline-none text-sm placeholder:text-main-silverSteel"
                    />
                </div>
            </div>

            {/* List */}
            <div>
                {filtered.map((item) => (
                    <VerificationRow key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
};

const VerificationRow = ({ item }: { item: IVerificationItem }) => {
    const initials = item.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const status = verificationStatusStyles[item.status];

    return (
        <div className="p-4 border-b border-main-whiteMarble flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-main-primary text-main-white flex items-center justify-center font-bold">
                    {initials}
                </div>

                <div className="space-y-3">
                    <div>
                        <h4 className="text-main-mirage font-semibold">{item.name}</h4>
                        <p className="text-main-sharkGray text-xs">
                            {item.type} • {item.submittedAt}
                        </p>
                    </div>

                    <div>
                        <p className="text-main-sharkGray text-xs mb-2">Submitted Documents:</p>
                        <div className="flex flex-wrap gap-2">
                            {item.documents.map((doc) => (
                                <span
                                    key={doc}
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-main-luxuryWhite text-main-hydrocarbon text-xs border border-main-whiteMarble"
                                >
                                    <FileText size={12} />
                                    {doc}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="h-8 px-4 text-xs font-semibold bg-main-primary text-main-white rounded-md">View Documents</button>
                        <button className="h-8 px-4 text-xs font-semibold bg-main-vividMint text-main-white rounded-md">Approve</button>
                        <button className="h-8 px-4 text-xs font-semibold bg-main-remove text-main-white rounded-md">Reject</button>
                    </div>
                </div>
            </div>

            <span className={clsx("px-3 py-1 rounded-full text-xs font-medium", status.bg, status.text)}>
                {status.label}
            </span>
        </div>
    );
};

export default VerificationList;