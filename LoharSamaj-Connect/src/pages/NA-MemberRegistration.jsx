{/*This form is currently not in use. Just Keep it for reference */}
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");

  const calculateAge = (date) => {
    const birthDate = new Date(date);
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      years--;
    }
    setAge(years);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src="/images/FinalLogo.png"
            alt="Community Logo"
            className="h-20 w-20 rounded-full object-contain"
          />
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Member Registration
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Create your account to join the community
          </p>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="First Name"
              className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Middle Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Middle Name"
              className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Last Name"
              className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={dob}
              onChange={(e) => {
                setDob(e.target.value);
                calculateAge(e.target.value);
              }}
              className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Age</label>
            <input
              type="number"
              value={age}
              readOnly
              className="mt-1 w-full rounded-lg border px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Gender <span className="text-red-500">*</span></label>
            <select
              className="mt-1 w-full rounded-lg border px-3 py-2 bg-white
               focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue=""
              required
            >
              <option value="" disabled>
                Gender 
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Mobile</label>
            <input
              type="tel"
              placeholder="9876543210"
              maxLength={10}
              inputMode="numeric"
              pattern="[0-9]*"
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                e.target.value = value;
              }}
              className="mt-1 w-full rounded-lg border px-3 py-2 
             focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Division <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Division"
              className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Address <span className="text-red-500">*</span></label>
            <textarea
              rows="3"
              required
              placeholder="Enter your address"
              className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Education
            </label>
            <input
              type="text"
              placeholder="Education"
              className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Native Place
            </label>
            <input
              type="text"
              placeholder="Native Place"
              className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700">
              Blood Group
            </label>
            <input
              type="text"
              placeholder="Blood Group"
              className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Family Relation <span className="text-red-500">*</span>
            </label>
            <select
              className="mt-1 w-full rounded-lg border px-3 py-2 bg-white
               focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue=""
              required
            >
              <option value="" disabled>
                Family Relation
              </option>
              <option value="self">Self</option>
              <option value="wife">Wife</option>
              <option value="son">Son</option>
              <option value="daughter">Daughter</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Occupation
            </label>
            <input
              type="text"
              placeholder="Occupation"
              className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Firm Name
            </label>
            <input
              type="text"
              placeholder="Firm Name"
              className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold
                     hover:bg-blue-700 transition"
        >
          Register
        </button>

        {/* Footer */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?
            <span
              onClick={() => navigate("/")}
              className="text-blue-600 cursor-pointer hover:underline ml-1"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
