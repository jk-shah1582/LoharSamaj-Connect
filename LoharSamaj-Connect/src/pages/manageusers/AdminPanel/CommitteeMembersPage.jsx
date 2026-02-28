import { useEffect, useState } from "react";
import { ArrowLeftCircle, X } from "lucide-react";
import {
  getCommitteeMembersWithDetails,
  assignMemberToCommittee, // 👈 you must create this service
  updateCommitteeMemberStatus,
} from "../../../services/committeeservices/committee.manage.service";
import { searchMembersByName } from "../../../services/memberservice/member.profile.service";

export default function CommitteeMembersPage({ committee, onBack }) {
  const [searchText, setSearchText] = useState("");
  const [searchMembers, setSearchMembers] = useState([]);
  const [assignedMembers, setAssignedMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [role, setRole] = useState("");
  const [regDate, setRegDate] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Load already assigned members
  useEffect(() => {
    const loadMembers = async () => {
      setLoading(true);
      const data = await getCommitteeMembersWithDetails(committee.com_id);
      setAssignedMembers(data || []);
      setLoading(false);
    };
    loadMembers();
  }, [committee]);

  // 🔍 Search Member
  const handleSearch = async () => {
    if (!searchText.trim()) return;
    setLoading(true);
    const members = await searchMembersByName(searchText);
    if (members.length === 0)
      alert("Sorry! The Member you have searched is not a registered user.");
    setSearchMembers(members || []);
    setLoading(false);
  };

  // ✅ Assign Member
  const handleAssign = async () => {
    console.log("Searched Member Details: ",selectedMember);
    if (!selectedMember || !role || !regDate) {
      alert("Please select member, role and registration date");
      return;
    }

    const payload = {
      com_id: committee.com_id,
      user_id: selectedMember.user_id,
      com_role: role,
      user_committee_reg_dt: regDate,
    };

    const result = await assignMemberToCommittee(payload);

    if (result?.success) {
      // 👇 Update state immediately without reload
      setAssignedMembers((prev) => [
        ...prev,
        {
          id: result.data.id,
          com_role: role,
          user_committee_reg_dt: regDate,
          member: {
            user_fname:
              selectedMember.member_profile_withtranslation?.[0]?.user_fname,
            user_mname:
              selectedMember.member_profile_withtranslation?.[0]?.user_mname,
            user_lname:
              selectedMember.member_profile_withtranslation?.[0]?.user_lname,
          },
        },
      ]);

      // Reset form
      setSelectedMember(null);
      setRole("");
      setRegDate("");
      setSearchMembers([]);
      setSearchText("");

      alert("Member assigned successfully!");
    }
    else{
      alert("Sorry!, fail to add committee member. Check if selected member is already in committee?")
    }
  };

  //Remove Member from committee
  const handleRemoveMember = async(id)=>{
    console.log("Trying to remove : ", id);
    if (window.confirm("Are you sure you want to remoe this member from committee?")) {
      const removedMember = await updateCommitteeMemberStatus(id);
      console.log("Removed Member: ",removedMember);
      if(removedMember)
        setAssignedMembers((prev) => prev.filter((m) => m.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between">
        <h2 className="text-lg font-semibold">Committee:  {committee.com_name}</h2>
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-blue-400 text-white px-4 h-10 rounded-xl"
        >
          <ArrowLeftCircle size={18} />
        </button>
      </div>

      {/* 🔍 Search */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search Member by Name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full border rounded-lg p-2"
        />
        <button
          onClick={handleSearch}
          className="bg-indigo-600 text-white px-4 rounded-lg"
        >
          Search
        </button>
      </div>

      {/* Search Results */}
      {loading && (
        <div className="text-sm text-gray-500 animate-pulse">
          Searching members...
        </div>
      )}

      <div className="space-y-3">
        {searchMembers.map((m) => {
          const profile = m.member_profile_withtranslation?.[0];

          return (
            <div
              key={m.id}
              className={`flex justify-between items-center bg-white border rounded-xl p-4 shadow-sm`}
            >
              <div>
                <p className="font-semibold text-gray-800">
                  {profile?.user_fname} {profile?.user_mname}{" "}
                  {profile?.user_lname}
                </p>
                <p className="text-sm text-gray-500">{profile?.user_phone}</p>
              </div>

              <button
                onClick={() => setSelectedMember(m)}
                className="px-4 py-1.5 text-sm bg-green-500 text-white rounded-lg"
              >
                Select
              </button>
            </div>
          );
        })}
      </div>

      {/* ✅ Selected Member Form */}
      {selectedMember && (
        <div className="bg-gray-50 p-4 rounded-xl space-y-4 border">
          <h3 className="font-semibold text-gray-700">
            Assign:{" "}
            {selectedMember.member_profile_withtranslation?.[0]?.user_fname}
          </h3>

          <div className="flex gap-4">
            <input
              type="date"
              value={regDate}
              onChange={(e) => setRegDate(e.target.value)}
              className="border rounded-lg p-2"
            />

            <input
              type="text"
              placeholder="Enter Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border rounded-lg p-2"
            />

            <button
              onClick={handleAssign}
              className="bg-blue-600 text-white px-4 rounded-lg"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Assigned Members Table */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4">Member Name</th>
              <th className="text-left p-4">Role</th>
              <th className="text-left p-4">Registration Date</th>
            </tr>
          </thead>
          <tbody>
            {assignedMembers.map((member) => (
              <tr key={member.id} className="border-t">
                <td className="p-4 font-medium text-gray-800">
                  {member.member.user_fname} {member.member.user_mname}{" "}
                  {member.member.user_lname}
                </td>
                <td className="p-4 text-gray-600">{member.com_role}</td>
                <td className="p-4 text-gray-600">
                  {new Date(member.user_committee_reg_dt).toLocaleDateString(
                    "en-GB",
                  )}
                </td>
                <td>
                  <button
                    onClick={()=>handleRemoveMember(member.id)}
                    className="p-2 rounded-full bg-red-100 text-red-600 
             hover:bg-red-600 hover:text-white 
             transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <X size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {assignedMembers.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No members assigned yet.
          </div>
        )}
      </div>
    </div>
  );
}
