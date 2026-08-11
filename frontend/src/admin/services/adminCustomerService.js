import api from "../../services/api";


// ============================================================
// GET ALL CUSTOMERS - ADMIN
// ============================================================

export const getAdminCustomers = async () => {

    const response = await api.get(
        "/auth/admin/customers/"
    );

    return response.data;
};

// ============================================================
// GET SINGLE CUSTOMER - ADMIN
// ============================================================

export const getAdminCustomer = async (id) => {

    const response = await api.get(
        `/auth/admin/customers/${id}/`
    );

    return response.data;
};