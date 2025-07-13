import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getMe = async () => {
    try {
      const response = await fetch("/api/me");

      if (!response.ok) {
        setUser(null);
        return;
      }

      const data = await response.json();

      setUser(data.loginType === "admin" ? data.admin : data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMe();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
