import React from 'react';
import { BaseModal } from '../../common/BaseModal';
import { usePasswordChanged } from '../stores/usePasswordChanged';

export const PasswordChangeSuccessModal: React.FC = () => {
  const { setPasswordChanged } = usePasswordChanged();

  const handleClose = () => {
    setPasswordChanged(false);
  };

  return (
    <BaseModal isOpen={true} onClose={handleClose}>
      <div className="mb-8 text-center">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-gray-300 bg-green-100">
          <svg
            className="h-12 w-12 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-bold">비밀번호 변경 완료</h3>
        <p className="text-md mb-4 text-gray-500">
          비밀번호가 성공적으로 변경되었습니다.
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <button
          onClick={handleClose}
          className="flex-1 rounded bg-green-400 px-4 py-3 text-white hover:bg-green-500"
        >
          확인
        </button>
      </div>
    </BaseModal>
  );
};
