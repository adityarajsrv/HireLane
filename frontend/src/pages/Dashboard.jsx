import { useAuth } from "../context/AuthContext.jsx";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0effa]">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col gap-4 w-80">
        <h1 className="text-[18px] font-semibold text-gray-900">
          Welcome, {user?.name}
        </h1>
        <p className="text-[12px] font-mono text-gray-400">{user?.email}</p>
        <p className="text-[11px] font-mono text-gray-300">
          Plan: {user?.plan}
        </p>
        <button
          onClick={logout}
          className="mt-2 text-[12px] font-medium text-red-400 hover:text-red-500 text-left"
        >
          Logout →
        </button>
      </div>
    </div>
  );
}