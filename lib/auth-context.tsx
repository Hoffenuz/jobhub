"use client"

import type { User } from "./models"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  register: (userData: Partial<User>, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("currentUser")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      console.log("Sending login request:", { username });
      
      let response;
      try {
        response = await fetch('https://serverjobhub2.onrender.com/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });
      } catch (connectionError) {
        console.error("Connection error during login:", connectionError);
        // Handle CORS or network errors
        setIsLoading(false);
        return false;
      }

      let data;
      try {
        data = await response.json();
        console.log("Server login response:", { status: response.status, data });
      } catch (parseError) {
        console.error("Error parsing login response:", parseError);
        setIsLoading(false);
        return false;
      }
      
      if (response.ok) {
        const userData: User = {
          id: data.user?.id?.toString() || "temp-id",
          name: data.user?.username || username,
          email: username,
          avatar: "/placeholder-user.jpg",
          userType: "jobseeker",
          location: {
              country: "O'zbekiston",
              region: "",
              city: "",
            },
            createdAt: new Date(),
            lastActive: new Date(),
            verificationStatus: "unverified",
            subscription: "free",
        };
        
        setUser(userData);
        localStorage.setItem("currentUser", JSON.stringify(userData));
        setIsLoading(false);
        return true;
      } else {
        console.error("Login failed:", data.message);
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      return false;
    }
  }

  const register = async (userData: Partial<User>, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      console.log("Sending registration request:", {
        username: userData.name,
        email: userData.email
      });
      
      let response;
      try {
        response = await fetch('https://serverjobhub2.onrender.com/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: userData.name,
            email: userData.email,
            password: password
          }),
        });
      } catch (connectionError) {
        console.error("Connection error during registration:", connectionError);
        // Handle CORS or network errors
        setIsLoading(false);
        return false;
      }

      let data;
      try {
        data = await response.json();
        console.log("Server register response:", { status: response.status, data });
      } catch (parseError) {
        console.error("Error parsing registration response:", parseError);
        setIsLoading(false);
        return false;
      }
      
      if (response.ok) {
        // After successful registration, automatically log in
        const loginSuccess = await login(userData.name || "", password);
        return loginSuccess;
      } else {
        console.error("Registration failed:", data.message);
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Registration network error:", error);
      setIsLoading(false);
      return false;
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
  }

  return <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
