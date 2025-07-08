import React from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-5xl relative flex flex-col"
        style={{ height: '90vh', maxHeight: '800px' }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white z-20">
          <X size={24} />
        </button>
        {children}
      </div>
    </div>
  );
};
