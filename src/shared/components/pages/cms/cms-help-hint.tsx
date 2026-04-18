import { Info } from "lucide-react";

export interface CmsHelpHintProps {
    text: string;
}

/**
 * Info icon with hover/focus tooltip.
 * Anchored to grow into the reading direction (LTR: opens right; RTL: opens left) so it is not clipped by the card edge.
 */
const CmsHelpHint = ({ text }: CmsHelpHintProps) => (
    <span className="group relative inline-flex shrink-0 overflow-visible">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-main-whiteMarble bg-main-titaniumWhite text-main-lightSlate">
            <Info className="h-3 w-3" />
        </span>
        <span
            className={[
                "pointer-events-none absolute top-7 z-[200] w-64 max-w-[min(16rem,calc(100vw-1.5rem))]",
                "rounded-lg border border-main-whiteMarble bg-main-white p-2",
                "text-start text-xs font-medium leading-relaxed text-main-sharkGray break-words",
                "opacity-0 shadow-[0_10px_26px_rgba(17,24,39,0.12)] transition-opacity",
                "group-hover:opacity-100 group-focus-within:opacity-100",
                /* LTR: anchor left edge to icon, extend right (away from page margin). */
                "ltr:left-0 ltr:right-auto",
                /* RTL: anchor right edge to icon, extend left into the column. */
                "rtl:right-0 rtl:left-auto",
            ].join(" ")}
        >
            {text}
        </span>
    </span>
);

export default CmsHelpHint;
