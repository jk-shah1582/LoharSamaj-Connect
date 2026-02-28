import { useState } from "react";
import MemberDetail from "../dashboard/MemberDetails";
import FamilyMembers from "./FamilyMembers"; // your separate component

export default function ProfilePage({ onBack, onEditProfile, setActionView }) {
  const [activeTab, setActiveTab] = useState("personal");

  return (
    <div className="w-full">
      {/* Tab Strip */}
      <div className="relative w-full border-b border-gray-200 bg-white mb-6">
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("personal")}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
              activeTab === "personal"
                ? "bg-gradient-to-r from-blue-400 to-amber-400 text-white shadow-md hover:brightness-110"
                : "text-gray-500 hover:text-blue-600"
            }`}
          >
            Personal Details
          </button>

          <button
            onClick={() => setActiveTab("family")}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
              activeTab === "family"
                ? "bg-gradient-to-r from-blue-400 to-amber-400 text-white shadow-md hover:brightness-110"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Family Members
          </button>

          {/* Sliding Indicator */}
          <span
            className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${
              activeTab === "personal"
                ? "w-1/2 translate-x-0"
                : "w-1/2 translate-x-full"
            }`}
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        {activeTab === "personal" && (
          <MemberDetail
            onBack={onBack}
            showBackButton={true}
            editProfile={true}
            onEditProfile={onEditProfile}
            setActionView={setActionView}
          />
        )}

        {activeTab === "family" && <FamilyMembers />}
      </div>
    </div>
  );
}
