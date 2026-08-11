import api from "../../services/api";


// ============================================================
// GET ALL ORDERS - ADMIN
// ============================================================

export const getAdminOrders = async () => {

    const response = await api.get(
        "/orders/admin/"
    );

    return response.data;
};


// ============================================================
// GET SINGLE ORDER - ADMIN
// ============================================================

export const getAdminOrder = async (id) => {

    const response = await api.get(
        `/orders/admin/${id}/`
    );

    return response.data;
};


// ============================================================
// UPDATE ORDER STATUS - ADMIN
// ============================================================

export const updateOrderStatus = async (
    id,
    status
) => {

    const response = await api.patch(
        `/orders/admin/${id}/status/`,
        {
            status: status,
        }
    );

    return response.data;
};