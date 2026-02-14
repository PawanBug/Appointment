"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type ToastType = {
  message: string;
  type?: "success" | "error" | "info";
};

type ToastContextType = {
  showToast: (data: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastType | null>(null);
  console.log(toast);

  const showToast = (data: ToastType) => {
    setToast(data);
  };
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  {
    /*toast style */
  }
  const getToastStyle = () => {
    switch (toast?.type) {
      case "success":
        return "bg-white text-green-600";
      case "error":
        return "bg-white text-red-700";
      case "info":
        return "bg-white text-blue-500";
      default:
        return "bg-white text-green";
    }
  };
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-6 right-0 z-50 w-full rounded-2xl  shadow-2xl max-w-80"
          >
            <div className={` w-full px-6 py-3 ${getToastStyle()}    `}>
              {toast.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
};
