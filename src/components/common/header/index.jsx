import React, { useContext, useState } from "react";
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
import logo from "../../../assets/logo.png";

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  // Menu dropdown khi bấm mũi tên
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  return (
    <AppBar position="static" className="header">
      <Toolbar sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {/* Logo */}
        <Box className="logo-container" sx={{ mr: 2 }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <img src={logo} alt="Logo" className="logo" />
          </Link>
        </Box>

        {/* Danh mục (Thời sự, Thế giới, v.v.) */}
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

        {/* Thanh tìm kiếm */}
        <Box
          className="search-bar"
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#f2f2f2",
            borderRadius: 2,
            px: 2,
            py: 0.5
          }}
        >
          <IconButton>
            <MenuIcon />
          </IconButton>
          <InputBase placeholder="Tìm tin chấn động" sx={{ ml: 1, flex: 1 }} />
          <IconButton>
            <Search />
          </IconButton>
        </Box>

        {/* Nút chuông thông báo */}
        <IconButton className="notification-icon">
          <Notifications />
        </IconButton>

        {/* Nếu user login -> hiển thị email + mũi tên => menu, nếu chưa -> nút Đăng nhập */}
        {user ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Email user */}
            <span style={{ fontWeight: "bold", color: "#000" }}>
              {user.email || "admin@gmail.com"}
            </span>

            {/* Mũi tên -> Mở menu */}
            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
              <ArrowDropDownIcon />
            </IconButton>

            {/* Menu: Dashboard, Đăng xuất */}
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={handleMenuClose}>Dashboard</MenuItem>
              <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
            </Menu>
          </Box>
        ) : (
          <Button component={Link} to="/login" className="login-btn">
            Đăng nhập
          </Button>
        )}
      </Toolbar>

      {/* Dòng chữ chạy breaking news */}
      <Box className="breaking-news" sx={{ width: "100%" }}>
        <div className="news-content">
          <span>ĐỘI BÓNG HÀNG DA ĐÁNH RƠI CHIẾN THẮNG TRƯỚC ANH LONG</span>
          <span>NÓNG: PHẠM THOẠI TUNG 28 TRANG SAO KÊ TÀI KHOẢN MB</span>
          <span>KHUYẾN MÃI LỚN DỊP 8/3 - ƯU ĐÃI KHỦNG!</span>
        </div>
      </Box>
    </AppBar>
  );
};

export default Header;
