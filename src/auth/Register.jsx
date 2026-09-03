import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useHeader } from "../context/HeaderContext";
import Logo from "../Logo";
import VerifyCode from "./VerifyCode";
import GuestLoginButton from "./GuestLoginButton";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [verification, setVerification] = useState(null);
  const { setUser } = useContext(UserContext);
  const { hideHeader, displayHeader } = useHeader();
  const navigate = useNavigate();

  const getErrors = (apiErrors) =>
    Array.isArray(apiErrors) ? apiErrors : [apiErrors || "Something went wrong"];

  useEffect(() => {
    hideHeader();
    return () => displayHeader();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, email, bio, location }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors(getErrors(data.errors));
        return;
      }

      setVerification({ userId: data.userId, email: data.email });
    } catch {
      setErrors(["Something went wrong. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerified = (user) => {
    setUser(user);
    navigate("/profile");
  };

  if (verification) {
    return (
      <VerifyCode
        userId={verification.userId}
        email={verification.email}
        onVerified={handleVerified}
      />
    );
  }

  return (
    <div className="relative flex flex-col gap-4 p-8 bg-[var(--color-toggle-bg)] rounded shadow-md max-w-md mx-auto mt-10">
      <Link to="/" className="absolute top-4 left-4 text-sm font-medium text-blue-400 hover:text-blue-300">
        ‹ Return to app
      </Link>
      <div className="flex items-center justify-center mb-2">
        <Logo />
      </div>
      <h2 className="text-lg font-medium text-white text-center">Welcome to rifftales!</h2>
      <p className="text-sm text-gray-400 text-center">Create an account to start your guitar collection journey</p>
      {errors.length > 0 && (
        <ul className="bg-red-900/30 border border-red-600 rounded p-3">
          {errors.map((error) => (
            <li key={error} className="text-red-300 text-sm">{error}</li>
          ))}
        </ul>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="username" className="text-sm font-medium text-gray-300">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-2 rounded border border-gray-500 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-300">Email address</label>
          <input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 rounded border border-gray-500 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="bio" className="text-sm font-medium text-gray-300">About you (optional)</label>
          <textarea
            id="bio"
            placeholder="Tell us about your guitar interests"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="p-2 rounded border border-gray-500 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="location" className="text-sm font-medium text-gray-300">Location (optional)</label>
          <input
            id="location"
            type="text"
            placeholder="City, Country"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="p-2 rounded border border-gray-500 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white rounded px-4 py-3 font-medium disabled:bg-gray-500"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>
      <p className="text-center text-sm text-gray-300">
        Already have an account? <Link to="/login" className="text-blue-400 hover:underline font-medium">Login</Link>
      </p>
      <GuestLoginButton onSuccess={handleVerified} />
    </div>
  );
};

export default Register;
