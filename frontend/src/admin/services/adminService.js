import API from "../../services/api";

// Dashboard
export const getDashboard = async () => {
  const response = await API.get("/admin/dashboard/");
  return response.data;
};


export const getCustomerDetails = async (id) => {
    const token = localStorage.getItem("access");

    const response = await API.get(
        `/auth/admin/customers/${id}/`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};