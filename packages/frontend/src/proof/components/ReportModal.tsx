import { useParams } from 'react-router-dom';
import { BaseModal } from '../../common/BaseModal';
import { ReportReasonType } from '../utils/types';
import React from 'react';
import { useProofHook } from '../hooks/useProofHook';
import { ReasonEnum } from '@rimgosu/libs';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { proofId } = useParams();
  const { reportProof } = useProofHook();
  const [selectedReason, setSelectedReason] = React.useState<ReasonEnum | null>(
    null,
  );
  const [isReported, setIsReported] = React.useState(false);

  const handleReport = () => {
    if (!selectedReason) return;
    reportProof({
      reason: selectedReason,
      proofId: Number(proofId),
    });
    setIsReported(true);
  };

  const handleConfirm = () => {
    setIsReported(false);
    setSelectedReason(null);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-lg"
      existXButton={isReported ? false : true}
    >
      <div className="flex flex-col gap-12">
        {isReported && (
          <div className="flex flex-col items-center gap-6 py-12">
            <div className="text-lg">신고해주셔서 감사합니다.</div>
            <div
              className="cursor-pointer text-lg text-blue-500"
              onClick={handleConfirm}
            >
              확인
            </div>
          </div>
        )}
        {!isReported && (
          <main className="mt-4 flex flex-col gap-12">
            <form className="mt-4 flex flex-col gap-3">
              {Object.values(ReasonEnum).map((reason) => (
                <label
                  key={reason}
                  className="flex cursor-pointer items-center gap-4 text-lg text-gray-700"
                >
                  <input
                    type="radio"
                    name="reportReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason as ReasonEnum)}
                    className="h-4 w-4"
                  />
                  {ReportReasonType[reason as ReasonEnum]}
                </label>
              ))}
            </form>
            <div
              className="flex cursor-pointer justify-end text-blue-500"
              onClick={handleReport}
            >
              신고하기
            </div>
          </main>
        )}
      </div>
    </BaseModal>
  );
};
