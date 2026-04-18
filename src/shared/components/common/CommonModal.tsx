import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import React from "react";

interface CommonModalProps {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    children: React.ReactNode;
    maxWidth?: string;
    className?: string;
    loading?: boolean;
}

export const CommonModal = ({
    open,
    onOpenChange,
    children,
    maxWidth = "sm:max-w-[480px]",
    className,
    loading = false,
}: CommonModalProps) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
            showCloseButton={!loading}
            onPointerDownOutside={(e) => loading && e.preventDefault()}
            onEscapeKeyDown={(e) => loading && e.preventDefault()}
            className={cn(
                maxWidth,
                "bg-white p-0 border-0 ring-0 shadow-2xl rounded-3xl overflow-hidden outline-none",
                className
            )}
        >
            <div className="flex flex-col">{children}</div>
        </DialogContent>
    </Dialog>
);

export const CommonModalHeader = ({
    title,
    description,
    className,
}: {
    title: string;
    description?: React.ReactNode;
    className?: string;
}) => (
    <div className={cn("px-8 py-6", className)}>
        <DialogHeader className="gap-1">
            <DialogTitle className="text-2xl font-bold text-main-mirage tracking-tight">
                {title}
            </DialogTitle>
            {description && (
                <DialogDescription className="text-main-sharkGray text-sm">
                    {description}
                </DialogDescription>
            )}
        </DialogHeader>
    </div>
);

export const CommonModalBody = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => (
    <div className={cn("px-8 pb-2 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-main-whiteMarble scrollbar-track-transparent", className)}>
        {children}
    </div>
);

export const CommonModalFooter = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => (
    <div className={cn("px-8 py-6 bg-main-titaniumWhite/30 flex justify-end gap-3 mt-4 border-t border-main-whiteMarble", className)}>
        {children}
    </div>
);
