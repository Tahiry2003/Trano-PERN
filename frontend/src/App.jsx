
import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import HomePage from "./components/home/HomePage";
import Login from "./components/Login";
import Register from "./components/Register";
import PublishModal from "./components/PublishModal";

import ProfilPage from "./pages/ProfilPage";

export default function App() {
  const [activeModal, setActiveModal] = useState(null);

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  const [favoritesCount, setFavoritesCount] = useState(0);

  // Connexion réussie
  const handleLogin = async (data) => {
    setUser(data.user);

    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);

    setActiveModal(null);
  };

  // Inscription
  const handleRegister = async (data) => {
    console.log("Inscription :", data);
  };

  // Déconnexion
  const handleLogout = () => {
    setUser(null);
    setFavoritesCount(0);

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setActiveModal(null);
  };

  // Réception du formulaire de publication
  const handlePublish = (data) => {
    console.log("Nouvelle annonce :", data);

    // Ici, nous connecterons le formulaire à l'API PostgreSQL.
    // Pour le moment, aucune annonce n'est enregistrée en base.
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#faf9f5]">

      {/* Header */}
      <Header
        user={user}
        onLoginClick={() => setActiveModal("login")}
        onPublishClick={() => setActiveModal("publish")}
        onLogout={handleLogout}
        favoritesCount={favoritesCount}
      />

      {/* Pages */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route
            path="/profile"
            element={
              user ? (
                <ProfilPage
                  onUserUpdated={(updatedUser) => {
                    setUser(updatedUser);
                    localStorage.setItem(
                      "user",
                      JSON.stringify(updatedUser)
                    );
                  }}
                />
              ) : (
                <HomePage />
              )
            }
          />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modal connexion */}
      {activeModal === "login" && (
        <Login
          onClose={() => setActiveModal(null)}
          onLogin={handleLogin}
          onRegister={() => setActiveModal("register")}
        />
      )}

      {/* Modal inscription */}
      {activeModal === "register" && (
        <Register
          onClose={() => setActiveModal(null)}
          onLogin={() => setActiveModal("login")}
          onRegister={handleRegister}
        />
      )}

      {/* Modal publication */}
      {activeModal === "publish" && (
        <PublishModal
          onClose={() => setActiveModal(null)}
          onSubmit={handlePublish}
        />
      )}

    </div>
  );
}
