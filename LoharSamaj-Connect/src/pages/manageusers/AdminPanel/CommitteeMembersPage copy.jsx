import { useEffect, useState } from "react";
import { ArrowLeftCircle } from "lucide-react";
import { getCommitteeMembersWithDetails } 
from "../../../services/committeeservices/committee.manage.service";
import { searchMembersByName } from "../../../services/memberservice/member.profile.service"

export default function CommitteeMembersPage({ committeeId, onBack }) {

  const [searchText, setSearchText] = useState("");
  const [searchMembers, setsearchMembers] = useState(null);
  const [assignedMembers, setAssignedMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load already assigned members
  useEffect(() => {
    const loadMembers = async () => {
      setLoading(true);
      const data = await getCommitteeMembersWithDetails(committeeId);
      setAssignedMembers(data || []);
      console.log("Assinged members to committee: ",committeeId, data);
      setLoading(false);
    };
    loadMembers();
  }, [committeeId]);

  // 🔍 Search Member
  const handleSearch = async () => {
    if (!searchText) return;
    setLoading(true)
    const members = await searchMembersByName(searchText);
    setsearchMembers(members || []);
    setLoading(false);
    console.log("Member to add to committee: ",searchMembers)
  };

  // ✅ Assign Member
  const handleAssign = async (id) => {
    console.log("Member id to add to committee: ",id);
    /*if (!searchResult) return;

    await assignMemberToCommittee(committeeId, searchResult.member_id);

    setAssignedMembers((prev) => [...prev, searchResult]);
    setSearchResult(null);
    setSearchText("");*/

    alert("Member assigned successfully!");
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between">
        <h2 className="text-lg font-semibold">Assign Members</h2>
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-blue-400 text-white px-4 h-10 rounded-xl"
        >
          <ArrowLeftCircle size={18} />
        </button>
      </div>

      
      {/* Search Box */}
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

      {/* Search Members with Name */}
      {/* Loading */}
      {loading && (
        <div className="text-sm text-gray-500 animate-pulse mb-4">
          Searching members...
        </div>
      )}

      {/* Results */}
      <div className="space-y-3">
        {searchMembers && searchMembers.map((m) => {
          const profile = m.member_profile_withtranslation?.[0];

          return (
            <div
              key={m.id}
              className="flex justify-between items-center bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div>
                <p className="font-semibold text-gray-800">
                  {profile?.user_fname} {profile?.user_mname}{" "}
                  {profile?.user_lname}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {profile?.user_phone}
                </p>
              </div>

              <button
                onClick={() => handleAssign(m.id)}
                className="px-4 py-1.5 text-sm font-medium bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Add
              </button>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {!loading && searchMembers && searchMembers.length === 0 &&  (
        <div className="text-center text-gray-400 mt-6">No members found</div>
      )}

      {/* Assigned Members List */}
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
                <td className="p-4 font-medium text-gray-800">{member.member.user_fname}{" "}{member.member.user_mname}{" "}{member.member.user_lname}</td>
                <td className="p-4 font-medium text-gray-600">{member.com_role}</td>
                <td className="p-4 font-medium text-gray-600">{new Date(member.user_committee_reg_dt).toLocaleDateString("en-GB")}</td>
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