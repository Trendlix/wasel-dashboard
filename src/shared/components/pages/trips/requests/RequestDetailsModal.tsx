import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CommonModal } from "@/shared/components/common/CommonModal";
import useTruckRequestsStore, { type IAppTruckRequest } from "@/shared/hooks/store/useTruckRequestsStore";
import RequestDetailsView from "./RequestDetailsView";

interface RequestDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: IAppTruckRequest | null;
}

const RequestDetailsModal = ({ open, onOpenChange, request }: RequestDetailsModalProps) => {
  const navigate = useNavigate();
  const { requestDetails, requestDetailsLoading, fetchRequestDetails, clearRequestDetails } =
    useTruckRequestsStore();

  useEffect(() => {
    if (open && request) {
      void fetchRequestDetails(request.id);
    } else if (!open) {
      clearRequestDetails();
    }
  }, [open, request, fetchRequestDetails, clearRequestDetails]);

  return (
    <CommonModal open={open} onOpenChange={onOpenChange} maxWidth="sm:max-w-[980px]" loading={requestDetailsLoading}>
      {request && (
        <RequestDetailsView
          variant="modal"
          requestId={request.id}
          listRequest={request}
          requestDetails={requestDetails}
          requestDetailsLoading={requestDetailsLoading}
          onClose={() => onOpenChange(false)}
          onOpenFullPage={() => {
            onOpenChange(false);
            navigate(`/trips/requests/view/${request.id}`);
          }}
        />
      )}
    </CommonModal>
  );
};

export default RequestDetailsModal;
