import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/registration/Login.jsx";
import ForgotPasswordPage from "./pages/registration/ForgotPasswordPage.jsx";
import UpdatePasswordPage from "./pages/registration/UpdatePasswordPage.jsx";
import Home from "./pages/manageusers/UserHome.jsx";
import MemberDetail from "./pages/dashboard/MemberDetails.jsx";
import UserRegistration from "./pages/manageusers/UserRegistration.jsx";
import Signup from "./pages/registration/SignUp.jsx";
import ProtectedRoute from "./pages/manageusers/ProtectedRoutes.jsx";
import UserDashboard from "./pages/dashboard/UserDashboard.jsx";
import AdminDashboard from "./pages/dashboard/AdminDashboard.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import CommunityHome from "./pages/communityhome/CommunityHome.jsx";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CommunityHome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/update-password" element={<UpdatePasswordPage />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/members/:id" element={<MemberDetail />} />
          <Route path="/register" element={<UserRegistration />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
