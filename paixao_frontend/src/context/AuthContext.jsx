import { createContext, useContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwt_decode(token);

        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
        } else {
          const userData = {
            id: decoded.sub,
            role: decoded.role,
            email: decoded.email || "",
            name:
              decoded.name ||
              decoded.username ||
              decoded.email ||
              "Usuário",
            photo: decoded.photo || decoded.avatar || null,
          };

          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (err) {
        localStorage.removeItem("token");
      }
    }

    setLoading(false);
  }, []);

  const login = (token, expectedRole = null) => {
    if (!token) return false;

    try {
      const decoded = jwt_decode(token);

      if (decoded.exp * 1000 < Date.now()) {
        return false;
      }

      if (
        expectedRole &&
        decoded.role.toLowerCase() !== expectedRole.toLowerCase()
      ) {
        return false;
      }

      const userData = {
        id: decoded.sub,
        role: decoded.role,
        email: decoded.email || "",
        name:
          decoded.name ||
          decoded.username ||
          decoded.email ||
          "Usuário",
        photo: decoded.photo || decoded.avatar || null,
      };

      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("token", token);

      return true;
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("token");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
  };

  const getToken = () => localStorage.getItem("token") || null;

  // 🔥 NOVO: atualizar usuário após edição de perfil
  const updateUser = (newUserData) => {
    setUser((prev) => ({
      ...prev,
      ...newUserData,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,       // 🔥 agora disponível
        updateUser,    // 🔥 melhor prática
        isAuthenticated,
        login,
        logout,
        loading,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}