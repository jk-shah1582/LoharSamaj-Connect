import {
  UserIcon,
  CalendarDaysIcon,
  Cog6ToothIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { getMemberPhotoPublicUrl } from "../services/memberservice/member.profile.service.js";

function SearchInput({ value, onChange }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search members..."
      className="px-3 py-2 border rounded-lg text-sm
                 focus:outline-none focus:ring-2 focus:ring-blue-500
                 w-48 md:w-64"
    />
  );
}

function ActionButton({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`group flex items-center gap-1 text-sm font-medium
        transition relative
        ${active ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}
      `}
    >
      <Icon className="h-5 w-5" />
      <span className="hidden md:inline">{label}</span>

      {active && (
        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 rounded" />
      )}
    </button>
  );
}

export default function DashboardHeader({
  title,
  subtitle,

  // 👤 User Info
  userName,
  userRole,
  userPhoto,
  onLogout,
  // actions
  showProfile = false,
  showSearch = false,
  showEvents = false,
  showAdminPanel = false,
  showCommittes = false,
  searchValue = "",
  onSearch,

  /* 🔑 NAV STATE */
  activeView = "members",
  onChangeView,
}) {
  return (
    <div className="mb-6">
      {/* ================= USER INFO STRIP ================= */}
      <div className="flex items-center justify-between mb-4">
        {/* Left: User Info */}
        <div className="flex items-center gap-3">
          <img
            src={
              userPhoto
                ? getMemberPhotoPublicUrl(userPhoto)
                : "/images/default-user.png"
            }
            alt="User"
            className="h-15 w-15 rounded-md object-cover"
          />

          <div>
            <p className="text-2xl font-bold text-gray-800 leading-tight">
              Welcome {userName}!
            </p>
            <p className="text-sm text-gray-500">{userRole}</p>
          </div>
        </div>

        {/* Right: Logout */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="border border-blue-500 text-blue-600 bg-white 
px-4 py-2 rounded-lg text-sm font-semibold 
hover:bg-red-50 hover:border-blue-600 
transition-all duration-200"
          >
            LogOut
          </button>
        )}
      </div>

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        {/* LEFT */}
        <div>
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Search only on Members */}
          {showSearch && activeView === "members" && (
            <SearchInput value={searchValue} onChange={onSearch} />
          )}

          {showEvents && (
            <ActionButton
              icon={CalendarDaysIcon}
              label={activeView === "events" ? "Members" : "Events"}
              active={activeView === "events"}
              onClick={() =>
                onChangeView(activeView === "events" ? "members" : "events")
              }
            />
          )}

          {showCommittes && (
            <ActionButton
              icon={UserGroupIcon}
              label={activeView === "committee" ? "Members" : "Committee"}
              active={activeView === "committee"}
              onClick={() =>
                onChangeView(
                  activeView === "committee" ? "members" : "committee",
                )
              }
            />
          )}

          {showProfile && (
            <ActionButton
              icon={UserIcon}
              label="Profile"
              active={activeView === "profile"}
              onClick={() => onChangeView("profile")}
            />
          )}

          {["admin", "approver"].includes(userRole) && (
            <ActionButton
              icon={Cog6ToothIcon}
              label="AdminPanel"
              active={activeView === "admin"}
              onClick={() => onChangeView("admin")}
            />
          )}
        </div>
      </div>
    </div>
  );
}
