import { useContext } from "react";
import { AuthContext } from "../../hooks/useAuth";
import Login from "../Login";
import Layout from "../Layout";

const ProtectedRoute = ({ children }) => {
  const { userId, accountType } = useContext(AuthContext);
  if (!userId && !accountType) {
    return <Login />;
  }
  return <Layout>{children}</Layout>;
};
export default ProtectedRoute;
