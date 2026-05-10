import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BackButton from "@/shared/components/common/BackButton";
import PageHeader from "@/shared/components/common/PageHeader";
import PageTransition from "@/shared/components/common/PageTransition";
import NoDataFound from "@/shared/components/common/NoDataFound";
import TripDetailsView from "@/shared/components/pages/trips/TripDetailsView";
import useTripsStore from "@/shared/hooks/store/useTripsStore";

const TripDetailPage = () => {
  const { tripId: tripIdParam } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation(["trips", "common"]);

  const tripId = tripIdParam ? Number(tripIdParam) : NaN;
  const validId = Number.isFinite(tripId) && tripId > 0;

  const {
    tripDetails,
    tripDetailsLoading,
    updating,
    fetchTripDetails,
    clearTripDetails,
    updateStatus,
  } = useTripsStore();

  useEffect(() => {
    if (!validId) return;
    void fetchTripDetails(tripId);
    return () => {
      clearTripDetails();
    };
  }, [validId, tripId, fetchTripDetails, clearTripDetails]);

  const handleCancelTrip = async () => {
    if (!validId) return;
    await updateStatus(tripId, "cancelled");
  };

  const handleBack = () => {
    const from = (location.state as { from?: string } | null)?.from;
    if (from === "notification") {
      navigate(-1);
      return;
    }
    navigate("/trips");
  };

  if (!validId) {
    return (
      <PageTransition>
        <BackButton label={t("common:back")} onClick={() => navigate("/trips")} />
        <NoDataFound
          title={t("trips:detailNotFoundTitle")}
          description={t("trips:detailNotFoundDescription")}
        />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <BackButton label={t("common:back")} onClick={handleBack} />
        <PageHeader title={t("trips:details.title")} description={t("trips:detailPageDescription", { id: tripId })} />
        <TripDetailsView
          variant="page"
          tripId={tripId}
          listTrip={null}
          tripDetails={tripDetails}
          tripDetailsLoading={tripDetailsLoading}
          updating={updating}
          onCancelTrip={handleCancelTrip}
        />
      </div>
    </PageTransition>
  );
};

export default TripDetailPage;
