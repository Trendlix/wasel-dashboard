import clsx from "clsx";
import { useEffect } from "react";
import { CheckCircle2, FileText, XCircle } from "lucide-react";
import useVerificationStore from "@/shared/hooks/store/useVerificationStore";

const Analytics = () => {
  const { counts, countsLoading, fetchVerificationCounts } = useVerificationStore();

  useEffect(() => {
    fetchVerificationCounts();
  }, []);

  const cards = [
    {
      id: 1,
      label: "Pending Reviews",
      value: String(counts.pending),
      icon: FileText,
      iconBg: "bg-main-mustardGold/10",
      iconColor: "text-main-mustardGold",
    },
    {
      id: 2,
      label: "Approved",
      value: String(counts.approved),
      icon: CheckCircle2,
      iconBg: "bg-main-vividMint/10",
      iconColor: "text-main-vividMint",
    },
    {
      id: 3,
      label: "Rejected",
      value: String(counts.rejected),
      icon: XCircle,
      iconBg: "bg-main-primary/10",
      iconColor: "text-main-primary",
    },
  ];

  if (countsLoading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-main-white border border-main-whiteMarble common-rounded p-4 flex items-center justify-between animate-pulse"
          >
            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-main-whiteMarble" />
              <div className="h-9 w-12 rounded bg-main-whiteMarble" />
            </div>
            <div className="w-10 h-10 rounded-lg bg-main-whiteMarble" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.id} className="bg-main-white border border-main-whiteMarble common-rounded p-4 flex items-center justify-between">
            <div>
              <p className="text-main-sharkGray text-sm">{card.label}</p>
              <p className="text-main-mirage text-4xl font-bold">{card.value}</p>
            </div>
            <div className={clsx("w-10 h-10 rounded-lg flex items-center justify-center", card.iconBg, card.iconColor)}>
              <Icon size={18} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Analytics;
