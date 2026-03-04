import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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

  const schedulesByDay = {};
  DAYS.forEach(day => {
    schedulesByDay[day] = [];
  });

  filteredSchedules.forEach(schedule => {
    schedulesByDay[schedule.day].push(schedule);
  });

  DAYS.forEach(day => {
    schedulesByDay[day].sort((a, b) => a.time.localeCompare(b.time));
  });

  if (loading) {
    return (
      <div className="max-w-full mx-auto w-full p-6 bg-[var(--color-main-bg)]">
        <h2 className="text-2xl font-bold mb-6 text-[var(--color-text-header)]">Live Streamer Guide</h2>
        <div className="text-[var(--color-text-muted)]">Loading schedules...</div>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto w-full p-6 bg-[var(--color-main-bg)]">
      <h2 className="text-2xl font-bold mb-4 text-[var(--color-text-header)]">Live Streamer Guide</h2>
      
      <div className="mb-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {availableTimezones.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--color-text-header)]">Timezone</label>
            <select
              value={selectedTimezone}
              onChange={(e) => setSelectedTimezone(e.target.value)}
              className="px-3 py-2 bg-[var(--color-panel-bg)] dark:bg-[var(--color-card-dark)] text-[var(--color-text-header)] border border-[var(--color-skeleton-line)] dark:border-[var(--color-skeleton-line-dark)] rounded w-full sm:w-64"
            >
              {availableTimezones.map(tz => {
                const count = schedules.filter(s => s.timezone === tz).length;
                return (
                  <option key={tz} value={tz}>{tz} ({count})</option>
                );
              })}
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
        <div className="space-y-4">
          {DAYS.map(day => (
            <div key={day} className="bg-[var(--color-card-bg)] dark:bg-[var(--color-card-dark)] rounded-lg border border-[var(--color-skeleton-line)] dark:border-[var(--color-skeleton-line-dark)] overflow-hidden">
              <div className="xbg-[var(--color-panel-bg)] px-4 py-3">
                <h3 className="text-[var(--color-text-header)] font-semibold">{day}</h3>
              </div>
              <div className="p-4">
                {schedulesByDay[day].length === 0 ? (
                  <p className="text-[var(--color-text-muted)] text-sm">No streams scheduled</p>
                ) : (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {schedulesByDay[day].map((schedule, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link
                          to={`/profile/${schedule.userId}`}
                          className="flex-shrink-0 w-64 h-32 rounded overflow-hidden relative block shadow-md hover:shadow-lg transition-shadow duration-200"
                        >
                          <AnimatePresence>
                            {schedule.youtubeChannelBanner ? (
                              <motion.img
                                key="banner"
                                src={`${BASE_URL}/api/youtube/image-proxy?url=${encodeURIComponent(schedule.youtubeChannelBanner)}`}
                                alt={`${schedule.username} banner`}
                                className="absolute inset-0 w-full h-full object-cover"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                              />
                            ) : (
                              <motion.div
                                key="fallback"
                                className="absolute inset-0 w-full h-full bg-[var(--color-index-bg)]"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                              />
                            )}
                          </AnimatePresence>
                          <div className="absolute inset-0"></div>
                          <div className="absolute inset-0 p-3 flex flex-col justify-between">
                            <div className="flex items-start gap-2">
                              {schedule.youtubeChannelAvatar && (
                                <img
                                  src={`${BASE_URL}/api/youtube/image-proxy?url=${encodeURIComponent(schedule.youtubeChannelAvatar)}`}
                                  alt={schedule.username}
                                  className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-white/50"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold truncate text-white drop-shadow-md">{schedule.username}</div>
                              </div>
                            </div>
                            <div className="space-y-1">
                              {schedule.title && (
                                <div className="text-sm font-medium truncate text-white drop-shadow-md">{schedule.title}</div>
                              )}
                              <div className="text-xs text-gray-100 drop-shadow-md">
                                {formatTimeFromString(schedule.time)} - {formatTimeFromString(schedule.endTime)}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FullSchedule;
