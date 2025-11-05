import { useState, useEffect, useCallback, type ReactNode } from "react";
import { useAuth } from "../hook/useAuth";
import { bitacoraService } from "../services/bitacoraService";
import type { SleepRecord, SleepRecordInput } from "../interface";
import { BitacoraContext } from "../context/BitacoraContext";

interface BitacoraProviderProps {
  children: ReactNode;
}

export const BitacoraProvider = ({ children }: BitacoraProviderProps) => {
  const { currentUser } = useAuth();
  const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshRecords = useCallback(async () => {
    if (!currentUser) {
      setSleepRecords([]);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const records = await bitacoraService.fetchRecords(currentUser.uid);
      setSleepRecords(records);
      // Si cargó correctamente (aunque esté vacío), limpiamos el error
      setError(null);
    } catch (err) {
      console.error("Error al cargar registros:", err);
      // Solo setear error si realmente falló la petición
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(`Error de conexión: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    refreshRecords();
  }, [refreshRecords]);

  const addSleepRecord = async (record: SleepRecordInput) => {
    if (!currentUser) {
      setError("Usuario no autenticado");
      return;
    }

    try {
      setError(null);
      const newRecord = await bitacoraService.addRecord(
        currentUser.uid,
        record
      );
      setSleepRecords((prev) => [newRecord, ...prev]);
    } catch (err) {
      console.error("Error al guardar registro:", err);
      setError("No se pudo guardar el registro");
      throw err;
    }
  };

  const updateSleepRecord = async (
    id: string,
    updates: Partial<SleepRecordInput>
  ) => {
    try {
      setError(null);
      await bitacoraService.updateRecord(id, updates);
      setSleepRecords((prev) =>
        prev.map((record) =>
          record.id === id ? { ...record, ...updates } : record
        )
      );
    } catch (err) {
      console.error("Error al actualizar registro:", err);
      setError("No se pudo actualizar el registro");
      throw err;
    }
  };

  const deleteSleepRecord = async (id: string) => {
    try {
      setError(null);
      await bitacoraService.deleteRecord(id);
      setSleepRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Error al eliminar registro:", err);
      setError("No se pudo eliminar el registro");
      throw err;
    }
  };

  return (
    <BitacoraContext.Provider
      value={{
        sleepRecords,
        loading,
        error,
        addSleepRecord,
        updateSleepRecord,
        deleteSleepRecord,
        refreshRecords,
      }}
    >
      {children}
    </BitacoraContext.Provider>
  );
};
