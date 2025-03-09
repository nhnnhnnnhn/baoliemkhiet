import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/common/header";
import MainTitle from "./components/common/MainTitle";
import LoginPage from "./pages/login";
import SportPage from "./pages/news/sport";
import { AuthProvider } from "./contexts/AuthContext"; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<MainTitle />} />
          <Route path="/sport" element={<SportPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
