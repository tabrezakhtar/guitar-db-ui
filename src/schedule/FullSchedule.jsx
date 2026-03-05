import { useState, useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDraggable } from "react-use-draggable-scroll";
import { useScheduleData } from "./useScheduleData";
import { UserContext } from "../context/UserContext";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

const DraggableScheduleList = ({ schedules, onScheduleClick, formatTimeFromString }) => {
  const ref = useRef();
  const { events } = useDraggable(ref);

  return (
    <>
      <style>
        {`
          .schedule-scroll-container::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      <div 
        ref={ref}
        {...events}
        className="flex gap-3 overflow-x-auto pb-2 schedule-scroll-container"
        style={{
          cursor: "grab",
          userSelect: "none",
          scrollbarWidth: "none"
        }}
      >
        {schedules.map((schedule, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            onClick={() => onScheduleClick(schedule)}
            className="cursor-pointer"
            onDragStart={(e) => e.preventDefault()}
          >
            <div className="flex-shrink-0 w-64 h-32 rounded overflow-hidden relative block shadow-md hover:shadow-lg transition-shadow duration-200">
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
                <div className="flex items-start gap-2 align-center">
                  {schedule.youtubeChannelAvatar && (
                    <img
                      src={`${BASE_URL}/api/youtube/image-proxy?url=${encodeURIComponent(schedule.youtubeChannelAvatar)}`}
                      alt={schedule.username}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-white/50"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="bg-[var(--color-overlay-dark)] rounded px-2 py-1">
                      <div className="text-sm font-semibold truncate text-[var(--color-text)] drop-shadow-lg">{schedule.username}</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="bg-[var(--color-overlay-dark)] rounded px-2 py-1">
                    {schedule.title && (
                      <div className="text-sm font-medium truncate text-[var(--color-text)] drop-shadow-lg mb-1" title={schedule.title}>{schedule.title}</div>
                    )}
                    <div className="text-xs text-[var(--color-text)] drop-shadow-lg">
                      {formatTimeFromString(schedule.time)} - {formatTimeFromString(schedule.endTime)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
};

const FullSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [selectedTimezone, setSelectedTimezone] = useState("");
  const [availableTimezones, setAvailableTimezones] = useState([]);
  const [weekStart, setWeekStart] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const { getWeeklySchedule, loading } = useScheduleData();
  const { user } = useContext(UserContext);
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

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape" && selectedSchedule) {
        setSelectedSchedule(null);
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, [selectedSchedule]);

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

  const isDarkMode = document.documentElement.classList.contains('dark');
  const backgroundImage = isDarkMode 
    ? 'url(https://res.cloudinary.com/dx8d5hlk1/image/upload/v1772643605/tvguidebg_inmpjq.jpg)'
    : 'url(https://res.cloudinary.com/dx8d5hlk1/image/upload/v1772646428/tvguidebg_light_vnjoim.jpg)';
  const backgroundColor = isDarkMode ? '#10072E' : '#F5F5F5';

  if (loading) {
    return (
      <div 
        className="min-h-screen w-full p-6 relative"
        style={{
          backgroundColor,
          backgroundImage,
          backgroundSize: 'contain',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-60% to-[var(--color-main-bg)]"></div>
        <div className="relative max-w-full mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-[var(--color-text-header)]">Live Streamer Guide</h2>
          <div className="text-[var(--color-text-muted)]">Loading schedules...</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen w-full p-6 relative"
      style={{
        backgroundColor,
        backgroundImage,
        backgroundSize: 'contain',
        backgroundPosition: 'top center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="relative max-w-full mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-[var(--color-text-header)]">Live Streamer Guide</h2>
          <div className="text-right">
            {user ? (
              <Link 
                to="/edit-schedule" 
                className="bg-[var(--color-index-bg)] hover:opacity-90 text-white px-4 py-2 rounded font-medium transition-opacity"
              >
                ✏️ Edit Schedule
              </Link>
            ) : (
              <p className="text-sm text-[var(--color-text-muted)] max-w-xs">
                Want to add your own live schedule? <Link to="/login" className="text-[var(--color-index-bg)] hover:underline">Sign in</Link>
              </p>
            )}
          </div>
        </div>
      
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
          <p className="text-sm text-[var(--color-text-header)] mb-1">Week of</p>
          <p className="text-lg font-semibold text-[var(--color-text-header)]">{weekStart}</p>
        </div>
      </div>

      {filteredSchedules.length === 0 ? (
        <div className="bg-[var(--color-panel-bg)] dark:bg-[var(--color-card-bg)] p-4 rounded-md">
          <p className="text-[var(--color-text-muted)]">No live stream schedules found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {DAYS.map((day, dayIndex) => (
            <motion.div
              key={day}
              className="bg-[var(--color-card-bg)]/80 dark:bg-[var(--color-card-dark)]/80 rounded-lg border border-[var(--color-skeleton-line)] dark:border-[var(--color-skeleton-line-dark)] overflow-hidden backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: dayIndex * 0.05 }}
            >
              <div className="px-4 py-3">
                <h3 className="text-[var(--color-text-header)] font-semibold">{day}</h3>
              </div>
              <div className="p-4">
                {schedulesByDay[day].length === 0 ? (
                  <p className="text-[var(--color-text-muted)] text-sm">No streams scheduled</p>
                ) : (
                  <DraggableScheduleList 
                    schedules={schedulesByDay[day]} 
                    onScheduleClick={setSelectedSchedule}
                    formatTimeFromString={formatTimeFromString}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
      </div>

      <AnimatePresence>
        {selectedSchedule && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedSchedule(null)}
          >
            <motion.div
              className="bg-[var(--color-card-dark)] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                {selectedSchedule.youtubeChannelBanner ? (
                  <img
                    src={`${BASE_URL}/api/youtube/image-proxy?url=${encodeURIComponent(selectedSchedule.youtubeChannelBanner)}`}
                    alt={`${selectedSchedule.username} banner`}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-[var(--color-index-bg)]"></div>
                )}
                <button
                  onClick={() => setSelectedSchedule(null)}
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  {selectedSchedule.youtubeChannelAvatar && (
                    <img
                      src={`${BASE_URL}/api/youtube/image-proxy?url=${encodeURIComponent(selectedSchedule.youtubeChannelAvatar)}`}
                      alt={selectedSchedule.username}
                      className="w-20 h-20 rounded-full object-cover border-4 border-white/50"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-[var(--color-text-header)]">{selectedSchedule.username}</h3>
                    <p className="text-[var(--color-text-muted)]">{selectedSchedule.day} at {formatTimeFromString(selectedSchedule.time)} - {formatTimeFromString(selectedSchedule.endTime)}</p>
                  </div>
                </div>

                {selectedSchedule.title && (
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--color-text-muted)] mb-1">Stream Title</h4>
                    <p className="text-lg text-[var(--color-text-header)]">{selectedSchedule.title}</p>
                  </div>
                )}

                {selectedSchedule.description && (
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--color-text-muted)] mb-1">Description</h4>
                    <p className="text-[var(--color-text-header)] whitespace-pre-wrap">{selectedSchedule.description}</p>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-semibold text-[var(--color-text-muted)] mb-1">Timezone</h4>
                  <p className="text-[var(--color-text-header)]">{selectedSchedule.timezone}</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Link
                    to={`/profile/${selectedSchedule.userId}`}
                    className="flex-1 bg-[var(--color-index-bg)] hover:opacity-90 text-white px-4 py-3 rounded-lg font-semibold text-center transition-opacity"
                  >
                    View Profile
                  </Link>
                  {selectedSchedule.youtubeChannelUrl && (
                    <a
                      href={`${selectedSchedule.youtubeChannelUrl}/streams`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-semibold text-center transition-colors"
                    >
                      YouTube Channel
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FullSchedule;
