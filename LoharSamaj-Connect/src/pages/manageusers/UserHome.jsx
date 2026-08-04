import { supabase } from "../../services/superbase";
import { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { getUserProfileWTById } from "../../services/dbservices/user.service.js";
import { getMemberIdByUserId, getUserApprovalStatus } from "../../services/memberservice/member.profile.service.js";
import UserDashboard from "../dashboard/UserDashboard.jsx";
import AdminDashboard from "../dashboard/AdminDashboard.jsx";
import ResponsiveHeader from "../../component/ResponsiveHeader.jsx";

export default function Home() {
  const navigate = useNavigate();
  // const [firstName, setFirstName] = useState("");

  const { userId, userType, userRole, userName, userPhoto, isAuthenticated, logout, setUserName } =
    useAuth();
  const [userApprovalStatus, setUserApprovalStatus] = useState(null);
  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const loadUser = async () => {
      const memberId = await getMemberIdByUserId(userId);
      const approvalStatus = await getUserApprovalStatus(userId);
      setUserApprovalStatus(approvalStatus);
      console.log("User approval status: for user :", userId, approvalStatus);
      const userProfileWT = await getUserProfileWTById(memberId);
      if (userProfileWT && userProfileWT.length > 0) {
        //  setFirstName(userProfileWT[0].user_fname);
        setUserName(userProfileWT[0].user_fname);
      }
    };

    loadUser();
  }, [userId]);

  const isApproved = userApprovalStatus === true;

  return (
    <div className="min-h-screen w-full flex flex-col bg-white">
      {isApproved && <ResponsiveHeader />}

      {/* ================= MIDDLE ================= */}
      <main className="flex-1 w-full">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {isApproved ? (
            <div className="bg-white rounded-xl shadow-lg p-6">
              {/*userRole === "admin" ? <AdminDashboard /> : <UserDashboard />*/}
              <UserDashboard />
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <h2 className="text-2xl font-semibold text-gray-800">Registration Successful!</h2>
              <p className="mt-3 text-gray-600">
                Wait for approval. Try again after sometime.
              </p>
              <button
                onClick={handleLogout}
                className="mt-6 inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Exit
              </button>
            </div>
          )}
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="w-full bg-gray-50 border-t">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center space-y-3">
          {/* Social Links */}
          <div className="flex justify-center gap-6 text-gray-600">
            <a
              href="https://wa.me/xxxxxxxxxx"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-600"
            >
              WhatsApp
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600"
            >
              Facebook
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sky-500"
            >
              Twitter
            </a>
          </div>

          {/* Credit */}
          <p className="text-sm text-gray-500">
            Created by <span className="font-semibold">ABC Company</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
