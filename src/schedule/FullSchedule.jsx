import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useScheduleData } from "./useScheduleData";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

const FullSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [selectedTimezone, setSelectedTimezone] = useState("");
  const [availableTimezones, setAvailableTimezones] = useState([]);
  const [weekStart, setWeekStart] = useState("");
  const { getWeeklySchedule, loading } = useScheduleData();
  const gridRef = useRef(null);

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

      const now = new Date();
      const dayOfWeek = now.getDay();
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const monday = new Date(now);
      monday.setDate(now.getDate() + diff);
      monday.setHours(0, 0, 0, 0);
      
      const options = { month: "long", day: "numeric", year: "numeric" };
      setWeekStart(monday.toLocaleDateString("en-US", options));
    };

    fetchSchedules();
  }, []);

  const formatTime = (hour) => {
    const ampm = hour >= 12 ? "pm" : "am";
    const hour12 = hour % 12 || 12;
    return `${hour12}${ampm}`;
  };

  const formatTimeFromString = (timeStr) => {
    if (!timeStr) return "";
    const [hour, minute] = timeStr.split(":").map(Number);
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
  };

  const filteredSchedules = selectedTimezone
    ? schedules.filter(s => s.timezone === selectedTimezone)
    : schedules;

  const scheduleGrid = {};
  DAYS.forEach(day => {
    scheduleGrid[day] = {};
  });

  filteredSchedules.forEach(schedule => {
    const [hour] = schedule.time.split(":").map(Number);
    if (!scheduleGrid[schedule.day][hour]) {
      scheduleGrid[schedule.day][hour] = [];
    }
    scheduleGrid[schedule.day][hour].push(schedule);
  });

  if (loading) {
    return (
      <div className="max-w-full mx-auto w-full p-6 bg-[var(--color-main-bg)]">
        <h2 className="text-2xl font-bold mb-6 text-[var(--color-text-header)]">Full Schedule</h2>
        <div className="text-[var(--color-text-muted)]">Loading schedules...</div>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto w-full p-6 bg-[var(--color-main-bg)]">
      <h2 className="text-2xl font-bold mb-4 text-[var(--color-text-header)]">Full Schedule</h2>
      
      <div className="mb-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {availableTimezones.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--color-text-header)]">Timezone</label>
            <select
              value={selectedTimezone}
              onChange={(e) => setSelectedTimezone(e.target.value)}
              className="px-3 py-2 bg-[var(--color-panel-bg)] dark:bg-[var(--color-card-dark)] text-[var(--color-text-header)] border border-[var(--color-skeleton-line)] dark:border-[var(--color-skeleton-line-dark)] rounded w-full sm:w-64"
            >
              {availableTimezones.map(tz => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>
        )}
        <div className="sm:ml-auto">
          <p className="text-sm text-[var(--color-text-muted)] mb-1">Week of</p>
          <p className="text-lg font-semibold text-[var(--color-text-header)]">{weekStart}</p>
        </div>
      </div>

      {filteredSchedules.length === 0 ? (
        <div className="bg-[var(--color-panel-bg)] dark:bg-[var(--color-card-bg)] p-4 rounded-md">
          <p className="text-[var(--color-text-muted)]">No schedules available for this timezone</p>
        </div>
      ) : (
        <div className="bg-[var(--color-card-bg)] dark:bg-[var(--color-card-dark)] rounded-lg overflow-hidden border border-[var(--color-skeleton-line)] dark:border-[var(--color-skeleton-line-dark)]">
          <style>
            {`
              .tv-guide-scroll::-webkit-scrollbar {
                height: 10px;
              }
              .tv-guide-scroll::-webkit-scrollbar-track {
                background: #1F2937;
                border-radius: 4px;
              }
              .tv-guide-scroll::-webkit-scrollbar-thumb {
                background: #4B5563;
                border-radius: 4px;
              }
              .tv-guide-scroll::-webkit-scrollbar-thumb:hover {
                background: #6B7280;
              }
            `}
          </style>
          
          <div 
            ref={gridRef}
            className="overflow-x-auto tv-guide-scroll"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#4B5563 #1F2937"
            }}
          >
            <div className="inline-block min-w-full">
              <div className="flex">
                <div className="w-32 flex-shrink-0 sticky left-0 z-10 bg-[var(--color-card-bg)] dark:bg-[var(--color-card-dark)] border-r border-[var(--color-skeleton-line)]">
                  <div className="h-12 border-b border-[var(--color-skeleton-line)]"></div>
                  {DAYS.map(day => (
                    <div key={day} className="h-24 flex items-center justify-center border-b border-[var(--color-skeleton-line)] text-[var(--color-text-header)] font-medium text-sm">
                      {day.slice(0, 3)}
                    </div>
                  ))}
                </div>

                <div className="flex-1">
                  <div className="flex h-12 border-b border-[var(--color-skeleton-line)] bg-[var(--color-panel-bg)]">
                    {HOURS.map(hour => (
                      <div key={hour} className="w-48 flex-shrink-0 flex items-center justify-center border-r border-[var(--color-skeleton-line)] text-[var(--color-text-muted)] text-xs">
                        {formatTime(hour)}
                      </div>
                    ))}
                  </div>

                  {DAYS.map(day => (
                    <div key={day} className="flex h-24 border-b border-[var(--color-skeleton-line)]">
                      {HOURS.map(hour => (
                        <div key={`${day}-${hour}`} className="w-48 flex-shrink-0 border-r border-[var(--color-skeleton-line)] p-2">
                          {scheduleGrid[day][hour] && scheduleGrid[day][hour].map((schedule, idx) => (
                            <Link
                              key={idx}
                              to={`/profile/${schedule.userId}`}
                              className="block p-2 bg-[var(--color-index-bg)] rounded text-white hover:opacity-80 transition-opacity h-full"
                            >
                              <div className="flex items-start gap-2">
                                {schedule.youtubeChannelAvatar && (
                                  <img
                                    src={`${BASE_URL}/api/youtube/image-proxy?url=${encodeURIComponent(schedule.youtubeChannelAvatar)}`}
                                    alt={schedule.username}
                                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                  />
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-semibold truncate">{schedule.username}</div>
                                  {schedule.title && (
                                    <div className="text-xs truncate mt-1">{schedule.title}</div>
                                  )}
                                  <div className="text-xs text-gray-200 mt-1">
                                    {formatTimeFromString(schedule.time)} - {formatTimeFromString(schedule.endTime)}
                                  </div>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FullSchedule;
