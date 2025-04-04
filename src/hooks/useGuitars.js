import { useState, useEffect } from "react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function useGuitars() {
  const [guitars, setGuitars] = useState([]);
  const [page, setPage] = useState(1);
  const [totalGuitars, setTotalGuitars] = useState(0);

  const fetchGuitars = async (page) => {
    try {
      const response = await fetch(`${BASE_URL}/api/guitars?page=${page}&limit=20`);
      const data = await response.json();
      setGuitars(prevGuitars => page === 1 ? data.guitars : [...prevGuitars, ...data.guitars]);
      page === 1 && setTotalGuitars(data.total);
    } catch (error) {
      console.error("Error fetching guitars:", error);
    }
  };

  useEffect(() => {
    let subscribed = true;
    (async () => {
      if (subscribed) {
        await fetchGuitars(1);
      }
    })();
    return () => {
      subscribed = false;
    };
  }, []);

  const loadMore = () => {
    setPage(prevPage => {
      const nextPage = prevPage + 1;
      fetchGuitars(nextPage);
      return nextPage;
    });
  };

  return { guitars, totalGuitars, loadMore };
} 