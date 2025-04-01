import React from "react";
import {
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  InputAdornment,
  IconButton
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Person, Email, Lock, ArrowBack } from "@mui/icons-material";
import logo from "../../assets/logo.png";

export default function SignUpPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý logic đăng ký (gọi API)
    console.log("Sign up submitted!");
  };

  return (
    <Grid container sx={{ height: "100vh" }}>
      {/* Nút quay lại */}
      <IconButton
        component={RouterLink}
        to="/"
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 1,
        }}
      >
        <ArrowBack />
      </IconButton>

      {/* Cột trái (logo) */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff"
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <img
            src={logo}
            alt="Logo"
            style={{ maxWidth: "600px", marginBottom: "16px" }}
          />
        </Box>
      </Grid>

      {/* Cột phải (form) */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffff"
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: "100%",
            maxWidth: "400px",
            p: 4,
            backgroundColor: "#fff",
            borderRadius: 2
          }}
        >
          <Typography variant="h5" mb={2}sx={{ fontWeight: "bold" }}>
            Create an account
          </Typography>

          {/* Full Name + Icon Person */}
          <TextField
            label="Full Name"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              )
            }}
          />

          {/* Email + Icon Email */}
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            type="email"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              )
            }}
          />

          {/* Password + Icon Lock */}
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            type="password"
            helperText="Must be at least 8 characters"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              )
            }}
          />

          {/* Nút Sign In */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, mb: 1 }}
          >
            Sign In
          </Button>

          {/* Nút Sign up with Google */}
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            sx={{ mb: 2 }}
          >
            Sign up with Google
          </Button>

          {/* Chuyển sang trang Sign In */}
          <Typography variant="body2" align="center">
            Already have an account?{" "}
            <RouterLink to="/login" style={{ textDecoration: "none" }}>
              Sign in
            </RouterLink>
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
}
