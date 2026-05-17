import { Navigate, useParams } from "react-router-dom";
import RequestsTable from "@/shared/components/pages/trips/requests/RequestsTable";
import { REQUEST_LIST_TABS, type TRequestListTab } from "@/shared/core/pages/requests";

const validTabs = new Set<string>(REQUEST_LIST_TABS);

const RequestsListRoute = () => {
  const { status } = useParams<{ status: string }>();

  if (!status) {
    return <Navigate to="/trips/requests/all" replace />;
  }

  if (/^\d+$/.test(status)) {
    return <Navigate to={`/trips/requests/view/${status}`} replace />;
  }

  if (validTabs.has(status)) {
    return <RequestsTable statusTab={status as TRequestListTab} />;
  }

  return <Navigate to="/trips/requests/all" replace />;
};

export default RequestsListRoute;
