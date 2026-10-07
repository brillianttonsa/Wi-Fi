import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import { Dashboard } from "./dashboard";
import { DashboardHomePage } from "./component/dashboard/HomePage";
import { PackagesPage } from "./component/dashboard/packages/PackagesPage";
import { Profile } from "./component/dashboard/Profile";
import Website from "./website";

function CheckingAccount() {
  return <main className="grid min-h-screen place-items-center bg-[#f7f8f2] text-sm text-[#66736e]">Checking your account…</main>;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <CheckingAccount />;

  return (
    <Routes>
      {user ? (
        <Route path="/" element={<Dashboard />}>
          <Route index element={<DashboardHomePage />} />
          <Route path="packages" element={<PackagesPage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      ) : (
        <>
          <Route path="/" element={<Website />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
