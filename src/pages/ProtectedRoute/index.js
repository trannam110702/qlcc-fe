import { useContext, useEffect } from "react";
import { AuthContext } from "../../hooks/useAuth";
import { authApi } from "../../api/qlccApi";
import Login from "../Login";
import Layout from "../Layout";

const ProtectedRoute = ({ children }) => {
  const { userId, accountType, logout } = useContext(AuthContext);
  useEffect(() => {
    const checkSession = async () => {
      try {
        await authApi.checkExpire();
      } catch (error) {
        logout();
        return <Login />;
      }
    };
    checkSession();
  }, []);
  if (!userId && !accountType) {
    return <Login />;
  }
  return <Layout>{children}</Layout>;
};
export default ProtectedRoute;
