import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { login as authLogin, register as authRegister, setAuthToken, clearAuthToken } from "../api/auth";

type UserRole = "admin" | "staff" | "user";

interface User {
  username: string;
  role: UserRole1;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<User | null>;
  register: (username: string, password: string, role: UserRole) => Promise<true | string>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const { token, user: loggedUser } = await authLogin({ username, password });
      setAuthToken(token);
      localStorage.setItem('token', token);
      setUser(loggedUser);
      return loggedUser;
    } catch (err) {
      console.error('Login failed:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, password: string, role: UserRole) => {
    setLoading(true);
    try {
      const { token, user: newUser } = await authRegister({ username, password, role });
      setAuthToken(token);
      localStorage.setItem('token', token);
      setUser(newUser);
      return true;
    } catch (err: any) {
      console.error('Register failed:', err);
      return err.response?.data?.error || err.message || 'Registration server error.';
    } finally {
      setLoading(false);
    }
  };


  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    clearAuthToken();
    setLoading(false);
  };

  // Decode JWT payload (simple base64 decode)
  const decodeJwt = (token: string): User | null => {
    try {
      const payload = token.split('.')[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
      const decoded = JSON.parse(atob(padded));
      // Check expiry
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        return null;
      }
      if (decoded.username && decoded.role && (decoded.role === 'admin' || decoded.role === 'staff' || decoded.role === 'user')) {
        return {
          username: decoded.username,
          role: decoded.role,
        };
      }
      return null;
    } catch {
      return null;
    }
  };

  // Check for existing token on mount and restore user
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userData = decodeJwt(token);
      if (userData) {
        setUser(userData);
        setAuthToken(token);
      } else {
        // Invalid token
        localStorage.removeItem('token');
        clearAuthToken();
      }
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );

};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

