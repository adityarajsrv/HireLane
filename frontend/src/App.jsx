import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Shell from "./components/layout/Shell.jsx";
import Home from "./pages/Home.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Applications from "./pages/Applications.jsx";
import Analytics from "./pages/Analytics.jsx";
import Profile from "./pages/Profile.jsx";
import JDMatch from "./pages/JDMatch.jsx";
import Settings from "./pages/Settings.jsx";
import Insights from "./pages/Insights.jsx";
import useProfile from "./hooks/useProfile.js";
import OnboardingWizard from "./pages/OnboardingWizard.jsx";
import ExtensionSetup from "./pages/ExtensionSetup.jsx";

const DashboardApp = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [globalSearch, setGlobalSearch] = useState("");
  const [skippedOnboarding, setSkippedOnboarding] = useState(false);

  const { profile, loading } = useProfile();

  if (loading) return null;

  const needsOnboarding = (!profile || profile.onboardingCompleted !== true) && !skippedOnboarding;

  if (needsOnboarding) {
    return (
      <OnboardingWizard
        onComplete={() => window.location.reload()} 
      />
    );
  }

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard onNavigate={setActivePage} />;
      case "applications":
        return <Applications initialSearch={globalSearch} />;
      case "analytics":
        return <Analytics />;
      case "profile":
        return <Profile />;
      case "jdmatch":
        return <JDMatch />;
      case "settings":
        return <Settings onNavigate={setActivePage}/>;
      case "insights":
        return <Insights />;
      case "extension": 
        return <ExtensionSetup />;
      default:
        return <Dashboard onNavigate={setActivePage} />;
    }
  };

  return (
    <Shell
      activePage={activePage}
      onNavigate={setActivePage}
      onSearch={setGlobalSearch}
    >
      {renderPage()}
    </Shell>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
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
