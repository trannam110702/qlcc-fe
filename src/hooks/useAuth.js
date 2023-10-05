import { createContext, useContext, useMemo } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import useLocalStorage from "./useLocalStorage";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useLocalStorage("token");
  const [accountType, setAccountType] = useLocalStorage("accountType");
  const navigate = useNavigate();
  const login = async ({ token, type }) => {
    setToken(token);
    setAccountType(type);
    navigate("/dashboard");
  };

  const logout = () => {
    // setToken(null);
    // setAccountType(null);
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("accountType");
    navigate("/", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ token, accountType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export { AuthContext };
export default AuthProvider;
