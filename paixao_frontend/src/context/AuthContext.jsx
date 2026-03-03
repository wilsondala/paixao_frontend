import { createContext, useContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    // ✅ Primeiro tenta restaurar o user salvo (inclui photo)
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem("user");
      }
    }

    // ✅ Depois valida token (expiração)
    if (token) {
      try {
        const decoded = jwt_decode(token);

        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
          setIsAuthenticated(false);
        } else {
          // Se não existir user salvo, cria um mínimo do token
          if (!storedUser) {
            const userData = {
              id: decoded.sub,
              role: decoded.role,
              email: decoded.email || "",
              name: decoded.name || decoded.username || decoded.email || "Usuário",
              photo: decoded.photo || decoded.avatar || null,
            };

            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem("user", JSON.stringify(userData));
          }
        }
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setIsAuthenticated(false);
      }
    } else {
      // Sem token, limpa tudo
      localStorage.removeItem("user");
      setUser(null);
      setIsAuthenticated(false);
    }

    setLoading(false);
  }, []);

  const login = (token, expectedRole = null) => {
    if (!token) return false;

    try {
      const decoded = jwt_decode(token);

      if (decoded.exp * 1000 < Date.now()) return false;

      if (
        expectedRole &&
        decoded.role &&
        decoded.role.toLowerCase() !== expectedRole.toLowerCase()
      ) {
        return false;
      }

      const userData = {
        id: decoded.sub,
        role: decoded.role,
        email: decoded.email || "",
        name: decoded.name || decoded.username || decoded.email || "Usuário",
        photo: decoded.photo || decoded.avatar || null,
      };

      setUser(userData);
      setIsAuthenticated(true);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData)); // ✅ salva

      return true;
    } catch {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // ✅ limpa
  };

  const getToken = () => localStorage.getItem("token") || null;

  // ✅ Atualiza user e persiste (principal para photo fixar)
  const updateUser = (newUserData) => {
    setUser((prev) => {
      const updated = { ...(prev || {}), ...(newUserData || {}) };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,     // mantém para compatibilidade
        updateUser,  // recomendado
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