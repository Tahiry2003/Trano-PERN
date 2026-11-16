
import React, { useEffect, useState } from "react";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

const SERVER_URL = API_URL.replace(/\/api$/, "");

const ProfilPage = ({ onUserUpdated }) => {
  const [formData, setFormData] = useState({
    nom: "",
    ville: "",
    bio: "",
    email: "",
    telephone: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [role, setRole] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Convertir le rôle de la base de données en libellé lisible
  const getRoleLabel = (userRole) => {
    const roles = {
      locataire: "Locataire",
      proprietaire: "Propriétaire",
      recherche: "Locataire",
      publication: "Propriétaire",
    };

    return roles[userRole] || userRole || "Rôle non défini";
  };

  // Récupérer le profil depuis PostgreSQL
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Vous devez être connecté pour consulter votre profil.");
        setLoading(false);
        return;
      }

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

        const user = data.user;

        if (!user) {
          throw new Error("Les informations du profil sont introuvables.");
        }

        setFormData({
          nom: user.name || "",
          ville: user.city || "",
          bio: user.bio || "",
          email: user.email || "",
          telephone: user.phone || "",
        });

        setRole(user.role || "");

        if (user.avatar_path) {
          setAvatarPreview(
            user.avatar_path.startsWith("http")
              ? user.avatar_path
              : `${SERVER_URL}${user.avatar_path}`
          );
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Libérer les URL temporaires de prévisualisation
  useEffect(() => {
    return () => {
      if (avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  // Modifier les champs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Choisir une photo
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Format invalide. Utilisez JPG, PNG ou WebP.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("La photo ne doit pas dépasser 5 Mo.");
      e.target.value = "";
      return;
    }

    setError("");
    setSuccess("");
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  // Enregistrer le profil
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Votre session a expiré. Veuillez vous reconnecter.");
      return;
    }

    setSaving(true);

    try {
      const payload = new FormData();

      payload.append("name", formData.nom.trim());
      payload.append("email", formData.email.trim());
      payload.append("phone", formData.telephone.trim());
      payload.append("city", formData.ville.trim());
      payload.append("bio", formData.bio.trim());

      if (avatarFile) {
        payload.append("avatar", avatarFile);
      }

      const response = await fetch(`${API_URL}/users/me`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Erreur lors de la modification."
        );
      }

      const updatedUser = data.user;

      if (!updatedUser) {
        throw new Error("Le serveur n'a pas retourné le profil modifié.");
      }

      setFormData({
        nom: updatedUser.name || "",
        ville: updatedUser.city || "",
        bio: updatedUser.bio || "",
        email: updatedUser.email || "",
        telephone: updatedUser.phone || "",
      });

      // Actualiser le rôle
      setRole(updatedUser.role || "");

      setAvatarFile(null);

      if (updatedUser.avatar_path) {
        const avatarUrl = updatedUser.avatar_path.startsWith("http")
          ? updatedUser.avatar_path
          : `${SERVER_URL}${updatedUser.avatar_path}`;

        setAvatarPreview(`${avatarUrl}?t=${Date.now()}`);
      }

      // Mettre à jour les informations globales
      if (onUserUpdated) {
        onUserUpdated(updatedUser);
      }

      localStorage.setItem("user", JSON.stringify(updatedUser));

      setSuccess("Votre profil a été mis à jour avec succès.");

    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const initial =
    formData.nom.trim().charAt(0).toUpperCase() || "?";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9F9F9]">
        <p className="text-sm text-gray-500">
          Chargement de votre profil...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] font-sans text-[#1A1A1A]">

      {/* CONTENU PRINCIPAL */}
      <main className="mx-auto max-w-6xl px-6 py-12">

        {/* EN-TÊTE */}
        <div className="mb-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
            Votre espace trano
          </p>

          <h1 className="mb-3 font-serif text-5xl text-[#1A1A1A]">
            Votre profil
          </h1>

          <p className="text-sm text-gray-500">
            Une présentation qui vous ressemble, des échanges plus simples.
          </p>
        </div>

        {/* MESSAGES */}
        {error && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <div className="flex flex-col items-start gap-12 lg:flex-row">

          {/* CARTE DE PROFIL */}
          <div className="flex w-full flex-col items-center rounded-xl bg-[#EEF2ED] p-8 text-center lg:w-[320px]">

            <div className="mb-6 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-[#E2EAE0]">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Photo de profil"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="font-serif text-5xl text-[#2C5E4A]">
                  {initial}
                </span>
              )}
            </div>

            <h2 className="mb-1 font-serif text-2xl text-[#1A1A1A]">
              {formData.nom || "Votre nom"}
            </h2>

            {/* RÔLE RÉEL DEPUIS POSTGRESQL */}
            <p className="mb-6 text-xs text-gray-500">
              {getRoleLabel(role)}
            </p>

            <p className="mb-8 w-full border-b border-[#DCE4DA] pb-8 text-sm italic text-gray-500">
              {formData.ville || "Votre ville à renseigner"}
            </p>

            <p className="text-xs leading-relaxed text-gray-500">
              Votre nom, votre photo et votre présentation sont visibles sur
              votre profil. Vos coordonnées restent réservées
              aux échanges et aux locations.
            </p>
          </div>

          {/* FORMULAIRE */}
          <div className="w-full flex-1">
            <form onSubmit={handleSubmit}>

              {/* SECTION PUBLIQUE */}
              <div className="mb-10">
                <h3 className="mb-1 text-lg font-semibold">
                  Un profil qui vous ressemble
                </h3>

                <p className="mb-6 text-sm text-gray-500">
                  Présentez-vous et facilitez vos prochains échanges.
                </p>

                {/* PHOTO */}
                <div className="mb-8 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#E8F0EA]">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Photo de profil"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="font-serif text-xl text-[#2C5E4A]">
                        {initial}
                      </span>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="avatar"
                      className="mb-1.5 inline-block cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50"
                    >
                      Choisir une photo
                    </label>

                    <input
                      id="avatar"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />

                    <p className="text-[11px] text-gray-400">
                      JPEG, PNG ou WebP - 5 Mo maximum
                    </p>
                  </div>
                </div>

                {/* NOM ET VILLE */}
                <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Nom complet
                    </label>

                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      required
                      minLength={2}
                      maxLength={120}
                      className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-[#2C5E4A] focus:outline-none focus:ring-1 focus:ring-[#2C5E4A]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Ville
                    </label>

                    <input
                      type="text"
                      name="ville"
                      value={formData.ville}
                      onChange={handleChange}
                      maxLength={100}
                      className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-[#2C5E4A] focus:outline-none focus:ring-1 focus:ring-[#2C5E4A]"
                    />
                  </div>
                </div>

                {/* BIO */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Quelques mots sur vous
                  </label>

                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    maxLength={1000}
                    placeholder="Votre présentation, votre approche de la location..."
                    className="w-full resize-none rounded-md border border-gray-300 px-4 py-3 text-sm focus:border-[#2C5E4A] focus:outline-none focus:ring-1 focus:ring-[#2C5E4A]"
                  />

                  <p className="mt-1 text-right text-xs text-gray-400">
                    {formData.bio.length}/1000
                  </p>
                </div>
              </div>

              <hr className="mb-8 border-gray-200" />

              {/* SECTION PRIVÉE */}
              <div className="mb-8">
                <h3 className="mb-6 text-lg font-semibold">
                  Vos coordonnées privées
                </h3>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Adresse email
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      maxLength={190}
                      className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-[#2C5E4A] focus:outline-none focus:ring-1 focus:ring-[#2C5E4A]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Téléphone
                    </label>

                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      required
                      maxLength={30}
                      className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-[#2C5E4A] focus:outline-none focus:ring-1 focus:ring-[#2C5E4A]"
                    />
                  </div>
                </div>
              </div>

              {/* ENREGISTRER */}
              <button
                type="submit"
                disabled={saving}
                className="rounded-md bg-[#2C5E4A] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#234A3A] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Enregistrement..."
                  : "Enregistrer mon profil"}
              </button>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilPage;
