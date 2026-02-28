import { useEffect, useState } from "react";
import { getCommitteeMembersWithDetails } from "../../services/committeeservices/committee.manage.service";
import {  Users, ArrowLeftCircle } from "lucide-react";

export default function CommitteeMembers({ committee, onBack }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log("Committee Members for:", committee);
  useEffect(() => {
    const loadCommitteeMembers = async () => {
      const data = await getCommitteeMembersWithDetails(committee.com_id);
      console.log("Fetched committee members with details:", data);
      setMembers(data || []);
      setLoading(false);
    };
    loadCommitteeMembers();
  }, [committee.com_id]);

  if (loading) {
    return <div className="text-sm text-gray-500">Loading members...</div>;
  }

  if (members.length === 0) {
    return <div className="text-sm text-gray-500">No members in this committee</div>;
  }

  return (
    <div className="bg-white space-y-4 p-4 rounded-lg shadow-md">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
       {/* <button
          onClick={onBack}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to Committees
        </button>*/}

        <h2 className="text-xl font-semibold mt-2">{committee.com_name}</h2>
        <button
          onClick={onBack}
          className=" items-center gap-2 bg-blue-400 text-white px-4 h-10 rounded-xl hover:bg-blue-700 transition"
        >
          <ArrowLeftCircle size={18} />
        </button>
      </div>

      {/* Members */}
      <div className="bg-white rounded-lg divide-y">
        {members.map((mem) => (
          <div
            key={mem.id}
            className="flex items-center bg-white rounded-xl shadow-lg p-4
          hover:shadow-xl transition cursor-pointer border-l-4 border-blue-500 mb-2"
          >
        {console.log("Rendering committee member:", mem)}
            {/* PHOTO 
            <img
              src={
                mem.user_photo && mem.user_photo.trim() !== ""
                  ? mem.user_photo
                  : "/images/committee.png"
              }
              alt="User"
              className="h-12 w-12 object-cover mr-3"
            />*/}
            <div className="bg-blue-100 p-4 rounded-xl mr-3">
              <Users className="text-blue-600" size={25} />
            </div>
            <div>
              <p className="font-medium">{mem.member.user_fname + " " + mem.member.user_mname+" "+mem.member.user_lname}</p>
              <p className="text-sm text-gray-500">{mem.com_role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
