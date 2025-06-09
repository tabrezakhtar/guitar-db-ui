const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function decodeJWT(token) {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) throw new Error("Invalid JWT");

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = atob(base64);
    const decoded = JSON.parse(jsonPayload);
    return decoded;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

export async function validateToken(updateState) {
  try {
    const token = localStorage.getItem("token");
    if (!token) return false;

    const decodedToken = decodeJWT(token);
    if (!decodedToken) return false;

    const currentTime = Math.floor(Date.now() / 1000);
    
    if (decodedToken.exp && decodedToken.exp > currentTime) {
      return true;
    } else {
      return await refreshToken(updateState);
    }
  } catch (error) {
    if (updateState) {
      updateState(error.message || "Failed to validate token");
    }
    return false;
  }
}

export async function refreshToken(updateState) {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const response = await fetch(`${BASE_URL}/api/auth/refreshToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (response.ok && data.token) {
      localStorage.setItem("token", data.token);
      return true;
    } else {
      if (updateState) {
        updateState(data.message || "Session expired");
      }
      return false;
    }
  } catch (error) {
    if (updateState) {
      updateState("Authentication failed");
    }
    return false;
  }
}
