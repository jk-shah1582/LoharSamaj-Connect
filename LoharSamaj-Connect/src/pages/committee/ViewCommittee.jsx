import { useEffect, useState } from "react";
import { getCommittes } from "../../services/committeeservices/committee.manage.service";
import CommitteeMembers from "./CommitteeMembers.jsx";
import {  Users } from "lucide-react";

export default function CommitteeList({ onBack }) {
  const [committees, setCommittees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCommittee, setSelectedCommittee] = useState(null);

  useEffect(() => {
    const loadCommittees = async () => {
      const data = await getCommittes();
      setCommittees(data || []);
      setLoading(false);
    };
    loadCommittees();
  }, []);

  /* ✅ IF A COMMITTEE IS SELECTED → SHOW MEMBERS VIEW */
  if (selectedCommittee) {
    return (
      <CommitteeMembers
        committee={selectedCommittee}   // pass full object
        onBack={() => setSelectedCommittee(null)}
      />
    );
  }

  /* LOADING STATE */
  if (loading) {
    return <div className="text-sm text-gray-500">Loading committee...</div>;
  }

  /* EMPTY STATE */
  if (committees.length === 0) {
    return <div className="text-sm text-gray-500">No committees available</div>;
  }

  /* COMMITTEE LIST VIEW */
  return (
    <div className="bg-white space-y-4 p-4 rounded-lg shadow-md">

      {/* optional back to members */}
      {onBack && (
        <div>
          <button
            onClick={onBack}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Members
          </button>
        </div>
      )}

      {committees.map((committee) => (
        <div
          key={committee.com_id}
          onClick={() => setSelectedCommittee(committee)}
          className="flex items-center bg-white rounded-xl shadow-lg p-4
                     hover:shadow-xl transition cursor-pointer
                     border-l-4 border-blue-500"
        >
          {/* LEFT 
          <img
            src="/images/committee.png"
            alt={committee.com_name}
            className="h-12 w-12  object-cover"
          />*/}
          <div className="bg-blue-100 p-4 rounded-xl mr-3">
              <Users className="text-blue-600" size={25} />
            </div>
          {/* DETAILS */}
          <div className="flex-1 min-w-0 ml-4">
            <p className="font-medium text-gray-800 truncate">
              {committee.com_name}
            </p>

            {committee.com_description && (
              <p className="text-sm text-gray-600 truncate mt-1">
                {committee.com_description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
