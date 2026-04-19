import { useEffect, useState } from "react";
import {
    CommonModal,
    CommonModalBody,
    CommonModalFooter,
    CommonModalHeader,
} from "@/shared/components/common/CommonModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { IPolicyRow, TPolicyType } from "@/shared/hooks/store/useLegalHelpStore";

const labelClass = "text-sm font-semibold text-main-mirage";

interface PolicyFormModalProps {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    editing: IPolicyRow | null;
    loading: boolean;
    onSubmit: (data: { type: TPolicyType; key: string; answer: string }) => Promise<boolean>;
}

const PolicyFormModal = ({
    open,
    onOpenChange,
    editing,
    loading,
    onSubmit,
}: PolicyFormModalProps) => {
    const [type, setType] = useState<TPolicyType>("terms");
    const [key, setKey] = useState("");
    const [answer, setAnswer] = useState("");

    useEffect(() => {
        if (editing) {
            setType(editing.type);
            setKey(editing.key);
            setAnswer(editing.answer);
        } else {
            setType("terms");
            setKey("");
            setAnswer("");
        }
    }, [editing, open]);

    const handleSave = async () => {
        const ok = await onSubmit({
            type,
            key: key.trim(),
            answer: answer.trim(),
        });
        if (ok) onOpenChange(false);
    };

    return (
        <CommonModal open={open} onOpenChange={onOpenChange} loading={loading} maxWidth="sm:max-w-[520px]">
            <CommonModalHeader
                title={editing ? "Edit Policy Entry" : "Add Policy Entry"}
                description="Create or update a key/value row for terms or privacy policy."
            />
            <CommonModalBody className="space-y-4">
                <div className="space-y-1.5">
                    <p className={labelClass}>Type</p>
                    <Select
                        value={type}
                        onValueChange={(v) => setType(v as TPolicyType)}
                        disabled={!!editing}
                    >
                        <SelectTrigger className="h-11 border-main-whiteMarble focus:ring-main-primary/30 common-rounded">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="terms">Terms</SelectItem>
                            <SelectItem value="privacy">Privacy</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1.5">
                    <p className={labelClass}>Key</p>
                    <Input
                        className="h-11 border-main-whiteMarble focus-visible:ring-main-primary/30 common-rounded"
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        placeholder="e.g. cookie_policy"
                        disabled={!!editing}
                    />
                </div>
                <div className="space-y-1.5">
                    <p className={labelClass}>Answer / Content</p>
                    <Textarea
                        className="min-h-[140px] border-main-whiteMarble focus-visible:ring-main-primary/30"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Enter the full content for this policy entry..."
                    />
                </div>
            </CommonModalBody>
            <CommonModalFooter className="gap-3">
                <Button
                    type="button"
                    variant="ghost"
                    className="font-semibold text-main-sharkGray h-11 px-6 common-rounded hover:bg-main-titaniumWhite"
                    onClick={() => onOpenChange(false)}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    className="bg-main-primary hover:bg-main-primary/90 text-main-white font-bold h-11 px-8 common-rounded shadow-lg shadow-main-primary/20"
                    disabled={loading || !key.trim() || !answer.trim()}
                    onClick={() => void handleSave()}
                >
                    {loading ? "Saving…" : editing ? "Update" : "Create"}
                </Button>
            </CommonModalFooter>
        </CommonModal>
    );
};

export default PolicyFormModal;
