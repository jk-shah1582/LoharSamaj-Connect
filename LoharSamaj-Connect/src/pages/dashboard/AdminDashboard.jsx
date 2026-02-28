import { useAuth } from "../../context/AuthContext.jsx";
import DashboardHeader from "../../component/DashboardHeader";

export default function AdminDashboard() {
  const { userName } = useAuth();

  return (
    <div>
      <DashboardHeader
        title={`Welcome Admin ${userName}`}
        subtitle="Manage users, approvals and events"
        showSearch
        showEvents
        showSettings
      />
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-gray-700 mb-6">
        Here you can manage community members, approve new registrations, and organize events.
      </p>
      {/* Admin-specific content */}
    </div>
  );
}