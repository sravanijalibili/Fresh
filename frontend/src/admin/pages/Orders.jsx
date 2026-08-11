import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import {
    getAdminOrders,
    updateOrderStatus,
} from "../services/adminOrderService";

import "../styles/orders.css";


function AdminOrders() {

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);


    useEffect(() => {

        loadOrders();

    }, []);


    const loadOrders = async () => {

        try {

            setLoading(true);

            const data = await getAdminOrders();

            setOrders(data);

        } catch (error) {

            console.error(error);

            toast.error(
                "Unable to load orders"
            );

        } finally {

            setLoading(false);

        }
    };


    const handleStatusChange = async (
        orderId,
        newStatus
    ) => {

        try {

            await updateOrderStatus(
                orderId,
                newStatus
            );

            toast.success(
                "Order status updated"
            );

            loadOrders();

        } catch (error) {

            console.error(error);

            toast.error(
                "Unable to update order status"
            );

        }
    };


    if (loading) {

        return (
            <div className="admin-orders">

                <h2>Orders</h2>

                <div className="orders-loading">
                    Loading orders...
                </div>

            </div>
        );
    }


    return (

        <div className="admin-orders">

            <div className="page-top">

                <div>

                    <h2>Orders</h2>

                    <p className="orders-subtitle">
                        Manage customer orders
                    </p>

                </div>

                <div className="order-total-count">
                    {orders.length} Orders
                </div>

            </div>


            {orders.length === 0 ? (

                <div className="empty-orders">

                    <h3>
                        No Orders Found
                    </h3>

                    <p>
                        Customer orders will appear here.
                    </p>

                </div>

            ) : (

                <div className="orders-table-wrapper">

                    <table className="admin-orders-table">

                        <thead>

                            <tr>

                                <th>
                                    Order
                                </th>

                                <th>
                                    Customer
                                </th>

                                <th>
                                    Date
                                </th>

                                <th>
                                    Items
                                </th>

                                <th>
                                    Payment
                                </th>

                                <th>
                                    Total
                                </th>

                                <th>
                                    Status
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {orders.map((order) => (

                                <tr key={order.id}>

                                    <td>
                                        <strong>
                                            #{order.id}
                                        </strong>
                                    </td>


                                    <td>

                                        <div className="customer-cell">

                                            <strong>
                                                {order.customer_name}
                                            </strong>

                                            <span>
                                                {order.customer_email}
                                            </span>

                                        </div>

                                    </td>


                                    <td>

                                        {new Date(
                                            order.created_at
                                        ).toLocaleString()}

                                    </td>


                                    <td>

                                        {order.items?.length || 0}

                                    </td>


                                    <td>

                                        {order.payment_method}

                                    </td>


                                    <td>

                                        ₹{order.total_amount}

                                    </td>


                                    <td>

                                        <select
                                            className={`order-status-select ${order.status
                                                .toLowerCase()
                                                .replaceAll(" ", "-")}`}
                                            value={order.status}
                                            onChange={(e) =>
                                                handleStatusChange(
                                                    order.id,
                                                    e.target.value
                                                )
                                            }
                                        >

                                            <option value="Pending">
                                                Pending
                                            </option>

                                            <option value="Confirmed">
                                                Confirmed
                                            </option>

                                            <option value="Packed">
                                                Packed
                                            </option>

                                            <option value="Out for Delivery">
                                                Out for Delivery
                                            </option>

                                            <option value="Delivered">
                                                Delivered
                                            </option>

                                            <option value="Cancelled">
                                                Cancelled
                                            </option>

                                        </select>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

        </div>
    );
}


export default AdminOrders;