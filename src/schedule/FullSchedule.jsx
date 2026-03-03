import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useScheduleData } from "./useScheduleData";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const FullSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [selectedTimezone, setSelectedTimezone] = useState("");
  const [availableTimezones, setAvailableTimezones] = useState([]);
  const { getWeeklySchedule, loading } = useScheduleData();

  useEffect(() => {
    const fetchSchedules = async () => {
      const data = await getWeeklySchedule();
      if (data && data.schedules) {
        setSchedules(data.schedules);
        
        const timezones = [...new Set(data.schedules.map(s => s.timezone))];
        setAvailableTimezones(timezones);
        
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (timezones.includes(userTimezone)) {
          setSelectedTimezone(userTimezone);
        } else if (timezones.length > 0) {
          setSelectedTimezone(timezones[0]);
        }
      }
    };

    fetchSchedules();
  }, []);

  const formatTime = (time24) => {
    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const filteredSchedules = selectedTimezone
    ? schedules.filter(s => s.timezone === selectedTimezone)
    : schedules;

  if (loading) {
    return (
      <div className="max-w-screen-xl mx-auto w-full p-6 bg-[var(--color-main-bg)]">
        <h2 className="text-2xl font-bold mb-6 text-[var(--color-text-header)]">Full Schedule</h2>
        <div className="text-[var(--color-text-muted)]">Loading schedules...</div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto w-full p-6 bg-[var(--color-main-bg)]">
      <h2 className="text-2xl font-bold mb-6 text-[var(--color-text-header)]">Full Schedule</h2>
      
      {availableTimezones.length > 0 && (
        <div className="mb-6 bg-[var(--color-card-bg)] p-4 rounded-md">
          <label className="block text-sm font-medium mb-2 text-[var(--color-text-header)]">Timezone</label>
          <select
            value={selectedTimezone}
            onChange={(e) => setSelectedTimezone(e.target.value)}
            className="px-3 py-2 bg-[var(--color-panel-bg)] dark:bg-[var(--color-card-dark)] text-[var(--color-text-header)] border border-[var(--color-skeleton-line)] dark:border-[var(--color-skeleton-line-dark)] rounded w-full md:w-64"
          >
            {availableTimezones.map(tz => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>
      )}

      {filteredSchedules.length === 0 ? (
        <div className="bg-[var(--color-panel-bg)] dark:bg-[var(--color-card-bg)] p-4 rounded-md">
          <p className="text-[var(--color-text-muted)]">No schedules available for this timezone</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSchedules.map((schedule, index) => (
            <Link
              key={index}
              to={`/profile/${schedule.userId}`}
              className="block p-4 bg-[var(--color-card-bg)] dark:bg-[var(--color-card-dark)] rounded-lg border border-[var(--color-skeleton-line)] dark:border-[var(--color-skeleton-line-dark)] shadow-sm hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center gap-4">
                {schedule.youtubeChannelAvatar && (
                  <img
                    src={`${BASE_URL}/api/youtube/image-proxy?url=${encodeURIComponent(schedule.youtubeChannelAvatar)}`}
                    alt={schedule.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <div className="font-medium text-[var(--color-text-header)]">
                    {schedule.username}
                  </div>
                  <div className="text-sm text-[var(--color-text-muted)]">
                    {schedule.day} at {formatTime(schedule.time)}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default FullSchedule;
