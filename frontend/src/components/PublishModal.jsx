
import { useEffect, useRef, useState } from "react";
import {
  X,
  MapPin,
  ImagePlus,
  ArrowLeft,
  ArrowRight,
  Check,
  Home,
  LoaderCircle,
  Trash2,
  Building2,
  Ruler,
  DoorOpen,
  Wallet,
  MapPinned,
  Images,
  ClipboardCheck,
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

const STEPS = [
  { label: "Logement", icon: Home },
  { label: "Localisation", icon: MapPin },
  { label: "Description", icon: Images },
  { label: "Récapitulatif", icon: ClipboardCheck },
];

function SummaryRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#edf1e7] text-[#244d40]">
        <Icon size={15} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-[#899187]">{label}</p>

        <p className="mt-1 break-words text-[12px] font-semibold text-[#244d40]">
          {value || "Non renseigné"}
        </p>
      </div>
    </div>
  );
}

export default function PublishModal({ onClose, onSubmit }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialForm);
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const photosRef = useRef(photos);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  // Bloquer le scroll et gérer Escape
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

  // Nettoyage des aperçus à la fermeture
  useEffect(() => {
    return () => {
      photosRef.current.forEach((photo) => {
        URL.revokeObjectURL(photo.preview);
      });
    };
  }, []);

  const inputClass =
    "mt-2 h-11 w-full rounded-lg border border-[#dfe3d8] bg-white px-3 text-[13px] text-[#244d40] outline-none transition focus:border-[#244d40] focus:ring-2 focus:ring-[#244d40]/10";

  const labelClass =
    "block text-[12px] font-semibold text-[#244d40]";

  const selectedType = PROPERTY_TYPES.find(
    (type) => type.value === formData.type_id
  );

  const updateField = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const updateType = (value) => {
    setFormData((previous) => ({
      ...previous,
      type_id: value,
    }));

    setError("");
  };

  const updateMapPosition = ({ lat, lng }) => {
    setFormData((previous) => ({
      ...previous,
      lat,
      lng,
    }));

    setError("");
  };

  // Validation de chaque étape
  const validateStep = () => {
    setError("");

    if (step === 1) {
      if (!formData.title.trim()) {
        setError("Veuillez saisir le titre de votre annonce.");
        return false;
      }

      if (!formData.type_id) {
        setError("Veuillez sélectionner un type de bien.");
        return false;
      }

      if (!formData.price || Number(formData.price) <= 0) {
        setError("Veuillez saisir un loyer valide.");
        return false;
      }

      if (!formData.surface || Number(formData.surface) <= 0) {
        setError("Veuillez saisir une surface valide.");
        return false;
      }

      if (!formData.rooms || Number(formData.rooms) <= 0) {
        setError("Veuillez saisir le nombre de pièces.");
        return false;
      }
    }

    if (step === 2) {
      if (!formData.city.trim()) {
        setError("Veuillez saisir la ville.");
        return false;
      }

      if (
        formData.lat !== "" &&
        (!Number.isFinite(Number(formData.lat)) ||
          Number(formData.lat) < -90 ||
          Number(formData.lat) > 90)
      ) {
        setError("Latitude invalide.");
        return false;
      }

      if (
        formData.lng !== "" &&
        (!Number.isFinite(Number(formData.lng)) ||
          Number(formData.lng) < -180 ||
          Number(formData.lng) > 180)
      ) {
        setError("Longitude invalide.");
        return false;
      }

      if (!!formData.lat !== !!formData.lng) {
        setError("Veuillez sélectionner une position complète sur la carte.");
        return false;
      }
    }

    if (step === 3) {
      if (formData.description.trim().length < 20) {
        setError("La description doit contenir au moins 20 caractères.");
        return false;
      }
    }

    return true;
  };

  const nextStep = () => {
    if (!validateStep()) return;

    setStep((previous) => Math.min(previous + 1, 4));
    setError("");
  };

  const previousStep = () => {
    setStep((previous) => Math.max(previous - 1, 1));
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

    setPhotos((previous) => [...previous, ...newPhotos]);
    setError("");
    e.target.value = "";
  };

  // Supprimer une photo
  const removePhoto = (index) => {
    setPhotos((previous) => {
      const photoToRemove = previous[index];

      if (photoToRemove) {
        URL.revokeObjectURL(photoToRemove.preview);
      }

      return previous.filter((_, i) => i !== index);
    });
  };

  // Confirmation finale
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step !== 4 || submitting) return;

    setSubmitting(true);
    setError("");

    try {
      const announcement = {
        ...formData,
        type_label: selectedType?.label || "",
        price: Number(formData.price),
        surface: Number(formData.surface),
        rooms: Number(formData.rooms),
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

  const formattedPrice = formData.price
    ? `${Number(formData.price).toLocaleString("fr-FR")} Ar`
    : "Non renseigné";

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
        className="relative flex max-h-[88vh] w-full max-w-[465px] flex-col overflow-hidden rounded-2xl bg-[#fffefa] shadow-2xl"
      >
        {/* Fermeture */}
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          aria-label="Fermer"
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full text-[#40564b] transition hover:bg-[#edf0e8] disabled:opacity-50"
        >
          <X size={19} />
        </button>

        <div className="overflow-y-auto px-6 pb-6 pt-9 sm:px-8">

          {/* En-tête */}
          <div className="mb-6">
            <p className="mb-3 text-[9px] font-bold uppercase tracking-[2px] text-[#879b70]">
              Espace propriétaire
            </p>

            <h2
              id="publish-title"
              className="max-w-[350px] font-serif text-[27px] leading-tight text-[#203c33]"
            >
              {step === 4
                ? "Vérifiez votre annonce"
                : "Un nouveau logement à découvrir"}
            </h2>

            <p className="mt-2 text-[11px] text-[#788178]">
              {step === 4
                ? "Vérifiez toutes les informations avant de confirmer."
                : "Complétez les informations en quatre étapes."}
            </p>
          </div>

          {/* Progression */}
          <div className="mb-7">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#244d40]">
                Étape {step} sur 4
              </span>

              <span className="text-[10px] text-[#879b70]">
                {Math.round((step / 4) * 100)} %
              </span>
            </div>

            <div className="flex gap-2">
              {[1, 2, 3, 4].map((number) => (
                <div
                  key={number}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    number <= step ? "bg-[#244d40]" : "bg-[#e7e9df]"
                  }`}
                />
              ))}
            </div>

            <div className="mt-3 grid grid-cols-4 gap-1">
              {STEPS.map((item, index) => {
                const Icon = item.icon;
                const active = step === index + 1;

                return (
                  <div
                    key={item.label}
                    className={`flex flex-col items-center gap-1 text-center ${
                      active ? "text-[#244d40]" : "text-[#92998e]"
                    }`}
                  >
                    <Icon size={15} />
                    <span className={`text-[8px] ${active ? "font-bold" : ""}`}>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit}>

            {/* ÉTAPE 1 : LOGEMENT */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Titre de l'annonce</label>

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
                    <label className={labelClass}>Type de bien</label>

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
                    <label className={labelClass}>Loyer mensuel (Ar)</label>

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
                    <label className={labelClass}>Surface (m²)</label>

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
                    <label className={labelClass}>Nombre de pièces</label>

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
            )}

            {/* ÉTAPE 2 : LOCALISATION */}
            {step === 2 && (
              <div className="space-y-5">
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
                        <label className={labelClass}>Quartier / adresse</label>

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

                <MapPicker
                latitude={formData.latitude}
                longitude={formData.longitude}
                onChange={({ latitude, longitude }) => {
                    setFormData((prev) => ({
                    ...prev,
                    latitude,
                    longitude,
                    }));
                }}
                />
              </div>
            )}

            {/* ÉTAPE 3 : DESCRIPTION ET PHOTOS */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Description</label>

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
                </div>

                <div>
                  <label className={labelClass}>Photos du logement</label>

                  <label className="mt-2 flex min-h-[130px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#bdcdb5] bg-[#f5f6ef] px-4 py-5 text-center transition hover:bg-[#edf1e7]">
                    <ImagePlus
                      size={25}
                      className="mb-2 text-[#244d40]"
                    />

                    <span className="text-[12px] font-semibold text-[#244d40]">
                      Ajouter des photos
                    </span>

                    <span className="mt-2 text-[9px] text-[#899187]">
                      JPEG, PNG ou WebP · 5 Mo maximum par photo
                    </span>

                    <span className="mt-1 text-[9px] text-[#899187]">
                      10 photos maximum
                    </span>

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={handlePhotos}
                      disabled={photos.length >= 10}
                      className="mt-4 max-w-full text-[10px]"
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
              </div>
            )}

            {/* ÉTAPE 4 : RÉCAPITULATIF */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="rounded-xl bg-[#f5f6ef] p-4">
                  <div className="flex items-center gap-2">
                    <ClipboardCheck size={19} className="text-[#244d40]" />

                    <div>
                      <p className="text-[12px] font-bold text-[#244d40]">
                        Votre annonce est prête
                      </p>

                      <p className="mt-1 text-[9px] text-[#788178]">
                        Vérifiez les informations avant confirmation.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-[#e2e6da] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-[#879b70]">
                        Votre logement
                      </p>

                      <h3 className="mt-2 break-words font-serif text-[21px] leading-tight text-[#203c33]">
                        {formData.title}
                      </h3>

                      <p className="mt-2 text-[11px] text-[#788178]">
                        {selectedType?.label} · {formData.city}
                      </p>
                    </div>

                    <div className="shrink-0 rounded-lg bg-[#edf1e7] px-3 py-2 text-right">
                      <p className="text-[8px] text-[#788178]">
                        Loyer mensuel
                      </p>

                      <p className="mt-1 text-[12px] font-bold text-[#244d40]">
                        {formattedPrice}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-[#e2e6da] px-4">
                  <SummaryRow
                    icon={Building2}
                    label="Type de bien"
                    value={selectedType?.label}
                  />

                  <div className="border-t border-[#edf0e8]" />

                  <SummaryRow
                    icon={Wallet}
                    label="Loyer mensuel"
                    value={formattedPrice}
                  />

                  <div className="border-t border-[#edf0e8]" />

                  <SummaryRow
                    icon={Ruler}
                    label="Surface"
                    value={`${formData.surface} m²`}
                  />

                  <div className="border-t border-[#edf0e8]" />

                  <SummaryRow
                    icon={DoorOpen}
                    label="Nombre de pièces"
                    value={formData.rooms}
                  />
                </div>

                <div className="rounded-xl border border-[#e2e6da] p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <MapPinned size={16} className="text-[#244d40]" />

                    <p className="text-[11px] font-semibold text-[#244d40]">
                      Localisation
                    </p>
                  </div>

                  <p className="text-[12px] font-semibold text-[#40564b]">
                    {formData.city}
                  </p>

                  <p className="mt-1 text-[10px] text-[#788178]">
                    {formData.address || "Adresse non renseignée"}
                  </p>

                  {formData.lat && formData.lng && (
                    <p className="mt-3 text-[9px] text-[#899187]">
                      Latitude : {formData.lat}
                      <br />
                      Longitude : {formData.lng}
                    </p>
                  )}
                </div>

                <div className="rounded-xl border border-[#e2e6da] p-4">
                  <p className="mb-2 text-[11px] font-semibold text-[#244d40]">
                    Description
                  </p>

                  <p className="whitespace-pre-wrap text-[11px] leading-relaxed text-[#788178]">
                    {formData.description}
                  </p>
                </div>

                <div className="rounded-xl border border-[#e2e6da] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Images size={16} className="text-[#244d40]" />

                      <p className="text-[11px] font-semibold text-[#244d40]">
                        Photos du logement
                      </p>
                    </div>

                    <span className="text-[9px] text-[#899187]">
                      {photos.length}/10
                    </span>
                  </div>

                  {photos.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {photos.map((photo, index) => (
                        <div
                          key={`${photo.file.name}-${index}`}
                          className="relative aspect-square overflow-hidden rounded-lg"
                        >
                          <img
                            src={photo.preview}
                            alt={`Photo ${index + 1}`}
                            className="h-full w-full object-cover"
                          />

                          {index === 0 && (
                            <span className="absolute bottom-0 left-0 right-0 bg-[#244d40]/90 py-1 text-center text-[8px] font-semibold text-white">
                              Principale
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-[#899187]">
                      Aucune photo ajoutée.
                    </p>
                  )}
                </div>

                <div className="rounded-xl border border-[#cbd7c4] bg-[#f5f6ef] p-3">
                  <p className="text-[10px] leading-relaxed text-[#40564b]">
                    Vérifiez attentivement toutes les informations.
                    Vous pourrez revenir aux étapes précédentes pour
                    effectuer des modifications avant de confirmer.
                  </p>
                </div>
              </div>
            )}

            {/* Erreur */}
            {error && (
              <div
                role="alert"
                className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-[11px] text-red-600"
              >
                {error}
              </div>
            )}

            {/* Navigation */}
            <div className="mt-6 flex items-center gap-3 border-t border-[#ecece4] pt-5">
              {step > 1 && (
                <button
                  type="button"
                  onClick={previousStep}
                  disabled={submitting}
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-[#dfe3d8] text-[11px] font-semibold text-[#40564b] transition hover:bg-[#f5f6ef]"
                >
                  <ArrowLeft size={15} />
                  Précédent
                </button>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#244d40] text-[11px] font-semibold text-white transition hover:bg-[#193d32]"
                >
                  Suivant
                  <ArrowRight size={15} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#244d40] text-[11px] font-semibold text-white transition hover:bg-[#193d32] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <LoaderCircle size={16} className="animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      Confirmer et enregistrer
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
