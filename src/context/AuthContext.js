import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [authHeader, setAuthHeader] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authHeader");
    const userInfo = localStorage.getItem("userInfo");

    if (token && userInfo) {
      setAuthHeader(token);
      setUser(JSON.parse(userInfo));
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userInfo, token) => {
    localStorage.setItem("authHeader", token);
    localStorage.setItem("userInfo", JSON.stringify(userInfo));

    setAuthHeader(token);
    setUser(userInfo);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("authHeader");
    localStorage.removeItem("userInfo");

    setAuthHeader(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authHeader,
        isAuthenticated,
        login,
        logout,
        isAdmin: user?.role === "ADMIN",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
