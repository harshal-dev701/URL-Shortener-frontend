import React, { createContext, useContext, useState, useEffect } from "react";
import * as authApi from "../api/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);

  const setToken = (newToken, userData = null) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      setTokenState(newToken);
      setIsAuthenticated(true);
      if (userData) {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
      }
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setTokenState(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      const data = await authApi.getProfile();
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Failed to load profile:", err);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      if (!user) {
        loadUserProfile();
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [token, user]);

  const loginUser = async (email, password) => {
    setIsLoading(true);
    try {
      const data = await authApi.login(email, password);
      setToken(data.token, data.user);
      return data.user;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signupUser = async (name, email, password) => {
    setIsLoading(true);
    try {
      const data = await authApi.signup(name, email, password);
      setToken(data.token, data.user);
      return data.user;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logoutUser = () => {
    setToken(null);
  };

  const forgotPasswordUser = async (email) => {
    try {
      const data = await authApi.forgotPassword(email);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const resetPasswordUser = async (resetToken, password) => {
    try {
      const data = await authApi.resetPassword(resetToken, password);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const changePasswordUser = async (currentPassword, newPassword) => {
    try {
      const data = await authApi.changePassword(currentPassword, newPassword);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const deleteUserUrl = async (shortId) => {
    try {
      const data = await authApi.deleteUrl(shortId);
      return data;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        loginUser,
        signupUser,
        logoutUser,
        forgotPasswordUser,
        resetPasswordUser,
        changePasswordUser,
        deleteUserUrl,
        refreshProfile: loadUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
