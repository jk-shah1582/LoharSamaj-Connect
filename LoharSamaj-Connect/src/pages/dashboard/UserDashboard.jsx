import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import DashboardHeader from "../../component/DashboardHeader";
import MemberList from "../dashboard/MembersList.jsx";
import EventsList from "../events/EventsList.jsx";
import CommitteeList from "../committee/ViewCommittee.jsx";
import { supabase } from "../../services/superbase";
import ProfilePage from "../manageusers/ProfilePage.jsx";
import EditProfile from "../manageusers/EditProfile.jsx";
import AdminPanel from "../manageusers/AdminPanel/AdminPanel.jsx";
import EventAdminPage from "../manageusers/AdminPanel/EventAdminPage.jsx";
import CommitteeAdminPage from "../manageusers/AdminPanel/CommitteeAdminPage.jsx";  
import CommitteeMembers from "../manageusers/AdminPanel/CommitteeMembersPage.jsx";
import MemberApproval from "../manageusers/AdminPanel/MemberApproval.jsx";
import FindMatch from "../matrimony/FindMatch.jsx";
import {
  getMemberNameById,
  getMemberIdByUserId,
} from "../../services/memberservice/member.profile.service.js";
import AssignFamily from "../manageusers/AssignFamily.jsx";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("members");
  const { userId, userName, userType, userRole, userPhoto, logout } = useAuth();
  const [searchText, setSearchText] = useState(""); // ✅ ADD THIS
  const [member, setMember] = useState(null);

  const isAdmin = userRole === "admin";

  /* Title & subtitle based on active view */
  const headerConfig = {
    members: {
      title: "Community Members",
      subtitle: "Manage community members",
    },
    events: {
      title: "Events",
      subtitle: "Upcoming community events",
    },
    committee: {
      title: "Committee",
      subtitle: "Committee members and roles",
    },
    profile: {
      title: "Profile",
      subtitle: "Your personal information",
    },
    editProfile: {
      title: "Edit Profile",
      subtitle: "Update your personal information",
    },
    assignfamily: {
      title: "Assign Family",
      subtitle: "Assign family members to this profile",
    },
    admin: {
      title: "Admin Control Center",
      subtitle: "Manage events, committees, and administrative settings",
    },
    eventAdmin: {
      title: "Event Administration",
      subtitle: "Add, update or delete community events",
    },
    committeeAdmin: {
      title: "Committee Administration",
      subtitle: "Create committees and manage members",
    },
    memberApproval: {
      title: "Member Approval",
      subtitle: "Approve new member registrations",
    },
    committeeMembers: {
      title: "Assign Committee Members",
      subtitle: "Form a committee by assigning members"
    },
    findMatch: {
      title: "Find Match",
      subtitle: "Find suitable matches for members"
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="p-4 md:p-6">
      {/* HEADER */}
      <DashboardHeader
        title={headerConfig[activeView].title}
        subtitle={headerConfig[activeView].subtitle}
        userName={userName}
        userRole={userRole}
        userPhoto={userPhoto}
        onLogout={handleLogout}
        showSearch
        showEvents
        showCommittes
        showProfile
        showFindMatch
        searchValue={searchText}
        onSearch={setSearchText}
        activeView={activeView}
        onChangeView={setActiveView}
      />

      {/* CONTENT */}
      <div className="mt-4">
        {activeView === "members" && <MemberList searchText={searchText} />}

        {activeView === "events" && <EventsList />}

        {activeView === "committee" && <CommitteeList />}

        {activeView === "profile" && (
          <ProfilePage
            onBack={() => setActiveView("members")}
            onEditProfile={() => setActiveView("editProfile")}
            setActionView={setActiveView}
          />
        )}

        {activeView === "editProfile" && (
          <EditProfile
            memberId={null}
            onCancel={() => setActiveView("profile")}
            onSave={(updatedMember) => {
              setMember(updatedMember);
              setActiveView("profile");
            }}
          />
        )}

        {activeView === "assignfamily" && (
          <AssignFamily onBack={() => setActiveView("profile")} />
        )}

        {activeView === "findMatch" && (
          <FindMatch />
        )}
        {/* 👇 ADMIN PANEL RENDERING HERE */}
        {activeView === "admin" && (
          <AdminPanel setActiveView={setActiveView} />
        )}

        {activeView === "eventAdmin" && (
          <EventAdminPage onBack={() => setActiveView("admin")} />
        )}

        {activeView === "committeeAdmin" && (
          <CommitteeAdminPage onBack={() => setActiveView("admin")} />
        )}

        {activeView === "memberApproval" && (
          <MemberApproval onBack={() => setActiveView("admin")} />
        )}

        {activeView === "committeeMembers" && (
          <CommitteeMembers />
        )}
      </div>
    </div>
  );
}
