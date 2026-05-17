import { CommonModal } from "@/shared/components/common/CommonModal";
import TripDetailsView from "@/shared/components/pages/trips/TripDetailsView";
import useTripsStore from "@/shared/hooks/store/useTripsStore";
import type { IAppTrip } from "@/shared/hooks/store/useTripsStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface TripDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trip: IAppTrip | null;
}

export const TripDetailsModal = ({ open, onOpenChange, trip }: TripDetailsModalProps) => {
  const navigate = useNavigate();
  const {
    tripDetails,
    tripDetailsLoading,
    updating,
    fetchTripDetails,
    clearTripDetails,
    updateStatus,
  } = useTripsStore();

  useEffect(() => {
    if (open && trip) {
      void fetchTripDetails(trip.id);
    } else if (!open) {
      clearTripDetails();
    }
  }, [open, trip, fetchTripDetails, clearTripDetails]);

  const handleCancelTrip = async () => {
    if (!trip) return;
    await updateStatus(trip.id, "cancelled");
  };

  return (
    <CommonModal open={open} onOpenChange={onOpenChange} maxWidth="sm:max-w-[980px]" loading={tripDetailsLoading}>
      {trip && (
        <TripDetailsView
          variant="modal"
          tripId={trip.id}
          listTrip={trip}
          tripDetails={tripDetails}
          tripDetailsLoading={tripDetailsLoading}
          updating={updating}
          onCancelTrip={handleCancelTrip}
          onClose={() => onOpenChange(false)}
          onOpenFullPage={() => {
            onOpenChange(false);
            navigate(`/trips/view/${trip.id}`);
          }}
        />
      )}
    </CommonModal>
  );
};

export default TripDetailsModal;
