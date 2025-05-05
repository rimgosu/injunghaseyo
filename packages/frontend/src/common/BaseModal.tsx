import { XMarkIcon } from '@heroicons/react/24/outline';
import React from 'react';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
  existXButton?: boolean;
}

export const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  children,
  maxWidth = 'max-w-sm',
  existXButton = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div
        className={`bg-white p-6 rounded-lg shadow-lg z-10 ${maxWidth} w-full mx-4`}
      >
        {existXButton && (
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
