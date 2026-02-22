import { createContext, useContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Inicializa autenticação ao montar o contexto
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt_decode(token);

        // Verifica se o token expirou
        if (decoded.exp * 1000 < Date.now()) {
          console.warn("Token expirado ao inicializar AuthContext");
          localStorage.removeItem("token");
          setUser(null);
          setIsAuthenticated(false);
        } else {
          setUser({
            id: decoded.sub,
            role: decoded.role,
            email: decoded.email || "",
          });
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.warn("Token inválido ao inicializar AuthContext", err);
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
      }
    }
    setLoading(false);
  }, []);

  // Login: salva token e atualiza estado
// Dentro do login(token, expectedRole)
const login = (token, expectedRole = null) => {
  if (!token) return false;

  try {
    const decoded = jwt_decode(token);

    if (decoded.exp * 1000 < Date.now()) {
      console.error("Token expirado no login");
      return false;
    }

    // Se houver role esperada, valida
    if (expectedRole && decoded.role.toLowerCase() !== expectedRole.toLowerCase()) {
      console.error(`Usuário não tem permissão de ${expectedRole}`);
      return false;
    }

    setUser({
      id: decoded.sub,
      role: decoded.role,
      email: decoded.email || "",
    });
    setIsAuthenticated(true);
    localStorage.setItem("token", token);
    return true;
  } catch (err) {
    console.error("Erro ao decodificar token no login", err);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    return false;
  }
};

  // Logout: remove token e limpa estado
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
  };

  // Função para pegar token atual
  const getToken = () => localStorage.getItem("token") || null;

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, loading, getToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar o contexto
export function useAuth() {
  return useContext(AuthContext);
}