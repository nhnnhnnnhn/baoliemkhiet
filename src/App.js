// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/common/header";
import MainTitle from "./components/common/MainTitle";

// Import trang sport
import SportPage from "./pages/news/sport"; 

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<MainTitle />} />
        {/* Trang sport */}
        <Route path="/sport" element={<SportPage />} />
      </Routes>
    </Router>
  );
}

export default App;
