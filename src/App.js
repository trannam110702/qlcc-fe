import "./App.css";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./pages/ProtectedRoute";
function App() {
  return (
    <AuthProvider>
      <ProtectedRoute></ProtectedRoute>
    </AuthProvider>
  );
}

export default App;
