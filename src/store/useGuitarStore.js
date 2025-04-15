import { create } from "zustand";
import { resizeImage, getCombinedUrl } from "../imageUtils";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGuitarStore = create((set, get) => ({
  guitars: [],
  filesToUpload: [],
  currentGuitar: null,
  settings: {},
  loading: true,
  page: 1,
  totalGuitars: 0,

  setLoading: (loading) => set({ loading }),
  setCurrentGuitar: (guitar) => set({ currentGuitar: guitar }),
  clearCurrentGuitar: () => set({ currentGuitar: null }),
  setFilesToUpload: (files) => set({ filesToUpload: files }),
  clearFilesToUpload: () => set({ filesToUpload: null }),

  fetchSettings: async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/guitar/settings`);
      const data = await response.json();
      set({ settings: data.settings || {} });
      return data.settings;
    } catch (error) {
      console.error("Error fetching settings:", error);
      return {};
    }
  },

  fetchGuitar: async (id) => {
    if (!id) return;
    set({ loading: true });
    try {
      const response = await fetch(`${BASE_URL}/api/guitar?id=${id}`);
      const { guitar, settings } = await response.json();
      set({ currentGuitar: guitar, settings, loading: false });
    } catch (error) {
      console.error("Error fetching guitar:", error);
      set({ loading: false });
    }
  },

  updateGuitar: async () => {
    const { currentGuitar } = get();
    
    try {
      // If the guitar has no _id, it's a new guitar (add mode)
      if (!currentGuitar._id) {
        const response = await fetch(`${BASE_URL}/api/guitars/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currentGuitar),
        });
        
        if (!response.ok) {
          throw new Error('Failed to add new guitar');
        }
        
        const result = await response.json();
        set({ currentGuitar: result });
        return result.guitar;
      } else {
        // Update existing guitar
        const response = await fetch(`${BASE_URL}/api/guitars/update/${currentGuitar._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currentGuitar),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update guitar');
        }
        
        return currentGuitar;
      }
    } catch (e) {
      console.error("Error updating/adding guitar:", e);
      throw e;
    }
  },

  deleteGuitar: async () => {
    const { currentGuitar } = get();
    if (!currentGuitar || !currentGuitar._id) {
      console.error("No guitar selected for deletion");
      return;
    }

    try {
      await fetch(`${BASE_URL}/api/guitars/remove/${currentGuitar._id}`, {
        method: "DELETE",
      });
      console.log("Guitar deleted successfully");
      clearCurrentGuitar();
    } catch (e) {
      console.error("Error deleting guitar:", e);
    }
  },

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

  deleteImage: async (imageUrl) => {
    const currentGuitar = get().currentGuitar; // Correctly access currentGuitar from the store
    if (!currentGuitar || !currentGuitar._id) {
      console.error("No guitar selected for deletion");
      return;
    }

    if (!imageUrl) {
      console.error("No image URL provided for deletion");
      return;
    }

    try {
      await fetch(`${BASE_URL}/api/guitars/deleteImage/${currentGuitar._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl: imageUrl }), // Ensure body is properly stringified
      });
      console.log("Image deleted successfully");

      const updatedImages = currentGuitar.images.filter((image) => getCombinedUrl(image) !== imageUrl);
      set({ currentGuitar: { ...currentGuitar, images: updatedImages } });
    } catch (e) {
      console.error("Error deleting image:", e);
    }
  },

  loadMore: () => {
    const { page, fetchGuitars } = get();
    const nextPage = page + 1;
    fetchGuitars(nextPage);
  }
}));
