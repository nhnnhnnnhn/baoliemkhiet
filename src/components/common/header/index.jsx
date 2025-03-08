import React from "react";
import { AppBar, Toolbar, Button, IconButton, InputBase, Box } from "@mui/material";
import { Search, Notifications } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import "./Header.css";
import logo from "../../../assets/logo.png";

const Header = () => {
  return (
    <AppBar position="static" className="header">
      <Toolbar>
        {/* Logo */}
        <Box className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </Box>

        {/* Danh mục */}
        <Box className="nav-links">
          <Button className="custom-nav-link">Thời sự</Button>
          <Button className="custom-nav-link">Thế giới</Button>
          <Button className="custom-nav-link">Kinh doanh</Button>
          <Button className="custom-nav-link">Công nghệ</Button>
          <Button className="custom-nav-link">Thể thao</Button>
        </Box>

        {/* Thanh tìm kiếm */}
        <Box className="search-bar">
          <IconButton>
            <MenuIcon />
          </IconButton>
          <InputBase placeholder="Tìm tin chấn động" />
          <IconButton>
            <Search />
          </IconButton>
        </Box>

        {/* Nút thông báo và đăng nhập */}
        <Box className="actions">
          <IconButton className="notification-icon">
            <Notifications />
          </IconButton>
          <Button className="login-btn">Đăng nhập</Button>
        </Box>
      </Toolbar>

      {/* Dòng chữ chạy breaking news */}
      <Box className="breaking-news" sx={{ width: '100%' }}>
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
