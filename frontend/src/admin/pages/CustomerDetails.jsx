import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import toast from "react-hot-toast";

import {
    FaArrowLeft,
    FaUser,
    FaMapMarkerAlt,
    FaShoppingBag,
    FaPhone,
    FaEnvelope,
    FaCalendarAlt,
} from "react-icons/fa";

import { getCustomerDetails } from "../../services/adminService";

import "../../styles/adminCustomerDetails.css";


function CustomerDetails() {

    const { id } = useParams();

    const navigate = useNavigate();


    const [data, setData] = useState(null);

    const [loading, setLoading] = useState(true);


    useEffect(() => {
        loadCustomer();
    }, [id]);


    const loadCustomer = async () => {

        try {

            setLoading(true);

            const response =
                await getCustomerDetails(id);

            setData(response);

        } catch (error) {

            console.error(
                "Customer details error:",
                error.response?.data || error
            );

            toast.error(
                "Unable to load customer details"
            );

        } finally {

            setLoading(false);

        }

    };


    if (loading) {

        return (
            <div className="admin-customer-loading">
                Loading customer details...
            </div>
        );

    }


    if (!data) {

        return (
            <div className="admin-customer-error">
                <h2>
                    Customer not found
                </h2>

                <button
                    onClick={() =>
                        navigate("/admin/customers")
                    }
                >
                    Back to Customers
                </button>
            </div>
        );

    }


    const customer = data.customer || {};

    const addresses = data.addresses || [];

    const orders = data.orders || [];


    return (
        <div className="admin-customer-details">

            {/* HEADER */}

            <div className="customer-details-header">

                <button
                    className="back-button"
                    onClick={() =>
                        navigate("/admin/customers")
                    }
                >
                    <FaArrowLeft />

                    Back to Customers
                </button>


                <h1>
                    Customer Details
                </h1>

            </div>


            {/* CUSTOMER INFORMATION */}

            <div className="customer-info-card">

                <div className="customer-avatar">

                    <FaUser />

                </div>


                <div className="customer-main-info">

                    <h2>
                        {customer.username}
                    </h2>


                    <div className="customer-contact">

                        <span>
                            <FaEnvelope />

                            {customer.email ||
                                "No email"}
                        </span>


                        {customer.phone && (

                            <span>
                                <FaPhone />

                                {customer.phone}
                            </span>

                        )}

                    </div>


                    <span className="customer-joined">

                        <FaCalendarAlt />

                        Joined{" "}

                        {customer.date_joined
                            ? new Date(
                                  customer.date_joined
                              ).toLocaleDateString()
                            : "N/A"}

                    </span>

                </div>

            </div>


            {/* STATISTICS */}

            <div className="customer-stats">

                <div className="customer-stat-card">

                    <FaShoppingBag />

                    <div>

                        <span>
                            Total Orders
                        </span>

                        <strong>
                            {customer.order_count ?? 0}
                        </strong>

                    </div>

                </div>


                <div className="customer-stat-card">

                    <FaShoppingBag />

                    <div>

                        <span>
                            Total Spent
                        </span>

                        <strong>
                            ₹
                            {Number(
                                customer.total_spent || 0
                            ).toFixed(2)}
                        </strong>

                    </div>

                </div>

            </div>


            {/* ADDRESSES */}

            <section className="customer-section">

                <div className="section-title">

                    <FaMapMarkerAlt />

                    <h2>
                        Saved Addresses
                    </h2>

                </div>


                {addresses.length === 0 ? (

                    <div className="empty-section">

                        No saved addresses.

                    </div>

                ) : (

                    <div className="customer-address-list">

                        {addresses.map(
                            (address) => (

                                <div
                                    className="customer-address-card"
                                    key={address.id}
                                >

                                    <div className="address-card-header">

                                        <h3>
                                            {address.full_name}
                                        </h3>


                                        {address.is_default && (

                                            <span className="default-badge">
                                                Default
                                            </span>

                                        )}

                                    </div>


                                    <p>
                                        <FaPhone />

                                        {address.phone}
                                    </p>


                                    <p>
                                        {address.house},{" "}

                                        {address.street}
                                    </p>


                                    <p>
                                        {address.city},{" "}

                                        {address.state}
                                    </p>


                                    <p>
                                        {address.pincode}
                                    </p>


                                    {address.latitude &&
                                        address.longitude && (

                                            <div className="address-coordinates">

                                                📍 Location saved

                                            </div>

                                        )}

                                </div>

                            )
                        )}

                    </div>

                )}

            </section>


            {/* ORDERS */}

            <section className="customer-section">

                <div className="section-title">

                    <FaShoppingBag />

                    <h2>
                        Order History
                    </h2>

                </div>


                {orders.length === 0 ? (

                    <div className="empty-section">

                        No orders found.

                    </div>

                ) : (

                    <div className="customer-orders">

                        {orders.map(
                            (order) => (

                                <div
                                    className="customer-order-card"
                                    key={order.id}
                                >

                                    <div>

                                        <h3>
                                            Order #
                                            {order.id}
                                        </h3>


                                        <p>
                                            {order.created_at
                                                ? new Date(
                                                      order.created_at
                                                  ).toLocaleDateString()
                                                : ""}
                                        </p>

                                    </div>


                                    <div className="order-middle">

                                        <span>
                                            ₹
                                            {Number(
                                                order.total_amount ||
                                                    0
                                            ).toFixed(2)}
                                        </span>

                                    </div>


                                    <div className="order-right">

                                        <span
                                            className={`order-status ${String(
                                                order.status ||
                                                    ""
                                            )
                                                .toLowerCase()
                                                .replace(
                                                    /\s+/g,
                                                    "-"
                                                )}`}
                                        >
                                            {order.status}
                                        </span>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </section>

        </div>
    );
}


export default CustomerDetails;