import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: "#f8f8f8", p: 4, mt: 4 }}>
      <Grid container spacing={2}>
        {/* Cột 1: Logo + Slogan */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#000", mb: 1 }}>
            Báo Liêm Khiết
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "#000" }}>
            Chúng ta trung thực, còn bạn thì sao?
          </Typography>
        </Grid>

        {/* Cột 2: Danh mục */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#000", mb: 1 }}>
            Danh mục
          </Typography>
          <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
            <li>
              <Link
                to="/category/thoi-su"
                style={{ color: "#000", textDecoration: "none" }}
              >
                Thời sự
              </Link>
            </li>
            <li>
              <Link
                to="/category/the-gioi"
                style={{ color: "#000", textDecoration: "none" }}
              >
                Thế giới
              </Link>
            </li>
            <li>
              <Link
                to="/category/kinh-doanh"
                style={{ color: "#000", textDecoration: "none" }}
              >
                Kinh doanh
              </Link>
            </li>
            <li>
              <Link
                to="/category/cong-nghe"
                style={{ color: "#000", textDecoration: "none" }}
              >
                Công nghệ
              </Link>
            </li>
            <li>
              <Link
                to="/category/khoa-hoc"
                style={{ color: "#000", textDecoration: "none" }}
              >
                Khoa học
              </Link>
            </li>
          </Box>
        </Grid>

        {/* Cột 3: Thông tin */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#000", mb: 1 }}>
            Thông tin
          </Typography>
          <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
            <li>
              <Link to="/about" style={{ color: "#000", textDecoration: "none" }}>
                Giới thiệu
              </Link>
            </li>
            <li>
              <Link to="/contact" style={{ color: "#000", textDecoration: "none" }}>
                Liên hệ
              </Link>
            </li>
            <li>
              <Link to="/terms" style={{ color: "#000", textDecoration: "none" }}>
                Điều khoản sử dụng
              </Link>
            </li>
            <li>
              <Link to="/privacy" style={{ color: "#000", textDecoration: "none" }}>
                Chính sách bảo mật
              </Link>
            </li>
          </Box>
        </Grid>

        {/* Cột 4: Kết nối */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#000", mb: 1 }}>
            Kết nối
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Link to="#" style={{ color: "#000", textDecoration: "none" }}>
              Facebook
            </Link>
            <Link to="#" style={{ color: "#000", textDecoration: "none" }}>
              Twitter
            </Link>
            <Link to="#" style={{ color: "#000", textDecoration: "none" }}>
              YouTube
            </Link>
          </Box>
        </Grid>
      </Grid>

      {/* Dòng bản quyền */}
      <Box
        sx={{
          borderTop: "1px solid #ccc",
          mt: 3,
          pt: 2,
          textAlign: "center",
          fontSize: "0.9rem",
          color: "#000",
        }}
      >
        <p>© 2025 Báo Liêm Khiết. Tất cả các quyền được bảo lưu.</p>
      </Box>
    </Box>
  );
};

export default Footer;
