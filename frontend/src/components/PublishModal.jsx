
import { useEffect, useRef, useState } from "react";
import {
  X,
  ImagePlus,
  Trash2,
  LoaderCircle,
  Check,
  ArrowDown,
} from "lucide-react";

import CustomDropdown from "./ui/CustomDropdown";
import MapPicker from "./ui/MapPicker";

const PROPERTY_TYPES = [
  { value: "appartement", label: "Appartement" },
  { value: "maison", label: "Maison" },
  { value: "studio", label: "Studio" },
  { value: "villa", label: "Villa" },
  { value: "terrain", label: "Terrain" },
  { value: "bureau", label: "Bureau" },
  { value: "local_commercial", label: "Local commercial" },
];

const initialForm = {
  title: "",
  type_id: "",
  price: "",
  surface: "",
  rooms: "",
  city: "",
  address: "",
  lat: "",
  lng: "",
  description: "",
};

export default function PublishModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState(initialForm);
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [hasMoreContent, setHasMoreContent] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const scrollRef = useRef(null);
  const contentRef = useRef(null);
  const photosRef = useRef(photos);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  // Bloquer le scroll de la page
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape" && !submitting) {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, submitting]);

  // Nettoyage des aperçus des photos
  useEffect(() => {
    return () => {
      photosRef.current.forEach((photo) => {
        URL.revokeObjectURL(photo.preview);
      });
    };
  }, []);

  // Détection automatique du contenu à défiler
  useEffect(() => {
    const container = scrollRef.current;
    const content = contentRef.current;

    if (!container || !content) return;

    const checkScroll = () => {
      const hasOverflow =
        container.scrollHeight > container.clientHeight + 10;

      const atBottom =
        container.scrollHeight - container.scrollTop <=
        container.clientHeight + 10;

      setHasMoreContent(hasOverflow);
      setIsAtBottom(atBottom);
    };

    checkScroll();

    const observer = new ResizeObserver(checkScroll);

    observer.observe(container);
    observer.observe(content);

    window.addEventListener("resize", checkScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  // Gestion du défilement
  const handleScroll = () => {
    const container = scrollRef.current;

    if (!container) return;

    const atBottom =
      container.scrollHeight - container.scrollTop <=
      container.clientHeight + 10;

    setIsAtBottom(atBottom);
  };

  const inputClass =
    "mt-2 h-11 w-full rounded-lg border border-[#dfe3d8] bg-white px-3 text-[13px] text-[#244d40] outline-none transition focus:border-[#244d40] focus:ring-2 focus:ring-[#244d40]/10";

  const labelClass =
    "block text-[12px] font-semibold text-[#244d40]";

  // Mise à jour des champs
  const updateField = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // Mise à jour du type de logement
  const updateType = (value) => {
    setFormData((prev) => ({
      ...prev,
      type_id: value,
    }));

    setError("");
  };

  // Mise à jour de la position
  const updateMapPosition = ({ latitude, longitude }) => {
    setFormData((prev) => ({
      ...prev,
      lat: latitude,
      lng: longitude,
    }));

    setError("");
  };

  // Ajouter des photos
  const handlePhotos = (e) => {
    const files = Array.from(e.target.files || []);

    if (photos.length + files.length > 10) {
      setError("Vous pouvez ajouter 10 photos maximum.");
      e.target.value = "";
      return;
    }

    const invalidFile = files.find(
      (file) =>
        !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
        file.size > 5 * 1024 * 1024
    );

    if (invalidFile) {
      setError("Format invalide ou photo supérieure à 5 Mo.");
      e.target.value = "";
      return;
    }

    const newPhotos = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setPhotos((prev) => [...prev, ...newPhotos]);

    setError("");
    e.target.value = "";
  };

  // Supprimer une photo
  const removePhoto = (index) => {
    setPhotos((prev) => {
      const photo = prev[index];

      if (photo) {
        URL.revokeObjectURL(photo.preview);
      }

      return prev.filter((_, i) => i !== index);
    });
  };

  // Enregistrement de l'annonce
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.title.trim()) {
      setError("Veuillez saisir le titre de votre annonce.");
      return;
    }

    if (!formData.type_id) {
      setError("Veuillez sélectionner un type de bien.");
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      setError("Veuillez saisir un loyer valide.");
      return;
    }

    if (!formData.surface || Number(formData.surface) <= 0) {
      setError("Veuillez saisir une surface valide.");
      return;
    }

    if (!formData.rooms || Number(formData.rooms) <= 0) {
      setError("Veuillez saisir le nombre de pièces.");
      return;
    }

    if (!formData.city.trim()) {
      setError("Veuillez saisir la ville.");
      return;
    }

    if (formData.description.trim().length < 20) {
      setError("La description doit contenir au moins 20 caractères.");
      return;
    }

    if (
      formData.lat !== "" &&
      (!Number.isFinite(Number(formData.lat)) ||
        Number(formData.lat) < -90 ||
        Number(formData.lat) > 90)
    ) {
      setError("Latitude invalide.");
      return;
    }

    if (
      formData.lng !== "" &&
      (!Number.isFinite(Number(formData.lng)) ||
        Number(formData.lng) < -180 ||
        Number(formData.lng) > 180)
    ) {
      setError("Longitude invalide.");
      return;
    }

    if (!!formData.lat !== !!formData.lng) {
      setError("Veuillez sélectionner une position complète sur la carte.");
      return;
    }

    if (submitting) return;

    setSubmitting(true);

    try {
      const selectedType = PROPERTY_TYPES.find(
        (type) => type.value === formData.type_id
      );

      const announcement = {
        ...formData,
        type_label: selectedType?.label || "",
        price: Number(formData.price),
        surface: Number(formData.surface),
        rooms: Number(formData.rooms),
        lat: formData.lat === "" ? null : Number(formData.lat),
        lng: formData.lng === "" ? null : Number(formData.lng),
        currency: "MGA",
        status: "brouillon",
        photos: photos.map((photo) => photo.file),
        createdAt: new Date().toISOString(),
      };

      await onSubmit?.(announcement);
    } catch (err) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#15271f]/40 p-3 backdrop-blur-md sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !submitting) {
          onClose?.();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="publish-title"
        className="relative flex max-h-[90vh] w-full max-w-[600px] flex-col overflow-hidden rounded-2xl bg-[#fffefa] shadow-2xl"
      >
        {/* Fermeture */}
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          aria-label="Fermer"
          className="absolute right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full text-[#40564b] transition hover:bg-[#edf0e8] disabled:opacity-50"
        >
          <X size={19} />
        </button>

        {/* Contenu scrollable */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="min-h-0 flex-1 overflow-y-auto px-6 pb-8 pt-9 sm:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div ref={contentRef}>
            {/* En-tête */}
            <div className="mb-7 pr-8">
              <p className="mb-3 text-[9px] font-bold uppercase tracking-[2px] text-[#879b70]">
                Espace propriétaire
              </p>

              <h2
                id="publish-title"
                className="font-serif text-[27px] leading-tight text-[#203c33]"
              >
                Publier une annonce
              </h2>

              <p className="mt-2 text-[11px] leading-relaxed text-[#788178]">
                Présentez votre logement et ajoutez toutes les informations nécessaires.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations du logement */}
              <div>
                <h3 className="mb-4 text-[13px] font-bold text-[#244d40]">
                  Informations du logement
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>
                      Titre de l'annonce
                    </label>

                    <input
                      name="title"
                      value={formData.title}
                      onChange={updateField}
                      maxLength={160}
                      placeholder="Ex : Bel appartement moderne..."
                      className={inputClass}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>
                        Type de bien
                      </label>

                      <div className="mt-2">
                        <CustomDropdown
                          options={PROPERTY_TYPES}
                          value={formData.type_id}
                          onChange={updateType}
                          placeholder="Sélectionner"
                          size="md"
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>
                        Loyer mensuel (Ar)
                      </label>

                      <input
                        type="number"
                        name="price"
                        min="1"
                        value={formData.price}
                        onChange={updateField}
                        placeholder="500000"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Surface (m²)
                      </label>

                      <input
                        type="number"
                        name="surface"
                        min="1"
                        value={formData.surface}
                        onChange={updateField}
                        placeholder="85"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Nombre de pièces
                      </label>

                      <input
                        type="number"
                        name="rooms"
                        min="1"
                        value={formData.rooms}
                        onChange={updateField}
                        placeholder="3"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#ecece4]" />

              {/* Localisation */}
              <div>
                <h3 className="mb-4 text-[13px] font-bold text-[#244d40]">
                  Localisation
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Ville</label>

                    <input
                      name="city"
                      value={formData.city}
                      onChange={updateField}
                      maxLength={100}
                      placeholder="Ex : Antananarivo"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Quartier / adresse
                    </label>

                    <input
                      name="address"
                      value={formData.address}
                      onChange={updateField}
                      maxLength={255}
                      placeholder="Ex : Ankorondrano"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <MapPicker
                    latitude={formData.lat}
                    longitude={formData.lng}
                    onChange={updateMapPosition}
                  />
                </div>
              </div>

              <div className="border-t border-[#ecece4]" />

              {/* Description et photos */}
              <div>
                <h3 className="mb-4 text-[13px] font-bold text-[#244d40]">
                  Description et photos
                </h3>

                <label className={labelClass}>
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={updateField}
                  rows={5}
                  maxLength={3000}
                  placeholder="Décrivez votre logement, ses équipements, son environnement et ses avantages..."
                  className="mt-2 w-full resize-y rounded-lg border border-[#dfe3d8] bg-white p-3 text-[13px] text-[#244d40] outline-none transition focus:border-[#244d40] focus:ring-2 focus:ring-[#244d40]/10"
                />

                <p className="mt-1 text-right text-[9px] text-[#899187]">
                  {formData.description.length}/3000 caractères
                </p>

                <label className={`${labelClass} mt-5`}>
                  Photos du logement
                </label>


                <label
                  className={`group mt-2 flex min-h-[155px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-4 py-6 text-center transition-all duration-300 ${
                    photos.length >= 10
                      ? "cursor-not-allowed border-[#dfe3d8] bg-[#f5f6ef] opacity-60"
                      : "border-[#bdcdb5] bg-[#f8f9f4] hover:border-[#244d40] hover:bg-[#f0f3eb]"
                  }`}
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#e9eee4] text-[#244d40] transition-transform duration-300 group-hover:scale-105">
                    <ImagePlus size={23} strokeWidth={1.7} />
                  </div>

                  <span className="text-[12px] font-semibold text-[#244d40]">
                    Ajouter des photos du logement
                  </span>

                  <span className="mt-1.5 text-[10px] text-[#899187]">
                    Glissez vos images ou sélectionnez-les depuis votre appareil
                  </span>

                  <span className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#244d40] px-4 py-2 text-[10px] font-semibold text-white shadow-sm transition group-hover:bg-[#193d32]">
                    <ImagePlus size={13} />
                    Parcourir les photos
                  </span>

                  <span className="mt-3 text-[9px] text-[#899187]">
                    JPEG, PNG, WebP · 5 Mo maximum par photo
                  </span>

                  <span className="mt-1 text-[9px] font-medium text-[#879b70]">
                    {photos.length}/10 photos sélectionnées
                  </span>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handlePhotos}
                    disabled={photos.length >= 10}
                    className="hidden"
                  />
                </label>


                {photos.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {photos.map((photo, index) => (
                      <div
                        key={`${photo.file.name}-${index}`}
                        className="group relative aspect-square overflow-hidden rounded-lg"
                      >
                        <img
                          src={photo.preview}
                          alt={`Photo ${index + 1}`}
                          className="h-full w-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          aria-label="Supprimer cette photo"
                          className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-red-600 shadow transition hover:bg-white"
                        >
                          <Trash2 size={14} />
                        </button>

                        {index === 0 && (
                          <span className="absolute bottom-0 left-0 right-0 bg-[#244d40]/90 py-1 text-center text-[9px] font-semibold text-white">
                            Photo principale
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <p className="mt-2 text-[9px] text-[#899187]">
                  {photos.length}/10 photos sélectionnées.
                </p>
              </div>

              {/* Erreur */}
              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 p-3 text-[11px] text-red-600"
                >
                  {error}
                </div>
              )}

              {/* Boutons */}
              <div className="flex gap-3 border-t border-[#ecece4] pt-5">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="flex h-11 flex-1 items-center justify-center rounded-xl border border-[#dfe3d8] text-[11px] font-semibold text-[#40564b] transition hover:bg-[#f5f6ef]"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#244d40] text-[11px] font-semibold text-white transition hover:bg-[#193d32] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <LoaderCircle
                        size={16}
                        className="animate-spin"
                      />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      Publier l'annonce
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Indicateur de défilement */}
        {hasMoreContent && !isAtBottom && (
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 flex flex-col items-center bg-gradient-to-t from-[#fffefa] via-[#fffefa]/95 to-transparent pb-5 pt-12">
            <div className="flex items-center gap-2 rounded-full border border-[#e6e9df] bg-white/95 px-4 py-2 shadow-sm backdrop-blur-sm">
              <span className="text-[9px] font-medium tracking-wide text-[#788178]">
                Faites défiler pour découvrir la suite
              </span>

              <ArrowDown
                size={13}
                className="animate-bounce text-[#244d40]"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
