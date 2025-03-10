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

function AppLayout() {
  const location = useLocation();
  return (
    <>
      {location.pathname.startsWith("/admin") ? <AdminHeader /> : <Header />}
      <Routes>
        <Route path="/" element={<MainTitle />} />
        <Route path="/sport" element={<SportPage />} />
        <Route path="/news/cong-nghe" element={<TechNewsPage/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<Sidebar />} />
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
