// src/hook/useAlert.ts
import { useState, useCallback } from "react";

interface AlertState {
    type: "error" | "success";
    message: string;
}

export const useAlert = () => {
    const [alert, setAlert] = useState<AlertState | null>(null);

    const showAlert = useCallback((type: "error" | "success", message: string) => {
        setAlert({ type, message });
    }, []);

    const showError = useCallback((message: string) => {
        setAlert({ type: "error", message });
    }, []);

    const showSuccess = useCallback((message: string) => {
        setAlert({ type: "success", message });
    }, []);

    const clearAlert = useCallback(() => {
        setAlert(null);
    }, []);

    return {
        alert,
        showAlert,
        showError,
        showSuccess,
        clearAlert,
    };
};