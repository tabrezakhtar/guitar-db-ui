import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const VerifyCode = ({ userId, email, onVerified }) => {
  const [code, setCode] = useState("");
  const [currentUserId, setCurrentUserId] = useState(userId);
  const [currentEmail, setCurrentEmail] = useState(email);
  const [errors, setErrors] = useState([]);
  const [showResendOnly, setShowResendOnly] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [maxAttempts, setMaxAttempts] = useState(5);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const codeInputRef = useRef(null);

  const handleVerify = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/auth/verifyCode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code, userId: currentUserId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors || ["Something went wrong"]);
        setShowResendOnly(Boolean(data.showResendOnly));
        if (data.email) setCurrentEmail(data.email);
        if (data.attemptCount) setAttemptCount(data.attemptCount);
        if (data.maxAttempts) setMaxAttempts(data.maxAttempts);
        setCode("");
        codeInputRef.current?.focus();
        return;
      }

      onVerified(data.user);
    } catch {
      setErrors(["Something went wrong. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setErrors([]);
    setResending(true);

    try {
      const res = await fetch(`${BASE_URL}/api/auth/sendCode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId: currentUserId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors || ["Something went wrong"]);
        return;
      }

      setCurrentUserId(data.userId);
      setCurrentEmail(data.email);
      setShowResendOnly(false);
      setAttemptCount(0);
      setCode("");
    } catch {
      setErrors(["Something went wrong. Please try again."]);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-8 bg-[var(--color-toggle-bg)] rounded shadow-md max-w-md mx-auto mt-10 text-center">
      <h1 className="text-2xl font-semibold text-white">Enter Verification Code</h1>
      <p className="text-sm text-gray-400">{currentEmail}</p>

      {!showResendOnly && (
        <div className="bg-slate-700 border border-slate-600 rounded-lg p-6 text-left">
          <p className="text-blue-400 font-semibold mb-3">Check your email for the 4-digit code</p>
          {attemptCount > 0 && (
            <p className="text-sm font-semibold text-amber-400 bg-amber-400/10 border-l-4 border-amber-400 rounded px-2 py-1 mb-2">
              Attempt {attemptCount} of {maxAttempts}
            </p>
          )}
          <p className="text-blue-400 text-sm mb-0">
            The code will expire in 15 minutes. Check your spam folder if you don&apos;t see it.
          </p>
        </div>
      )}

      {showResendOnly && (
        <div className="bg-slate-700 border border-slate-600 rounded-lg p-6">
          <p className="text-blue-400 font-semibold mb-0">🔄 Request a new verification code</p>
        </div>
      )}

      {errors.length > 0 && (
        <ul className="bg-red-900/30 border border-red-600 rounded p-3 text-left">
          {errors.map((error) => (
            <li key={error} className="text-red-300 text-sm">{error}</li>
          ))}
        </ul>
      )}

      {!showResendOnly && (
        <form onSubmit={handleVerify} className="flex flex-col gap-2 text-left">
          <label htmlFor="code" className="text-sm font-medium text-gray-300">Enter 4-digit code</label>
          <input
            id="code"
            ref={codeInputRef}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="1234"
            maxLength={4}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))}
            className="p-4 rounded border border-gray-500 bg-white text-black text-center text-2xl font-semibold tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <p className="text-xs italic text-gray-400 text-center">Enter all 4 digits, then click verify or press Enter</p>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-3 font-medium disabled:bg-gray-500"
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </form>
      )}

      <div className="pt-4 mt-2 border-t border-gray-600">
        {showResendOnly ? (
          <button
            onClick={handleResend}
            disabled={resending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-3 font-medium disabled:bg-gray-500"
          >
            {resending ? "Sending..." : "Get New Code"}
          </button>
        ) : (
          <>
            <p className="text-sm text-gray-300 mb-2">Didn&apos;t receive the code?</p>
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-blue-400 hover:text-blue-300 underline text-sm disabled:text-gray-500"
            >
              {resending ? "Sending..." : "Send new code"}
            </button>
          </>
        )}
      </div>

      <Link to="/login" className="text-sm font-medium text-blue-400 hover:text-blue-300">
        Return to login page
      </Link>
    </div>
  );
};

VerifyCode.propTypes = {
  userId: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  onVerified: PropTypes.func.isRequired,
};

export default VerifyCode;
