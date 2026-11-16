
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  ChevronDown,
  SlidersHorizontal,
  Maximize2,
  BedDouble,
  Home,
  Building2,
  Hotel,
  Castle,
  X,
  RotateCcw,
  Check,
  Wallet,
  Sparkles,
} from "lucide-react";

import CustomDropdown from "../ui/CustomDropdown";

const PROPERTY_TYPES = [
  { value: "", label: "Tous", icon: Home },
  { value: "maison", label: "Maison", icon: Home },
  { value: "appartement", label: "Appartement", icon: Building2 },
  { value: "studio", label: "Studio", icon: Hotel },
  { value: "villa", label: "Villa", icon: Castle },
];

const ROOM_OPTIONS = ["1", "2", "3", "4"];

const inputClass =
  "w-full bg-transparent text-[13px] font-medium text-[#34483d] outline-none placeholder:font-normal placeholder:text-[#a0a399]";
  

export default function SearchSection() {
  const navigate = useNavigate();

  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [budget, setBudget] = useState("");
  const [rooms, setRooms] = useState("");
  const [surface, setSurface] = useState("");

  const [showFilters, setShowFilters] = useState(false);

  const activeFilters = useMemo(
    () =>
      [
        type,
        minBudget,
        budget,
        rooms,
        surface,
      ].filter(Boolean).length,
    [type, minBudget, budget, rooms, surface]
  );

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (city.trim()) params.set("city", city.trim());
    if (type) params.set("type", type);
    if (minBudget) params.set("minBudget", minBudget);
    if (budget) params.set("maxBudget", budget);
    if (rooms) params.set("rooms", rooms);
    if (surface) params.set("minSurface", surface);

    navigate(`/properties?${params.toString()}`);
  };

  const resetFilters = () => {
    setCity("");
    setType("");
    setMinBudget("");
    setBudget("");
    setRooms("");
    setSurface("");
  };

  const toggleRoom = (value) => {
    setRooms((current) => current === value ? "" : value);
  };

  return (
    <section className="relative z-10 mx-auto max-w-[1080px] px-5 lg:px-0">

      {/* Main Search Card */}
      <div className="rounded-2xl border border-[#e9e7df] bg-white p-4 shadow-[0_12px_40px_rgba(39,57,44,0.055)] sm:p-5">

        <form onSubmit={handleSearch}>

          {/* Main fields */}
          <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-[1.3fr_1.1fr_1.1fr_auto] md:gap-0">

            {/* Location */}
            <div className="group min-w-0 border-b border-[#efeee8] pb-4 md:border-b-0 md:border-r md:pb-0 md:pr-5">
              <label className="mb-2 block text-[11px] font-bold tracking-wide text-[#294237]">
                Où souhaitez-vous vivre ?
              </label>

              <div className="flex items-center gap-2.5">
                <MapPin
                  size={18}
                  strokeWidth={1.7}
                  className="shrink-0 text-[#84957b]"
                />

                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ville, ex. Antananarivo"
                  className={inputClass}
                />

                {city && (
                  <button
                    type="button"
                    onClick={() => setCity("")}
                    className="text-[#a1a69b] transition hover:text-[#244d40]"
                    aria-label="Effacer la ville"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>

            {/* Property Type */}
            <div className="min-w-0 border-b border-[#efeee8] pb-4 md:border-b-0 md:border-r md:px-5 md:pb-0">
              <label className="mb-2 block text-[11px] font-bold tracking-wide text-[#294237]">
                Type de logement
              </label>

              <div className="flex items-center gap-2.5">
                <Home
                  size={18}
                  strokeWidth={1.7}
                  className="shrink-0 text-[#84957b]"
                />

                <div className="min-w-0 flex-1">
                  <CustomDropdown
                    options={PROPERTY_TYPES}
                    value={type}
                    onChange={setType}
                    placeholder="Tous les types"
                    size="md"
                  />
                </div>
              </div>
            </div>

            {/* Budget */}
            <div className="min-w-0 border-b border-[#efeee8] pb-4 md:border-b-0 md:px-5 md:pb-0">
              <label className="mb-2 block text-[11px] font-bold tracking-wide text-[#294237]">
                Budget maximum
              </label>

              <div className="flex items-center gap-2">
                <Wallet
                  size={17}
                  strokeWidth={1.7}
                  className="shrink-0 text-[#84957b]"
                />

                <input
                  type="text"
                  min="0"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Sans limite"
                  className={inputClass}
                />

                <span className="whitespace-nowrap text-[10px] text-[#92988e]">
                  Ar/mois
                </span>
              </div>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="group flex h-[46px] items-center justify-center gap-2.5 rounded-xl bg-[#244d40] px-7 text-[12px] font-semibold text-white shadow-[0_4px_12px_rgba(36,77,64,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#193d32] hover:shadow-[0_8px_20px_rgba(36,77,64,0.2)] active:translate-y-0"
            >
              <Search
                size={17}
                className="transition-transform duration-300 group-hover:scale-110"
              />
              Rechercher
            </button>
          </div>

          {/* Divider */}
          <div className="my-5 hidden border-t border-[#f0eee8] md:block" />

          {/* Advanced filter toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3">

            <div className="flex flex-wrap items-center gap-2">

              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`group flex h-9 items-center gap-2 rounded-lg border px-3.5 text-[11px] font-semibold transition-all duration-200 ${
                  showFilters || activeFilters > 0
                    ? "border-[#cbd7c5] bg-[#edf1e9] text-[#315b49]"
                    : "border-[#e9e7df] bg-white text-[#657267] hover:border-[#cbd7c5] hover:bg-[#f5f7f1]"
                }`}
              >
                <SlidersHorizontal size={14} />

                Filtres avancés

                {activeFilters > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#315b49] px-1 text-[9px] text-white">
                    {activeFilters}
                  </span>
                )}

                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </button>

              {activeFilters > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-[10px] font-medium text-[#8b9187] transition-colors hover:bg-[#f6f5ef] hover:text-[#315b49]"
                >
                  <RotateCcw size={12} />
                  Tout effacer
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-[#93988e]">
              <Sparkles size={13} className="text-[#899b75]" />
              Affinez votre recherche
            </div>
          </div>

          {/* Advanced Filters Panel */}
          <div
            className={`grid transition-all duration-300 ease-in-out ${
              showFilters
                ? "mt-5 grid-rows-[1fr] opacity-100"
                : "mt-0 grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="rounded-xl border border-[#e9e9df] bg-[#fafaf6] p-4 sm:p-5">

                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-[13px] font-bold text-[#294237]">
                      Personnalisez votre recherche
                    </h3>
                    <p className="mt-1 text-[10px] text-[#969b91]">
                      Sélectionnez les critères qui vous correspondent.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowFilters(false)}
                    className="rounded-lg p-2 text-[#90978c] transition hover:bg-white hover:text-[#244d40]"
                    aria-label="Fermer les filtres"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                  {/* Property type toggle */}
                  <div className="md:col-span-2">
                    <label className="mb-3 block text-[11px] font-bold text-[#405348]">
                      Type de propriété
                    </label>

                    <div className="flex flex-wrap gap-2">
                      {PROPERTY_TYPES.map((item) => {
                        const Icon = item.icon;
                        const selected = type === item.value;

                        return (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() => setType(item.value)}
                            className={`flex min-w-[100px] items-center justify-center gap-2 rounded-xl border px-3.5 py-3 text-[11px] font-medium transition-all duration-200 ${
                              selected
                                ? "border-[#315b49] bg-[#315b49] text-white shadow-sm"
                                : "border-[#e5e5da] bg-white text-[#657267] hover:border-[#9cad92] hover:bg-[#f2f5ee]"
                            }`}
                          >
                            <Icon size={15} />
                            {item.label}

                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Rooms toggle */}
                  <div>
                    <label className="mb-3 flex items-center gap-2 text-[11px] font-bold text-[#405348]">
                      <BedDouble size={14} className="text-[#829475]" />
                      Nombre de pièces
                    </label>

                    <div className="flex flex-wrap gap-2">
                      {ROOM_OPTIONS.map((room) => {
                        const selected = rooms === room;

                        return (
                          <button
                            key={room}
                            type="button"
                            onClick={() => toggleRoom(room)}
                            className={`flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-[11px] font-semibold transition-all ${
                              selected
                                ? "border-[#315b49] bg-[#315b49] text-white"
                                : "border-[#e5e5da] bg-white text-[#657267] hover:border-[#9cad92]"
                            }`}
                          >
                            {room === "4" ? "4+" : room}
                          </button>
                        );
                      })}

                      <button
                        type="button"
                        onClick={() => setRooms("")}
                        className={`h-10 rounded-lg border px-3 text-[10px] transition-colors ${
                          !rooms
                            ? "border-[#cbd7c5] bg-[#edf1e9] text-[#315b49]"
                            : "border-[#e5e5da] bg-white text-[#829084] hover:border-[#9cad92]"
                        }`}
                      >
                        Toutes
                      </button>
                    </div>
                  </div>

                  {/* Surface */}
                  <div>
                    <label className="mb-3 flex items-center gap-2 text-[11px] font-bold text-[#405348]">
                      <Maximize2 size={14} className="text-[#829475]" />
                      Surface minimale
                    </label>

                    <div className="flex h-11 items-center rounded-lg border border-[#e5e5da] bg-white px-3 transition-all focus-within:border-[#829475] focus-within:ring-2 focus-within:ring-[#829475]/10">
                      <input
                        min="0"
                        value={surface}
                        onChange={(e) => setSurface(e.target.value)}
                        placeholder="Ex. 50"
                        className="w-full bg-transparent text-[12px] text-[#34483d] outline-none placeholder:text-[#a0a399]"
                      />
                      <span className="text-[11px] font-medium text-[#8d968b]">
                        m²
                      </span>
                    </div>
                  </div>

                  {/* Minimum budget */}
                  <div>
                    <label className="mb-3 flex items-center gap-2 text-[11px] font-bold text-[#405348]">
                      <Wallet size={14} className="text-[#829475]" />
                      Budget minimum
                    </label>

                    <div className="flex h-11 items-center rounded-lg border border-[#e5e5da] bg-white px-3 transition-all focus-within:border-[#829475] focus-within:ring-2 focus-within:ring-[#829475]/10">
                      <input
                        min="0"
                        value={minBudget}
                        onChange={(e) => setMinBudget(e.target.value)}
                        placeholder="Budget minimum"
                        className="w-full bg-transparent text-[12px] text-[#34483d] outline-none placeholder:text-[#a0a399]"
                      />
                      <span className="text-[11px] font-medium text-[#8d968b]">
                        Ar
                      </span>
                    </div>
                  </div>

                  {/* Maximum budget */}
                  <div>
                    <label className="mb-3 flex items-center gap-2 text-[11px] font-bold text-[#405348]">
                      <Wallet size={14} className="text-[#829475]" />
                      Budget maximum
                    </label>

                    <div className="flex h-11 items-center rounded-lg border border-[#e5e5da] bg-white px-3 transition-all focus-within:border-[#829475] focus-within:ring-2 focus-within:ring-[#829475]/10">
                      <input
                        min="0"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        placeholder="Budget maximum"
                        className="w-full bg-transparent text-[12px] text-[#34483d] outline-none placeholder:text-[#a0a399]"
                      />
                      <span className="text-[11px] font-medium text-[#8d968b]">
                        Ar
                      </span>
                    </div>
                  </div>
                </div>

                {/* Panel footer */}
                <div className="mt-6 flex flex-col justify-between gap-3 border-t border-[#e9e9df] pt-4 sm:flex-row sm:items-center">
                  <p className="text-[10px] text-[#92988e]">
                    {activeFilters} critère(s) sélectionné(s)
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="rounded-lg px-4 py-2.5 text-[11px] font-semibold text-[#778276] transition-colors hover:bg-white hover:text-[#315b49]"
                    >
                      Réinitialiser
                    </button>

                    <button
                      type="submit"
                      className="flex items-center gap-2 rounded-lg bg-[#244d40] px-5 py-2.5 text-[11px] font-semibold text-white transition-all hover:bg-[#193d32] hover:shadow-md"
                    >
                      <Search size={14} />
                      Voir les logements
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
