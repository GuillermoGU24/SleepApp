import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

// Layout
import MainLayout from "./components/MainLayout";

// Pages
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import RitualPage from "./pages/RitualPage";
import RegistroPage from "./pages/RegistroPage";
import { BitacoraProvider } from "./provider/BitacoraProvider";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BitacoraProvider>
          <Routes>
            {/* Ruta pública */}
            <Route path="/login" element={<LoginPage />} />

            {/* Rutas protegidas */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="ritual" element={<RitualPage />} />
              <Route path="registro" element={<RegistroPage />} />
            </Route>

            {/* Ruta 404 (redirige al home) */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BitacoraProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
