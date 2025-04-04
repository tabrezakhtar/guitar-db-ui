import { useState, useEffect } from "react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function useGuitar(id) {
  const [guitar, setGuitar] = useState(null);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchGuitar = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/guitar?id=${id}`);
        const { guitar, settings } = await response.json();
        setGuitar(guitar);
        setSettings(settings);
      } catch (error) {
        console.error("Error fetching guitar:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchGuitar();
    }
  }, [id]);

  const updateGuitar = async (updatedGuitar) => {
    setSaved(false);
    try {
      const response = await fetch(`${BASE_URL}/api/guitars/update/${updatedGuitar._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedGuitar)
      });
      setGuitar(updatedGuitar);
      setSaved(true);
    } catch(e) {
      console.error("Error updating guitar:", e);
    }
  };

  return { guitar, settings, loading, saved, updateGuitar, setGuitar };
} 