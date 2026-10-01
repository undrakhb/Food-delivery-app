"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { LocateFixed, Search } from "lucide-react";
import { lookupAddress, searchPlaces } from "@/app/_api/geocode";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";
import { CloseButton, Modal, ModalTitle } from "../_components/modal";

// Leaflet touches `window` as soon as it loads, so the map is browser-only.
const LocationMap = dynamic(() => import("../_components/location-map"), {
  ssr: false,
  loading: () => <div className="size-full animate-pulse bg-zinc-100" />,
});

// Ulaanbaatar: where the map opens before an address is saved.
const DEFAULT_CENTER = { lat: 47.9185, lng: 106.9177 };

// Wait for the pin to settle before asking OpenStreetMap for its street.
const LOOKUP_DELAY = 600;

const inputClass =
  "w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus-visible:border-zinc-400";
const buttonClass =
  "flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-colors disabled:cursor-not-allowed";

// onSaved(address) runs after the address is stored on the account.
export function AddressDialog({ open, onOpenChange, onSaved }) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} className="max-w-xl">
      {/* Remounts on every open, so it starts from the saved address. */}
      <AddressDialogBody onSaved={onSaved} onDone={() => onOpenChange(false)} />
    </Modal>
  );
}

function AddressDialogBody({ onSaved, onDone }) {
  const { user, saveAddress } = useAuth();
  const showToast = useToast();
  const saved = user?.address;

  const [pin, setPin] = useState(saved ? { lat: saved.lat, lng: saved.lng } : null);
  const [street, setStreet] = useState(saved?.street ?? "");
  const [details, setDetails] = useState(saved?.details ?? "");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [lookingUp, setLookingUp] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const lookup = useRef({ timer: null, controller: null });

  useEffect(() => {
    const pending = lookup.current;
    return () => {
      clearTimeout(pending.timer);
      pending.controller?.abort();
    };
  }, []);

  // A label comes with search results; otherwise the street is looked up
  // from the pin. Only the latest lookup is kept.
  function movePin(position, label) {
    const next = { lat: position.lat, lng: position.lng };
    setPin(next);
    setResults(null);
    setError("");

    clearTimeout(lookup.current.timer);
    lookup.current.controller?.abort();

    if (label) {
      setStreet(label);
      setLookingUp(false);
      return;
    }

    setLookingUp(true);
    lookup.current.timer = setTimeout(() => {
      const controller = new AbortController();
      lookup.current.controller = controller;
      lookupAddress(next, controller.signal)
        .then(setStreet)
        .catch((err) => {
          if (err.name !== "AbortError") {
            setError("Couldn't find the street for this spot. Please type it.");
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) setLookingUp(false);
        });
    }, LOOKUP_DELAY);
  }

  async function handleSearch(event) {
    event.preventDefault();
    const text = query.trim();
    if (!text || searching) return;

    setSearching(true);
    setError("");
    try {
      setResults(await searchPlaces(text));
    } catch {
      setError("Search isn't working right now. Tap the map instead.");
    } finally {
      setSearching(false);
    }
  }

  function handleLocate() {
    if (!navigator.geolocation) {
      setError("Your browser can't share your location.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocating(false);
        movePin({ lat: coords.latitude, lng: coords.longitude });
      },
      () => {
        setLocating(false);
        setError("Couldn't get your location. Search or tap the map instead.");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  const canSave = Boolean(pin && street.trim()) && !lookingUp && !saving;

  async function handleSave() {
    if (!canSave) return;

    const address = {
      street: street.trim(),
      details: details.trim(),
      lat: pin.lat,
      lng: pin.lng,
    };
    setSaving(true);
    const result = await saveAddress(address);
    setSaving(false);

    if (!result.success) {
      setError(result.error);
      return;
    }
    showToast("Delivery address saved");
    onSaved?.(address);
    onDone();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <ModalTitle className="text-2xl font-semibold">Delivery address</ModalTitle>
          <p className="mt-1 text-sm text-zinc-500">
            Search, or tap the map where we should deliver.
          </p>
        </div>
        <CloseButton variant="muted" />
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a place, street or building"
          aria-label="Search for a place"
          className={`h-10 ${inputClass}`}
        />
        <button
          type="submit"
          disabled={!query.trim() || searching}
          className={`${buttonClass} shrink-0 bg-zinc-900 text-white hover:bg-zinc-800 disabled:bg-zinc-300`}
        >
          <Search className="size-4" />
          {searching ? "Searching..." : "Search"}
        </button>
      </form>

      {results ? (
        results.length > 0 ? (
          <ul className="max-h-40 divide-y divide-zinc-100 overflow-y-auto rounded-md border border-zinc-200 text-sm">
            {results.map((place) => (
              <li key={`${place.lat},${place.lng}`}>
                <button
                  type="button"
                  onClick={() => movePin(place, place.label)}
                  className="w-full px-3 py-2 text-left transition-colors hover:bg-zinc-100"
                >
                  {place.label}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-zinc-500">
            No places found. Try another name, or tap the map.
          </p>
        )
      ) : null}

      <div className="relative h-72 overflow-hidden rounded-xl border border-zinc-200">
        <LocationMap center={DEFAULT_CENTER} position={pin} onChange={movePin} />
        <button
          type="button"
          onClick={handleLocate}
          disabled={locating}
          className="absolute top-3 right-3 z-1000 flex h-9 items-center gap-2 rounded-full bg-white px-3 text-xs font-medium shadow-md transition-colors hover:bg-zinc-100 disabled:cursor-wait"
        >
          <LocateFixed className="size-4 text-red-500" />
          {locating ? "Locating..." : "My location"}
        </button>
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        <span>
          Street address
          {lookingUp ? (
            <span className="ml-2 font-normal text-zinc-500">Finding the street...</span>
          ) : null}
        </span>
        <input
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          placeholder={pin ? "Street, building" : "Drop the pin on the map first"}
          className={`h-10 font-normal ${inputClass}`}
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Apartment, entrance, door code
        <textarea
          rows={2}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Apartment 12, entrance 2, code 1234 (optional)"
          className={`resize-none py-2 font-normal ${inputClass}`}
        />
      </label>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onDone}
          className={`${buttonClass} border border-zinc-200 hover:bg-zinc-100`}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave}
          className={`${buttonClass} bg-zinc-900 text-white hover:bg-zinc-800 disabled:bg-zinc-300`}
        >
          {saving ? "Saving..." : "Deliver here"}
        </button>
      </div>
    </div>
  );
}
