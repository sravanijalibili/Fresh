import API from "./api";

export const getProfile = async () => {
  const token = localStorage.getItem("access");

  const response = await API.get("/auth/profile/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateProfile = async (profileData) => {
  const token = localStorage.getItem("access");

  const response = await API.put(
    "/auth/profile/",
    profileData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};