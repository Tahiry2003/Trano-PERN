
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  LayoutGrid,
  Map,
  MapPin,
  ArrowUpRight,
  BedDouble,
  Maximize2,
} from "lucide-react";

const properties = [
  {
    id: 1,
    type: "Maison",
    title: "Maison familiale",
    location: "Antananarivo",
    rooms: 4,
    surface: 120,
    price: "À découvrir",
    style: "from-[#eee5d5] to-[#e1d1b9]",
    accent: "#d8bfa0",
  },
  {
    id: 2,
    type: "Appartement",
    title: "Appartement moderne",
    location: "Antananarivo",
    rooms: 3,
    surface: 85,
    price: "À découvrir",
    style: "from-[#e9e9dc] to-[#d8dfd0]",
    accent: "#b7c4ad",
  },
  {
    id: 3,
    type: "Studio",
    title: "Studio lumineux",
    location: "Toamasina",
    rooms: 1,
    surface: 35,
    price: "À découvrir",
    style: "from-[#eee0d4] to-[#e5cbb9]",
    accent: "#d6b5a1",
  },
];

function PropertyVisual({ property }) {
  return (
    <div
      className={`relative flex aspect-[1.55/1] items-center justify-center overflow-hidden rounded-t-xl bg-gradient-to-br ${property.style}`}
    >
      <div className="absolute right-[15%] top-[8%] h-14 w-14 rounded-full bg-[#fff8df]" />

      <div className="absolute bottom-0 h-[35%] w-full bg-[#d5d0bd]/50" />

      {/* Decorative building */}
      <div className="relative mt-5 h-[65%] w-[66%] shadow-lg">
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

      <span className="absolute left-4 top-4 rounded-md bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-[#344b3c]">
        {property.type}
      </span>
    </div>
  );
}

export default function FeaturedProperties() {
  const [favorites, setFavorites] = useState([]);
  const [view, setView] = useState("list");
  const [sort, setSort] = useState("recent");

  const toggleFavorite = (id) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  return (
    <section className="mx-auto max-w-[1080px] px-5 pb-20 pt-8 lg:px-0">

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
              9
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
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

          <label className="flex items-center gap-2 text-[10px] text-[#899087]">
            Trier par
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="max-w-[130px] bg-transparent font-medium text-[#34483d] outline-none"
            >
              <option value="recent">Les plus récentes</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
          </label>
        </div>
      </div>

      {/* Cards */}
      {view === "list" ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <article
              key={property.id}
              className="group overflow-hidden rounded-xl border border-[#e9e5dc] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(42,55,43,0.08)]"
            >
              <div className="relative">
                <PropertyVisual property={property} />

                <button
                  type="button"
                  onClick={() => toggleFavorite(property.id)}
                  aria-label="Ajouter aux favoris"
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

                  <Link
                    to="/properties"
                    className="ml-auto flex items-center gap-1 font-semibold text-[#315b49] transition-colors hover:text-[#82966b]"
                  >
                    Voir
                    <ArrowUpRight size={13} />
                  </Link>
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

      <div className="mt-9 flex justify-center">
        <Link
          to="/properties"
          className="group flex items-center gap-2 rounded-lg border border-[#dce2d6] px-6 py-3 text-[12px] font-semibold text-[#315b49] transition-all hover:border-[#244d40] hover:bg-[#244d40] hover:text-white"
        >
          Découvrir tous les logements
          <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
