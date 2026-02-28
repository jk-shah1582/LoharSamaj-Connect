import { getFamilyMembers, removeFamilyMemberFromFamily } from "../../services/memberservice/familymember.profile.service";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getFamilyIdByMemberId } from "../../services/memberservice/member.profile.service";
import MemberDetails from "../dashboard/MemberDetails.jsx";

export default function FamilyMembers({profileId=null}) {
  const [familyMemberList, setFamilyMemberList] = useState([]);
  const { userId, memberId } = useAuth();
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
        let familyId="";
        if(profileId)
        {
          familyId = await getFamilyIdByMemberId(profileId); 
        }
        else{
          familyId = await getFamilyIdByMemberId(memberId);
        }
        const members = await getFamilyMembers(familyId, userId);
        setFamilyMemberList(members);
        console.log("FamilyMembers - Fetched family members:", members);
      } catch (error) {
        console.error("Error fetching family members:", error);
      }
    };

    if (memberId && userId) {
      fetchFamilyMembers();
    }
  }, []);

   /* ✅ IF A Family member IS SELECTED → SHOW MEMBERS VIEW */
    if (selectedMember) {
      console.log("FamilyMembers - Selected member ID for details view:", selectedMember);
      return (
        <MemberDetails
          id={selectedMember} // pass full object
          onBack={() => setSelectedMember(null)}
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
          {familyMemberList.map((member) => (
            
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
                  setSelectedMember(member.id)
                }}>
                  View
                </button>
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
