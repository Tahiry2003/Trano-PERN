
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import CustomDropdown from "../ui/CustomDropdown";

import {
  Heart,
  LayoutGrid,
  Map,
  MapPin,
  ArrowUpRight,
  BedDouble,
  Maximize2,
  X,
  ArrowRight,
  Home,
} from "lucide-react";

const properties = [
  {
    id: 1,
    type: "Maison",
    title: "Maison familiale",
    location: "Antananarivo",
    rooms: 4,
    surface: 120,
    price: "850 000 Ar",
    period: "/ mois",
    style: "from-[#eee5d5] to-[#e1d1b9]",
    accent: "#d8bfa0",
    description:
      "Installez-vous dans un logement agréable, situé à Ambatobe. Un espace lumineux et bien agencé, idéal pour profiter du quotidien en toute tranquillité.\n\nLe logement dispose d'une cuisine, de rangements et d'un accès indépendant. Commerces et transports à proximité.\n\nVisites sur rendez-vous. Contactez le propriétaire pour connaître les conditions de location et organiser une visite.",
    owner: {
      name: "Hardí Rakoto",
      role: "Propriétaire · Pas encore d'avis",
      initial: "H",
    },
  },
  {
    id: 2,
    type: "Appartement",
    title: "Appartement moderne",
    location: "Antananarivo",
    rooms: 3,
    surface: 85,
    price: "À découvrir",
    period: "",
    style: "from-[#e9e9dc] to-[#d8dfd0]",
    accent: "#b7c4ad",
    description:
      "Bel appartement moderne au cœur de la ville. Proche de toutes commodités.",
    owner: {
      name: "Sarah Martin",
      role: "Propriétaire",
      initial: "S",
    },
  },
  {
    id: 3,
    type: "Studio",
    title: "Studio lumineux",
    location: "Toamasina",
    rooms: 1,
    surface: 35,
    price: "À découvrir",
    period: "",
    style: "from-[#eee0d4] to-[#e5cbb9]",
    accent: "#d6b5a1",
    description:
      "Studio idéal pour étudiant ou jeune actif. Très lumineux.",
    owner: {
      name: "Jean Dupont",
      role: "Propriétaire",
      initial: "J",
    },
  },
];

