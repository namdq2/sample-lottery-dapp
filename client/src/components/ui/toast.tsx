import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertTriangle, X, Info } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export type ToastType = "success" | "error" | "warning" | "info";
export type ToastPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left";

export interface ToastProps {
  id: string;
  message: string;
  description?: string;
  type: ToastType;
  duration?: number;
  onClose: (id: string) => void;
}

export interface ToastContainerProps {
  position?: ToastPosition;
}

const Toast = ({
  id,
  message,
  description,
  type,
  duration = 5000,
  onClose,
}: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-[#10B981]" />,
    error: <XCircle className="h-5 w-5 text-[#F43F5E]" />,
    warning: <AlertTriangle className="h-5 w-5 text-[#FBBF24]" />,
    info: <Info className="h-5 w-5 text-[#6366F1]" />,
  };

  const bgColors = {
    success: "bg-[#132c21] border-[#10B981]/30",
    error: "bg-[#311b22] border-[#F43F5E]/30",
    warning: "bg-[#2e2410] border-[#FBBF24]/30",
    info: "bg-[#1e1f3e] border-[#6366F1]/30",
  };

  const titleColors = {
    success: "text-[#10B981]",
    error: "text-[#F43F5E]",
    warning: "text-[#FBBF24]",
    info: "text-[#6366F1]",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`${bgColors[type]} rounded-lg shadow-lg p-4 mb-3 max-w-sm w-full border flex items-start`}
    >
      <div className="mr-3 mt-0.5">{icons[type]}</div>

      <div className="flex-1 mr-2">
        <h4 className={`font-medium ${titleColors[type]}`}>{message}</h4>
        {description && (
          <p className="text-sm text-gray-300 mt-1">{description}</p>
        )}
      </div>

      <button
        onClick={() => onClose(id)}
        className="text-gray-400 hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
};

export const ToastContainer = ({
  position = "bottom-right",
}: ToastContainerProps) => {
  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      <AnimatePresence />
    </div>
  );
};

export default Toast;
