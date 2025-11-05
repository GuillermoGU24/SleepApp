import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Moon, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../hook/useAuth";
import { useTheme } from "../hook/useTheme";
import { useAlert } from "../hook/useAlert";
import { Alert } from "../components/Alert";
import { updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const LoginPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, register, loginWithGoogle } = useAuth();
  const { theme } = useTheme();
  const { alert, showError, showSuccess, clearAlert } = useAlert();
  const navigate = useNavigate();
  const db = getFirestore();

  const isDark = theme === "dark";
  const cardBg = isDark ? "bg-gray-800" : "bg-white";
  const textClass = isDark ? "text-gray-100" : "text-gray-900";
  const textMuted = isDark ? "text-gray-400" : "text-gray-600";

  useEffect(() => {
    setName("");
    setEmail("");
    setPassword("");
    clearAlert();
  }, [isSignUp, clearAlert]);

  const handleFirebaseError = (code: string) => {
    switch (code) {
      case "auth/email-already-in-use":
        return "El correo ya está registrado. Intenta iniciar sesión.";
      case "auth/weak-password":
        return "La contraseña debe tener al menos 6 caracteres.";
      case "auth/invalid-email":
        return "El correo no tiene un formato válido.";
      case "auth/user-not-found":
        return "No existe una cuenta con este correo.";
      case "auth/wrong-password":
        return "La contraseña es incorrecta.";
      case "auth/invalid-credential":
        return "Credenciales inválidas. Verifica tu correo y contraseña.";
      case "permission-denied":
        return "No tienes permiso para realizar esta acción.";
      default:
        return "Ha ocurrido un error inesperado. Intenta nuevamente.";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || (isSignUp && !name.trim())) {
      showError("Por favor completa todos los campos.");
      return;
    }

    setLoading(true);
    clearAlert();

    try {
      if (isSignUp) {
        const userCredential = await register(email, password);
        const user = userCredential.user;

        await updateProfile(user, { displayName: name.trim() });
        await setDoc(doc(db, "usuarios", user.uid), {
          nombre: name.trim(),
          email: user.email,
          creadoEn: new Date(),
        });

        showSuccess("Registro exitoso 🎉");
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        await login(email, password);
        showSuccess("Inicio de sesión correcto ✅");
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch (err: any) {
      console.error("Error:", err);
      const firebaseMessage =
        err.code && err.code.startsWith("auth/")
          ? handleFirebaseError(err.code)
          : "Ha ocurrido un error. Verifica tus datos.";
      showError(firebaseMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    clearAlert();
    setLoading(true);

    try {
      await loginWithGoogle();
      showSuccess("¡Bienvenido! ✅");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err: any) {
      const firebaseMessage =
        err.code && err.code.startsWith("auth/")
          ? handleFirebaseError(err.code)
          : err.message;
      showError(firebaseMessage || "Ha ocurrido un error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${
        isDark ? "bg-gray-900" : "bg-gradient-to-br from-purple-50 to-pink-50"
      }`}
    >
      {alert && (
        <Alert type={alert.type} message={alert.message} onClose={clearAlert} />
      )}

      <div className={`${cardBg} rounded-3xl shadow-2xl p-8 w-full max-w-md`}>
        <div className="text-center mb-8">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 ${
              isDark ? "bg-purple-900" : "bg-purple-100"
            } rounded-full mb-4`}
          >
            <Moon
              className={`w-8 h-8 ${
                isDark ? "text-purple-300" : "text-purple-600"
              }`}
            />
          </div>
          <h1 className={`text-3xl font-bold ${textClass}`}>Dream Tracker</h1>
          <p className={textMuted}>Tu compañero de descanso</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className={`block text-sm font-medium ${textClass} mb-2`}>
                Nombre
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl ${
                  isDark
                    ? "bg-gray-700 text-white"
                    : "bg-purple-50 text-gray-900"
                } border-0 focus:ring-2 focus:ring-purple-400`}
                placeholder="Tu nombre completo"
                required
                disabled={loading}
              />
            </div>
          )}

          <div>
            <label className={`block text-sm font-medium ${textClass} mb-2`}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl ${
                isDark ? "bg-gray-700 text-white" : "bg-purple-50 text-gray-900"
              } border-0 focus:ring-2 focus:ring-purple-400`}
              placeholder="tu@email.com"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${textClass} mb-2`}>
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl ${
                  isDark
                    ? "bg-gray-700 text-white"
                    : "bg-purple-50 text-gray-900"
                } border-0 focus:ring-2 focus:ring-purple-400 pr-10`}
                placeholder="••••••••"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
          >
            {loading
              ? "Cargando..."
              : isSignUp
              ? "Crear cuenta"
              : "Iniciar sesión"}
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className={`w-full ${cardBg} border-2 border-purple-300 ${textClass} py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all disabled:opacity-50`}
          >
            Continuar con Google
          </button>
        </form>

        <p className={`text-center mt-4 text-sm ${textMuted}`}>
          {isSignUp ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="ml-2 text-purple-500 font-semibold hover:text-purple-600"
            disabled={loading}
          >
            {isSignUp ? "Inicia sesión" : "Regístrate"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
