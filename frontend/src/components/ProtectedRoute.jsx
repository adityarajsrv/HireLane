import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0effa]">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#e8e8f0" strokeWidth="3"/>
            <path d="M12 2a10 10 0 0 1 10 10" stroke="#5b3df5" strokeWidth="3" strokeLinecap="round"/>
          </svg>
          <span className="text-[11px] font-mono text-gray-400">Checking session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;