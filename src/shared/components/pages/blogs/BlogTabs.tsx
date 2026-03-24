import { NavLink } from "react-router-dom";
import { BLOG_TABS } from "./blogTabs.constants";

const BlogTabs = () => {
    const baseClassName =
        "text-sm leading-full text-nowrap cursor-pointer py-4 px-4 -mb-[1px] border-b-2 transition duration-200 ease-linear";

    return (
        <nav className=" pb-0 border-b border-main-whiteMarble flex items-center gap-6">
            {BLOG_TABS.map((tab) => (
                <NavLink
                    key={tab.id}
                    to={tab.to}
                    end
                    className={({ isActive }) =>
                        `${baseClassName} ${isActive
                            ? "text-main-primary border-main-primary font-bold"
                            : "text-main-dustyGray border-transparent hover:text-main-primary"
                        }`
                    }
                >
                    {tab.name}
                </NavLink>
            ))}
        </nav>
    );
};

export default BlogTabs;