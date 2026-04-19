import type { ReactNode } from "react";

interface IPageTransition {
    children: ReactNode;
}

/** Route content fade/slide-in (CSS). Layout.tsx handles route-level Framer motion — keep this layer DOM-simple. */
const PageTransition = ({ children }: IPageTransition) => {
    return (
        <div className="flex flex-col gap-8 animate-wasel-page-enter">{children}</div>
    );
};

export default PageTransition;