const SORT_OPTIONS = [
  { value: "recent", label: "Les plus récentes" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
];

// Convertit "850 000 Ar" en nombre.
// Retourne null lorsque le prix est inconnu.
function getNumericPrice(price) {
  const numericPrice = Number(price.replace(/[^\d]/g, ""));

  return Number.isFinite(numericPrice) && numericPrice > 0
    ? numericPrice
    : null;
}

// --------------------------------------------------
// VISUALISATION DU LOGEMENT
// --------------------------------------------------

function PropertyVisual({ property, isModal = false }) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${
        property.style
      } ${
        isModal
          ? "aspect-[2.2/1] w-full"
          : "aspect-[1.55/1] rounded-t-xl"
      }`}
    >
      <div className="absolute right-[15%] top-[8%] h-14 w-14 rounded-full bg-[#fff8df]" />

      <div className="absolute bottom-0 h-[35%] w-full bg-[#d5d0bd]/50" />

      {/* Decorative building */}
      <div
        className={`relative mt-5 shadow-lg ${
          isModal ? "h-[70%] w-[50%]" : "h-[65%] w-[66%]"
        }`}
      >
        <div className="absolute -top-4 left-0 h-5 w-full -skew-y-6 bg-[#f7f1e5]" />

        <div className="flex h-full items-center justify-center gap-2 bg-[#e8d8c2] p-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-[65%] flex-1 border-[3px] border-[#f8f0e3] bg-[#78918a]"
            />
          ))}
        </div>

        <div
          className="absolute -bottom-2 left-0 h-3 w-full"
          style={{ backgroundColor: property.accent }}
        />
      </div>

      {!isModal && (
        <span className="absolute left-4 top-4 rounded-md bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-[#344b3c]">
          {property.type}
        </span>
      )}
    </div>
  );
}

// --------------------------------------------------
// MODALE DU LOGEMENT
// --------------------------------------------------

function PropertyModal({ property, onClose }) {
  useEffect(() => {
    if (!property) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [property]);

  if (!property) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-[700px] flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bouton Fermer */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer la fenêtre"
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-sm transition-colors hover:bg-white hover:text-gray-900"
        >
          <X size={18} />
        </button>

        {/* Contenu défilable */}
        <div className="overflow-y-auto overflow-x-hidden">
          <PropertyVisual property={property} isModal />

          <div className="p-6 sm:p-8">
            {/* Localisation */}
            <p className="flex items-center gap-1.5 text-[12px] text-gray-500">
              <MapPin size={14} />
              {property.location}
            </p>

            {/* Titre et prix */}
            <h2 className="mt-3 font-serif text-2xl text-[#263d33] sm:text-3xl">
              {property.title === "Maison familiale"
                ? "Une maison au calme, proche de la ville"
                : property.title}
            </h2>

            <p className="mt-2 text-xl font-medium text-[#263d33]">
              {property.price}
              <span className="text-sm font-normal text-gray-500">
                {" "}{property.period}
              </span>
            </p>

            {/* Caractéristiques */}
            <div className="mt-5 flex flex-wrap items-center gap-5 border-y border-gray-100 py-4 text-[13px] text-gray-600">
              <span className="flex items-center gap-1.5">
                <Home size={16} className="text-gray-400" />
                {property.type}
              </span>

              <span className="flex items-center gap-1.5">
                <BedDouble size={16} className="text-gray-400" />
                {property.rooms} pièces
              </span>

              <span className="flex items-center gap-1.5">
                <Maximize2 size={16} className="text-gray-400" />
                {property.surface} m²
              </span>
            </div>

            {/* Propriétaire */}
            <div className="mt-5 flex items-center justify-between rounded-lg border border-[#e3e9d9] bg-[#f6f8f3] p-3 sm:p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e1e8d5] font-semibold text-[#4a6844]">
                  {property.owner.initial}
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#263d33]">
                    {property.owner.name}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    {property.owner.role}
                  </p>
                </div>
              </div>

              <button
                type="button"
                aria-label="Contacter le propriétaire"
                className="text-gray-500 hover:text-gray-800"
              >
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Description */}
            <div className="mt-7">
              <h3 className="text-sm font-bold text-[#263d33]">
                Un peu plus sur ce logement
              </h3>

              <div className="mt-3 space-y-3 text-[13px] leading-relaxed text-gray-600">
                {property.description.split("\n").map((paragraph, idx) =>
                  paragraph.trim() !== "" ? (
                    <p key={idx}>{paragraph}</p>
                  ) : null
                )}
              </div>
            </div>

            {/* Localisation */}
            <div className="mt-8 border-t border-gray-100 pt-6">
              <h3 className="flex items-center gap-2 text-sm font-bold text-[#263d33]">
                <MapPin size={16} />
                Où se trouve ce logement ?
              </h3>

              <div className="mt-3 rounded-lg border border-[#e3e9d9] bg-[#f6f8f3] p-4">
                <p className="text-sm font-medium text-[#263d33]">
                  {property.location}
                </p>

                <p className="mt-1 text-[11px] text-gray-500">
                  Le propriétaire n'a pas encore placé de repère sur la carte.
                </p>
              </div>
            </div>

            {/* Planifier une visite */}
            <div className="mt-8 rounded-xl border border-[#e3e9d9] bg-[#f4f6ed] p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#64805e]">
                Rencontrons-nous
              </p>

              <h3 className="mt-1 font-serif text-xl text-[#263d33]">
                Planifier une visite
              </h3>

              <p className="mt-2 text-[13px] text-gray-600">
                Aucun créneau n'est proposé pour le moment. Vous pouvez
                envoyer une demande d'intérêt au propriétaire.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 bg-white p-4 sm:px-8 sm:py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#2b4d3e] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#1e3a2e]"
            >
              Je suis intéressé
              <ArrowRight size={16} />
            </button>

            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Heart size={16} />
              Enregistrer
            </button>
          </div>

          <p className="mt-3 text-center text-[10px] text-gray-400">
            Échangez avec le propriétaire pour organiser une visite.
          </p>
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------
// FEATURED PROPERTIES
// --------------------------------------------------

export default function FeaturedProperties() {
  // Hooks React : toujours à l'intérieur du composant
  const [favorites, setFavorites] = useState([]);
  const [view, setView] = useState("list");
  const [sort, setSort] = useState("recent");
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Tri des logements
  const sortedProperties = useMemo(() => {
    const result = [...properties];

    if (sort === "recent") {
      return result.sort((a, b) => b.id - a.id);
    }

    if (sort === "price-asc" || sort === "price-desc") {
      return result.sort((a, b) => {
        const priceA = getNumericPrice(a.price);
        const priceB = getNumericPrice(b.price);

        // Prix inconnus à la fin
        if (priceA === null && priceB === null) return 0;
        if (priceA === null) return 1;
        if (priceB === null) return -1;

        return sort === "price-asc"
          ? priceA - priceB
          : priceB - priceA;
      });
    }

    return result;
  }, [sort]);

  // Gestion des favoris
  const toggleFavorite = (id) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  return (
    <section className="mx-auto max-w-[1200px] px-5 pb-20 pt-8 lg:px-0">

      {/* Section heading */}
      <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-[9px] font-bold uppercase tracking-[2px] text-[#64805e]">
            À découvrir
          </p>

          <div className="flex items-center gap-3">
            <h2 className="font-serif text-[25px] tracking-[-0.8px] text-[#263d33] sm:text-[28px]">
              Trouvez votre prochain chez-vous
            </h2>

            <span className="rounded-md bg-[#e9eee2] px-2 py-1 text-[10px] font-semibold text-[#6f8665]">
              {properties.length}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">

          {/* View switch */}
          <div className="flex rounded-lg border border-[#e3e6dc] bg-[#eef0e7] p-1">
            <button
              type="button"
              onClick={() => setView("list")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-[10px] transition-colors ${
                view === "list"
                  ? "bg-white font-semibold text-[#315b49] shadow-sm"
                  : "text-[#829084] hover:text-[#315b49]"
              }`}
            >
              <LayoutGrid size={13} />
              Liste
            </button>

            <button
              type="button"
              onClick={() => setView("map")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-[10px] transition-colors ${
                view === "map"
                  ? "bg-white font-semibold text-[#315b49] shadow-sm"
                  : "text-[#829084] hover:text-[#315b49]"
              }`}
            >
              <Map size={13} />
              Carte
            </button>
          </div>

          {/* Custom Dropdown : Trier par */}
          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap text-[10px] text-[#899087]">
              Trier par
            </span>

            <div className="w-[170px]">
              <CustomDropdown
                options={SORT_OPTIONS}
                value={sort}
                onChange={setSort}
                placeholder="Trier par"
                size="md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Cards */}
      {view === "list" ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProperties.map((property) => (
            <article
              key={property.id}
              className="group overflow-hidden rounded-xl border border-[#e9e5dc] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(42,55,43,0.08)]"
            >
              <div className="relative">
                <PropertyVisual property={property} />

                {/* Favorite */}
                <button
                  type="button"
                  onClick={() => toggleFavorite(property.id)}
                  aria-label={
                    favorites.includes(property.id)
                      ? "Retirer des favoris"
                      : "Ajouter aux favoris"
                  }
                  aria-pressed={favorites.includes(property.id)}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#687c64] shadow-sm transition-all hover:scale-110"
                >
                  <Heart
                    size={16}
                    className={
                      favorites.includes(property.id)
                        ? "fill-[#b56f66] text-[#b56f66]"
                        : ""
                    }
                  />
                </button>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-[14px] font-semibold text-[#263d33]">
                      {property.title}
                    </h3>

                    <p className="mt-1 flex items-center gap-1 text-[11px] text-[#92988e]">
                      <MapPin size={12} />
                      {property.location}
                    </p>
                  </div>

                  <span className="whitespace-nowrap text-[10px] font-medium text-[#75876d]">
                    {property.price}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-4 border-t border-[#eeeae2] pt-3 text-[10px] text-[#778176]">
                  <span className="flex items-center gap-1">
                    <BedDouble size={13} />
                    {property.rooms} pièces
                  </span>

                  <span className="flex items-center gap-1">
                    <Maximize2 size={12} />
                    {property.surface} m²
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelectedProperty(property)}
                    className="ml-auto flex items-center gap-1 font-semibold text-[#315b49] transition-colors hover:text-[#82966b]"
                  >
                    Voir
                    <ArrowUpRight size={13} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-xl border border-dashed border-[#dcded2] bg-[#f3f2eb] px-5 text-center">
          <Map size={28} className="mb-3 text-[#829475]" />

          <h3 className="text-sm font-semibold text-[#344b3c]">
            Explorer les logements sur une carte
          </h3>

          <p className="mt-2 max-w-sm text-xs leading-6 text-[#858c80]">
            La vue cartographique sera disponible lorsque les coordonnées
            géographiques des annonces seront intégrées.
          </p>

          <Link
            to="/properties"
            className="mt-4 text-xs font-semibold text-[#315b49] hover:underline"
          >
            Voir tous les logements
          </Link>
        </div>
      )}

      {/* Voir tous les logements */}
      <div className="mt-9 flex justify-center">
        <Link
          to="/properties"
          className="group flex items-center gap-2 rounded-lg border border-[#dce2d6] px-6 py-3 text-[12px] font-semibold text-[#315b49] transition-all hover:border-[#244d40] hover:bg-[#244d40] hover:text-white"
        >
          Découvrir tous les logements

          <ArrowUpRight
            size={15}
            className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      {/* Modal */}
      {selectedProperty && (
        <PropertyModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </section>
  );
}
