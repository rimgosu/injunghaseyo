import { ProofMethodElem } from '@rimgosu/libs';
import { ProofMethodTypeView } from '../utils/types';
import { formatMinutesToTime } from '../utils/utils';

interface ProofMethodCardProps {
  proofMethod: ProofMethodElem;
  onDelete?: (proofMethod: ProofMethodElem) => void;
}

export const ProofMethodCard = ({
  proofMethod,
  onDelete,
}: ProofMethodCardProps) => {
  return (
    <div className="mb-3 rounded-lg border px-4 py-6 shadow-sm">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{proofMethod.contents}</h3>
          {onDelete && (
            <button
              onClick={() => onDelete(proofMethod)}
              className="rounded-md px-2 py-1 text-sm text-red-500 hover:text-red-700"
            >
              삭제하기
            </button>
          )}
        </div>
        <div className="text-md text-gray-600">
          <div className="flex items-center justify-between py-1">
            <span>인증 유형:</span>
            <span className="font-medium">
              {ProofMethodTypeView[proofMethod.type]}
            </span>
          </div>
          <div className="flex items-center justify-between py-1">
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
