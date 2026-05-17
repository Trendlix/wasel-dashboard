import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "@/shared/components/common/BackButton";
import PageHeader from "@/shared/components/common/PageHeader";
import PageTransition from "@/shared/components/common/PageTransition";
import NoDataFound from "@/shared/components/common/NoDataFound";
import RequestDetailsView from "@/shared/components/pages/trips/requests/RequestDetailsView";
import useTruckRequestsStore from "@/shared/hooks/store/useTruckRequestsStore";

const RequestDetailPage = () => {
  const { requestId: requestIdParam } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(["trips", "common"]);

  const requestId = requestIdParam ? Number(requestIdParam) : NaN;
  const validId = Number.isFinite(requestId) && requestId > 0;

  const { requestDetails, requestDetailsLoading, fetchRequestDetails, clearRequestDetails } =
    useTruckRequestsStore();

  useEffect(() => {
    if (!validId) return;
    void fetchRequestDetails(requestId);
    return () => clearRequestDetails();
  }, [validId, requestId, fetchRequestDetails, clearRequestDetails]);

  if (!validId) {
    return (
      <PageTransition>
        <BackButton label={t("common:back")} onClick={() => navigate("/trips/requests/all")} />
        <NoDataFound title={t("trips:requestDetailNotFoundTitle")} description={t("trips:requestDetailNotFoundDescription")} />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <BackButton label={t("common:back")} onClick={() => navigate(-1)} />
        <PageHeader
          title={t("trips:requestsDetails.title")}
          description={t("trips:requestDetailPageDescription", { id: requestId })}
        />
        <RequestDetailsView
          variant="page"
          requestId={requestId}
          listRequest={null}
          requestDetails={requestDetails}
          requestDetailsLoading={requestDetailsLoading}
        />
      </div>
    </PageTransition>
  );
};

export default RequestDetailPage;
