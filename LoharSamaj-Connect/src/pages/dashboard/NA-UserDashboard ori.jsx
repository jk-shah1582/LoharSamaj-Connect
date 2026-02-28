import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import DashboardHeader from "../../component/DashboardHeader";
import MemberList from "../dashboard/MembersList.jsx";

export default function UserDashboard() {
  const { userName } = useAuth();
  const [searchText, setSearchText] = useState(""); // ✅ ADD THIS

  return (
    <div>
      <DashboardHeader
        title="Members"
        subtitle="Browse community members"
        showSearch
        showProfile
        showEvents
        showCommittes
        searchValue={searchText}
        onSearch={setSearchText}
      />

      {/* User cards */}
      {/* existing user list code stays unchanged */}
      {/* User List */}
      <div className="space-y-4">
        <MemberList searchText={searchText} /> {/* 👈 pass it down */}
      </div>
    </div>
  );
}
