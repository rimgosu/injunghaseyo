import React from 'react';
import { BaseModal } from '../../common/BaseModal';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-8 bg-red-100 rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-2">정말 탈퇴하시겠어요?</h3>
        <p className="text-gray-500 text-md mb-4">
          탈퇴 버튼 선택 시, 계정은 삭제되며 복구되지 않습니다.
        </p>
      </div>
      <div className="flex gap-1 flex-col">
        <button
          onClick={onConfirm}
          className="flex-1 px-4 py-3 bg-red-500 text-white rounded hover:bg-red-600"
        >
          탈퇴
        </button>
        <button onClick={onClose} className="flex-1 px-4 py-3 text-gray-500">
          취소
        </button>
      </div>
    </BaseModal>
  );
};
