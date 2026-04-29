import { Navigate, useParams } from "react-router-dom";
import VerificationList from "@/shared/components/pages/verification/VerificationList";

const validFlows = new Set(["registration", "re_verification"]);
const validStatuses = new Set(["pending", "approved", "rejected"]);

const VerificationListRoute = () => {
  const { flowType, status } = useParams<{ flowType: string; status: string }>();

  if (!flowType || !status || !validFlows.has(flowType) || !validStatuses.has(status)) {
    return <Navigate to="/verification/registration/pending" replace />;
  }

  return (
    <VerificationList
      flowType={flowType as "registration" | "re_verification"}
      statusTab={status as "pending" | "approved" | "rejected"}
    />
  );
};

export default VerificationListRoute;
