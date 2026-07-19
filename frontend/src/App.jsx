import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Shell from "./components/layout/Shell.jsx";
import Home from "./pages/Home.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Applications from "./pages/Applications.jsx";

const PlaceholderPage = ({ name }) => (
  <div>
    <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, color: "#0a0a0f", marginBottom: 8 }}>
      {name}
    </h1>
    <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13, color: "#9ca3af" }}>
      Building this next...
    </p>
  </div>
);

const DashboardApp = () => {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <Dashboard onNavigate={setActivePage} />;
      case "applications": return <Applications />;
      case "jdmatch":      return <PlaceholderPage name="JD Match" />;
      case "analytics":    return <PlaceholderPage name="Analytics" />;
      case "predictor":    return <PlaceholderPage name="Predictor" />;
      case "cache":        return <PlaceholderPage name="Cache Monitor" />;
      case "profile":      return <PlaceholderPage name="Profile" />;
      case "settings":     return <PlaceholderPage name="Settings" />;
      default:             return <PlaceholderPage name="Dashboard" />;
    }
  };

  return (
    <Shell activePage={activePage} onNavigate={setActivePage}>
      {renderPage()}
    </Shell>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/"     element={<Home />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardApp />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;