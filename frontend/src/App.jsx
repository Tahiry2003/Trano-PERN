
import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HomePage from "./components/home/HomePage";
import Login from "./components/Login";
import Register from "./components/Register";

export default function App() {
  const [activeModal, setActiveModal] = useState(null);

  const handleLogin = (credentials) => {
    console.log("Connexion :", credentials);
    // Connexion backend à intégrer
  };

  const handleRegister = (userData) => {
    console.log("Inscription :", userData);
    // Inscription backend à intégrer
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#faf9f5]">
      <Header onLoginClick={() => setActiveModal("login")} />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </main>

      <Footer />

      {activeModal === "login" && (
        <Login
          onClose={() => setActiveModal(null)}
          onLogin={handleLogin}
          onRegister={() => setActiveModal("register")}
        />
      )}

      {activeModal === "register" && (
        <Register
          onClose={() => setActiveModal(null)}
          onLogin={() => setActiveModal("login")}
          onRegister={handleRegister}
        />
      )}
    </div>
  );
}
