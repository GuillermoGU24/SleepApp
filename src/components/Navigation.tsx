import { useNavigate, useLocation } from "react-router-dom";
import { Moon, Sun, Home, Activity, BarChart3, LogOut } from "lucide-react";

import { useTheme } from "../hook/useTheme";
import { useAuth } from "../hook/useAuth";


const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";
  const textClass = isDark ? "text-gray-100" : "text-gray-900";
  const cardBg = isDark ? "bg-gray-800" : "bg-white";

  return (
    <nav className={`${cardBg} shadow-lg`}>
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center h-16">
        <div className="flex items-center gap-2">
          <Moon className="w-6 h-6 text-purple-500" />
          <span className={`font-bold ${textClass}`}>Dream Tracker</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate("/dashboard")}
            className={`p-2 rounded-lg ${
              location.pathname === "/dashboard"
                ? "bg-purple-500 text-white"
                : textClass
            }`}
          >
            <Home className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate("/ritual")}
            className={`p-2 rounded-lg ${
              location.pathname === "/ritual"
                ? "bg-purple-500 text-white"
                : textClass
            }`}
          >
            <Activity className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate("/registro")}
            className={`p-2 rounded-lg ${
              location.pathname === "/registro"
                ? "bg-purple-500 text-white"
                : textClass
            }`}
          >
            <BarChart3 className="w-5 h-5" />
          </button>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg ${textClass}`}
          >
            {isDark ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={logout}
            className={`p-2 rounded-lg ${textClass} hover:text-red-500`}
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};
export default Navigation;
