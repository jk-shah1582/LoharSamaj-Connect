import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  X,
  ArrowLeftCircle,
  ImagePlus,
} from "lucide-react";
import {
  addEvents,
  getUpcommingEvents,
  updateEvent,
  deleteEvent,
  removePhotosOfDeletedEvent
} from "../../../services/eventservices/event.manage.service";
import EventPhotoUpload from "../../../component/EventPhotoUpload";

export default function EventAdminPage({ onBack }) {
  const [events, setEvents] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [uploadImgEvent, setUploadImgEvent] = useState(null);
  const [imgPaths, setImgPaths] = useState(null);

  const [formData, setFormData] = useState({
    event_title: "",
    event_date: "",
    event_description: "",
    event_image: "",
  });

  /* ------Show Events on page load-------- */
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const upcomingEvents = await getUpcommingEvents();
        console.log("Fetched Events:", upcomingEvents);
        setEvents(upcomingEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  /* Open Add Modal */
  const handleAdd = () => {
    setEditingEvent(null);
    setFormData({ event_title: "", event_date: "", event_description: "" });
    setShowModal(true);
  };

  /* Open Edit Modal */
  const handleEdit = (event) => {
    setEditingEvent(event);
    setUploadImgEvent(null);
    setFormData({
      event_title: event.event_title,
      event_date: event.event_date,
      event_description: event.event_description,
    });
    setShowModal(true);
  };

  /* Open upload image Modal */
  const handleUpload = (event) => {
    console.log("Event value in edit and upload: ", event);
    setEditingEvent(event);
    setUploadImgEvent(event);
    setFormData({
      event_title: event.event_title,
      event_date: event.event_date,
      event_description: event.event_description,
    });
    setShowModal(true);
  };

  /* Save Event */
  const handleSave = async () => {
    if (editingEvent) {
      //---------call method to update event in database---------
      console.log("Updating Event ID:", editingEvent); //.event_id);
      console.log("Updated Event Data:", formData);
      //------ upload image to bucket and update db with image path ----------------
      const updatedEvent = await updateEvent(editingEvent.event_id, formData);
      setEvents(
        events.map((e) =>
          e.event_id === editingEvent.event_id ? { ...e, ...updatedEvent } : e,
        ),
      );
      alert("Event updated.....");
    } else {
      //---------call method to add event to database and get new event id---------
      console.log("Event Form Data : ", formData);
      const newEvent = await addEvents(formData);
      setEvents([...events, { event_id: newEvent.event_id, ...formData }]);
      alert("Event Added.....");
    }
    setShowModal(false);
  };

  /* Delete Event */
  const handleDelete = async(id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      const res = await removePhotosOfDeletedEvent(id)
      console.log("On Event List -",res);
      if(res.success)
         setEvents(prevEvents =>
        prevEvents.filter(e => e.event_id !== id)
      );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-end items-center gap-3">
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-400 text-white px-4 h-10 rounded-xl hover:bg-indigo-700 transition"
        >
          <Plus size={18} />
          Add Event
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
              <th className="text-left p-4">Event Name</th>
              <th className="text-left p-4">Date</th>
              <th className="text-center p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events &&
              events.map((event) => (
                <tr key={event.event_id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-800">
                    {event.event_title}
                  </td>
                  <td className="p-4 text-gray-600">{event.event_date}</td>
                  <td className="p-4 flex justify-center gap-3">
                    <button
                      onClick={() => handleEdit(event)}
                      className="text-yellow-500 hover:text-yellow-600"
                    >
                      <Edit size={18} />
                    </button>

                    <button
                      onClick={() => handleUpload(event)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <ImagePlus size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(event.event_id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {events && events.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No events available.
          </div>
        )}
      </div>

      {/* Modal */}
      {console.log(
        "Value of uploadImgEvent: ",
        uploadImgEvent,
        "editingEvent: ",
        editingEvent,
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {editingEvent ? "Edit Event" : "Add Event"}
              </h3>
              <button onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>
            {!uploadImgEvent && (
              <input
                type="text"
                name="event_title"
                placeholder="Event Name"
                value={formData.event_title}
                onChange={(e) =>
                  setFormData({ ...formData, event_title: e.target.value })
                }
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            )}

            {!uploadImgEvent && (
              <input
                type="date"
                value={formData.event_date}
                onChange={(e) =>
                  setFormData({ ...formData, event_date: e.target.value })
                }
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            )}

            {!uploadImgEvent && (
              <input
                type="text"
                placeholder="Event Description"
                value={formData.event_description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    event_description: e.target.value,
                  })
                }
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            )}
            {/* upload event photos */}
            {uploadImgEvent && (
              
              <EventPhotoUpload 
                event={uploadImgEvent}
                onFilesChange={(value)=>setFormData({ ...formData, event_image: value })}
              />
            )}

            <button
              onClick={handleSave}
              className="w-full bg-blue-400 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              {editingEvent ? "Update Event" : "Create Event"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
