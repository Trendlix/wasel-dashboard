import clsx from "clsx";
import { NavLink } from "react-router-dom";
import { sidebarItems, type ISidebarItem } from "../../core/layout/sidebar";


const Sidebar = () => {
    return (
        <aside className="w-64 bg-main-primary common-rounded flex flex-col sticky top-7 h-max">
            <Header />
            <Nav />
            <Footer />
        </aside>
    );
};

const Nav = () => {
    return (
        <nav className="p-4 w-full space-y-1">
            {sidebarItems?.map((item) => (
                <SidebarItem key={item.id} item={item} />
            ))}
        </nav>
    );
};

const SidebarItem = ({ item }: { item: ISidebarItem }) => {
    const baseClass =
        "flex w-full items-center gap-3 common-rounded p-3 transition duration-200 ease-linear text-sm leading-[20px] capitalize";

    return (
        <NavLink
            to={item.to}
            className={({ isActive }) =>
                clsx(baseClass, {
                    "bg-main-white text-main-primary font-bold": isActive,
                    "bg-transparent text-main-white font-medium": !isActive,
                })
            }
        >
            <span>
                <item.icon />
            </span>
            <span>{item.name}</span>
        </NavLink>
    );
};

const Header = () => {
    return (
        <div>
            <div className="p-4">
                <img src="/brand/logo.png" alt="wasel-logo" className="w-20 h-8" />
                <p className="text-main-white/70 font-medium text-sm leading-5 mt-0.5">
                    Management Panel
                </p>
            </div>
            <Divider />
        </div>
    );
};

const Footer = () => {
    return (
        <div className="mt-auto">
            <Divider />
            <div className="p-4 flex items-center gap-3">
                <div className="bg-main-white/20 w-10 h-10 rounded-full uppercase text-main-white font-bold text-sm flex items-center justify-center">
                    AD
                </div>
                <div className="space-y-1">
                    <p className="capitalize text-main-white font-semibold text-sm">
                        Admin User
                    </p>
                    <p className="text-xs font-normal text-main-white/70">
                        admin@wasel.com
                    </p>
                </div>
            </div>
        </div>
    );
};

const Divider = () => (
    <hr className="border-main-white/10" />
);

export default Sidebar;