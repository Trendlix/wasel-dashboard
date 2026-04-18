import type { ReactNode } from "react";
import HelpHint from "./HelpHint";

interface SectionCardProps {
    title: string;
    description: string;
    hint?: string;
    children: ReactNode;
    actions?: ReactNode;
    stickyHeader?: boolean;
}

const SectionCard = ({ title, description, hint, children, actions, stickyHeader }: SectionCardProps) => {
    return (
        <section className="overflow-visible rounded-2xl border border-main-whiteMarble bg-main-white shadow-[0_10px_28px_rgba(17,24,39,0.04)]">
            <div
                className={
                    stickyHeader
                        ? "sticky top-0 z-20 flex flex-wrap items-start justify-between gap-3 overflow-visible rounded-t-2xl bg-main-white px-5 py-4"
                        : "flex flex-wrap items-start justify-between gap-3 overflow-visible px-5 pt-5 pb-4"
                }
            >
                <div className="min-w-0 flex-1 space-y-1 overflow-visible">
                    <div className="flex items-center gap-2 overflow-visible">
                        <h3 className="text-lg font-bold text-main-mirage">{title}</h3>
                        {hint ? <HelpHint text={hint} /> : null}
                    </div>
                    <p className="text-sm text-main-coolGray">{description}</p>
                </div>
                {actions}
            </div>
            <div className="px-5 pb-5">{children}</div>
        </section>
    );
};

export default SectionCard;
