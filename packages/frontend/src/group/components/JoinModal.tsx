import React from 'react';
import { BaseModal } from '../../common/BaseModal';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export const JoinModal: React.FC<JoinModalProps> = ({
  isOpen,
  onClose,
  title,
}) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
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
        <h3 className="mb-2 text-xl font-bold">그룹 참여 완료</h3>
        <p className="text-md mb-4 text-gray-500">{title}에 참여하였습니다.</p>
      </div>
      <div className="flex flex-col gap-1">
        <button
          onClick={onClose}
          className="flex-1 rounded bg-green-400 px-4 py-3 text-white hover:bg-green-500"
        >
          확인하러 가기
        </button>
      </div>
    </BaseModal>
  );
};
