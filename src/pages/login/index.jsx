import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import { AuthContext } from "../../contexts/AuthContext";
import { Link as RouterLink } from "react-router-dom";
import googleIcon from "../../assets/google.png"; // Logo Google đa màu
import {
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useContext(AuthContext);

  // Lấy đường dẫn trước đó mà người dùng muốn truy cập (nếu có)
  const from = location.state?.from?.pathname || "/admin";
  const isAdminLogin = location.pathname.startsWith("/admin/login");
  const redirectPath = isAdminLogin ? "/admin/dashboard" : "/";

  // Nếu đã đăng nhập, chuyển hướng đến trang yêu cầu
  useEffect(() => {
    if (user) {
      navigate(redirectPath);
    }
  }, [user, navigate, redirectPath]);

  const handleLogin = () => {
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Vui lòng nhập email và mật khẩu");
      return;
    }

    if (email === "admin@gmail.com" && password === "123") {
      // Lưu thông tin user với role admin
      const success = login({ email, role: "admin" });

      if (success) {
        console.log("Đăng nhập thành công, chuyển hướng đến:", from);
        navigate(redirectPath);
      }
    } else {
      setErrorMessage("Tài khoản hoặc mật khẩu không đúng!");
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Cột trái */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: "#fffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={logo}
          alt="logo"
          style={{ maxWidth: "60%", height: "auto" }}
        />
      </Box>

      {/* Cột phải */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
        }}
      >
        <Box
          sx={{
            width: 360,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
            Sign in to continue
          </Typography>

          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            type={showPass ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPass(!showPass)} edge="end">
                    {showPass ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Hiển thị thông báo lỗi nếu có */}
          {errorMessage && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {errorMessage}
            </Typography>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <FormControlLabel control={<Checkbox />} label="Remember me" />
            <Button variant="text" size="small" sx={{ textTransform: "none" }}>
              Forgot password
            </Button>
          </Box>

          <Button
            variant="contained"
            onClick={handleLogin}
            sx={{ textTransform: "none", fontWeight: "bold", mb: 1 }}
          >
            Sign In
          </Button>

          <Button
            variant="outlined"
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 1,
            }}
          >
            <img
              src={googleIcon}
              alt="Google"
              style={{ width: 20, height: 20 }}
            />
            Sign in with Google
          </Button>

          <Box sx={{ fontSize: "0.9rem" }}>
            Don't have an account?{" "}
            <Button
              variant="text"
              size="small"
              sx={{ textTransform: "none", p: 0 }}
              component={RouterLink}
              to="/signup"
            >
              Signup
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
