import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { AppShell } from "./components/layout/AppShell";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { DashboardPage } from "./pages/DashboardPage";
import { InstitutionPage } from "./pages/InstitutionPage";
import { LoginPage } from "./pages/LoginPage";
import { PersonsPage } from "./pages/PersonsPage";
import { RolesPage } from "./pages/RolesPage";
import { StudentDossiersPage } from "./pages/StudentDossiersPage";
import { UsersPage } from "./pages/UsersPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute adminOnly />}>
            <Route element={<AppShell />}>
              <Route index element={<DashboardPage />} />
              <Route path="persons" element={<PersonsPage />} />
              <Route path="student-dossiers" element={<StudentDossiersPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="roles" element={<RolesPage />} />
              <Route path="institution" element={<InstitutionPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
