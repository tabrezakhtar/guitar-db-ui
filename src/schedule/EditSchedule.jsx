import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useScheduleData } from "./useScheduleData";
import Breadcrumbs from "../components/Breadcrumbs";
import ConnectYoutubeChannel from "../components/ConnectYoutubeChannel";
import Modal from "../components/Modal";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const EditSchedule = () => {
  const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [timezone, setTimezone] = useState(detectedTimezone || "UTC");
  const [schedules, setSchedules] = useState([]);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const { user, updateUserLocal } = useContext(UserContext);
  const { getSchedule, updateSchedule, deleteScheduleItem, loading } = useScheduleData();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchedule = async () => {
      if (user?._id) {
        const data = await getSchedule(user._id);
        if (data) {
          const tz = data.timezone || detectedTimezone || "UTC";
          const scheds = data.liveSchedules && data.liveSchedules.length > 0 
            ? data.liveSchedules.map(schedule => ({
                ...schedule,
                duration: schedule.duration || 60
              }))
            : [];
          setTimezone(tz);
          setSchedules(scheds);
        }
      }
    };

    fetchSchedule();
  }, [user]);

  const addSchedule = () => {
    const defaultStartTime = "20:00";
    const defaultDuration = 60;
    setSchedules([...schedules, { day: "Monday", time: defaultStartTime, duration: defaultDuration, title: "", description: "" }]);
    setErrors({});
  };

  const removeSchedule = (index) => {
    setScheduleToDelete({ index, id: schedules[index]._id });
    setShowDeleteModal(true);
  };

  const confirmDeleteSchedule = async () => {
    if (!scheduleToDelete) return;

    setDeleteLoading(true);
    try {
      if (scheduleToDelete.id) {
        await deleteScheduleItem(scheduleToDelete.id);
      }
      
      setSchedules(schedules.filter((_, i) => i !== scheduleToDelete.index));
      const newErrors = { ...errors };
      delete newErrors[`day-${scheduleToDelete.index}`];
      delete newErrors[`time-${scheduleToDelete.index}`];
      delete newErrors[`title-${scheduleToDelete.index}`];
      delete newErrors[`description-${scheduleToDelete.index}`];
      delete newErrors.duplicate;
      delete newErrors.submit;
      setErrors(newErrors);
      
      setShowDeleteModal(false);
      setScheduleToDelete(null);
    } catch (err) {
      setError("Failed to delete schedule item. Please try again.");
      setShowDeleteModal(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  const updateScheduleItem = (index, field, value) => {
    const newSchedules = [...schedules];
    
    if (field === "duration") {
      const numValue = parseInt(value, 10);
      newSchedules[index][field] = isNaN(numValue) ? "" : numValue;
    } else {
      newSchedules[index][field] = value;
    }
    
    setSchedules(newSchedules);
    
    const newErrors = { ...errors };
    delete newErrors[`${field}-${index}`];
    delete newErrors.duplicate;
    delete newErrors.submit;
    
    if (field === "duration" && value) {
      const numValue = parseInt(value, 10);
      if (isNaN(numValue) || numValue < 1) {
        newErrors[`duration-${index}`] = "Duration must be at least 1 minute";
      }
    }
    
    setErrors(newErrors);
  };

  const validateSchedules = () => {
    const newErrors = {};
    let isValid = true;

    schedules.forEach((schedule, index) => {
      if (!schedule.day) {
        newErrors[`day-${index}`] = "Day is required";
        isValid = false;
      }

      if (!schedule.time) {
        newErrors[`time-${index}`] = "Time is required";
        isValid = false;
      } else if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(schedule.time)) {
        newErrors[`time-${index}`] = "Invalid time format";
        isValid = false;
      }

      if (!schedule.duration) {
        newErrors[`duration-${index}`] = "Duration is required";
        isValid = false;
      } else {
        const numValue = parseInt(schedule.duration, 10);
        if (isNaN(numValue) || numValue < 1) {
          newErrors[`duration-${index}`] = "Duration must be at least 1 minute";
          isValid = false;
        }
      }

      if (schedule.title && schedule.title.length > 200) {
        newErrors[`title-${index}`] = "Title must be 200 characters or less";
        isValid = false;
      }

      if (schedule.description && schedule.description.length > 500) {
        newErrors[`description-${index}`] = "Description must be 500 characters or less";
        isValid = false;
      }
    });

    const uniqueSchedules = new Set(schedules.map(s => `${s.day}-${s.time}`));
    if (uniqueSchedules.size !== schedules.length) {
      newErrors.duplicate = "Duplicate schedules are not allowed";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateSchedules()) {
      return;
    }

    setSaving(true);
    setSuccessMessage("");

    try {
      await updateSchedule({
        timezone,
        liveSchedules: schedules
      });
      
      setSuccessMessage("Schedule saved successfully!");
    //   setTimeout(() => {
    //     navigate("/profile");
    //   }, 1500);
    } catch (err) {
      setErrors({ submit: "Failed to save schedule. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleYoutubeSuccess = (data) => {
    updateUserLocal({
      ...user,
      youtubeChannelUrl: data.youtubeChannelUrl || "",
      youtubeChannelId: data.youtubeChannelId || "",
      youtubeChannelHandle: data.handle || "",
      youtubeChannelTitle: data.title || "",
      youtubeChannelAvatar: data.avatar || "",
      uploadsPlaylistId: data.uploadsPlaylistId || ""
    });
  };

const getTimezones = () => {
  return [
    // UTC / special
    "UTC",

    // North America (most popular first)
    "America/New_York",       // Eastern Time (US & Canada)
    "America/Chicago",        // Central Time
    "America/Denver",         // Mountain Time
    "America/Phoenix",        // Arizona (no DST)
    "America/Los_Angeles",    // Pacific Time
    "America/Anchorage",      // Alaska
    "America/Honolulu",       // Hawaii
    "America/Toronto",        // Eastern Canada
    "America/Vancouver",      // Pacific Canada
    "America/Halifax",        // Atlantic Canada
    "America/Mexico_City",    // Central Mexico

    // South America
    "America/Sao_Paulo",      // Brazil (most populous)
    "America/Buenos_Aires",   // Argentina
    "America/Santiago",       // Chile
    "America/Bogota",         // Colombia
    "America/Lima",           // Peru

    // Europe (major ones)
    "Europe/London",          // UK
    "Europe/Dublin",          // Ireland
    "Europe/Paris",           // France
    "Europe/Berlin",          // Germany, most of Central Europe
    "Europe/Rome",            // Italy
    "Europe/Madrid",          // Spain
    "Europe/Amsterdam",       // Netherlands
    "Europe/Brussels",        // Belgium
    "Europe/Zurich",          // Switzerland
    "Europe/Stockholm",       // Sweden
    "Europe/Oslo",            // Norway
    "Europe/Warsaw",          // Poland
    "Europe/Athens",          // Greece
    "Europe/Moscow",          // Russia (Moscow time)
    "Europe/Istanbul",        // Turkey

    // Africa (key business/population centers)
    "Africa/Cairo",           // Egypt
    "Africa/Lagos",           // Nigeria (West Africa Time)
    "Africa/Johannesburg",    // South Africa
    "Africa/Nairobi",         // East Africa Time (Kenya, etc.)

    // Middle East
    "Asia/Dubai",             // UAE
    "Asia/Riyadh",            // Saudi Arabia
    "Asia/Jerusalem",         // Israel
    "Asia/Tehran",            // Iran
    "Asia/Baghdad",           // Iraq
    "Asia/Beirut",            // Lebanon

    // Asia (major hubs)
    "Asia/Kolkata",           // India
    "Asia/Dhaka",             // Bangladesh
    "Asia/Karachi",           // Pakistan
    "Asia/Shanghai",          // China
    "Asia/Hong_Kong",
    "Asia/Taipei",            // Taiwan
    "Asia/Seoul",             // South Korea
    "Asia/Tokyo",             // Japan
    "Asia/Singapore",
    "Asia/Bangkok",           // Thailand
    "Asia/Jakarta",           // Indonesia (Western)
    "Asia/Manila",            // Philippines

    // Australia / Pacific
    "Australia/Sydney",       // Eastern Australia
    "Australia/Melbourne",
    "Australia/Brisbane",     // Queensland (no DST)
    "Australia/Perth",        // Western Australia
    "Pacific/Auckland",       // New Zealand
  ];
};

  return (
    <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 bg-[var(--color-main-bg)]">
      <div className="mb-4">
        <Breadcrumbs items={[
          { label: "Profile", url: "/profile" },
          { label: "Edit Schedule", url: "/edit-schedule" }
        ]} />
      </div>

      <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text-header)] mb-6">📅 Edit Live Stream Schedule</h1>

      {!user?.youtubeChannelUrl && (
        <div className="mb-4 p-4 bg-yellow-900/30 border border-yellow-600 text-yellow-400 rounded">
          <p className="font-semibold mb-2">⚠️ No YouTube Channel Connected</p>
          <p className="text-sm">Connect your YouTube channel below to enable live stream scheduling.  No YouTube login required.</p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-[var(--color-error-bg)] border border-[var(--color-error-border)] text-[var(--color-error-border)] rounded">
          {error}
        </div>
      )}

      <div className="bg-[var(--color-card-bg)] p-4 sm:p-6 rounded-lg mb-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-[var(--color-text-header)] mb-2">
            YouTube Channel
          </label>
          <ConnectYoutubeChannel
            initialValue={user?.youtubeChannelUrl || ""}
            onSuccess={handleYoutubeSuccess}
            onError={(error) => setError(error)}
          />
        </div>
      </div>

      <div className="bg-[var(--color-card-bg)] p-4 sm:p-6 rounded-lg mb-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-[var(--color-text-header)] mb-2">
            Timezone
          </label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full p-2 border border-[var(--color-text-muted)] rounded bg-[var(--color-main-bg)] text-[var(--color-text-header)]"
          >
            {getTimezones().map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-[var(--color-text-header)] mb-3">Live Stream Times</h3>

          <div className="space-y-3">
            {schedules.length === 0 ? (
              <div className="p-6 bg-[var(--color-main-bg)] rounded border-2 border-dashed border-[var(--color-text-muted)] text-center">
                <p className="text-[var(--color-text-header)] mb-2">No schedules yet</p>
                <p className="text-sm text-[var(--color-text-muted)]">Click the "Add Stream Time" button below to create your first schedule</p>
              </div>
            ) : (
              schedules.map((schedule, index) => (
              <div key={index} className="flex flex-col gap-3 items-start p-3 sm:p-4 bg-[var(--color-main-bg)] rounded">
                <div className="flex w-full justify-end">
                  <button
                    onClick={() => removeSchedule(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors rounded cursor-pointer"
                    title="Remove this schedule"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex w-full gap-3">
                  <div className="flex-1 w-full sm:w-auto">
                    <label className="block text-xs text-[var(--color-text-muted)] mb-1">Day</label>
                    <select
                      value={schedule.day}
                      onChange={(e) => updateScheduleItem(index, "day", e.target.value)}
                      className={`w-full p-2 border rounded bg-[var(--color-panel-bg)] text-[var(--color-text-header)] ${
                        errors[`day-${index}`] ? "border-[var(--color-error-border)]" : "border-[var(--color-text-muted)]"
                      }`}
                    >
                      {DAYS.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                    {errors[`day-${index}`] && (
                      <p className="text-[var(--color-error-border)] text-xs mt-1">{errors[`day-${index}`]}</p>
                    )}
                  </div>

                  <div className="flex-1 w-full sm:w-auto">
                    <label className="block text-xs text-[var(--color-text-muted)] mb-1">Start time</label>
                    <input
                      type="time"
                      value={schedule.time}
                      onChange={(e) => updateScheduleItem(index, "time", e.target.value)}
                      className={`w-full p-2 border rounded bg-[var(--color-panel-bg)] text-[var(--color-text-header)] [color-scheme:light] dark:[color-scheme:dark] ${
                        errors[`time-${index}`] ? "border-[var(--color-error-border)]" : "border-[var(--color-text-muted)]"
                      }`}
                    />
                    {errors[`time-${index}`] && (
                      <p className="text-[var(--color-error-border)] text-xs mt-1">{errors[`time-${index}`]}</p>
                    )}
                  </div>

                  <div className="flex-1 w-full sm:w-auto">
                    <label className="block text-xs text-[var(--color-text-muted)] mb-1">Duration (minutes)</label>
                    <input
                      type="number"
                      min="1"
                      value={schedule.duration || ""}
                      onChange={(e) => updateScheduleItem(index, "duration", e.target.value)}
                      placeholder="60"
                      className={`w-full p-2 border rounded bg-[var(--color-panel-bg)] text-[var(--color-text-header)] ${
                        errors[`duration-${index}`] ? "border-[var(--color-error-border)]" : "border-[var(--color-text-muted)]"
                      }`}
                    />
                    {errors[`duration-${index}`] && (
                      <p className="text-[var(--color-error-border)] text-xs mt-1">{errors[`duration-${index}`]}</p>
                    )}
                  </div>
                </div>

                <div className="flex-1 w-full">
                  <label className="block text-xs text-[var(--color-text-muted)] mb-1">Title (optional)</label>
                  <input
                    type="text"
                    value={schedule.title || ""}
                    onChange={(e) => updateScheduleItem(index, "title", e.target.value)}
                    maxLength={200}
                    placeholder="Stream title"
                    className={`w-full p-2 border rounded bg-[var(--color-panel-bg)] text-[var(--color-text-header)] ${
                      errors[`title-${index}`] ? "border-[var(--color-error-border)]" : "border-[var(--color-text-muted)]"
                    }`}
                  />
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">{(schedule.title || "").length}/200 characters</p>
                  {errors[`title-${index}`] && (
                    <p className="text-[var(--color-error-border)] text-xs mt-1">{errors[`title-${index}`]}</p>
                  )}
                </div>

                <div className="flex-1 w-full">
                  <label className="block text-xs text-[var(--color-text-muted)] mb-1">Description (optional)</label>
                  <textarea
                    value={schedule.description || ""}
                    onChange={(e) => updateScheduleItem(index, "description", e.target.value)}
                    maxLength={500}
                    placeholder="Stream description"
                    rows={3}
                    className={`w-full p-2 border rounded bg-[var(--color-panel-bg)] text-[var(--color-text-header)] resize-y ${
                      errors[`description-${index}`] ? "border-[var(--color-error-border)]" : "border-[var(--color-text-muted)]"
                    }`}
                  />
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">{(schedule.description || "").length}/500 characters</p>
                  {errors[`description-${index}`] && (
                    <p className="text-[var(--color-error-border)] text-xs mt-1">{errors[`description-${index}`]}</p>
                  )}
                </div>
              </div>
              ))
            )}
          </div>

          <div className="flex justify-center mt-4">
            <button
              onClick={addSchedule}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors w-full sm:w-auto text-sm sm:text-base"
            >
              Add Stream Time
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={handleSave}
            disabled={saving || loading || schedules.length === 0 || !user?.youtubeChannelUrl || Object.keys(errors).length > 0}
            className="bg-[var(--color-index-bg)] hover:opacity-90 text-white px-6 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed order-1"
          >
            {saving ? "Saving..." : "Save Schedule"}
          </button>
          <button
            onClick={handleCancel}
            disabled={saving}
            className="px-6 py-2 text-[var(--color-text)] bg-gray-600 rounded hover:bg-gray-500 transition-colors disabled:opacity-50 cursor-pointer order-2"
          >
            Close
          </button>
        </div>

        {successMessage && (
          <div className="mt-4 p-4 bg-[var(--color-success-bg)] border border-[var(--color-success-border)] text-[var(--color-success-border)] rounded">
            {successMessage}
          </div>
        )}

        {errors.submit && (
          <div className="mt-4 p-4 bg-[var(--color-error-bg)] border border-[var(--color-error-border)] text-[var(--color-error-border)] rounded">
            {errors.submit}
          </div>
        )}

        {errors.duplicate && (
          <div className="mt-4 p-4 bg-[var(--color-error-bg)] border border-[var(--color-error-border)] text-[var(--color-error-border)] rounded">
            {errors.duplicate}
          </div>
        )}
      </div>

      <div className="text-sm text-[var(--color-text-header)] p-4 bg-[var(--color-panel-bg)] rounded">
        <p className="font-semibold mb-2 text-[var(--color-text-header)]">💡 Tips:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Add multiple schedules if you stream on different days</li>
          <li>Times are in 24-hour format for accuracy</li>
          <li>Make sure to select the correct timezone</li>
        </ul>
      </div>
      {showDeleteModal && (
        <Modal
          message={
            deleteLoading ? (
              <div className="text-center max-w-md mx-auto">
                <div className="text-red-400 text-6xl mb-6">🗑️</div>
                <h3 className="text-xl font-bold text-[var(--color-text-header)] mb-4">
                  Deleting Schedule...
                </h3>
                <p className="text-[var(--color-text-muted-dark)] mb-6 text-lg">
                  Please wait while we remove this schedule item.
                </p>
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-300 border-t-red-400"></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center max-w-md mx-auto">
                <div className="text-red-400 text-6xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold text-[var(--color-text-header)] mb-4">
                  Are you sure you want to delete this schedule item?
                </h3>
                <p className="text-[var(--color-text-muted-dark)] mb-2">
                  This action will permanently remove this scheduled stream time.
                </p>
                <p className="text-red-400 font-semibold">
                  This cannot be undone.
                </p>
              </div>
            )
          }
          onConfirm={deleteLoading ? undefined : confirmDeleteSchedule}
          onCancel={deleteLoading ? undefined : () => setShowDeleteModal(false)}
        />
      )}    </div>
  );
};

export default EditSchedule;
