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
<<<<<<< HEAD

      if (!response.ok) {
        setUser(null);
        return;
      }

      const data = await response.json();

      setUser(data.admin ? data.admin : data.userPayload);
=======
      setUser(response.ok ? await response.json() : null);
>>>>>>> 04829cb (Added Functionality to Request Device Form)
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
