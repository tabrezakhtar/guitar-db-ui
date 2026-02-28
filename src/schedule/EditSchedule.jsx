import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useScheduleData } from "./useScheduleData";
import Breadcrumbs from "../components/Breadcrumbs";
import Modal from "../components/Modal";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const EditSchedule = () => {
  const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [timezone, setTimezone] = useState(detectedTimezone || "UTC");
  const [schedules, setSchedules] = useState([]);
  const [initialTimezone, setInitialTimezone] = useState(detectedTimezone || "UTC");
  const [initialSchedules, setInitialSchedules] = useState([]);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const { user } = useContext(UserContext);
  const { getSchedule, updateSchedule, deleteSchedule, loading } = useScheduleData();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchedule = async () => {
      if (user?._id) {
        const data = await getSchedule(user._id);
        if (data) {
          const tz = data.timezone || detectedTimezone || "UTC";
          const scheds = data.liveSchedules && data.liveSchedules.length > 0 ? data.liveSchedules : [];
          setTimezone(tz);
          setSchedules(scheds);
          setInitialTimezone(tz);
          setInitialSchedules(scheds);
        }
      }
    };

    fetchSchedule();
  }, [user]);

  const addSchedule = () => {
    setSchedules([...schedules, { day: "Monday", time: "20:00" }]);
    setErrors({});
  };

  const removeSchedule = (index) => {
    setSchedules(schedules.filter((_, i) => i !== index));
    const newErrors = { ...errors };
    delete newErrors[`day-${index}`];
    delete newErrors[`time-${index}`];
    setErrors(newErrors);
  };

  const updateScheduleItem = (index, field, value) => {
    const newSchedules = [...schedules];
    newSchedules[index][field] = value;
    setSchedules(newSchedules);
    
    const newErrors = { ...errors };
    delete newErrors[`${field}-${index}`];
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
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (err) {
      setErrors({ submit: "Failed to save schedule. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setShowDeleteModal(false);
    setSaving(true);
    try {
      await deleteSchedule();
      setSuccessMessage("Schedule deleted successfully!");
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (err) {
      setErrors({ submit: err.message || "Failed to delete schedule. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  const hasChanges = () => {
    if (timezone !== initialTimezone) return true;
    if (schedules.length !== initialSchedules.length) return true;
    
    return schedules.some((schedule, index) => {
      const initial = initialSchedules[index];
      return !initial || schedule.day !== initial.day || schedule.time !== initial.time;
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

      {successMessage && (
        <div className="mb-4 p-4 bg-[var(--color-success-bg)] border border-[var(--color-success-border)] text-[var(--color-success-border)] rounded">
          {successMessage}
        </div>
      )}

      {errors.submit && (
        <div className="mb-4 p-4 bg-[var(--color-error-bg)] border border-[var(--color-error-border)] text-[var(--color-error-border)] rounded">
          {errors.submit}
        </div>
      )}

      {errors.duplicate && (
        <div className="mb-4 p-4 bg-[var(--color-error-bg)] border border-[var(--color-error-border)] text-[var(--color-error-border)] rounded">
          {errors.duplicate}
        </div>
      )}

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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
            <h3 className="text-lg font-semibold text-[var(--color-text-header)]">Live Stream Times</h3>
            <button
              onClick={addSchedule}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors w-full sm:w-auto text-sm sm:text-base"
            >
              Add Schedule
            </button>
          </div>

          <div className="space-y-3">
            {schedules.length === 0 ? (
              <div className="p-6 bg-[var(--color-main-bg)] rounded border-2 border-dashed border-[var(--color-text-muted)] text-center">
                <p className="text-[var(--color-text-header)] mb-2">No schedules yet</p>
                <p className="text-sm text-[var(--color-text-muted)]">Click the "+ Add Schedule" button above to create your first schedule</p>
              </div>
            ) : (
              schedules.map((schedule, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-3 items-start p-3 sm:p-4 bg-[var(--color-main-bg)] rounded">
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
                  <label className="block text-xs text-[var(--color-text-muted)] mb-1">Time</label>
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

                <button
                  onClick={() => removeSchedule(index)}
                  className="sm:mt-5 px-3 py-2 rounded transition-colors w-full sm:w-auto bg-[var(--color-delete-bg)] hover:bg-[var(--color-delete-hover)] text-white"
                  title="Remove this schedule"
                >
                  Remove
                </button>
              </div>
              ))
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={handleSave}
            disabled={saving || loading || !hasChanges()}
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
          <button
            onClick={handleDelete}
            disabled={saving || loading || schedules.length === 0}
            className="bg-[var(--color-delete-bg)] hover:bg-[var(--color-delete-hover)] text-white px-6 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed sm:ml-auto order-3"
          >
            {saving ? "Deleting..." : "Delete Schedule"}
          </button>
        </div>
      </div>

      <div className="text-sm text-[var(--color-text-header)] p-4 bg-[var(--color-panel-bg)] rounded">
        <p className="font-semibold mb-2 text-[var(--color-text-header)]">💡 Tips:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Add multiple schedules if you stream on different days</li>
          <li>Times are in 24-hour format for accuracy</li>
          <li>Make sure to select the correct timezone</li>
          <li>You can reorder schedules by removing and re-adding them</li>
        </ul>
      </div>

      {showDeleteModal && (
        <Modal
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        >
          <div className="text-center">
            <p className="mb-2">Are you sure you want to delete your entire schedule?</p>
            <p>This action cannot be undone.</p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EditSchedule;
