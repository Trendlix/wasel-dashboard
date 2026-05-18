import { useTranslation } from "react-i18next";
import type { ExportActiveFilters } from "@/shared/utils/export-query";

interface ExportActiveFiltersSummaryProps {
  activeFilters?: ExportActiveFilters;
}

const ExportActiveFiltersSummary = ({ activeFilters }: ExportActiveFiltersSummaryProps) => {
  const { t } = useTranslation("trips");

  if (!activeFilters) return null;

  const parts: string[] = [];
  if (activeFilters.urgent) {
    parts.push(t("export.filterUrgent"));
  }
  if (activeFilters.expired) {
    parts.push(t("export.filterExpired"));
  }
  if (activeFilters.statusLabel) {
    parts.push(`${t("export.filterStatus")}: ${activeFilters.statusLabel}`);
  }
  if (activeFilters.search) {
    parts.push(`${t("export.filterSearch")}: "${activeFilters.search}"`);
  }

  if (parts.length === 0) return null;

  return (
    <p className="text-xs font-medium text-main-primary mt-2">
      {t("export.activeFilters")} {parts.join(" · ")}
    </p>
  );
};

export default ExportActiveFiltersSummary;
