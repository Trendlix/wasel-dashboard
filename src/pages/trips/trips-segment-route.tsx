import { Navigate, useParams } from "react-router-dom";
import TripsTable from "@/shared/components/pages/trips/TripsTable";
import { TRIP_LIST_TABS, type TTripListTab } from "@/shared/core/pages/trips";

const validTabs = new Set<string>(TRIP_LIST_TABS);

const TripsSegmentRoute = () => {
  const { segment } = useParams<{ segment: string }>();

  if (!segment) {
    return <Navigate to="/trips/all" replace />;
  }

  if (/^\d+$/.test(segment)) {
    return <Navigate to={`/trips/view/${segment}`} replace />;
  }

  if (validTabs.has(segment)) {
    return <TripsTable statusTab={segment as TTripListTab} />;
  }

  return <Navigate to="/trips/all" replace />;
};

export default TripsSegmentRoute;
