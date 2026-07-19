import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import DiagnosticsPanel from "./DiagnosticsPanel.jsx";

const Shell = ({ children, activePage, onNavigate }) => {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#f5f4ff]">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activePage={activePage} onNavigate={onNavigate} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
        <DiagnosticsPanel />
      </div>
    </div>
  );
};

export default Shell;