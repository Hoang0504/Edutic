"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";

interface User {
  id: number;
  email: string;
  name: string;
  avatar: string;
  role: string;
  is_email_verified: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Khởi tạo từ localStorage khi component mount
  useEffect(() => {
    const savedToken = localStorage.getItem("mytoeic_token");
    const savedUser = localStorage.getItem("mytoeic_user");

    if (savedToken && savedUser) {
      try {
        const userData = JSON.parse(savedUser);

        setToken(savedToken);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing saved user data:", error);
        localStorage.removeItem("mytoeic_token");
        localStorage.removeItem("mytoeic_user");
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const handleRedirect = () => {
      if (pathname === "/login" || pathname === "/register") {
        // Chuyển hướng theo role
        if (user?.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }
    };

    handleRedirect();
  }, [user]);

  const login = (newToken: string, userData: User) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem("mytoeic_token", newToken);
    localStorage.setItem("mytoeic_user", JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("mytoeic_token");
    localStorage.removeItem("mytoeic_user");
    router.push("/login");
  };

  const value: AuthContextType = {
    user,
    token,
    role: user?.role || null,
    isLoggedIn: !!token && !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
