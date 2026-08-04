import { useEffect, useState } from "react";
import { getAddresses, deleteAddress } from "../services/addressService";

import PageHeader from "../components/PageHeader";
import AddressForm from "../components/AddressForm";

import toast from "react-hot-toast";

import { FaMapMarkerAlt, FaPlus, FaEdit, FaTrash } from "react-icons/fa";

import "../styles/addresses.css";

function Addresses() {
  const [addresses, setAddresses] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const data = await getAddresses();
      setAddresses(data);
    } catch {
      toast.error("Unable to load addresses");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this address?")) return;

    try {
      await deleteAddress(id);

      toast.success("Address deleted");

      loadAddresses();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <>
      <PageHeader title="Saved Addresses" />

      <div className="addresses-page">
        <button
          className="add-address-btn"
          onClick={() => {
            setSelectedAddress(null);
            setShowForm(true);
          }}
        >
          <FaPlus />
          Add Address
        </button>

        {addresses.length === 0 ? (
          <div className="empty-address">
            <FaMapMarkerAlt size={45} />

            <h3>No Saved Addresses</h3>

            <p>Add your first delivery address.</p>
          </div>
        ) : (
          addresses.map((address) => (
            <div className="address-card" key={address.id}>
              <div className="address-info">
                <h3>
                  {address.full_name}

                  {address.is_default && (
                    <span className="default-badge">Default</span>
                  )}
                </h3>

                <p>{address.phone}</p>

                <p>
                  {address.house}, {address.street}
                </p>

                <p>
                  {address.city}, {address.state}
                </p>

                <p>{address.pincode}</p>
              </div>

              <div className="address-actions">
                <button
                  onClick={() => {
                    setSelectedAddress(address);
                    setShowForm(true);
                  }}
                >
                  <FaEdit />
                </button>

                <button onClick={() => handleDelete(address.id)}>
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}

        {showForm && (
          <AddressForm
            address={selectedAddress}
            onClose={() => {
              setShowForm(false);
              loadAddresses();
            }}
          />
        )}
      </div>
    </>
  );
}

export default Addresses;
