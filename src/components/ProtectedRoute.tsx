import { Navigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";


export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuth();
  return currentUser ? <>{children}</> : <Navigate to="/login" replace />;
};
