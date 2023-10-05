import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../hooks/useAuth";
import Layout from "../Layout";

const ProtectedRoute = ({ children }) => {
  const { token, accountType } = useContext(AuthContext);
  if (!token) {
    return <Navigate to="/" />;
  }
  return <Layout>{children}</Layout>;
};
export default ProtectedRoute;
