
import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { MapPin, Plus, Minus, Crosshair } from "lucide-react";

import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER = [-18.8792, 47.5079];

// Icône personnalisée du marqueur
const markerIcon = new L.DivIcon({
  className: "",
  html: `
    <div style="
      width: 25px;
      height: 25px;
      background: #244d40;
      border: 3px solid white;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 2px 6px rgba(0,0,0,.3);
    ">
      <div style="
        width: 7px;
        height: 7px;
        background: white;
        border-radius: 50%;
        margin: 6px auto;
      "></div>
    </div>
  `,
  iconSize: [25, 25],
  iconAnchor: [12, 25],
});

function MapClickHandler({ onSelect }) {
  useMapEvents({
    click(event) {
      onSelect(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
}

function MapController({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 16, { duration: 0.7 });
    }
  }, [position, map]);

  return null;
}

export default function MapPicker({
  latitude = "",
  longitude = "",
  onChange,
}) {
  const [zoom, setZoom] = useState(12);
  const [error, setError] = useState("");

  const position = useMemo(() => {
    if (latitude === "" || longitude === "") return null;

    const lat = Number(latitude);
    const lng = Number(longitude);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      return null;
    }

    return [lat, lng];
  }, [latitude, longitude]);

  const selectPosition = (lat, lng) => {
    setError("");

    onChange?.({
      latitude: Number(lat.toFixed(7)),
      longitude: Number(lng.toFixed(7)),
    });
  };

  const locateMe = () => {
    setError("");

    if (!navigator.geolocation) {
      setError("La géolocalisation n'est pas disponible sur ce navigateur.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (result) => {
        selectPosition(
          result.coords.latitude,
          result.coords.longitude
        );
      },
      () => {
        setError(
          "Impossible de récupérer votre position. Vérifiez les autorisations."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };

  const centerMap = () => {
    if (position) {
      return;
    }

    selectPosition(DEFAULT_CENTER[0], DEFAULT_CENTER[1]);
  };

  const handleCoordinateChange = (field, value) => {
    const nextLatitude = field === "latitude" ? value : latitude;
    const nextLongitude = field === "longitude" ? value : longitude;

    onChange?.({
      latitude: nextLatitude,
      longitude: nextLongitude,
    });
  };

  return (
    <section className="w-full">
      {/* Titre */}
      <div className="mb-2 flex items-center gap-2 px-1">
        <MapPin size={17} className="text-[#244d40]" />
        <h3 className="text-[13px] font-medium text-[#203c33]">
          Localiser le logement
        </h3>
      </div>

      {/* Conteneur principal */}
      <div className="rounded-[10px] border border-[#e1e5d8] bg-[#f5f6ef] p-[17px]">
        {/* Actions */}
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={locateMe}
            className="flex h-[36px] items-center gap-2 rounded-[9px] border border-[#cbd4c5] bg-transparent px-3 text-[11px] font-medium text-[#244d40] transition hover:bg-[#e9eee5]"
          >
            <MapPin size={14} />
            Utiliser ma position
          </button>

          <button
            type="button"
            onClick={centerMap}
            className="text-[10px] text-[#244d40] underline underline-offset-2 transition hover:text-[#203c33]"
          >
            Placer au centre de la carte
          </button>
        </div>

        {/* Carte */}
        <div className="relative z-0 h-[300px] w-full overflow-hidden rounded-[9px] border border-[#d9dfd3]">
          <MapContainer
            center={position || DEFAULT_CENTER}
            zoom={position ? 16 : zoom}
            scrollWheelZoom
            className="h-full w-full"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapClickHandler onSelect={selectPosition} />

            <MapController position={position} />

            {position && (
              <Marker
                position={position}
                icon={markerIcon}
                draggable
                eventHandlers={{
                  dragend(event) {
                    const marker = event.target;
                    const coordinates = marker.getLatLng();

                    selectPosition(
                      coordinates.lat,
                      coordinates.lng
                    );
                  },
                }}
              />
            )}
          </MapContainer>

          {/* Contrôles de zoom */}
          <div className="absolute right-2 top-2 z-[1000] flex flex-col overflow-hidden rounded-md border border-[#d9dfd3] bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setZoom((value) => Math.min(value + 1, 19))}
              className="flex h-[31px] w-[31px] items-center justify-center text-[#203c33] hover:bg-[#f1f3ed]"
              aria-label="Zoom avant"
            >
              <Plus size={17} />
            </button>

            <div className="h-px bg-[#e5e7eb]" />

            <button
              type="button"
              onClick={() => setZoom((value) => Math.max(value - 1, 3))}
              className="flex h-[31px] w-[31px] items-center justify-center text-[#203c33] hover:bg-[#f1f3ed]"
              aria-label="Zoom arrière"
            >
              <Minus size={17} />
            </button>
          </div>
        </div>

        {/* État de localisation */}
        <p className="mt-3 min-h-[16px] text-[10px] leading-4 text-[#788178]">
          {position
            ? "Position enregistrée avec succès."
            : "Aucune position enregistrée. La géolocalisation est facultative."}
        </p>

        {error && (
          <p className="mt-2 text-[10px] leading-4 text-red-600">
            {error}
          </p>
        )}

        {/* Coordonnées */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-[10px] font-medium text-[#203c33]">
              Latitude
            </label>

            <input
              type="number"
              step="any"
              value={latitude}
              onChange={(event) =>
                handleCoordinateChange("latitude", event.target.value)
              }
              placeholder="Ex. -18.8792000"
              className="h-[41px] w-full rounded-[8px] border border-[#dce1d5] bg-[#fffefa] px-3 text-[11px] text-[#203c33] outline-none transition placeholder:text-[#8a918a] focus:border-[#244d40] focus:ring-1 focus:ring-[#244d40]/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-medium text-[#203c33]">
              Longitude
            </label>

            <input
              type="number"
              step="any"
              value={longitude}
              onChange={(event) =>
                handleCoordinateChange("longitude", event.target.value)
              }
              placeholder="Ex. 47.5079000"
              className="h-[41px] w-full rounded-[8px] border border-[#dce1d5] bg-[#fffefa] px-3 text-[11px] text-[#203c33] outline-none transition placeholder:text-[#8a918a] focus:border-[#244d40] focus:ring-1 focus:ring-[#244d40]/10"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
