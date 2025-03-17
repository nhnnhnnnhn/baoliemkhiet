import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Header from "./components/common/header";
import MainTitle from "./components/common/MainTitle";
import LoginPage from "./pages/login";
import SportPage from "./pages/news/sport";
import TechNewsPage from "./pages/news/technology";
import { AuthProvider } from "./contexts/AuthContext";
import Footer from "./components/common/Footer";
import Sidebar from "./pages/admin/sidebar/Sidebar";
import AdminHeader from "./pages/admin/adminHeader/AdminHeader";
import SignUpPage from "./pages/signup";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import Posts from "./pages/admin/posts/Posts";
import Comments from "./pages/admin/comments/Comments";
import Users from "./pages/admin/users/Users";

// Admin Layout component
function AdminLayout({ children }) {
  return (
    <div className="admin-layout" style={{ display: "flex" }}>
      <Sidebar />
      <div className="admin-content" style={{ flex: 1, padding: "20px" }}>
        {children}
      </div>
    </div>
  );
}

// Main App Layout
function AppLayout() {
  const location = useLocation();

  const hideHeaderFooter = ["/login", "/signup"].includes(location.pathname);
  const isAdminPath = location.pathname.startsWith("/admin");

  return (
    <>
      {!hideHeaderFooter && (isAdminPath ? <AdminHeader /> : <Header />)}

      <Routes>
        <Route path="/" element={<MainTitle />} />
        <Route path="/sport" element={<SportPage />} />
        <Route path="/news/cong-nghe" element={<TechNewsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<LoginPage />} />

        <Route
          path="/admin/dashboard"
          element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/posts"
          element={
            <AdminLayout>
              <Posts />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/comments"
          element={
            <AdminLayout>
              <Comments />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminLayout>
              <Users />
            </AdminLayout>
          }
        />
      </Routes>

      {!hideHeaderFooter && !isAdminPath && <Footer />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}

export default App;