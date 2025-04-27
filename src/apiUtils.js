export const apiRequest = async (url, options = {}, onSuccess, onError) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (onSuccess) onSuccess(data);
    return data;
  } catch (error) {
    console.error("API Request Error:", error.message);
    if (onError) onError(error);
    throw error;
  }
};