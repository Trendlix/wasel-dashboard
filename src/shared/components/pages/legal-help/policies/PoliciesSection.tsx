import { useEffect, useState } from "react";
import clsx from "clsx";
import { Pencil, Plus, Trash2 } from "lucide-react";
import useLegalHelpStore, { type IPolicyRow } from "@/shared/hooks/store/useLegalHelpStore";
import PolicyFormModal from "./PolicyFormModal";
import DeleteDataManagementModal from "@/shared/components/pages/data-management/modals/DeleteDataManagementModal";
import NoDataFound from "@/shared/components/common/NoDataFound";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const TH = ({ children }: { children: React.ReactNode }) => (
    <th className="text-main-hydrocarbon font-semibold text-xs uppercase tracking-wide py-4 px-6 text-left">
        {children}
    </th>
);

const PoliciesSection = () => {
    const {
        policies,
        policiesLoading,
        policySubmitting,
        policyTypeFilter,
        error,
        clearError,
        setPolicyTypeFilter,
        fetchPolicies,
        createPolicy,
        updatePolicy,
        deletePolicy,
    } = useLegalHelpStore();

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<IPolicyRow | null>(null);
    const [deleting, setDeleting] = useState<IPolicyRow | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        fetchPolicies();
    }, [fetchPolicies, policyTypeFilter]);

    const typeBadge = (t: string) => (
        <span
            className={clsx(
                "px-3 py-1 rounded-full text-xs font-semibold",
                t === "privacy"
                    ? "bg-main-vividSubmarine/20 text-main-hydrocarbon"
                    : "bg-main-primary/10 text-main-primary",
            )}
        >
            {t}
        </span>
    );

    return (
        <div className="space-y-6">
            {error && (
                <div className="mx-6 mt-4 flex items-center justify-between gap-3 rounded-lg bg-main-remove/10 px-3 py-2 text-sm text-main-remove">
                    <span>{error}</span>
                    <button type="button" className="font-bold underline" onClick={clearError}>
                        Dismiss
                    </button>
                </div>
            )}

            <div className="flex flex-col gap-4 p-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-3">
                    <div>
                        <h2 className="text-main-mirage font-bold text-xl">Policy entries</h2>
                        <p className="text-main-sharkGray text-sm mt-1">
                            Optional key/value records (separate from the main terms JSON document)
                        </p>
                    </div>
                    <div className="w-full sm:w-48">
                        <p className="text-xs font-semibold text-main-lightSlate uppercase tracking-wide mb-1">
                            Filter by type
                        </p>
                        <Select
                            value={policyTypeFilter || "all"}
                            onValueChange={(v) => setPolicyTypeFilter(v === "all" ? "" : v)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="terms">Terms</SelectItem>
                                <SelectItem value="privacy">Privacy</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <Button
                    type="button"
                    className="bg-main-primary text-main-white font-bold hover:bg-main-primary/90 shrink-0"
                    onClick={() => {
                        setEditing(null);
                        setModalOpen(true);
                    }}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add entry
                </Button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="border border-x-0 border-main-whiteMarble bg-main-luxuryWhite text-main-sharkGray">
                        <tr className="border-b border-main-whiteMarble">
                            <TH>Type</TH>
                            <TH>Key</TH>
                            <TH>Answer</TH>
                            <TH>Actions</TH>
                        </tr>
                    </thead>
                    <tbody>
                        {policiesLoading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <tr key={i} className="border-b border-main-whiteMarble animate-pulse">
                                    <td className="py-5 px-6">
                                        <div className="h-4 bg-main-titaniumWhite rounded w-16" />
                                    </td>
                                    <td className="py-5 px-6">
                                        <div className="h-4 bg-main-titaniumWhite rounded w-32" />
                                    </td>
                                    <td className="py-5 px-6">
                                        <div className="h-4 bg-main-titaniumWhite rounded w-full max-w-md" />
                                    </td>
                                    <td className="py-5 px-6" />
                                </tr>
                            ))
                        ) : policies.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-12">
                                    <NoDataFound
                                        title="No policy entries"
                                        description="Create a row or clear the type filter."
                                    />
                                </td>
                            </tr>
                        ) : (
                            policies.map((row) => (
                                <tr
                                    key={row.id}
                                    className="border-b border-main-whiteMarble last:border-0 hover:bg-main-luxuryWhite/50 transition-colors"
                                >
                                    <td className="py-5 px-6">{typeBadge(row.type)}</td>
                                    <td className="py-5 px-6 text-main-mirage font-semibold text-sm font-mono">
                                        {row.key}
                                    </td>
                                    <td className="py-5 px-6 text-main-sharkGray text-sm max-w-lg">
                                        <span className="line-clamp-2">{row.answer}</span>
                                    </td>
                                    <td className="py-5 px-6">
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                className="text-main-primary hover:opacity-70"
                                                onClick={() => {
                                                    setEditing(row);
                                                    setModalOpen(true);
                                                }}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                className="text-main-remove hover:opacity-70"
                                                onClick={() => setDeleting(row)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <PolicyFormModal
                open={modalOpen}
                onOpenChange={(v) => {
                    setModalOpen(v);
                    if (!v) setEditing(null);
                }}
                editing={editing}
                loading={policySubmitting}
                onSubmit={async (data) => {
                    if (editing) {
                        return updatePolicy(editing.id, {
                            answer: data.answer,
                            type: data.type,
                            key: data.key,
                        });
                    }
                    return createPolicy(data);
                }}
            />

            <DeleteDataManagementModal
                open={!!deleting}
                onOpenChange={(v) => !v && setDeleting(null)}
                title={deleting?.key ?? ""}
                loading={deleteLoading}
                onConfirm={async () => {
                    if (!deleting) return;
                    setDeleteLoading(true);
                    try {
                        await deletePolicy(deleting.id);
                    } finally {
                        setDeleteLoading(false);
                    }
                }}
            />
        </div>
    );
};

export default PoliciesSection;
