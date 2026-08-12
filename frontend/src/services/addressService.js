import API from "./api";

export const getAddresses = async () => {
  const token = localStorage.getItem("access");

  const response = await API.get("/auth/addresses/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const addAddress = async (address) => {
  const token = localStorage.getItem("access");

  const response = await API.post("/auth/addresses/", address, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateAddress = async (id, address) => {
  const token = localStorage.getItem("access");

  const response = await API.put(`/auth/addresses/${id}/`, address, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deleteAddress = async (id) => {
  const token = localStorage.getItem("access");

  await API.delete(`/auth/addresses/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
