
import { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Search,
  PlusCircle,
  LoaderCircle,
} from "lucide-react";

import CustomDropdown from "../components/ui/CustomDropdown";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

// Types de compte
const USER_TYPES = [
  {
    value: "locataire",
    label: "Locataire",
    icon: Search,
  },
  {
    value: "proprietaire",
    label: "Propriétaire",
    icon: PlusCircle,
  },
];

export default function Register({
  onClose,
  onLogin,
  onRegister,
  showToast,
}) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("locataire");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Bloquer le scroll de la page arrière
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedPhone = phone.trim();

    // Validation du nom
    if (trimmedName.length < 2 || trimmedName.length > 120) {
      setError("Le nom doit contenir entre 2 et 120 caractères.");
      return;
    }

    // Validation du type de compte
    if (!["locataire", "proprietaire"].includes(role)) {
      setError("Veuillez sélectionner un type de compte valide.");
      return;
    }

    // Validation du mot de passe
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (password.length < 8 || password.length > 72) {
      setError("Le mot de passe doit contenir entre 8 et 72 caractères.");
      return;
    }

    // Validation du téléphone
    if (trimmedPhone.length > 30) {
      setError("Le numéro de téléphone est trop long.");
      return;
    }

    if (loading) return;

    setLoading(true);

    try {
      const userData = {
        name: trimmedName,
        role,
        phone: trimmedPhone || null,
        email: normalizedEmail,
        password,
      };

      // Appel API
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json().catch(() => ({}));

      // Gestion des erreurs HTTP
      if (!response.ok) {
        if (response.status === 409) {
          throw new Error("Cette adresse email est déjà utilisée.");
        }

        if (response.status === 400) {
          throw new Error(
            data.message || "Les informations fournies sont invalides."
          );
        }

        if (response.status === 429) {
          throw new Error(
            "Trop de tentatives. Réessaie dans quelques minutes."
          );
        }

        throw new Error(
          data.message || "Une erreur est survenue lors de l'inscription."
        );
      }

      // Vérifier la réponse du backend
      if (!data.success || !data.user) {
        throw new Error("La réponse du serveur est invalide.");
      }

      // Callback parent : ne pas connecter automatiquement
      if (onRegister) {
        await onRegister(data);
      }

      // Fermer Register
      onClose?.();

      // Notification de succès
      showToast?.("Votre compte a été créé avec succès !");

      // Ouvrir Login
      onLogin?.();

    } catch (err) {
      console.error("Erreur inscription :", err);

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

  // Styles
  const inputClass =
    "h-[40px] w-full rounded-md border border-[#d9ddd6] bg-white px-3 text-[12px] text-[#26372e] outline-none transition focus:border-[#244d3e] focus:ring-2 focus:ring-[#244d3e]/10 disabled:cursor-not-allowed disabled:opacity-60";

  const labelClass =
    "mb-[7px] block text-[11px] font-semibold text-[#45534a]";

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#30483b]/40 p-4 backdrop-blur-[6px]"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-[510px] overflow-y-auto rounded-[15px] bg-[#faf9f6] px-6 py-10 shadow-xl sm:px-[38px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fermer */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute right-4 top-3 z-10 text-[25px] text-[#34443a] disabled:opacity-40"
          aria-label="Fermer"
        >
          ×
        </button>

        {/* En-tête */}
        <p className="mb-5 text-[10px] font-bold tracking-[2px] text-[#74836b]">
          BIENVENUE CHEZ TRANO
        </p>

        <h2 className="mb-3 font-serif text-[29px] font-normal leading-tight text-[#304238] sm:text-[31px]">
          Votre histoire commence ici.
        </h2>

        <p className="mb-7 text-[12px] text-[#858780]">
          Créez votre compte en quelques instants.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Nom complet */}
          <div className="mb-[18px]">
            <label className={labelClass}>
              Nom complet
            </label>

            <input
              type="text"
              placeholder="Votre nom complet"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              maxLength={120}
              disabled={loading}
              autoComplete="name"
              className={inputClass}
            />
          </div>

          {/* Type de compte */}
          <div className="mb-[18px]">
            <label className={labelClass}>
              Je souhaite
            </label>

            <CustomDropdown
              options={USER_TYPES}
              value={role}
              onChange={setRole}
              placeholder="Sélectionner votre profil"
            />
          </div>

          {/* Téléphone */}
          <div className="mb-[18px]">
            <label className={labelClass}>
              Téléphone (facultatif)
            </label>

            <input
              type="tel"
              placeholder="Votre numéro de téléphone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={30}
              disabled={loading}
              autoComplete="tel"
              className={inputClass}
            />
          </div>

          {/* Email */}
          <div className="mb-[18px]">
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
          <div className="mb-[18px]">
            <label className={labelClass}>
              Mot de passe
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Créer un mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                maxLength={72}
                disabled={loading}
                autoComplete="new-password"
                className={`${inputClass} pr-11`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#858780] hover:text-[#214d3c]"
                aria-label={
                  showPassword
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
              >
                {showPassword ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>
            </div>
          </div>

          {/* Confirmation mot de passe */}
          <div className="mb-[22px]">
            <label className={labelClass}>
              Confirmer le mot de passe
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmer votre mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                autoComplete="new-password"
                className={`${inputClass} pr-11`}
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#858780] hover:text-[#214d3c]"
                aria-label={
                  showConfirmPassword
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
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

          {/* Bouton inscription */}
          <button
            type="submit"
            disabled={loading}
            className="flex h-[46px] w-full items-center justify-center gap-3 rounded-lg bg-[#214d3c] text-[12px] font-semibold text-white transition hover:bg-[#173b2d] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <LoaderCircle size={17} className="animate-spin" />
                Création du compte...
              </>
            ) : (
              <>
                Créer mon compte
                <span className="text-[19px]">→</span>
              </>
            )}
          </button>
        </form>

        {/* Connexion */}
        <p className="mt-7 text-center text-[11px] text-[#858780]">
          Déjà un compte ?

          <button
            type="button"
            onClick={onLogin}
            disabled={loading}
            className="ml-2 font-bold text-[#304d3e] underline hover:text-[#b07f32]"
          >
            Se connecter
          </button>
        </p>
      </div>
    </div>
  );
}
