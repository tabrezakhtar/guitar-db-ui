import { create } from 'zustand';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGuitarStore = create((set, get) => ({
  // State
  guitars: [],
  filesToUpload: [],
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
  clearCurrentGuitar: () => set({ currentGuitar: null }),
  setFilesToUpload: (files) => set({ filesToUpload: files }),
  clearFilesToUpload: () => set({ filesToUpload: null }),

  // Fetch a single guitar
  fetchGuitar: async (id) => {
    if (!id) return;
    
    set({ loading: true });
    try {
      const response = await fetch(`${BASE_URL}/api/guitar?id=${id}`);
      const { guitar, settings } = await response.json();
      set({ currentGuitar: guitar, settings, loading: false });
    } catch (error) {
      console.error("Error fetching guitar:", error);
    }
  },

  // Update a guitar
  updateGuitar: async (updatedGuitar) => {
    set({ saved: false });
    try {
      await fetch(`${BASE_URL}/api/guitars/update/${updatedGuitar._id}`, {
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
    set({ loading: true });
    try {
      const response = await fetch(`${BASE_URL}/api/guitars?page=${page}&limit=20`);
      const data = await response.json();
      set(state => ({
        guitars: page === 1 ? data.guitars : [...state.guitars, ...data.guitars],
        totalGuitars: page === 1 ? data.total : state.totalGuitars,
        page,
        settings: data.settings,
        loading: false
      }));
    } catch (error) {
      console.error("Error fetching guitars:", error);
    }
  },

  cloudinaryUpload: async () => {
    const cloudName = 'dx8d5hlk1';
    const formData = new FormData();
    const { filesToUpload } = get();
    formData.append('file', filesToUpload[0].file);
    formData.append('folder', 'test'); 
    formData.append('upload_preset', 'guitar-images');

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  },

  // Load more guitars
  loadMore: () => {
    const { page, fetchGuitars } = get();
    const nextPage = page + 1;
    fetchGuitars(nextPage);
  }
}));