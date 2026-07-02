import { BrowserRouter as Router, Navigate, Outlet, Route, Routes } from "react-router-dom";

import AdminLayout from "@/admin/components/AdminLayout";
import RequireAuth from "@/admin/components/RequireAuth";
import { AuthProvider } from "@/admin/context/AuthContext";
import { ProjectsProvider } from "@/admin/context/ProjectsContext";
import DashboardPage from "@/admin/pages/DashboardPage";
import LoginPage from "@/admin/pages/LoginPage";
import MessagesPage from "@/admin/pages/MessagesPage";
import ProjectNewPage from "@/admin/pages/ProjectNewPage";
import ProjectEditPage from "@/admin/pages/ProjectEditPage";
import ProjectsListPage from "@/admin/pages/ProjectsListPage";
import SettingsPage from "@/admin/pages/SettingsPage";
import ScrollToTop from "@/components/ScrollToTop";
import Contact from "@/pages/Contact";
import Footer from "@/pages/Footer";
import Header from "@/pages/Header";
import MainContent from "@/pages/MainContent";
import Navbar from "@/pages/Navbar";
import WebProjects from "@/pages/WebProjects";
import "./index.css";

function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-500">
      <Header />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ProjectsProvider>
        <Router>
          <ScrollToTop>
            <Routes>
              <Route path="/admin/login" element={<LoginPage />} />
              <Route
                path="/admin"
                element={
                  <RequireAuth>
                    <AdminLayout />
                  </RequireAuth>
                }
              >
                <Route index element={<DashboardPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="messages" element={<MessagesPage />} />
                <Route path="projects" element={<ProjectsListPage />} />
                <Route path="projects/new" element={<ProjectNewPage />} />
                <Route path="projects/:projectId/edit" element={<ProjectEditPage />} />
              </Route>
              <Route path="/" element={<SiteLayout />}>
                <Route index element={<MainContent />} />
                <Route path="WebProjects" element={<WebProjects />} />
                <Route path="contact" element={<Contact />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ScrollToTop>
        </Router>
      </ProjectsProvider>
    </AuthProvider>
  );
}

export default App;
