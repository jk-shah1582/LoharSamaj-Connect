import { useEffect, useState } from "react";
import { getUpcommingEvents } from "../../services/eventservices/event.manage.service";

export default function EventsList({ onBack }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      const data = await getUpcommingEvents();
      setEvents(data || []);
      setLoading(false);
    };
    loadEvents();
  }, []);

  if (loading) {
    return <div className="text-sm text-gray-500">Loading events...</div>;
  }

  if (events.length === 0) {
    return <div className="text-sm text-gray-500">No upcoming events</div>;
  }

  return (
    <div className="bg-white space-y-4 p-4 rounded-lg shadow-md">
      {/* optional back */}
      {onBack && (
        <div className="p-3">
          <button
            onClick={onBack}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Members
          </button>
        </div>
      )}

      {events.map((event) => (
        <div
          key={event.event_id}
          className="flex items-center bg-white rounded-xl shadow-lg p-4
          hover:shadow-xl transition cursor-pointer border-l-4 border-blue-500"
        >
          {/* LEFT: Event logo (same as member avatar) */}
          <img
            src={event.event_logo || "/images/default-user.png"}
            alt={event.event_title}
            className="h-12 w-12 rounded-full object-cover border"
          />

          {/* MIDDLE: Event details */}
          <div className="flex-1 min-w-0 ml-4">
            <p className="font-medium text-gray-800 truncate">
              {event.event_title}
            </p>

            <p className="text-xs text-gray-500 mt-0.5">
              {event.event_date
                ? new Date(event.event_date).toLocaleDateString()
                : "Date not available"}
            </p>

            {event.event_description && (
              <p className="text-sm text-gray-600 truncate mt-1">
                {event.event_description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
