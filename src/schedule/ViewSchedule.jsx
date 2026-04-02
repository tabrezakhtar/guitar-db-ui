import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useScheduleData } from "./useScheduleData";

const ViewSchedule = ({ userId }) => {
  const [schedule, setSchedule] = useState(null);
  const { user } = useContext(UserContext);
  const { getSchedule, loading, error } = useScheduleData();
  const navigate = useNavigate();

  const isOwnProfile = user && user._id === userId;

  useEffect(() => {
    const fetchSchedule = async () => {
      if (userId) {
        const data = await getSchedule(userId);
        setSchedule(data);
      }
    };

    fetchSchedule();
  }, [userId]);

  const formatTime = (time24) => {
    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const sortedSchedules = schedule?.liveSchedules?.sort((a, b) => {
    return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
  });

  if (loading) {
    return (
      <div className="mt-6 p-6 rounded-lg bg-[var(--color-card-bg)]">
        <div className="text-[var(--color-text-muted)]">Loading schedule...</div>
      </div>
    );
  }

  if (!schedule || !schedule.liveSchedules || schedule.liveSchedules.length === 0) {
    return (
      <div className="mt-6 p-6 rounded-lg bg-[var(--color-card-bg)] mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[var(--color-text-header)]">📅 Live Stream Schedule</h3>
          {isOwnProfile && (
            <button
              onClick={() => navigate("/edit-schedule")}
              className="bg-[var(--color-index-bg)] hover:opacity-90 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              ✏️ Set Schedule
            </button>
          )}
        </div>
        <p className="text-[var(--color-text-header)]">No schedule set yet</p>
      </div>
    );
  }

  return (
    <div className="mt-6 p-6 rounded-lg bg-[var(--color-card-bg)] mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-[var(--color-text-header)]">📅 Live Stream Schedule</h3>
        {isOwnProfile && (
          <button
            onClick={() => navigate("/edit-schedule")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors cursor-pointer"
          >
            ✏️ Edit
          </button>
        )}
      </div>
      
      <div className="mb-3 text-sm text-[var(--color-text-muted)]">
        Timezone: {schedule.timezone}
      </div>

      <div className="space-y-2">
        {sortedSchedules.map((item, index) => (
          <div 
            key={index} 
            className="flex items-center gap-3 p-3 bg-[var(--color-main-bg)] rounded"
          >
            <span className="font-medium text-[var(--color-text-header)] min-w-[100px]">
              {item.day}
            </span>
            <span className="text-[var(--color-text-muted)]">at</span>
            <span className="text-[var(--color-text-header)]">
              {formatTime(item.time)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewSchedule;
