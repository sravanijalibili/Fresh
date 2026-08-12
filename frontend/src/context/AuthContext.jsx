import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // ==========================================
  // Loading State
  // ==========================================

  const [loading, setLoading] = useState(true);

  // ==========================================
  // Restore Login Session
  // ==========================================

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);

        setUser(parsedUser);
      } catch (error) {
        console.error("Invalid user data");

        localStorage.removeItem("user");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        setUser(null);
      }
    }

    // Login session restoration completed
    setLoading(false);
  }, []);

  // ==========================================
  // Login
  // ==========================================

  const login = (
    userData,
    accessToken,
    refreshToken
  ) => {
    // Save user
    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    // Save JWT access token
    localStorage.setItem(
      "access",
      accessToken
    );

    // Save JWT refresh token
    localStorage.setItem(
      "refresh",
      refreshToken
    );

    // Update React state
    setUser(userData);
  };

  // ==========================================
  // Logout
  // ==========================================

  const logout = () => {
    // Remove normal authentication
    localStorage.removeItem("user");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    // Remove old admin authentication
    localStorage.removeItem("admin_access");
    localStorage.removeItem("admin_refresh");
    localStorage.removeItem("admin_user");

    // Clear React authentication state
    setUser(null);
  };

  // ==========================================
  // Context
  // ==========================================

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,

        // True when user is logged in
        isAuthenticated: !!user,

        // True while restoring session
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ==========================================
// useAuth Hook
// ==========================================

export function useAuth() {
  return useContext(AuthContext);
}