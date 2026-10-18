import { lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { RequireAuth } from './auth/RequireAuth'
import { MainLayout } from './layouts/MainLayout'
import { PortalBlankLayout } from './layouts/PortalBlankLayout'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'

/** Pages hors premier affichage — chargées à la demande (D6.3). */
const PresentationPage = lazy(() =>
  import('./pages/PresentationPage').then((m) => ({ default: m.PresentationPage })),
)
const FacultiesPage = lazy(() =>
  import('./pages/FacultiesPage').then((m) => ({ default: m.FacultiesPage })),
)
const FacultyDetailPage = lazy(() =>
  import('./pages/FacultyDetailPage').then((m) => ({
    default: m.FacultyDetailPage,
  })),
)
const FormationDetailPage = lazy(() =>
  import('./pages/FormationDetailPage').then((m) => ({
    default: m.FormationDetailPage,
  })),
)
const AdmissionsPage = lazy(() =>
  import('./pages/AdmissionsPage').then((m) => ({ default: m.AdmissionsPage })),
)
const ResearchPage = lazy(() =>
  import('./pages/ResearchPage').then((m) => ({ default: m.ResearchPage })),
)
const NewsPage = lazy(() =>
  import('./pages/NewsPage').then((m) => ({ default: m.NewsPage })),
)
const NewsDetailPage = lazy(() =>
  import('./pages/NewsDetailPage').then((m) => ({ default: m.NewsDetailPage })),
)
const PublicationsPage = lazy(() =>
  import('./pages/PublicationsPage').then((m) => ({
    default: m.PublicationsPage,
  })),
)
const LibraryPage = lazy(() =>
  import('./pages/LibraryPage').then((m) => ({ default: m.LibraryPage })),
)
const DocumentPage = lazy(() =>
  import('./pages/DocumentPage').then((m) => ({ default: m.DocumentPage })),
)
const ContactPage = lazy(() =>
  import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })),
)
const SearchPage = lazy(() =>
  import('./pages/SearchPage').then((m) => ({ default: m.SearchPage })),
)
const ComingSoonPage = lazy(() =>
  import('./pages/ComingSoonPage').then((m) => ({ default: m.ComingSoonPage })),
)
const LoginPage = lazy(() =>
  import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })),
)
const StudentPortalPage = lazy(() =>
  import('./pages/StudentPortalPage').then((m) => ({
    default: m.StudentPortalPage,
  })),
)
const TeacherPortalPage = lazy(() =>
  import('./pages/TeacherPortalPage').then((m) => ({
    default: m.TeacherPortalPage,
  })),
)
const StudentDossierPage = lazy(() =>
  import('./pages/StudentDossierPage').then((m) => ({
    default: m.StudentDossierPage,
  })),
)

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="presentation" element={<PresentationPage />} />
            <Route path="facultes" element={<FacultiesPage />} />
            <Route path="formations" element={<FacultiesPage />} />
            <Route path="facultes/:facultyId" element={<FacultyDetailPage />} />
            <Route
              path="formations/:formationSlug"
              element={<FormationDetailPage />}
            />
            <Route path="admissions" element={<AdmissionsPage />} />
            <Route path="recherche" element={<ResearchPage />} />
            <Route path="actualites" element={<NewsPage />} />
            <Route path="actualites/:articleId" element={<NewsDetailPage />} />
            <Route path="publications" element={<PublicationsPage />} />
            <Route path="bibliotheque" element={<LibraryPage />} />
            <Route path="bibliotheque/:documentId" element={<DocumentPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="chercher" element={<SearchPage />} />
            <Route
              path="recherche-contenu"
              element={<Navigate to="/chercher" replace />}
            />
            <Route
              path="services-numeriques"
              element={
                <ComingSoonPage
                  title="Services numériques"
                  description="Accès centralisé aux services numériques de l’UWB (e-learning, bibliothèque, portails). Les liens officiels restent disponibles en attendant l’intégration complète."
                />
              }
            />
            <Route
              path="sigu"
              element={<Navigate to="/connexion" replace />}
            />
            <Route path="404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Portail public — hors Header/Footer institutionnels */}
          <Route element={<PortalBlankLayout />}>
            <Route path="connexion" element={<LoginPage />} />
            <Route element={<RequireAuth role="student" />}>
              <Route path="espace-etudiant" element={<StudentPortalPage />} />
              <Route
                path="espace-etudiant/dossier"
                element={<StudentDossierPage />}
              />
            </Route>
            <Route element={<RequireAuth role="teacher" />}>
              <Route
                path="espace-enseignant"
                element={<TeacherPortalPage />}
              />
            </Route>
          </Route>

          <Route path="home" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
