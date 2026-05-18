import type { ITripsQuery } from "@/shared/hooks/store/useTripsStore";
import type { ITruckRequestsQuery } from "@/shared/hooks/store/useTruckRequestsStore";

export type TripsExportPayload = Omit<ITripsQuery, "page" | "limit">;
export type TruckRequestsExportPayload = Omit<ITruckRequestsQuery, "page" | "limit">;

const omitPagination = <T extends { page?: number; limit?: number }>(
  query: T,
): Omit<T, "page" | "limit"> => {
  const { page: _page, limit: _limit, ...rest } = query;
  return rest;
};

export const buildTripsExportBody = (
  query: ITripsQuery,
  overrides?: Partial<TripsExportPayload>,
): TripsExportPayload => omitPagination({ ...query, ...overrides });

export const buildTruckRequestsExportBody = (
  query: ITruckRequestsQuery,
  overrides?: Partial<TruckRequestsExportPayload>,
): TruckRequestsExportPayload => omitPagination({ ...query, ...overrides });

export type ExportActiveFilters = {
  statusLabel?: string;
  urgent?: boolean;
  expired?: boolean;
  search?: string;
};
