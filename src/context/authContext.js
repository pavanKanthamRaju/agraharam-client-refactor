import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [redirectPath, setRedirectPath] = useState("/dashboard");
  const [loading, setLoading] = useState(true);

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // ✅ save to localStorage
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user"); // ✅ remove from localStorage
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, redirectPath, setRedirectPath, loading}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
