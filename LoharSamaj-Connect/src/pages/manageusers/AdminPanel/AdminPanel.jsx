import { useNavigate } from "react-router-dom";
import { CalendarDays, Users } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

export default function AdminPanel({ setActiveView }) {
  const navigate = useNavigate();
  const {userRole} = useAuth();

  const isApprover = userRole === "approver";
  console.log("is Approver: ",isApprover, "userRole ", userRole);

  console.log("AdminPanel rendered with setActiveView:", setActiveView);

  return (
    <div className="space-y-6">

      {/* Header 
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Admin Control Center
        </h2>
        <p className="text-gray-500 mt-1">
          Select a management area to continue.
        </p>
      </div>*/}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Event Management Card */}
        {!isApprover && (
        <div
           onClick={() => setActiveView("eventAdmin")}
          className="cursor-pointer bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="bg-indigo-100 p-4 rounded-xl">
              <CalendarDays className="text-indigo-600" size={28} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Event Management
              </h3>
              <p className="text-sm text-gray-500">
                Add, update, or delete community events
              </p>
            </div>
          </div>
        </div> )}

        {/* Committee Management Card */}
        {!isApprover && (
        <div
          onClick={() => setActiveView("committeeAdmin")}
          className="cursor-pointer bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-4 rounded-xl">
              <Users className="text-purple-600" size={28} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Committee Management
              </h3>
              <p className="text-sm text-gray-500">
                Create committees and manage members
              </p>
            </div>
          </div>
        </div> )}

        {/* member Approval Card */}
        
        <div
          onClick={() => setActiveView("memberApproval")}
          className="cursor-pointer bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-4 rounded-xl">
              <Users className="text-purple-600" size={28} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Member Approval
              </h3>
              <p className="text-sm text-gray-500">
                Approve new member registrations
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
