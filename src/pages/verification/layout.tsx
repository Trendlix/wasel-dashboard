import clsx from "clsx";
import { NavLink, Outlet, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BadgeCheck, CircleDashed, FileWarning, UserRoundPlus, XCircle } from "lucide-react";
import PageHeader from "@/shared/components/common/PageHeader";
import PageTransition from "@/shared/components/common/PageTransition";
import Analytics from "@/shared/components/pages/verification/Analytics";

const parentTabs = [
  { key: "registration", to: "/verification/registration/pending", icon: UserRoundPlus },
  { key: "re_verification", to: "/verification/re_verification/pending", icon: FileWarning },
] as const;

const statusTabs = [
  { key: "pending", icon: CircleDashed },
  { key: "approved", icon: BadgeCheck },
  { key: "rejected", icon: XCircle },
] as const;

const VerificationLayout = () => {
  const { t } = useTranslation("verification");
  const { flowType = "registration" } = useParams<{ flowType: "registration" | "re_verification" }>();

  return (
    <PageTransition>
      <PageHeader title={t("pageTitle")} description={t("pageDescription")} />
      <Analytics />

      <div className="space-y-4">
        <div className="rounded-2xl border border-main-whiteMarble bg-main-white p-2 shadow-[0_12px_30px_rgba(17,24,39,0.04)]">
          <div className="flex items-center gap-2">
            {parentTabs.map((tab) => (
              <NavLink
                key={tab.key}
                to={tab.to}
                className={() =>
                  clsx(
                    "group inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all",
                    flowType === tab.key
                      ? "bg-main-primary text-main-white shadow-[0_8px_18px_rgba(0,0,0,0.12)]"
                      : "bg-main-titaniumWhite text-main-sharkGray hover:bg-main-whiteMarble/70 hover:text-main-primary",
                  )
                }
              >
                <tab.icon size={16} className="opacity-90 group-hover:opacity-100" />
                {tab.key === "registration"
                  ? t("verification:list.registration")
                  : t("verification:list.docsReverification")}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-main-whiteMarble bg-main-white p-2 shadow-[0_12px_30px_rgba(17,24,39,0.04)]">
          <div className="flex flex-wrap items-center gap-2">
            {statusTabs.map((status) => (
              <NavLink
                key={`${flowType}-${status.key}`}
                to={`/verification/${flowType}/${status.key}`}
                className={({ isActive }) =>
                  clsx(
                    "group inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all",
                    isActive
                      ? "bg-main-primary text-main-white shadow-[0_8px_18px_rgba(0,0,0,0.12)]"
                      : "bg-main-titaniumWhite text-main-sharkGray hover:bg-main-whiteMarble/70 hover:text-main-primary",
                  )
                }
              >
                <status.icon size={16} className="opacity-90 group-hover:opacity-100" />
                {t(`verification:statuses.${status.key}`)}
              </NavLink>
            ))}
          </div>
        </div>

        <Outlet />
      </div>
    </PageTransition>
  );
};

export default VerificationLayout;
