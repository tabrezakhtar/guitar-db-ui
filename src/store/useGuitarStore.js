import { create } from 'zustand';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGuitarStore = create((set, get) => ({
  // State
  guitars: [],
  currentGuitar: null,
  settings: {},
  loading: true,
  saved: false,
  page: 1,
  totalGuitars: 0,

  // Actions
  setLoading: (loading) => set({ loading }),
  setSaved: (saved) => set({ saved }),
  setCurrentGuitar: (guitar) => set({ currentGuitar: guitar }),

  // Fetch a single guitar
  fetchGuitar: async (id) => {
    if (!id) return;
    
    set({ loading: true });
    try {
      const response = await fetch(`${BASE_URL}/api/guitar?id=${id}`);
      const { guitar, settings } = await response.json();
      set({ currentGuitar: guitar, settings });
    } catch (error) {
      console.error("Error fetching guitar:", error);
    } finally {
      set({ loading: false });
    }
  },

  // Update a guitar
  updateGuitar: async (updatedGuitar) => {
    set({ saved: false });
    try {
      const response = await fetch(`${BASE_URL}/api/guitars/update/${updatedGuitar._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedGuitar)
      });
      set({ currentGuitar: updatedGuitar, saved: true });
    } catch(e) {
      console.error("Error updating guitar:", e);
    }
  },

  // Fetch guitars with pagination
  fetchGuitars: async (page) => {
    try {
      const response = await fetch(`${BASE_URL}/api/guitars?page=${page}&limit=20`);
      const data = await response.json();
      set(state => ({
        guitars: page === 1 ? data.guitars : [...state.guitars, ...data.guitars],
        totalGuitars: page === 1 ? data.total : state.totalGuitars,
        page
      }));
    } catch (error) {
      console.error("Error fetching guitars:", error);
    }
  },

  // Load more guitars
  loadMore: () => {
    const { page, fetchGuitars } = get();
    const nextPage = page + 1;
    fetchGuitars(nextPage);
  }
})); 