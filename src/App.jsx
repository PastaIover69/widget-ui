import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./store/AuthContext.jsx";
import { SuperadminProvider } from "./store/SuperadminContext.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import DashboardPage from "./pages/dashboard/DashboardPage.jsx";
import CreditsPage from "./pages/dashboard/CreditsPage.jsx";
import SuperadminLoginPage from "./pages/superadmin/SuperadminLoginPage.jsx";
import SuperadminOverviewPage from "./pages/superadmin/SuperadminOverviewPage.jsx";
import SuperadminTenantsPage from "./pages/superadmin/SuperadminTenantsPage.jsx";
import SuperadminTenantPage from "./pages/superadmin/SuperadminTenantPage.jsx";
import "./styles/globals.css";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/auth" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <SuperadminProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth */}
            <Route path="/auth" element={<AuthPage />} />

            {/* Dashboard */}
            <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/dashboard/credits" element={<PrivateRoute><CreditsPage /></PrivateRoute>} />

            {/* Superadmin */}
            <Route path="/superadmin/login" element={<SuperadminLoginPage />} />
            <Route path="/superadmin" element={<SuperadminOverviewPage />} />
            <Route path="/superadmin/tenants" element={<SuperadminTenantsPage />} />
            <Route path="/superadmin/tenants/:id" element={<SuperadminTenantPage />} />

            <Route path="*" element={<Navigate to="/auth" replace />} />
          </Routes>
        </BrowserRouter>
      </SuperadminProvider>
    </AuthProvider>
  );
}
