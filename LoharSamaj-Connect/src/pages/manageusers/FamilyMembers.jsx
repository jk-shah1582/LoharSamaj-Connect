import { getFamilyMembers, removeFamilyMemberFromFamily } from "../../services/memberservice/familymember.profile.service";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getFamilyIdByMemberId } from "../../services/memberservice/member.profile.service";
import MemberDetails from "../dashboard/MemberDetails.jsx";
import EditFamMember from "./EditFamMember.jsx";

export default function FamilyMembers({profileId=null}) {
  const [familyMemberList, setFamilyMemberList] = useState([]);
  const { userId, memberId } = useAuth();
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [familyId, setFamilyId] = useState(null);

  const fetchFamilyMembers = async () => {
    console.log("InSide FamilyMemebers - profileID:", profileId);
    try {
      let familyIdValue = "";
      if (profileId) {
        familyIdValue = await getFamilyIdByMemberId(profileId);
      } else {
        familyIdValue = await getFamilyIdByMemberId(memberId);
      }
      setFamilyId(familyIdValue);
      const members = await getFamilyMembers(familyIdValue, userId);
      setFamilyMemberList(members);
      console.log("FamilyMembers - Fetched family members:", members);
    } catch (error) {
      console.error("Error fetching family members:", error);
    }
  };

  useEffect(() => {
    if (memberId && userId) {
      fetchFamilyMembers();
    }
  }, [memberId, userId, profileId]);

   /* ✅ IF A Family member IS SELECTED → SHOW THE RIGHT VIEW */
    if (selectedMember) {
      if (selectedAction === "edit") {
        console.log("FamilyMembers - Selected member for edit:", selectedMember);
          return (
            <EditFamMember
              famMember={selectedMember}
              onCancel={() => {
                setSelectedMember(null);
                setSelectedAction(null);
              }}
              onSave={async () => {
                await fetchFamilyMembers();
                setSelectedMember(null);
                setSelectedAction(null);
              }}
            />
          );
      }

      console.log("FamilyMembers - Selected member ID for details view:", selectedMember);
      return (
        <MemberDetails
          id={selectedMember}
          onBack={() => {
            setSelectedMember(null);
            setSelectedAction(null);
          }}
        />
      );
    }

  return (
    <div className="p-3">
      
      {familyMemberList.length === 0 ? (
        <div className="text-gray-500 text-center py-10">
          No family members found.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-1">
          {familyMemberList.map((member) =>(
            <div
              key={member.id}
             // onClick={() => setSelectedMember(member.id)}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-3 border border-gray-100"
            >
              {/* Avatar */}
              <div className="flex items-center space-x-4 mb-1">
                
                {member.member_profile_withtranslation?.[0]?.user_fname && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {member.member_profile_withtranslation[0]?.user_fname} {member.member_profile_withtranslation[0]?.user_mname} {member.member_profile_withtranslation[0]?.user_lname}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium">
                    <span className="font-medium text-gray-700">Family Relation:</span>{" "} {member.member_profile_withtranslation[0]?.fam_relationship || "Family Member"}
                  </p>
                </div>
                ) }
              </div>

              {/* Details */}
              <div className="space-y-1 text-sm text-gray-600">
                {member.user_phone && (
                  <p>
                    <span className="font-medium text-gray-700">Phone:</span>{" "}
                    {member.user_phone}
                  </p>
                )}
                {member.user_dob && (
                  <p>
                    <span className="font-medium text-gray-700">DOB:</span>{" "}
                    {member.user_dob}
                  </p>
                )}
              </div>

              {/* Optional Action Buttons */}
              <div className="mt-5 flex justify-end gap-2">
                <button 
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 text-blue-600 hover:bg-blue-100 transition"
                onClick={() => {
                  setSelectedMember(member.id);
                  setSelectedAction("view");
                }}>
                  View
                </button>
                {profileId == null && (
                <button 
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 text-blue-600 hover:bg-blue-100 transition"
                onClick={() => {
                  setSelectedMember(member);
                  setSelectedAction("edit");
                }}>
                  Edit
                </button>
                )}
                {profileId == null && (
                <button 
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                onClick={() => {
                  removeFamilyMemberFromFamily(member.id);
                  setFamilyMemberList(familyMemberList.filter(m => m.id !== member.id));
                }}>
                  Remove
                </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
