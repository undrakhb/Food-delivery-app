"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { server } from "../_api/api";

const AuthContext = createContext({
  user: null,
  token: null,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  export const getUser = async () => {
    const {user} = await server.get("/auth/:id"); 
    
  }

  // Хуудас ачаалагдахад localStorage-аас user болон token-ийг авна
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken) {
      setToken(savedToken);
    }

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error("Failed to parse user from localStorage:", err);
      }
    }

    setIsLoading(false);
  }, []);

  // Login функц (email, password хүлээн авч backend рүү хүсэлт явуулна)
  const login = async (email, password) => {
    try {
      const res = await fetch("http://localhost:1000/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Нэвтрэхэд алдаа гарлаа.");
      }

      // Backend-ээс token болон user ирнэ гэж тооцсон
      const { token: newToken, user: userData } = data;

      if (newToken) {
        localStorage.setItem("token", newToken);
        setToken(newToken);
      }

      if (userData) {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Signup функц (email, password хүлээн авч backend рүү хүсэлт явуулна)
  const signup = async (email, password) => {
    try {
      const res = await fetch("http://localhost:1000/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Бүртгүүлэхэд алдаа гарлаа.");
      }

      const { token: newToken, user: userData } = data;

      if (newToken) {
        localStorage.setItem("token", newToken);
        setToken(newToken);
      }

      if (userData) {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Logout функц (localStorage болон state-ийг цэвэрлэнэ)
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};