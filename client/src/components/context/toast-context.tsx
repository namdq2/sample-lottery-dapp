"use client";

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Toast, { ToastProps, ToastType, ToastPosition } from '../ui/toast';
import { AnimatePresence } from 'framer-motion';

interface ToastContextProps {
  showToast: (message: string, type: ToastType, description?: string, duration?: number) => void;
  position: ToastPosition;
  setPosition: (position: ToastPosition) => void;
}

const ToastContext = createContext<ToastContextProps>({
  showToast: () => {},
  position: 'bottom-right',
  setPosition: () => {}
});

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  const [position, setPosition] = useState<ToastPosition>('bottom-right');

  // Use useCallback to memoize the showToast function
  const showToast = useCallback((
    message: string, 
    type: ToastType, 
    description?: string, 
    duration: number = 5000
  ) => {
    const id = uuidv4();
    const newToast: ToastProps = {
      id,
      message,
      type,
      description,
      duration,
      onClose: (id) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
      }
    };
    
    setToasts(prevToasts => [...prevToasts, newToast]);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, position, setPosition }}>
      {children}
      <div className={`fixed ${position === 'top-right' ? 'top-4 right-4' : position === 'top-left' ? 'top-4 left-4' : position === 'bottom-left' ? 'bottom-4 left-4' : 'bottom-4 right-4'} z-50`}>
        <AnimatePresence>
          {toasts.map(toast => (
            <Toast key={toast.id} {...toast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);