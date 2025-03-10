import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
  Outlet
} from "react-router-dom";
import Header from "./components/common/header";
import MainTitle from "./components/common/MainTitle";
import LoginPage from "./pages/login";
import SportPage from "./pages/news/sport";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Footer from "./components/common/Footer";
import Sidebar from "./pages/admin/sidebar/Sidebar";
import AdminHeader from "./pages/admin/adminHeader/AdminHeader";

// Layout cho trang admin
function AdminLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AdminHeader />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '20px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// Route bảo vệ cho admin
function RequireAuth() {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();
  
  // Nếu đang loading, hiển thị thông báo đang tải
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Đang kiểm tra thông tin đăng nhập...</p>
    </div>;
  }
  
  console.log("RequireAuth - Thông tin user:", user);
  console.log("RequireAuth - Có quyền admin:", isAdmin());
  
  // Nếu chưa đăng nhập hoặc không phải admin, chuyển hướng đến trang login
  if (!isAdmin()) {
    console.log("Không có quyền admin, chuyển hướng đến trang login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  console.log("Đã xác thực quyền admin");
  return <Outlet />;
}

// Layout cho người dùng thông thường
function UserLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

function AppLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  console.log("AppLayout - Thông tin user hiện tại:", user);
  
  // Hiển thị loading spinner khi đang kiểm tra trạng thái đăng nhập
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Đang tải...</p>
      </div>
    );
  }
  
  // Nếu đường dẫn bắt đầu bằng /admin và không phải là admin, chuyển hướng về login
  if (location.pathname.startsWith('/admin') && (!user || user.role !== 'admin')) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return (
    <Routes>
      {/* Admin Routes */}
      <Route element={<RequireAuth />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<div>Trang quản trị Admin</div>} />
          <Route path="dashboard" element={<div>Dashboard Admin</div>} />
          <Route path="users" element={<div>Quản lý người dùng</div>} />
          <Route path="posts" element={<div>Quản lý bài viết</div>} />
        </Route>
      </Route>

      {/* User Routes */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<MainTitle />} />
        <Route path="/sport" element={<SportPage />} />
      </Route>
      
      {/* Login Route (không có layout) */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Route mặc định - redirect về trang chủ */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
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
