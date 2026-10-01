"use client";

import { useEffect } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Leaflet's default marker points at image files the bundler doesn't copy,
// so the pin is inline SVG instead.
const pinIcon = L.divIcon({
  className: "",
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="#ef4444" stroke="#ffffff" stroke-width="1.5"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5" fill="#ffffff"/></svg>`,
  iconSize: [36, 36],
  iconAnchor: [18, 34],
});

const PIN_ZOOM = 16;

// Brings the pin into view when it lands off-screen (search, my location)
// or the map is zoomed too far out to place it precisely. A tap inside the
// visible area leaves the map where it is.
function FollowPin({ position }) {
  const map = useMap();
  const lat = position?.lat;
  const lng = position?.lng;

  useEffect(() => {
    if (lat == null) return;
    const inView = map.getBounds().pad(-0.1).contains([lat, lng]);
    if (!inView || map.getZoom() < 14) {
      map.setView([lat, lng], Math.max(map.getZoom(), PIN_ZOOM));
    }
  }, [map, lat, lng]);

  return null;
}

// The dialog scales in, so Leaflet measures the map before it reaches its
// final size. Measure again once the animation is over.
function FixSize() {
  const map = useMap();

  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 250);
    return () => clearTimeout(timer);
  }, [map]);

  return null;
}

function TapToMove({ onChange }) {
  useMapEvents({
    click: ({ latlng }) => onChange({ lat: latlng.lat, lng: latlng.lng }),
  });
  return null;
}

// position: { lat, lng } of the pin, or null before one is dropped.
export default function LocationMap({ center, position, onChange }) {
  return (
    <MapContainer
      center={position ?? center}
      zoom={position ? PIN_ZOOM : 12}
      className="size-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {position ? (
        <Marker
          position={position}
          icon={pinIcon}
          draggable
          eventHandlers={{
            dragend: ({ target }) => {
              const { lat, lng } = target.getLatLng();
              onChange({ lat, lng });
            },
          }}
        />
      ) : null}
      <FollowPin position={position} />
      <TapToMove onChange={onChange} />
      <FixSize />
    </MapContainer>
  );
}
