// src/components/Alert.tsx
import { useEffect } from "react";
import { AlertCircle, CheckCircle, X } from "lucide-react";

interface AlertProps {
  type: "error" | "success";
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

export const Alert = ({
  type,
  message,
  onClose,
  autoClose = true,
  duration = 3000,
}: AlertProps) => {
  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const styles = {
    error: "bg-red-600 text-white",
    success: "bg-green-600 text-white",
  };

  const Icon = type === "error" ? AlertCircle : CheckCircle;

  return (
    <div
      className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all duration-300 animate-fade flex items-center gap-3 max-w-md ${styles[type]}`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="flex-1">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="hover:bg-white/20 rounded-lg p-1 transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
