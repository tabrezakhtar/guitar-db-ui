import { useState, useEffect, useContext } from "react";
import Select from "../components/Select";
import Modal from "../components/Modal";
import { UserContext } from "../context/UserContext";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const FavUsers = ({ isOpen, onClose, currentFavUsers = [] }) => {
  const { updateUserLocal } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      setSuccessMessage("");
      setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (users.length > 0 && currentFavUsers.length > 0) {
      const selectedOptions = currentFavUsers
        .map(userId => users.find(u => u.userId === userId))
        .filter(Boolean)
        .map(user => ({
          value: user.userId,
          label: user.username,
          youtubeChannelAvatar: user.youtubeChannelAvatar
        }));
      setSelectedUsers(selectedOptions);
    }
  }, [users, currentFavUsers]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/schedule/users`, {
        credentials: "include"
      });

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccessMessage("");

    try {
      const userIds = selectedUsers.map(user => user.value);

      const res = await fetch(`${BASE_URL}/api/users/favUsers`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ userIds })
      });

      if (!res.ok) {
        throw new Error("Failed to save favorite users");
      }

      const data = await res.json();
      if (data.user) {
        updateUserLocal(data.user);
      }

      setSuccessMessage("Favorite users saved successfully!");
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const userOptions = users.map(user => ({
    value: user.userId,
    label: user.username,
    youtubeChannelAvatar: user.youtubeChannelAvatar
  }));

  const formatOptionLabel = ({ label, youtubeChannelAvatar }) => (
    <div className="flex items-center gap-2">
      {youtubeChannelAvatar ? (
        <img 
          src={`${BASE_URL}/api/youtube/image-proxy?url=${encodeURIComponent(youtubeChannelAvatar)}`}
          alt={label || ""}
          className="w-8 h-8 rounded object-cover"
        />
      ) : (
        <div className="w-8 h-8 rounded bg-[var(--color-index-bg)] flex items-center justify-center text-white text-xs font-bold">
          {label ? label.charAt(0).toUpperCase() : "?"}
        </div>
      )}
      <span>{label || ""}</span>
    </div>
  );

  if (!isOpen) return null;

  return (
    <Modal
      onCancel={onClose}
      showConfirm={false}
      showCancel={false}
      allowBackgroundClose={!saving}
    >
      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-[var(--color-text-header)] mb-4">⭐ Select Favorite Streamers</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-600 text-red-800 dark:text-red-400 rounded">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-600 text-green-800 dark:text-green-400 rounded">
            {successMessage}
          </div>
        )}

        {loading ? (
          <div className="text-[var(--color-text-muted)] py-8 text-center">Loading users...</div>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-[var(--color-text-header)]">
                Select your favorite streamers to filter the schedule
              </label>
              <Select
                isMulti
                value={selectedUsers}
                onChange={setSelectedUsers}
                options={userOptions}
                formatOptionLabel={formatOptionLabel}
                placeholder="Select streamers..."
                isDisabled={saving}
              />
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={onClose}
                disabled={saving}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-900 dark:text-white rounded transition-colors disabled:opacity-50 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={handleSave}
                disabled={saving || loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-[var(--color-index-bg)] dark:hover:opacity-90 text-white rounded transition-colors disabled:opacity-50 cursor-pointer"
              >
                {saving ? "Saving..." : "Save Favorites"}
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default FavUsers;
