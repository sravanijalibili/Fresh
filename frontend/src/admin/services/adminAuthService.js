import api from "../../services/api";

export const adminLogin = async (credentials) => {
  const res = await api.post("/auth/adminLogin/", credentials);

  return res.data;
};
