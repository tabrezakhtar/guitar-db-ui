import { useState, useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDraggable } from "react-use-draggable-scroll";
import { DateTime } from "luxon";
import { useScheduleData } from "./useScheduleData";
import DraggableScheduleList from "./DraggableScheduleList";
import { UserContext } from "../context/UserContext";
import FavUsers from "./FavUsers";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

const FullSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [selectedTimezone, setSelectedTimezone] = useState("");
  const [availableTimezones, setAvailableTimezones] = useState([]);
  const [weekStart, setWeekStart] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showFavUsersModal, setShowFavUsersModal] = useState(false);
  const { getWeeklySchedule, loading } = useScheduleData();
  const { user, loading: userLoading } = useContext(UserContext);

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

  const formatTimeFromString = (timeStr, fromTimeZone) => {
    if (!timeStr || !fromTimeZone) return "";
    const [hour, minute] = timeStr.split(":").map(Number);
    
    const dt = DateTime.fromObject(
      { hour, minute },
      { zone: fromTimeZone }
    );
    
    const localDt = dt.setZone("local");
    
    return localDt.toLocaleString(DateTime.TIME_SIMPLE);
  };

  const formatDuration = (minutes) => {
    if (!minutes) return "";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    let parts = [];
    if (hours > 0) parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
    if (mins > 0) parts.push(`${mins} ${mins === 1 ? "minute" : "minutes"}`);
    return parts.join(" ");
  };

  let filteredSchedules = selectedTimezone
    ? schedules.filter(s => s.timezone === selectedTimezone)
    : schedules;

  if (user && user.favUsers && user.favUsers.length > 0) {
    filteredSchedules = filteredSchedules.filter(s => 
      user.favUsers.includes(s.userId) || s.userId === user._id
    );
  }

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
      <div className="min-h-screen w-full p-6 relative">
        <div className="relative max-w-full mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-[var(--color-text-header)]">Live Streamer Guide</h2>
          <div className="text-[var(--color-text-muted)]">Loading schedules...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-6 relative">
      <div className="relative max-w-full mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-2xl font-bold mb-6 text-[var(--color-text-header)]">Live Streamer Guide</h2>
          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
            {userLoading ? (
              <div className="h-10"></div>
            ) : user ? (
              <>
                <button
                  onClick={() => setShowFavUsersModal(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-medium transition-colors inline-block"
                >
                  ⭐ Favorites{user.favUsers && user.favUsers.length > 0 ? ` (${user.favUsers.length})` : ""}
                </button>
                <Link 
                  to="/edit-schedule" 
                  className="bg-[var(--color-index-bg)] hover:opacity-90 text-white px-4 py-2 rounded font-medium transition-opacity inline-block"
                >
                  ✏️ Edit Schedule
                </Link>
              </>
            ) : (
              <div className="bg-[var(--color-guest-bg)] text-[var(--color-guest-text)] border border-[var(--color-guest-border)] rounded-md">
                <div className="px-4 py-2 flex items-center gap-3">
                  <span className="text-sm">👋 Log in to add your own live schedule, and filter your favourite streamers.</span>
                </div>
              </div>
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
                const count = schedules.filter(s => {
                  if (s.timezone !== tz) return false;
                  if (user && user.favUsers && user.favUsers.length > 0) {
                    return user.favUsers.includes(s.userId) || s.userId === user._id;
                  }
                  return true;
                }).length;
                if (count === 0) return null;
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
                    formatDuration={formatDuration}
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
                    <p className="text-[var(--color-text-muted)]">
                      {selectedSchedule.day} at 
                      <span className="font-medium"> {formatTimeFromString(selectedSchedule.time, selectedSchedule.timezone)}</span>
                      <span className="mx-1">for</span>
                      <span>{formatDuration(selectedSchedule.duration)}</span>
                    </p>
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

      <FavUsers 
        isOpen={showFavUsersModal} 
        onClose={() => setShowFavUsersModal(false)}
        currentFavUsers={user?.favUsers || []}
      />
    </div>
  );
};

export default FullSchedule;
