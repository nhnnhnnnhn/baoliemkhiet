import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  InputBase,
  Box,
  Menu,
  MenuItem
} from "@mui/material";
import {
  Search,
  Notifications,
  Menu as MenuIcon,
  ArrowDropDown as ArrowDropDownIcon
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import "./Header.css";
import logo from "../../../assets/Logo.svg";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const location = useLocation();
  const navigate = useNavigate();

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  const handleDashboard = () => {
    handleMenuClose();
    navigate('/admin');
  };

  // Kiểm tra xem có phải đang ở trang chính không
  const isHomePage = location.pathname === "/";

  return (
    <AppBar 
      position="static" 
      className={`header ${isHomePage ? 'transparent' : ''}`}
      elevation={0}
      sx={{ 
        boxShadow: 'none', 
        border: 'none', 
        borderBottom: 'none'
      }}
    >
      <Toolbar 
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between", // Tách thành 3 cụm: trái - giữa - phải
          boxShadow: 'none',
          border: 'none',
          borderBottom: 'none'
        }}
      >
        {/* Cụm 1: Logo + Danh mục */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Logo */}
          <Box className="logo-container" sx={{ mr: 2 }}>
            <Link to="/" style={{ textDecoration: "none" }}>
              <img 
                src={logo} 
                alt="Logo" 
                className="logo" 
                style={{ 
                  height: "50px", 
                  width: "auto",
                  display: "block"
                }} 
              />
            </Link>
          </Box>

          {/* Nav links */}
          <Box className="nav-links" sx={{ display: "flex", gap: 1 }}>
            <Button component={Link} to="/news/thoi-su" className="custom-nav-link">
              Thời sự
            </Button>
            <Button component={Link} to="/news/the-gioi" className="custom-nav-link">
              Thế giới
            </Button>
            <Button component={Link} to="/news/kinh-doanh" className="custom-nav-link">
              Kinh doanh
            </Button>
            <Button component={Link} to="/news/cong-nghe" className="custom-nav-link">
              Công nghệ
            </Button>
            <Button component={Link} to="/sport" className="custom-nav-link">
              Thể thao
            </Button>
          </Box>
        </Box>

        {/* Cụm 2: Thanh tìm kiếm */}
        <Box
          className="search-bar"
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#f2f2f2",
            borderRadius: 2,
            px: 0.8,
            py: 0.15,
            minWidth: "180px" // Giảm độ rộng tối thiểu
          }}
        >
          <IconButton size="small">
            <MenuIcon fontSize="small" />
          </IconButton>
          <InputBase 
            placeholder="Tìm tin chấn động"
            sx={{ 
              ml: 1, 
              flex: 1,
              fontSize: '0.9rem' // Giảm kích thước font
            }} 
          />
          <IconButton size="small">
            <Search fontSize="small" />
          </IconButton>
        </Box>

        {/* Cụm 3: Nút thông báo + User info */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Nút chuông thông báo */}
          <IconButton className="notification-icon">
            <Notifications />
          </IconButton>

          {/* Nếu user login -> hiển thị email + mũi tên => menu, nếu chưa -> nút Đăng nhập */}
          {user ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <span style={{ fontWeight: "bold", color: "#000" }}>
                {user.email || "admin@gmail.com"}
              </span>
              <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                <ArrowDropDownIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem onClick={handleDashboard}>Dashboard</MenuItem>
                <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button component={Link} to="/login" className="login-btn">
              Đăng nhập
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
