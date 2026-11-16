
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Login({ onClose, onLogin, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Bloquer le scroll en arrière-plan
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ email, password });
  };

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
          className="absolute right-4 top-3 text-[25px] text-[#34443a] transition hover:rotate-90"
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
            <label className="mb-2 block text-[11px] font-semibold text-[#45534a]">
              Adresse email
            </label>

            <input
              type="email"
              placeholder="Votre adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-[42px] w-full rounded-md border border-[#d9ddd6] bg-white px-3 text-xs outline-none transition focus:border-[#244d3e] focus:ring-2 focus:ring-[#244d3e]/10"
            />
          </div>

          {/* Mot de passe */}
          <div className="mb-5">
            <label className="mb-2 block text-[11px] font-semibold text-[#45534a]">
              Mot de passe
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-[42px] w-full rounded-md border border-[#d9ddd6] bg-white px-3 pr-11 text-xs outline-none transition focus:border-[#244d3e] focus:ring-2 focus:ring-[#244d3e]/10"
              />

              {/* Bouton afficher / masquer */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#858780] transition hover:text-[#214d3c]"
                aria-label={
                  showPassword
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
                title={
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

          {/* Connexion */}
          <button
            type="submit"
            className="flex h-[46px] w-full items-center justify-center gap-3 rounded-lg bg-[#214d3c] text-xs font-semibold text-white transition hover:bg-[#173b2d]"
          >
            Se connecter
            <span className="text-lg">→</span>
          </button>
        </form>

        {/* Mot de passe oublié */}
        <div className="mt-3 text-center">
          <button
            type="button"
            className="text-[10px] text-[#7c8279] underline transition hover:text-[#214d3c]"
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
            className="ml-2 font-bold text-[#304d3e] underline transition hover:text-[#b07f32]"
            >
            S'inscrire
            </button>
        </p>
      </div>
    </div>
  );
}
