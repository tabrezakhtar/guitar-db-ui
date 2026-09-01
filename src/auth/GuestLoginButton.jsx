import { useState } from "react";
import PropTypes from "prop-types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const GuestLoginButton = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGuestLogin = async () => {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/auth/guestLogin`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError("Something went wrong. Please try again.");
        return;
      }

      onSuccess(data.user);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 pt-6 mt-2 border-t border-gray-600 text-center">
      <p className="font-bold text-white">Want to explore the app without signing up?</p>
      <p className="text-xs text-gray-400">
        Note: Guest accounts are temporary and cleared periodically. Any data will be lost.
      </p>
      {error && <p className="text-red-300 text-sm">{error}</p>}
      <button
        onClick={handleGuestLogin}
        disabled={loading}
        className="bg-[#1d52bc] hover:bg-[#1543a5] text-white rounded px-4 py-3 font-medium disabled:bg-gray-500"
      >
        {loading ? "Continuing..." : "Continue as a Temporary Guest"}
      </button>
      <p className="text-xs text-white">
        By continuing, you acknowledge and accept the use of essential functional cookies.
      </p>
    </div>
  );
};

GuestLoginButton.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};

export default GuestLoginButton;
