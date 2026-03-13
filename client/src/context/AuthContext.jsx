import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/axios.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { token: jwt, user: loggedInUser } = res.data;
    sessionStorage.setItem("token", jwt);
    sessionStorage.setItem("user", JSON.stringify(loggedInUser));
    setToken(jwt);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = async (name, email, password) => {
    await api.post("/auth/register", { name, email, password });
    // After registration user can be redirected to login
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = sessionStorage.getItem("token");
      const storedUser = sessionStorage.getItem("user");

      if (!storedToken) {
        setLoading(false);
        return;
      }

      setToken(storedToken);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          setUser(null);
        }
      }

      try {
        const res = await api.get("/auth/me");
        const safeUser = res.data?.user;
        if (safeUser) {
          setUser(safeUser);
          sessionStorage.setItem("user", JSON.stringify(safeUser));
        }
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    void initAuth();
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

