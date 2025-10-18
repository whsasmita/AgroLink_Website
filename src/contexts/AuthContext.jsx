import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Daftar role yang diizinkan
  const validRoles = ["farmer", "driver", "worker", "general"];

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    let user = null;
    if (userData && userData !== "undefined") {
      try {
        user = JSON.parse(userData);
      } catch {
        user = null;
      }
    }

    if (token && user) {
      // Tambahkan logika validasi role di sini
      if (validRoles.includes(user.role)) {
        setIsAuthenticated(true);
        setUser(user);
      } else {
        // Jika role tidak valid, hapus data dan anggap tidak terautentikasi
        console.log("Role tidak valid, logout otomatis.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsAuthenticated(false);
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    // ✅ Tambahkan validasi userData tidak null
    if (!userData) {
      console.error("userData tidak boleh null");
      return;
    }

    // Tambahkan validasi role saat login
    if (validRoles.includes(userData.role)) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setIsAuthenticated(true);
      setUser(userData);
    } else {
      // Jika role tidak valid, jangan izinkan login
      console.error("Role tidak diizinkan untuk login.");
      throw new Error("Role tidak diizinkan untuk login.");
    }
  };
  
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
