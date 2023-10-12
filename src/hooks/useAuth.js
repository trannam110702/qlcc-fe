import { createContext, useContext, useMemo } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import useLocalStorage from "./useLocalStorage";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useLocalStorage("userId");
  const [accountType, setAccountType] = useLocalStorage("accountType");
  const navigate = useNavigate();
  const login = async ({ userId, accountType }) => {
    setUserId(userId);
    setAccountType(accountType);
    navigate("/");
  };

  const logout = () => {
    window.localStorage.removeItem("userId");
    window.localStorage.removeItem("accountType");
    navigate("/", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ userId, accountType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export { AuthContext };
export default AuthProvider;
