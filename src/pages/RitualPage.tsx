import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";
import { useTheme } from "../hook/useTheme";

const breathingTechniques = {
  box: {
    name: "Respiración Cuadrada (Box)",
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
  },
  "4-7-8": {
    name: "Técnica 4-7-8 (Relajación)",
    inhale: 4,
    hold1: 7,
    exhale: 8,
    hold2: 0,
  },
  calm: { name: "Calma Rápida", inhale: 4, hold1: 2, exhale: 6, hold2: 0 },
  energy: { name: "Energizante", inhale: 3, hold1: 0, exhale: 3, hold2: 0 },
  deep: {
    name: "Respiración Profunda",
    inhale: 5,
    hold1: 5,
    exhale: 5,
    hold2: 5,
  },
};

const RitualPage = () => {
  const [ritualTimer, setRitualTimer] = useState(0);
  const [isRitualActive, setIsRitualActive] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [phaseTimer, setPhaseTimer] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0); // 0: inhale, 1: hold1, 2: exhale, 3: hold2
  const [selectedTechnique, setSelectedTechnique] =
    useState<keyof typeof breathingTechniques>("4-7-8");
  const [showSettings, setShowSettings] = useState(false);

    const { theme } = useTheme();
  
  const isDark = theme === "dark";
  const textClass = isDark ? "text-gray-100" : "text-gray-900";
  
  const technique = breathingTechniques[selectedTechnique];
  const phases = [
    {
      duration: technique.inhale,
      name: "Inhala",
      text: "Inhala profundamente por la nariz...",
    },
    { duration: technique.hold1, name: "Sostén", text: "Sostén el aire..." },
    {
      duration: technique.exhale,
      name: "Exhala",
      text: "Exhala lentamente por la boca...",
    },
    { duration: technique.hold2, name: "Sostén", text: "Sostén sin aire..." },
  ].filter((phase) => phase.duration > 0);

  const totalCycleTime = phases.reduce((sum, phase) => sum + phase.duration, 0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRitualActive) {
      interval = setInterval(() => {
        setRitualTimer((prev) => prev + 1);
        setPhaseTimer((prev) => {
          const nextTimer = prev + 1;
          if (nextTimer >= phases[currentPhase].duration) {
            // Pasar a la siguiente fase
            const nextPhase = (currentPhase + 1) % phases.length;
            setCurrentPhase(nextPhase);

            // Si completamos un ciclo
            if (nextPhase === 0) {
              setCycleCount((prev) => prev + 1);
            }

            return 0;
          }
          return nextTimer;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRitualActive, currentPhase, phases]);

  const handleStop = () => {
    setRitualTimer(0);
    setPhaseTimer(0);
    setCurrentPhase(0);
    setCycleCount(0);
    setIsRitualActive(false);
  };

  const handlePlayPause = () => {
    setIsRitualActive(!isRitualActive);
    if (!isRitualActive && ritualTimer === 0) {
      setCurrentPhase(0);
      setPhaseTimer(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const phase = phases[currentPhase];
  const progress = (phaseTimer / phase.duration) * 100;

  // Estilos según la fase
  const getCircleStyle = () => {
    const phaseName = phase.name;
    if (phaseName === "Inhala") {
      return "scale-150 bg-gradient-to-br from-blue-400 to-cyan-400 shadow-blue-400/50";
    } else if (phaseName === "Sostén") {
      return "scale-150 bg-gradient-to-br from-purple-400 to-pink-400 shadow-purple-400/50";
    } else {
      return "scale-100 bg-gradient-to-br from-indigo-400 to-purple-500 shadow-indigo-400/50";
    }
  };

  return (
    <div className="min-h-screen  from-slate-50 to-blue-50 p-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className={`text-3xl font-bold ${textClass} mb-2`}>
            Ritual de Respiración
          </h2>
          <p className="text-gray-600">{technique.name}</p>
        </div>

        {/* Main Circle */}
        <div className="flex flex-col items-center justify-center mb-12">
          <div className="relative">
            {/* Progress Ring */}
            <svg className="w-72 h-72 -rotate-90">
              <circle
                cx="144"
                cy="144"
                r="130"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              <circle
                cx="144"
                cy="144"
                r="130"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 130}`}
                strokeDashoffset={`${2 * Math.PI * 130 * (1 - progress / 100)}`}
                className="transition-all duration-1000 ease-linear"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient
                  id="gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>

            {/* Animated Circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={`rounded-full w-52 h-52 flex flex-col items-center justify-center shadow-2xl transition-all duration-[3000ms] ease-in-out ${getCircleStyle()}`}
              >
                <span className="text-5xl font-bold text-white drop-shadow-lg mb-2">
                  {phase.duration - phaseTimer}
                </span>
                <span className="text-sm text-white/90 font-medium">
                  {phase.name}
                </span>
              </div>
            </div>
          </div>

          {/* Instruction Text */}
          {isRitualActive && (
            <p className="mt-8 text-xl font-medium text-gray-700 transition-opacity duration-1000 ease-in-out animate-pulse">
              {phase.text}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur rounded-2xl p-4 text-center shadow-lg">
            <p className="text-3xl font-bold text-purple-600">{cycleCount}</p>
            <p className="text-sm text-gray-600 mt-1">Ciclos</p>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-2xl p-4 text-center shadow-lg">
            <p className="text-3xl font-bold text-pink-600">
              {formatTime(ritualTimer)}
            </p>
            <p className="text-sm text-gray-600 mt-1">Tiempo Total</p>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-2xl p-4 text-center shadow-lg">
            <p className="text-3xl font-bold text-indigo-600">
              {totalCycleTime}s
            </p>
            <p className="text-sm text-gray-600 mt-1">Por Ciclo</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={handlePlayPause}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-5 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-purple-400/40 hover:scale-110"
          >
            {isRitualActive ? (
              <Pause className="w-7 h-7" />
            ) : (
              <Play className="w-7 h-7" />
            )}
          </button>

          <button
            onClick={handleStop}
            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-5 rounded-full hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg hover:shadow-pink-400/40 hover:scale-110"
          >
            <RotateCcw className="w-7 h-7" />
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-5 rounded-full hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-indigo-400/40 hover:scale-110"
          >
            <Settings className="w-7 h-7" />
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Elige tu técnica de respiración
            </h3>
            <div className="space-y-2">
              {(
                Object.keys(breathingTechniques) as Array<
                  keyof typeof breathingTechniques
                >
              ).map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    if (!isRitualActive) {
                      setSelectedTechnique(key);
                      setShowSettings(false);
                    }
                  }}
                  disabled={isRitualActive}
                  className={`w-full text-left p-4 rounded-xl transition-all ${
                    selectedTechnique === key
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } ${isRitualActive ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="font-semibold">
                    {breathingTechniques[key].name}
                  </div>
                  <div
                    className={`text-sm ${
                      selectedTechnique === key
                        ? "text-white/90"
                        : "text-gray-500"
                    }`}
                  >
                    Inhalar: {breathingTechniques[key].inhale}s
                    {breathingTechniques[key].hold1 > 0 &&
                      ` • Sostener: ${breathingTechniques[key].hold1}s`}
                    {" • "}Exhalar: {breathingTechniques[key].exhale}s
                    {breathingTechniques[key].hold2 > 0 &&
                      ` • Sostener: ${breathingTechniques[key].hold2}s`}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        {!isRitualActive && (
          <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl">
            <p className="text-sm text-blue-800">
              <strong>💡 Consejo:</strong> Encuentra un lugar tranquilo,
              siéntate cómodamente. La técnica 4-7-8 es ideal para reducir
              ansiedad y dormir mejor.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RitualPage;
