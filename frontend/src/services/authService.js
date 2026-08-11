import API from "./api";

// ===============================
// Register User
// ===============================

export const register = async (userData) => {
  const response = await API.post(
    "/auth/register/",
    userData
  );

  return response.data;
};


// ===============================
// Login User
// ===============================

export const login = async (credentials) => {
  const response = await API.post(
    "/auth/login/",
    credentials
  );

  return response.data;
};


// ===============================
// Logout User
// ===============================

export const logout = () => {

  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");

};


// ===============================
// Get Access Token
// ===============================

export const getAccessToken = () => {

  return localStorage.getItem("access");

};


// ===============================
// Get Current User
// ===============================

export const getCurrentUser = () => {

  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    return null;
  }

  try {

    return JSON.parse(storedUser);

  } catch (error) {

    console.error("Invalid user data in localStorage");

    localStorage.removeItem("user");

    return null;

  }

};


// ===============================
// Check Login Status
// ===============================

export const isLoggedIn = () => {

  return !!localStorage.getItem("access");

};


// ===============================
// Check Admin
// ===============================

export const isAdmin = () => {

  const user = getCurrentUser();

  if (!user) {
    return false;
  }

  return user.is_staff === true || user.is_superuser === true;

};