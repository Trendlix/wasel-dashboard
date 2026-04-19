import { UserPlus, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AdminUsersHeaderProps {
    onInvite: () => void;
    search: string;
    onSearchChange: (value: string) => void;
}

const AdminUsersHeader = ({ onInvite, search, onSearchChange }: AdminUsersHeaderProps) => {
    const { t } = useTranslation("roles");
    return (
        <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <h2 className="text-main-mirage font-bold text-xl">{t("users.sectionTitle")}</h2>
                    <p className="text-main-sharkGray text-sm mt-1">{t("users.sectionSubtitle")}</p>
                </div>
                <button
                    type="button"
                    onClick={onInvite}
                    className="flex items-center gap-2 bg-main-vividMint text-main-white font-bold text-sm px-5 h-10 common-rounded hover:bg-main-vividMint/90 transition-colors shrink-0"
                >
                    <UserPlus className="w-4 h-4 shrink-0" />
                    {t("users.inviteUser")}
                </button>
            </div>

            <div className="relative max-w-sm">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-main-sharkGray pointer-events-none" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={t("users.searchPlaceholder")}
                    className="w-full h-10 ps-9 pe-4 text-sm rounded-xl border border-main-whiteMarble bg-main-white text-main-mirage placeholder:text-main-sharkGray/60 focus:outline-none focus:ring-2 focus:ring-main-primary/20 focus:border-main-primary/40 transition-all"
                />
            </div>
        </div>
    );
};

export default AdminUsersHeader;
