import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
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
import { Navigate } from "react-router-dom";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import Posts from "./pages/admin/posts/Posts";
import Comments from "./pages/admin/comments/Comments";

// Admin Layout component to include both Sidebar and content
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

function AppLayout() {
  const location = useLocation();
  return (
    <>
      {location.pathname.startsWith("/admin") ? <AdminHeader /> : <Header />}
      <Routes>
        <Route path="/" element={<MainTitle />} />
        <Route path="/sport" element={<SportPage />} />
        <Route path="/news/cong-nghe" element={<TechNewsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Update the admin dashboard route to use AdminLayout */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          }
        />

        {/* Add more admin routes as needed */}
        <Route
          path="/admin/posts"
          element={
            <AdminLayout>
              {/* User management component would go here */}
              <Posts />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/comments"
          element={
            <AdminLayout>
              {/* User management component would go here */}
              <Comments />
            </AdminLayout>
          }
        />
      </Routes>

      {location.pathname.startsWith("/admin") ? null : <Footer />}
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
