import { ProofMethodElemTypeEnum } from '@rimgosu/libs';

interface ProofMethodSelectorProps {
  value: ProofMethodElemTypeEnum;
  onChange: (type: ProofMethodElemTypeEnum) => void;
}

export const ProofMethodSelector = ({
  value,
  onChange,
}: ProofMethodSelectorProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">인증 방법</label>
      <div className="flex gap-2">
        {Object.entries(ProofMethodElemTypeEnum).map(([key, type]) => (
          <button
            key={type}
            className={`px-4 py-2 rounded-lg border ${
              value === type
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-300'
            }`}
            onClick={() => onChange(type)}
          >
            {key === ProofMethodElemTypeEnum.UPLOAD_PHOTO && '사진 업로드'}
            {key === ProofMethodElemTypeEnum.CLICK_BUTTON && '버튼 클릭'}
            {key === ProofMethodElemTypeEnum.CHECK_LOCATION && '위치 확인'}
          </button>
        ))}
      </div>
    </div>
  );
};
