import { createContext, useContext, useState } from "react";
import { authApi } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("pathseeker_user");
      const parsed = saved ? JSON.parse(saved) : null;
      return parsed && typeof parsed === "object" ? parsed : null;
    } catch {
      return null;
    }
  });

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    localStorage.setItem("pathseeker_token", res.data.token);
    localStorage.setItem("pathseeker_user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    console.log("[authApi.login] real response:", res);
    return res;
  };

  const register = async (payload) => {
    const res = await authApi.register(payload);
    console.log("[authApi.register] real response:", res);
    return res;
  };

  const verifyEmail = async (payload) => {
    const res = await authApi.verifyEmail(payload);
    console.log("[authApi.verifyEmail] real response:", res);
    return res;
  };

  const logout = () => {
    localStorage.removeItem("pathseeker_token");
    localStorage.removeItem("pathseeker_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token: () => localStorage.getItem("pathseeker_token"), login, register, verifyEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
