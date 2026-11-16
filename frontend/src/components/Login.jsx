
import { useState, useEffect } from "react";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

export default function Login({
  onClose,
  onLogin,
  onRegister,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Bloquer le scroll en arrière-plan
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  // Connexion
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    if (loading) return;

    setLoading(true);

    try {
      // Appel au backend Express
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      // Gestion des erreurs HTTP
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Email ou mot de passe incorrect.");
        }

        if (response.status === 400) {
          throw new Error(
            data.message || "Veuillez vérifier vos informations."
          );
        }

        if (response.status === 429) {
          throw new Error(
            "Trop de tentatives. Réessaie dans quelques minutes."
          );
        }

        throw new Error(
          data.message || "Une erreur est survenue pendant la connexion."
        );
      }

      // Vérification de la réponse
      if (!data.success || !data.token || !data.user) {
        throw new Error("La réponse du serveur est invalide.");
      }

      // Transmettre la session au composant parent
      if (onLogin) {
        await onLogin(data);
      }

      // Fermer la fenêtre de connexion
      onClose?.();

    } catch (err) {
      console.error("Erreur connexion :", err);

      if (err instanceof TypeError) {
        setError(
          "Impossible de contacter le serveur. Vérifie que le backend est démarré."
        );
      } else {
        setError(
          err.message || "Une erreur inattendue est survenue."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "h-[42px] w-full rounded-md border border-[#d9ddd6] bg-white px-3 text-xs text-[#26372e] outline-none transition focus:border-[#244d3e] focus:ring-2 focus:ring-[#244d3e]/10 disabled:cursor-not-allowed disabled:opacity-60";

  const labelClass =
    "mb-2 block text-[11px] font-semibold text-[#45534a]";

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#30483b]/40 p-5 backdrop-blur-[6px]"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[510px] rounded-[15px] bg-[#faf9f6] px-8 py-11 shadow-xl sm:px-[38px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fermer */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute right-4 top-3 text-[25px] text-[#34443a] disabled:opacity-40"
          aria-label="Fermer"
        >
          ×
        </button>

        {/* En-tête */}
        <p className="mb-5 text-[10px] font-bold tracking-[2px] text-[#74836b]">
          BIENVENUE CHEZ TRANO
        </p>

        <h2 className="mb-3 font-serif text-[31px] text-[#304238]">
          Heureux de vous revoir.
        </h2>

        <p className="mb-7 text-[12px] text-[#858780]">
          Connectez-vous pour continuer votre recherche.
        </p>

        {/* Formulaire */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-5">
            <label className={labelClass}>
              Adresse email
            </label>

            <input
              type="email"
              placeholder="Votre adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              maxLength={190}
              disabled={loading}
              autoComplete="email"
              className={inputClass}
            />
          </div>

          {/* Mot de passe */}
          <div className="mb-5">
            <label className={labelClass}>
              Mot de passe
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                autoComplete="current-password"
                className={`${inputClass} pr-11`}
              />

              {/* Afficher / masquer */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#858780] transition hover:text-[#214d3c]"
                aria-label={
                  showPassword
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
              >
                {showPassword ? (
                  <EyeOff size={18} strokeWidth={1.7} />
                ) : (
                  <Eye size={18} strokeWidth={1.7} />
                )}
              </button>
            </div>
          </div>

          {/* Erreur */}
          {error && (
            <p
              role="alert"
              className="mb-4 rounded-md bg-red-50 px-3 py-2 text-[11px] text-red-600"
            >
              {error}
            </p>
          )}

          {/* Connexion */}
          <button
            type="submit"
            disabled={loading}
            className="flex h-[46px] w-full items-center justify-center gap-3 rounded-lg bg-[#214d3c] text-xs font-semibold text-white transition hover:bg-[#173b2d] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <LoaderCircle size={17} className="animate-spin" />
                Connexion...
              </>
            ) : (
              <>
                Se connecter
                <span className="text-lg">→</span>
              </>
            )}
          </button>
        </form>

        {/* Mot de passe oublié */}
        <div className="mt-3 text-center">
          <button
            type="button"
            disabled
            title="Fonctionnalité à venir"
            className="cursor-not-allowed text-[10px] text-[#7c8279] underline opacity-70"
          >
            Mot de passe oublié ?
          </button>
        </div>

        {/* Inscription */}
        <p className="mt-7 text-center text-[11px] text-[#858780]">
          Pas encore de compte ?

          <button
            type="button"
            onClick={onRegister}
            disabled={loading}
            className="ml-2 font-bold text-[#304d3e] underline transition hover:text-[#b07f32]"
          >
            S'inscrire
          </button>
        </p>
      </div>
    </div>
  );
}
