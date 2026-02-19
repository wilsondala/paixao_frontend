import { createContext, useContext, useEffect, useState, useMemo } from "react";
import api from "../api/client";
import jwt_decode from "jwt-decode";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      delete api.defaults.headers.common["Authorization"];
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const decoded = jwt_decode(token);

      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
        setToken(null);
        setUser(null);
        setLoading(false);
        return;
      }

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser({
        id: decoded.sub,
        role: decoded.role?.toLowerCase(),
      });

    } catch (err) {
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
      setToken(null);
      setUser(null);
    }

    setLoading(false);
  }, [token]);

  const login = (accessToken) => {
    localStorage.setItem("token", accessToken);
    setToken(accessToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({
    token,
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
  }), [token, user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  }
  return context;
}
