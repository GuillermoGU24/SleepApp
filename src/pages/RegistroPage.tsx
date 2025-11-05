// src/pages/RegistroPage.tsx
import { useState } from "react";
import { Moon, Check, Trash2, AlertCircle } from "lucide-react";
import { useTheme } from "../hook/useTheme";
import { useBitacora } from "../hook/useBitacora";
import type { SleepRecordInput } from "../interface";

type FormStep =
  | "rememberBedTime"
  | "bedTime"
  | "wakeTime"
  | "quality"
  | "notes"
  | "complete";

const RegistroPage = () => {
  const { theme } = useTheme();
  const { sleepRecords, loading, error, addSleepRecord, deleteSleepRecord } =
    useBitacora();

  const [currentStep, setCurrentStep] = useState<FormStep>("rememberBedTime");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    remembersBedTime: null as boolean | null,
    bedTime: "22:00",
    wakeTime: "07:00",
    quality: 3 as 1 | 2 | 3 | 4 | 5,
    notes: "",
  });

  const isDark = theme === "dark";
  const cardBg = isDark ? "bg-gray-800" : "bg-white";
  const textClass = isDark ? "text-gray-100" : "text-gray-900";
  const textMuted = isDark ? "text-gray-400" : "text-gray-600";

  // Verificar si ya existe un registro para hoy
  const getTodayRecord = () => {
    const today = new Date().toISOString().split("T")[0];
    return sleepRecords.find((record) => record.date === today);
  };

  const todayRecord = getTodayRecord();
  const hasRecordToday = !!todayRecord;

  const calculateHoursSlept = (bedTime: string, wakeTime: string): number => {
    const [bedHour, bedMin] = bedTime.split(":").map(Number);
    const [wakeHour, wakeMin] = wakeTime.split(":").map(Number);

    let bedMinutes = bedHour * 60 + bedMin;
    let wakeMinutes = wakeHour * 60 + wakeMin;
    if (wakeMinutes < bedMinutes) wakeMinutes += 24 * 60;

    return (wakeMinutes - bedMinutes) / 60;
  };

  const handleSaveSleep = async () => {
    setSaving(true);
    setSaveError(null);

    try {
      const hoursSlept = formData.remembersBedTime
        ? calculateHoursSlept(formData.bedTime, formData.wakeTime)
        : 0;

      const newRecord: SleepRecordInput = {
        date: new Date().toISOString().split("T")[0],
        bedTime: formData.remembersBedTime ? formData.bedTime : "",
        wakeTime: formData.wakeTime,
        hoursSlept: parseFloat(hoursSlept.toFixed(1)),
        quality: formData.quality,
        notes: formData.notes,
      };

      await addSleepRecord(newRecord);

      setFormData({
        remembersBedTime: null,
        bedTime: "22:00",
        wakeTime: "07:00",
        quality: 3,
        notes: "",
      });
    } catch (error) {
      console.error("Error al guardar:", error);
      setSaveError("No se pudo guardar el registro. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar este registro?")) {
      try {
        await deleteSleepRecord(id);
        // Si eliminamos el registro de hoy, volver al primer paso
        if (todayRecord?.id === id) {
          setCurrentStep("rememberBedTime");
        }
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  const handleNext = () => {
    if (currentStep === "rememberBedTime") {
      if (formData.remembersBedTime) {
        setCurrentStep("bedTime");
      } else {
        setCurrentStep("wakeTime");
      }
    } else if (currentStep === "bedTime") {
      setCurrentStep("wakeTime");
    } else if (currentStep === "wakeTime") {
      setCurrentStep("quality");
    } else if (currentStep === "quality") {
      setCurrentStep("notes");
    } else if (currentStep === "notes") {
      setCurrentStep("complete");
      handleSaveSleep();
    }
  };

  const renderStep = () => {
    // Si ya hay registro de hoy, mostrar mensaje
    if (hasRecordToday) {
      return (
        <div className="space-y-6 text-center">
          <div className="flex justify-center">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center ${
                isDark ? "bg-purple-900/30" : "bg-purple-100"
              }`}
            >
              <Check className="w-10 h-10 text-purple-500" />
            </div>
          </div>
          <div>
            <h3 className={`text-2xl font-bold ${textClass} mb-2`}>
              ¡Ya registraste tu sueño hoy!
            </h3>
            <p className={`${textMuted} mb-4`}>
              Vuelve mañana para registrar cómo dormiste esta noche
            </p>
          </div>

          {/* Mostrar resumen del registro de hoy */}
          <div
            className={`${
              isDark ? "bg-gray-700" : "bg-purple-50"
            } rounded-xl p-6 text-left`}
          >
            <p className={`text-sm ${textMuted} mb-3`}>Tu registro de hoy:</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className={`${textClass} font-medium`}>
                  Hora de dormir:
                </span>
                <span className={textClass}>
                  {todayRecord.bedTime || "No registrada"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`${textClass} font-medium`}>
                  Hora de despertar:
                </span>
                <span className={textClass}>{todayRecord.wakeTime}</span>
              </div>
              {todayRecord.hoursSlept > 0 && (
                <div className="flex justify-between items-center">
                  <span className={`${textClass} font-medium`}>
                    Horas dormidas:
                  </span>
                  <span className={textClass}>{todayRecord.hoursSlept}h</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className={`${textClass} font-medium`}>Calidad:</span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Moon
                      key={i}
                      className={`w-4 h-4 ${
                        i < todayRecord.quality
                          ? "text-purple-500 fill-purple-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              {todayRecord.notes && (
                <div className="pt-2 border-t border-gray-300 dark:border-gray-600">
                  <p className={`text-sm ${textMuted} italic`}>
                    "{todayRecord.notes}"
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => handleDeleteRecord(todayRecord.id)}
            className={`w-full py-3 rounded-xl font-semibold transition-all ${
              isDark
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-gray-200 text-gray-900 hover:bg-gray-300"
            }`}
          >
            Eliminar y registrar de nuevo
          </button>
        </div>
      );
    }

    switch (currentStep) {
      case "rememberBedTime":
        return (
          <div className="space-y-6">
            <h3 className={`text-xl font-semibold ${textClass} text-center`}>
              ¿Recuerdas a qué hora te fuiste a la cama?
            </h3>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setFormData((prev) => ({ ...prev, remembersBedTime: true }));
                  setCurrentStep("bedTime");
                }}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Sí
              </button>
              <button
                onClick={() => {
                  setFormData((prev) => ({ ...prev, remembersBedTime: false }));
                  setCurrentStep("wakeTime");
                }}
                className={`px-8 py-4 rounded-xl font-semibold transition-all ${
                  isDark
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                }`}
              >
                No
              </button>
            </div>
          </div>
        );

      case "bedTime":
        return (
          <div className="space-y-6">
            <h3 className={`text-xl font-semibold ${textClass} text-center`}>
              ¿A qué hora te fuiste a la cama?
            </h3>
            <input
              type="time"
              value={formData.bedTime}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, bedTime: e.target.value }))
              }
              className={`w-full px-4 py-4 rounded-xl text-center text-2xl ${
                isDark ? "bg-gray-700 text-white" : "bg-purple-50 text-gray-900"
              }`}
            />
            <button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Continuar
            </button>
          </div>
        );

      case "wakeTime":
        return (
          <div className="space-y-6">
            <h3 className={`text-xl font-semibold ${textClass} text-center`}>
              ¿A qué hora despertaste?
            </h3>
            <input
              type="time"
              value={formData.wakeTime}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, wakeTime: e.target.value }))
              }
              className={`w-full px-4 py-4 rounded-xl text-center text-2xl ${
                isDark ? "bg-gray-700 text-white" : "bg-purple-50 text-gray-900"
              }`}
            />
            <button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Continuar
            </button>
          </div>
        );

      case "quality":
        return (
          <div className="space-y-6">
            <h3 className={`text-xl font-semibold ${textClass} text-center`}>
              ¿Qué tan descansado te sientes?
            </h3>
            <div className="space-y-4">
              <div className="flex justify-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Moon
                    key={i}
                    className={`w-8 h-8 cursor-pointer transition-all ${
                      i < formData.quality
                        ? "text-purple-500 fill-purple-500"
                        : "text-gray-300"
                    }`}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        quality: (i + 1) as 1 | 2 | 3 | 4 | 5,
                      }))
                    }
                  />
                ))}
              </div>
              <p className={`text-center ${textMuted}`}>
                {formData.quality === 1 && "Muy cansado"}
                {formData.quality === 2 && "Cansado"}
                {formData.quality === 3 && "Normal"}
                {formData.quality === 4 && "Descansado"}
                {formData.quality === 5 && "Muy descansado"}
              </p>
            </div>
            <button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Continuar
            </button>
          </div>
        );

      case "notes":
        return (
          <div className="space-y-6">
            <h3 className={`text-xl font-semibold ${textClass} text-center`}>
              ¿Alguna nota sobre tu sueño?
            </h3>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              className={`w-full px-4 py-3 rounded-xl ${
                isDark ? "bg-gray-700 text-white" : "bg-purple-50 text-gray-900"
              } h-32 resize-none`}
              placeholder="Sueños, interrupciones, cómo te sentiste..."
            />
            {saveError && (
              <div className="flex items-center gap-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{saveError}</span>
              </div>
            )}
            <button
              onClick={handleNext}
              disabled={saving}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Guardar registro
                </>
              )}
            </button>
          </div>
        );

      case "complete":
        return (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className={`text-xl font-semibold ${textClass}`}>
              ¡Registro guardado!
            </h3>
            <button
              onClick={() => setCurrentStep("rememberBedTime")}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Nuevo registro
            </button>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 py-8">
      <h2 className={`text-3xl font-bold ${textClass} mb-8`}>
        Registrar Sueño
      </h2>

      <div className={`${cardBg} rounded-2xl shadow-xl p-6 mb-8`}>
        {renderStep()}
      </div>

      <h3 className={`text-2xl font-bold ${textClass} mb-4`}>Historial</h3>

      {/* Mostrar error solo en la sección de historial */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Error al cargar el historial</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {sleepRecords.length === 0 ? (
          <div className={`${cardBg} rounded-xl shadow-lg p-8 text-center`}>
            <Moon className={`w-16 h-16 mx-auto mb-4 ${textMuted}`} />
            <p className={`${textMuted} text-lg`}>
              No hay registros aún. ¡Comienza a registrar tu sueño!
            </p>
          </div>
        ) : (
          sleepRecords.map((record) => {
            const recordDate = new Date(record.date + "T00:00:00");

            return (
              <div
                key={record.id}
                className={`${cardBg} rounded-xl shadow-lg p-5 relative hover:shadow-xl transition-shadow`}
              >
                <button
                  onClick={() => handleDeleteRecord(record.id)}
                  className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                  title="Eliminar registro"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="pr-10">
                  {/* Fecha del registro */}
                  <div className="mb-3">
                    <p
                      className={`text-sm ${textMuted} uppercase tracking-wide`}
                    >
                      Registrado el{" "}
                      {recordDate.toLocaleDateString("es-ES", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <p className={`text-lg font-bold ${textClass} mt-1`}>
                      {record.bedTime ? (
                        <>Cómo dormiste anoche</>
                      ) : (
                        <>Cómo dormiste</>
                      )}
                    </p>
                  </div>

                  {/* Horarios y horas dormidas */}
                  <div
                    className={`${
                      isDark ? "bg-gray-700/50" : "bg-purple-50"
                    } rounded-lg p-4 mb-3`}
                  >
                    <div className="grid grid-cols-2 gap-4">
                      {record.bedTime && (
                        <div>
                          <p className={`text-xs ${textMuted} mb-1`}>
                            Te acostaste
                          </p>
                          <p className={`text-xl font-bold ${textClass}`}>
                            🌙 {record.bedTime}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className={`text-xs ${textMuted} mb-1`}>
                          Despertaste
                        </p>
                        <p className={`text-xl font-bold ${textClass}`}>
                          ☀️ {record.wakeTime}
                        </p>
                      </div>
                    </div>
                    {record.hoursSlept > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
                        <p className={`text-sm ${textMuted}`}>
                          Total:{" "}
                          <span className={`font-bold ${textClass}`}>
                            {record.hoursSlept} horas
                          </span>{" "}
                          de sueño
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Calidad del sueño */}
                  <div className="mb-3">
                    <p className={`text-xs ${textMuted} mb-2`}>
                      ¿Cómo te sentiste al despertar?
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Moon
                            key={i}
                            className={`w-5 h-5 ${
                              i < record.quality
                                ? "text-purple-500 fill-purple-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className={`text-sm font-medium ${textClass}`}>
                        {record.quality === 1 && "Muy cansado"}
                        {record.quality === 2 && "Cansado"}
                        {record.quality === 3 && "Normal"}
                        {record.quality === 4 && "Descansado"}
                        {record.quality === 5 && "Muy descansado"}
                      </span>
                    </div>
                  </div>

                  {/* Notas */}
                  {record.notes && (
                    <div
                      className={`${
                        isDark ? "bg-gray-700/30" : "bg-gray-50"
                      } rounded-lg p-3`}
                    >
                      <p className={`text-xs ${textMuted} mb-1`}>Notas:</p>
                      <p className={`text-sm ${textClass} italic`}>
                        "{record.notes}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RegistroPage;
