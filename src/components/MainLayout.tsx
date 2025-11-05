import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import { useTheme } from "../hook/useTheme";


const MainLayout = () => {
  const { theme } = useTheme();
  const bgClass =
    theme === "dark"
      ? "bg-gray-900"
      : "bg-gradient-to-br from-purple-50 to-pink-50";

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-300`}>
      <Navigation />
      <main>
        <Outlet />
      </main>
    </div>
  );
};
export default MainLayout;
