import { useState } from "react";
import {
  searchMembers,
  updateMemberFamilyId,
} from "../../services/memberservice/familymember.profile.service.js";

export default function AddExistingMember({ familyId }) {
  console.log("Family ID", familyId);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const data = await searchMembers(query, familyId);
    setResults(data || []);
    setLoading(false);
  };

  const handleAssign = async (memberId) => {
    console.log("Assigning member", memberId, "to family", familyId);
    await updateMemberFamilyId(memberId, familyId);
    alert("Member added to family");
    handleSearch();
  };

  return (
    <>
      {/* Search Section */}
      <div className="flex gap-3 mb-6">
        <div className="relative w-full">
          <input
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            placeholder="Search by name or surname"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <button
          onClick={handleSearch}
          className="px-5 py-2.5 bg-primary text-black rounded-lg font-medium shadow-sm hover:shadow-md hover:opacity-95 transition-all"
        >
          Search
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-sm text-gray-500 animate-pulse mb-4">
          Searching members...
        </div>
      )}

      {/* Results */}
      <div className="space-y-3">
        {results.map((m) => {
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
                  {profile?.user_nativeplace}
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
      {!loading && results.length === 0 && query && (
        <div className="text-center text-gray-400 mt-6">No members found</div>
      )}
    </>
  );
}
