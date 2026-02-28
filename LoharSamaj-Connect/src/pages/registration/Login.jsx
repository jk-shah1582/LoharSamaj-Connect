import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { signInUser } from "../../services/authservices/loginservice";
import { useAuth } from "../../context/AuthContext.jsx";
import { getUserRoleById } from "../../services/dbservices/user.service.js";
import { getMemberIdByUserId } from "../../services/memberservice/member.profile.service.js";
import ResponsiveHeader from "../../component/ResponsiveHeader.jsx";

/* ---------- Validation Schema ---------- */
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (values) => {
    console.log(values);
    // Later: Supabase login here

    try {
      const userInfo = await signInUser(values);
      const userRoleInfo = await getUserRoleById(userInfo.user.id);
      const memberId = await getMemberIdByUserId(userInfo.user.id);
      console.log("User info:", userInfo);
      console.log("User role info:", userRoleInfo);
      login(
        userInfo.user.id,
        userRoleInfo.user_role,
        memberId,
        userRoleInfo.user_photo,
      );
      navigate("/home");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ================== HEADER / BANNER ================== */}

      <ResponsiveHeader />
      {/* ================== LOGIN FORM ================== */}
      <div className="flex justify-center mt-10 px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-[#3a2e2a]">Profile Login</h1>
            <p className="text-sm text-gray-500 mt-1">
              Sign in to access the member directory
            </p>
          </div>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Field
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Field
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold
                             hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>
              </Form>
            )}
          </Formik>

          {/* Footer */}
          <div className="text-center mt-3">
            <p className="text-sm text-gray-600">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:underline hover:text-blue-700 transition mr-2"
              >
                Forgot Password?
              </Link>
              New user?
              <span
                onClick={() => navigate("/signup")}
                className="text-blue-600 cursor-pointer hover:underline ml-1"
              >
                Register
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
