import { createContext, useContext, useMemo } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import useLocalStorage from "./useLocalStorage";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useLocalStorage("userId");
  const [accountType, setAccountType] = useLocalStorage("accountType");
  const [userData, setUserData] = useLocalStorage("userData");
  const navigate = useNavigate();
  const login = async ({ userId, accountType, userData }) => {
    setUserId(userId);
    setAccountType(accountType);
    setUserData(userData);
    navigate("/");
  };

  const logout = () => {
    window.localStorage.removeItem("userId");
    window.localStorage.removeItem("accountType");
    window.localStorage.removeItem("userData");
    navigate("/", { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{ userId, accountType, userData, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export { AuthContext };
export default AuthProvider;
