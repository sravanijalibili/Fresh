import API from "../../services/api";

// Dashboard
export const getDashboard = async () => {
  const response = await API.get("/admin/dashboard/");
  return response.data;
};