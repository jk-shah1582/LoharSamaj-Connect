import MemberDetail from "../dashboard/MemberDetails";

export default function ProfilePage({ onBack, onEditProfile, setActionView }) {
  
  return (
    <div className="space-y-4">
      
      {/* Profile details */}
      <MemberDetail onBack={onBack} showBackButton={true} editProfile={true} onEditProfile={onEditProfile} setActionView={setActionView} />
    </div>
  );
}
