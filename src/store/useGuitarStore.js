import { create } from "zustand";
import { resizeImage, getCombinedUrl } from "../imageUtils";

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
  updateGuitar: async () => {
    const { currentGuitar } = get(); // Access the latest state directly
    if (!currentGuitar || Object.keys(currentGuitar).length === 0) {
      console.error("currentGuitar is empty or undefined");
      return;
    }

    set({ saved: false });
    try {
      await fetch(`${BASE_URL}/api/guitars/update/${currentGuitar._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentGuitar),
      });
      set({ saved: true });
    } catch (e) {
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

  cloudinaryUpload: async (file) => {
    const cloudName = "x8d5hlk1";
    const apiKey = "124113443758435";
    const formData = new FormData();
    // const { filesToUpload } = get();

    // const resizedFiles = await Promise.all(
    //   filesToUpload.map(file => resizeImage(file.file))
    // );
    const resizedFile = await resizeImage(file.file);

    formData.append("file", resizedFile);
    formData.append("folder", "test"); 
    formData.append("upload_preset", "guitar-images");
    formData.append("api_key", apiKey);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData
      });
      const data = await response.json();

      if (data.error) {
        console.error("Error uploading image:", data.error);
        return null;
      }

      //put the secure_url into the images
      const { currentGuitar } = get();
      const updatedImages = currentGuitar.images.map(image =>
        getCombinedUrl(image) === file.url ? data.secure_url : image
      );
      set({ currentGuitar: { ...currentGuitar, images: updatedImages } });

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