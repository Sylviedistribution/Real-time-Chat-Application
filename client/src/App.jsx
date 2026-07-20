import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import ChatWelcome from "./pages/ChatWelcome";
import ChatRoom from "./pages/ChatRoom";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null; // évite le "flash" de redirection au rechargement
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>}>
            <Route index element={<ChatWelcome />} />
            <Route path=":roomId" element={<ChatRoom />} />
<<<<<<< HEAD
          </Route>          
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/chat" replace />} />
=======
          </Route>          <Route path="*" element={<Navigate to="/chat" replace />} />
>>>>>>> 1aa6f45b82911598d043dcf90324f24003171291
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}