import MemberList from "../../dashboard/MembersList";

export default function MemberApproval({ onBack }) {
  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="text-indigo-600 hover:underline text-sm"
      >
        ← Back to Admin Panel
      </button>

      <MemberList forApproval={true} />
    </div>
  );
}
