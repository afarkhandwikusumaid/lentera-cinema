'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type ModalContextType = {
  showAlert: (message: string) => Promise<void>;
  showConfirm: (message: string) => Promise<boolean>;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'alert' | 'confirm';
    message: string;
    resolve?: (value: boolean) => void;
  }>({
    isOpen: false,
    type: 'alert',
    message: '',
  });

  const showAlert = (message: string): Promise<void> => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        type: 'alert',
        message,
        resolve: () => resolve(),
      });
    });
  };

  const showConfirm = (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        type: 'confirm',
        message,
        resolve,
      });
    });
  };

  const handleClose = (result: boolean) => {
    if (modalState.resolve) {
      modalState.resolve(result);
    }
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <ModalContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      {modalState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-bg-surface rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <h3 className="text-lg font-bold text-text-primary mb-2">Konfirmasi</h3>
              <p className="text-text-secondary text-sm">{modalState.message}</p>
            </div>
            <div className="px-6 py-4 bg-bg-elevated flex justify-end gap-3 border-t border-border/50">
              {modalState.type === 'confirm' && (
                <button
                  onClick={() => handleClose(false)}
                  className="px-4 py-2 text-sm font-bold text-text-secondary bg-bg-surface border border-border rounded-lg hover:bg-bg-elevated transition-colors"
                >
                  Batal
                </button>
              )}
              <button
                onClick={() => handleClose(true)}
                className="px-4 py-2 text-sm font-bold text-white bg-black rounded-lg hover:bg-gray-800 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};
