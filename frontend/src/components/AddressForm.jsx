import { useEffect, useState } from "react";
import {
  addAddress,
  updateAddress,
} from "../services/addressService";

import toast from "react-hot-toast";

import "../styles/addressform.css";

function AddressForm({ address, onClose }) {
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    house: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    is_default: false,
  });

  useEffect(() => {
    if (address) {
      setFormData(address);
    }
  }, [address]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (address) {
        await updateAddress(address.id, formData);
        toast.success("Address Updated");
      } else {
        await addAddress(formData);
        toast.success("Address Added");
      }

      onClose();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="address-modal">

      <div className="address-form-card">

        <h2>
          {address ? "Edit Address" : "Add Address"}
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            name="full_name"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleChange}
            required
          />

          <input
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <input
            name="house"
            placeholder="House / Flat No"
            value={formData.house}
            onChange={handleChange}
            required
          />

          <input
            name="street"
            placeholder="Street"
            value={formData.street}
            onChange={handleChange}
            required
          />

          <input
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
          />

          <input
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            required
          />

          <input
            name="pincode"
            placeholder="Pincode"
            value={formData.pincode}
            onChange={handleChange}
            required
          />

          <label className="default-checkbox">

            <input
              type="checkbox"
              name="is_default"
              checked={formData.is_default}
              onChange={handleChange}
            />

            Set as Default Address

          </label>

          <div className="form-buttons">

            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-btn"
            >
              Save
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddressForm;