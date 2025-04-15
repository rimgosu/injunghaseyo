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
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-8 bg-green-100 rounded-full flex items-center justify-center border border-gray-300">
          <svg
            className="w-12 h-12 text-green-500 "
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
        <h3 className="text-xl font-bold mb-2">그룹 참여 완료</h3>
        <p className="text-gray-500 text-md mb-4">{title}에 참여하였습니다.</p>
      </div>
      <div className="flex gap-1 flex-col">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-3 bg-green-400 text-white rounded hover:bg-green-500"
        >
          확인하러 가기
        </button>
      </div>
    </BaseModal>
  );
};
