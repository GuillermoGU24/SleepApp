import { useState, useEffect } from "react";
import { Clock, Activity, Lightbulb } from "lucide-react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import type { SleepRecord, Tip } from "../interface";
import { useAuth } from "../hook/useAuth";
import { useTheme } from "../hook/useTheme";


const DashboardPage = () => {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const isDark = theme === "dark";
  const cardBg = isDark ? "bg-gray-800" : "bg-white";
  const textClass = isDark ? "text-gray-100" : "text-gray-900";
  const textMuted = isDark ? "text-gray-400" : "text-gray-600";

  const tips: Tip[] = [
    {
      id: "1",
      title: "Mantén un horario constante",
      description: "Acuéstate y levántate a la misma hora todos los días.",
      category: "routine",
    },
    {
      id: "2",
      title: "Evita pantallas antes de dormir",
      description: "Desconéctate del teléfono al menos 1 hora antes de dormir.",
      category: "environment",
    },
    {
      id: "3",
      title: "Temperatura ideal",
      description:
        "Mantén tu habitación entre 16°C y 20°C para un mejor descanso.",
      category: "environment",
    },
    {
      id: "4",
      title: "Ejercicio regular",
      description:
        "Haz actividad física diaria, pero no justo antes de dormir.",
      category: "routine",
    },
  ];

  useEffect(() => {
    const fetchRecords = async () => {
      if (!currentUser) return;

      try {
        const q = query(
          collection(db, "sleepRecords"),
          where("userId", "==", currentUser.uid)
        );
        const snapshot = await getDocs(q);
        const records = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as SleepRecord[];

        setSleepRecords(
          records.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );
      } catch (error) {
        console.error("Error al obtener registros:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [currentUser]);

  const avgHours =
    sleepRecords.length > 0
      ? sleepRecords.reduce((sum, r) => sum + r.hoursSlept, 0) /
        sleepRecords.length
      : 0;

  const avgQuality =
    sleepRecords.length > 0
      ? sleepRecords.reduce((sum, r) => sum + r.quality, 0) /
        sleepRecords.length
      : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
      <div className="mb-8">
        <h2 className={`text-3xl font-bold ${textClass} mb-2`}>
          ¡Hola, {currentUser?.displayName}! 👋
        </h2>
        <p className={textMuted}>Así va tu descanso</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className={`${cardBg} rounded-2xl shadow-xl p-6`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-xl">
              <Clock className="w-6 h-6 text-purple-600 dark:text-purple-300" />
            </div>
            <div>
              <p className={`text-sm ${textMuted}`}>Promedio de sueño</p>
              <p className={`text-2xl font-bold ${textClass}`}>
                {avgHours > 0 ? `${avgHours.toFixed(1)}h` : "Sin datos"}
              </p>
            </div>
          </div>
        </div>

        <div className={`${cardBg} rounded-2xl shadow-xl p-6`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-pink-100 dark:bg-pink-900 p-3 rounded-xl">
              <Activity className="w-6 h-6 text-pink-600 dark:text-pink-300" />
            </div>
            <div>
              <p className={`text-sm ${textMuted}`}>Calidad promedio</p>
              <p className={`text-2xl font-bold ${textClass}`}>
                {avgQuality > 0 ? `${avgQuality.toFixed(1)}/5` : "Sin datos"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={`${cardBg} rounded-2xl shadow-xl p-6`}>
        <div className="flex items-center gap-3 mb-6">
          <Lightbulb className="w-6 h-6 text-yellow-500" />
          <h3 className={`text-2xl font-bold ${textClass}`}>
            Consejos para dormir mejor
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tips.map((tip) => (
            <div
              key={tip.id}
              className={`${
                isDark ? "bg-gray-700" : "bg-purple-50"
              } rounded-xl p-4 hover:scale-105 transition-transform`}
            >
              <h4 className={`font-semibold ${textClass} mb-2`}>{tip.title}</h4>
              <p className={`text-sm ${textMuted}`}>{tip.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
