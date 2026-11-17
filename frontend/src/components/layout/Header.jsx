
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Home, Plus, ArrowUpRight, LogOut } from "lucide-react";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

const SERVER_URL = API_URL.replace(/\/api$/, "");

export default function Header({
  onLoginClick,
  onPublishClick,
  user,
  onLogout,
  favoritesCount = 0,
}) {
  const [profileUser, setProfileUser] = useState(user || null);

  // Synchroniser les données utilisateur reçues par les props
  useEffect(() => {
    setProfileUser(user || null);
  }, [user]);

  // Récupérer le profil depuis PostgreSQL comme dans ProfilPage
  useEffect(() => {
    let cancelled = false;

    const fetchProfile = async () => {
      if (!user) {
        setProfileUser(null);
        return;
      }

      const token = localStorage.getItem("token");

      if (!token) return;

      // Si l'avatar est déjà disponible, inutile de refaire la requête
      if (user.avatar_path) return;

      try {
        const response = await fetch(`${API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Impossible de récupérer le profil."
          );
        }

        if (!cancelled && data.user) {
          setProfileUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      } catch (error) {
        console.error("Erreur récupération avatar :", error);
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const getUserInitials = (name = "") => {
    return name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  };

  // Récupération de l'avatar comme dans ProfilPage
  const avatarUrl = profileUser?.avatar_path
    ? profileUser.avatar_path.startsWith("http")
      ? profileUser.avatar_path
      : `${SERVER_URL}${profileUser.avatar_path}`
    : null;
  
  const userRole = (profileUser?.role || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
  
  const isProprietaire = userRole === "proprietaire";
  
  const handlePublishClick = () => {
    if (!profileUser) {
      onLoginClick();
      return;
    }
  
    if (isProprietaire) {
      onPublishClick();
      return;
    }
  
    alert("La publication d'annonces est réservée aux propriétaires.");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#e9e7df]/80 bg-[#fffefa]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-[1300px] items-center justify-between px-5 lg:px-8">

        {/* Logo */}
        <div className="flex h-full items-center gap-10">
          <Link to="/" className="group flex shrink-0 items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#244d40] text-white transition-transform duration-300 group-hover:scale-105">
              <Home size={23} strokeWidth={1.7} />
            </span>

            <span className="text-[27px] font-extrabold tracking-[-1.5px] text-[#203c33]">
              trano<span className="text-[#879b70]">.</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden h-full items-center gap-8 sm:flex">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `relative flex h-full items-center text-[12px] font-medium transition-colors duration-200
                after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#244d40]
                after:transition-all after:duration-300
                ${
                  isActive
                    ? "text-[#244d40] after:w-full"
                    : "text-[#737c74] after:w-0 hover:text-[#244d40] hover:after:w-full"
                }`
              }
            >
              Trouver un logement
            </NavLink>

            {profileUser && (
              <>
                <NavLink to="/favorites" className="text-[12px] font-medium text-[#737c74] transition-colors hover:text-[#244d40]">
                  Mes favoris {favoritesCount}
                </NavLink>

                <NavLink to="/requests" className="text-[12px] font-medium text-[#737c74] transition-colors hover:text-[#244d40]">
                  Mes demandes
                </NavLink>

                <NavLink to="/rentals" className="text-[12px] font-medium text-[#737c74] transition-colors hover:text-[#244d40]">
                  Mes locations
                </NavLink>

                <NavLink to="/visits" className="text-[12px] font-medium text-[#737c74] transition-colors hover:text-[#244d40]">
                  Mes visites
                </NavLink>

                <NavLink to="/maintenance" className="text-[12px] font-medium text-[#737c74] transition-colors hover:text-[#244d40]">
                  Maintenance
                </NavLink>
              </>
            )}
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 sm:gap-6">
          {profileUser ? (
            <div className="flex items-center gap-2.5">
              <Link
                to="/profile"
                title="Voir mon profil"
                className="flex items-center gap-2.5"
              >
                {avatarUrl ? (
                  <img
                    key={avatarUrl}
                    src={avatarUrl}
                    alt="Photo de profil"
                    className="h-9 w-9 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#244d40] text-sm font-semibold text-white">
                    {getUserInitials(profileUser.name)}
                  </span>
                )}

                <span className="max-w-[110px] text-[13px] font-medium text-[#40564b]">
                  {profileUser.name?.slice(0, 5)}...
                </span>
              </Link>

              <button
                type="button"
                onClick={onLogout}
                title="Se déconnecter"
                aria-label="Se déconnecter"
                className="text-[#737c74] transition-colors hover:text-red-600"
              >
                <LogOut size={20} strokeWidth={1.8} />
              </button>
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="hidden text-[13px] font-medium text-[#40564b] transition-colors hover:text-[#879b70] sm:block"
            >
              Se connecter
            </button>
          )}

          <button
            type="button"
            onClick={handlePublishClick}
            className="group inline-flex h-[43px] items-center justify-center gap-2 rounded-xl bg-[#244d40] px-4 text-[12px] font-semibold text-white shadow-[0_3px_10px_rgba(36,77,64,0.10)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#193d32] hover:shadow-[0_7px_18px_rgba(36,77,64,0.18)] active:translate-y-0 sm:px-5"
          >
            <Plus size={18} strokeWidth={1.8} />
            <span>Publier une annonce</span>
            <ArrowUpRight
              size={14}
              className="opacity-60 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
