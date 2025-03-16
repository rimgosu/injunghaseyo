import { ProofMethodElem } from '@rimgosu/libs';
import { ProofMethodTypeView } from '../utils/types';
import { formatMinutesToTime } from '../utils/utils';

interface ProofMethodCardProps {
  proofMethod: ProofMethodElem;
  onDelete: (proofMethod: ProofMethodElem) => void;
}

export const ProofMethodCard = ({
  proofMethod,
  onDelete,
}: ProofMethodCardProps) => {
  return (
    <div className="border rounded-lg p-4 shadow-sm mb-3">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg">{proofMethod.contents}</h3>
          <button
            onClick={() => onDelete(proofMethod)}
            className="text-red-500 hover:text-red-700 px-2 py-1 rounded-md text-sm"
          >
            삭제하기
          </button>
        </div>
        <div className="text-gray-600 text-sm">
          <div className="flex justify-between items-center py-1">
            <span>인증 유형:</span>
            <span className="font-medium">
              {ProofMethodTypeView[proofMethod.type]}
            </span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span>인증 가능 시간:</span>
            <span className="font-medium">
              {formatMinutesToTime(proofMethod.fromMin)} -{' '}
              {formatMinutesToTime(proofMethod.toMin)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
