import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { signUpUser } from "../../services/authservices/authservice";
import { useAuth } from "../../context/AuthContext";
import { getUserRoleById } from "../../services/dbservices/user.service";
import { getMemberIdByUserId } from "../../services/memberservice/member.profile.service";
import ResponsiveHeader from "../../component/ResponsiveHeader";

/* ---------- Validation Schema helpers ---------- */
const getValidationSchema = (tab) => {
  if (tab === "mobile") {
    return Yup.object({
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
        .required("Phone is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    });
  }

  return Yup.object({
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });
};

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("mobile");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignup = async (values) => {
    console.log(values);

    setLoading(true);
    setError(null);
    // Later: Supabase signup here
    try {
      const data = await signUpUser(values);
      console.log("Signup successful:", data.user.id);
      const userRoleInfo = await getUserRoleById(data.user.id);

      // 2. Wait until member row exists (poll once or twice)
      let memberId = null;
      let attempts = 0;

      while (!memberId && attempts < 5) {
        memberId = await getMemberIdByUserId(data.user.id);
        attempts++;
        if (!memberId) {
          await new Promise((res) => setTimeout(res, 2000));
        }
      }

      if (!memberId) {
        throw new Error("Profile creation failed. Please retry.");
      } 
      login(data.user.id, userRoleInfo.user_role, memberId);
      navigate("/register");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ResponsiveHeader />
      <div className="w-full flex items-center justify-center bg-gray-50 px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-[#3a2e2a]">Create Account</h1>
            <p className="text-sm text-gray-500 mt-1">
              {activeTab === "email"
                ? "Sign up using your email and password"
                : "Sign up using your mobile and password"}
            </p>
          </div>

          <div className="mb-4 bg-gray-100 rounded-lg p-1 flex">
            <button
              onClick={() => setActiveTab("mobile")}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === "mobile"
                  ? "bg-white text-blue-600 shadow"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              Mobile
            </button>
            <button
              onClick={() => setActiveTab("email")}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === "email"
                  ? "bg-white text-blue-600 shadow"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              Email
            </button>
          </div>

          <Formik
            initialValues={{ email: "", phone: "", password: "" }}
            validationSchema={getValidationSchema(activeTab)}
            onSubmit={handleSignup}
            enableReinitialize
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                {/* Email or Phone */}
                {activeTab === "email" ? (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Field
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="email"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Mobile <span className="text-red-500">*</span>
                    </label>
                    <Field
                      type="tel"
                      name="phone"
                      placeholder="9876543210"
                      className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="phone"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                )}

                {/* Password */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••"
                      className="mt-1 w-full rounded-lg border px-3 py-2 
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-sm text-blue-600 
                               cursor-pointer select-none"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </span>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold
                           hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading && (
                    <span
                      className="h-10 w-10 animate-spin rounded-full
                     border-2 border-white border-t-transparent"
                    />
                  )}
                  {loading ? "Signing up..." : "Sign Up"}
                </button>
              </Form>
            )}
          </Formik>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?
              <span
                onClick={() => navigate("/login")}
                className="text-blue-600 cursor-pointer hover:underline ml-1"
              >
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
