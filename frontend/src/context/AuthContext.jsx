import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);


  // ==========================================
  // Restore Login Session
  // ==========================================

  useEffect(() => {

    const storedUser = localStorage.getItem("user");

    if (storedUser) {

      try {

        setUser(JSON.parse(storedUser));

      } catch (error) {

        console.error("Invalid user data");

        localStorage.removeItem("user");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        setUser(null);
      }
    }

  }, []);


  // ==========================================
  // Login
  // ==========================================

  const login = (
    userData,
    accessToken,
    refreshToken
  ) => {

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    localStorage.setItem(
      "access",
      accessToken
    );

    localStorage.setItem(
      "refresh",
      refreshToken
    );

    setUser(userData);
  };


  // ==========================================
  // Logout
  // ==========================================

  const logout = () => {

    // Remove unified authentication
    localStorage.removeItem("user");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    // Remove old admin authentication
    // in case it still exists from the previous system
    localStorage.removeItem("admin_access");
    localStorage.removeItem("admin_refresh");
    localStorage.removeItem("admin_user");

    setUser(null);
  };


  return (

    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >

      {children}

    </AuthContext.Provider>

  );
}


export function useAuth() {

  return useContext(AuthContext);

}