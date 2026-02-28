import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import AddExistingMember from "./AddExistingMember.jsx";
import AddNewFamilyMember from "./AddNewFamilyMember.jsx";
import { getFamilyIdByMemberId } from "../../services/memberservice/member.profile.service.js";
import {
  checkFamilyHeadExists,
  updateFamilyHeadStatus,
} from "../../services/memberservice/updateprofile.js";

export default function AssignFamily({ onBack }) {
  const [activeTab, setActiveTab] = useState("existing");
  const [famId, setFamId] = useState(null);
  const { memberId, userId } = useAuth();

  useEffect(() => {
    if (!memberId) return;
    // Fetch member details using memberId

    const fetchMemberDetails = async () => {
      try {
        const checkIfFamHeadExists = await checkFamilyHeadExists(memberId);
        console.log(
          "Check if family head exists result:",
          checkIfFamHeadExists,
        );
        if (checkIfFamHeadExists) {
          alert(
            "Only family head can add members to the family. Please contact your family head.",
          );
          onBack();
        } else {
          const fam_head_status = await updateFamilyHeadStatus(memberId, true);
          if (fam_head_status) {
            const res = await getFamilyIdByMemberId(memberId);
            console.log("AssignFamily - Fetched family ID:", res);
            setFamId(res);
          }
        }
      } catch (err) {
        console.error("Error fetching member details:", err);
      }
    };

    fetchMemberDetails();
  }, [memberId]);

  if (!famId) {
    return <div>Loading family details...</div>;
  }

  return (
    <div>
      {/* Tabs */}
      <div className="w-full justify-left mb-8">
        <div className="flex bg-gray-100 p-1 shadow-inner rounded-xl">
          <button
            onClick={() => setActiveTab("existing")}
            className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
              activeTab === "existing"
                ? "bg-gradient-to-r from-blue-400 to-amber-400 text-white shadow-md hover:brightness-110"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Add Existing Member
          </button>

          <button
            onClick={() => setActiveTab("new")}
            className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
              activeTab === "new"
                ? "bg-gradient-to-r from-blue-400 to-amber-400 text-white shadow-md hover:brightness-110"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Add New Member
          </button>

          <button
            onClick={onBack}
            className="ml-auto px-6 py-2 text-sm text-blue-600"
          >
            ← Back to Member Details
          </button>
        </div>
      </div>

      {/* Tab content */}
      {famId && activeTab === "existing" && (
        <AddExistingMember familyId={famId} />
      )}

      {famId && activeTab === "new" && <AddNewFamilyMember familyId={famId} />}
    </div>
  );
}
