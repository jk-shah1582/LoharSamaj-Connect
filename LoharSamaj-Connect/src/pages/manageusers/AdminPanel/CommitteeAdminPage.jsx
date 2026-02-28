import { useEffect, useState } from "react";
import { addCommittee, deleteCommittee, getCommittes, updateCommittee } from "../../../services/committeeservices/committee.manage.service";
import { Plus, Edit, Trash2, X, ArrowLeftCircle, Users } from "lucide-react";
import CommitteeMembersPage from "./CommitteeMembersPage.jsx"

export default function CommitteeAdminPage({ onBack }) {
  const [committees, setCommittees] = useState([]);
  const [editingCommittee, setEditingCommittee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCommittee, setSelectedCommittee] = useState(null);
  const [formData, setFormData] = useState({
    com_name: "",
    com_description: "",
    com_work_period: "",
  });

  useEffect(() => {
    const fetchCommittees = async () => {
      try {
        const committees = await getCommittes();
        console.log("Fetched committees:", committees);
        setCommittees(committees);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchCommittees();
  }, []);

  /* Open Add Modal */
  const handleAdd = () => {
    setEditingCommittee(null);
    setFormData({ com_name: "", com_description: "", com_work_period: "" });
    setShowModal(true);
  };

  /* Open Edit Modal */
  const handleEdit = (committee) => {
    setEditingCommittee(committee);

    setFormData({
      com_name: committee.com_name,
      com_description: committee.com_description,
      com_work_period: committee.com_work_period,
    });
    setShowModal(true);
  };

  /* Delete Event */
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this committee?")) {
      const delRes = await deleteCommittee(id)
      console.log("On Committee List -", delRes);
      if (delRes.success)
        setCommittees((prev) => prev.filter((e) => e.com_id !== id));
    }
  };

  /* AssignMember To committee */
  const handleAssignMembers = (committee)=>{
    console.log("Assigning Members to committee with ID:", committee);
    setSelectedCommittee(committee);
  };

  // ✅ Add / Update Committee
  const handleSave = async () => {
    if (editingCommittee) {
      const editResult = await updateCommittee(editingCommittee.com_id, formData);
       setCommittees(
        committees.map((c) =>
          c.com_id === editingCommittee.com_id ? { ...c, ...editResult } : c,
        ),
      );
      alert("Committee Updated Successfully");
    } else {
      //---------call method to add committee to database and get new committee id---------
      console.log("Committee Form Data : ", formData);
      const newCommittee = await addCommittee(formData);
      setCommittees([...committees, { com_id: newCommittee.com_id, ...formData }]);
      alert("Committee Created.....");
    }

    setShowModal(false);
  };

  
  const resetForm = () => {
    setFormData({ committee_name: "", description: "" });
    setEditingCommittee(null);
  };

  return (
    <div className="space-y-6">
      {selectedCommittee ? (
        <CommitteeMembersPage
          committee={selectedCommittee}
          onBack={() => setSelectedCommittee(null)}
        />
      ) : (
        <>
          {/* Header */}
          <div className="flex justify-end items-center gap-3">
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-400 text-white px-4 h-10 rounded-xl hover:bg-indigo-700 transition"
        >
          <Plus size={18} />
          Add Committee
        </button>

        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-blue-400 text-white px-4 h-10 rounded-xl hover:bg-indigo-700 transition"
        >
          <ArrowLeftCircle size={18} />
        </button>
      </div>

      {/* Event Table */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Description</th>
              <th className="text-center p-4">Working Period</th>
            </tr>
          </thead>
          <tbody>
            {committees &&
              committees.map((committee) => (
                <tr
                  key={committee.com_id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-4 font-medium text-gray-800">
                    {committee.com_name}
                  </td>
                  <td className="p-4 text-gray-600">
                    {committee.com_description}
                  </td>
                  <td className="p-4 text-gray-600">
                    {committee.com_work_period}
                  </td>
                  <td className="p-4 flex justify-center gap-3">
                    <button
                      onClick={() => handleEdit(committee)}
                      className="text-yellow-500 hover:text-yellow-600"
                    >
                      <Edit size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(committee.com_id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>

                    <button
                      onClick={() => handleAssignMembers(committee)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Users size={18} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {committees && committees.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No committee available.
          </div>
        )}
      </div>

      {/* Modal */}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {editingCommittee ? "Edit Committee" : "Add Committee"}
              </h3>
              <button onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>

            <input
              type="text"
              name="committee_name"
              placeholder="Committee Name"
              value={formData.com_name}
              onChange={(e) =>
                setFormData({ ...formData, com_name: e.target.value })
              }
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <input
              type="text"
              placeholder="Committee Description"
              value={formData.com_description}
              onChange={(e) =>
                setFormData({ ...formData, com_description: e.target.value })
              }
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <input
              type="text"
              placeholder="Working Period"
              value={formData.com_work_period}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  com_work_period: e.target.value,
                })
              }
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <button
              onClick={handleSave}
              className="w-full bg-blue-400 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              {editingCommittee ? "Update Committee" : "Create Committe"}
            </button>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}
