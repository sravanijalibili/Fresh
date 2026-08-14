import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import toast from "react-hot-toast";

import { createAddress, updateAddress } from "../services/addressService";

import "../styles/address-form.css";
import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

/* =========================================================
   MAP CLICK HANDLER
   ========================================================= */

function MapUpdater({ position }) {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();

      if (position) {
        map.setView([position.lat, position.lng], 16);
      }
    }, 100);
  }, [map, position]);

  return null;
}

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;

      setPosition({
        lat,
        lng,
      });
    },
  });

  return position ? <Marker position={[position.lat, position.lng]} /> : null;
}

/* =========================================================
   ADDRESS FORM
   ========================================================= */

function AddressForm({ address, onClose }) {
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    house: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    latitude: "",
    longitude: "",
    is_default: false,
  });

  const [position, setPosition] = useState(null);

  const [loading, setLoading] = useState(false);

  /* =========================================================
     LOAD EXISTING ADDRESS
     ========================================================= */

  useEffect(() => {
    if (address) {
      setFormData({
        full_name: address.full_name || "",
        phone: address.phone || "",
        house: address.house || "",
        street: address.street || "",
        city: address.city || "",
        state: address.state || "",
        pincode: address.pincode || "",
        latitude: address.latitude || "",
        longitude: address.longitude || "",
        is_default: address.is_default || false,
      });

      if (address.latitude && address.longitude) {
        setPosition({
          lat: Number(address.latitude),
          lng: Number(address.longitude),
        });
      }
    }
  }, [address]);

  /* =========================================================
     HANDLE INPUT
     ========================================================= */

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* =========================================================
     HANDLE MAP LOCATION
     ========================================================= */

  const handleLocationChange = (newPosition) => {
    setPosition(newPosition);

    setFormData((previous) => ({
      ...previous,
      latitude: newPosition.lat.toFixed(7),
      longitude: newPosition.lng.toFixed(7),
    }));
  };

  /* =========================================================
     SAVE ADDRESS
     ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    try {
      const payload = {
        ...formData,

        latitude: formData.latitude === "" ? null : Number(formData.latitude),

        longitude:
          formData.longitude === "" ? null : Number(formData.longitude),
      };

      if (address) {
        await updateAddress(address.id, payload);

        toast.success("Address updated");
      } else {
        await createAddress(payload);

        toast.success("Address added");
      }

      onClose();
    } catch (error) {
      console.error(error);

      toast.error("Unable to save address");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     MAP CENTER
     ========================================================= */

  const defaultPosition = position
    ? [position.lat, position.lng]
    : [12.9716, 77.5946];

  return (
    <div className="address-form-overlay">
      <div className="address-form">
        <div className="address-form-header">
          <h2>{address ? "Edit Address" : "Add Address"}</h2>

          <button type="button" className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone</label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>House / Flat</label>

            <input
              type="text"
              name="house"
              value={formData.house}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Street</label>

            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>City</label>

            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>State</label>

            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Pincode</label>

            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              required
            />
          </div>

          {/* =================================================
              LOCATION PICKER
              ================================================= */}

          <div className="location-section">
            <h3>Select Delivery Location</h3>

            <p className="location-help">
              Tap on the map to select your delivery location.
            </p>

            <div className="address-map">
              <MapContainer
                center={defaultPosition}
                zoom={16}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapUpdater position={position} />

                <LocationMarker
                  position={position}
                  setPosition={handleLocationChange}
                />
              </MapContainer>
            </div>

            {position && (
              <div className="coordinates">
                <span>Latitude: {position.lat.toFixed(7)}</span>

                <span>Longitude: {position.lng.toFixed(7)}</span>
              </div>
            )}
          </div>

          <label className="default-address">
            <input
              type="checkbox"
              name="is_default"
              checked={formData.is_default}
              onChange={handleChange}
            />

            <span>Set as default address</span>
          </label>

          <div className="address-form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>

            <button
              type="submit"
              className="save-address-btn"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : address
                  ? "Update Address"
                  : "Save Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddressForm;
