import { create } from 'zustand';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  getLocation: () => void;
}

const useLocationStore = create<LocationState>((set) => ({
  latitude: null,
  longitude: null,
  error: null,
  getLocation: () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Successfully retrieved the location
          set({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
          });
        },
        (error) => {
          // Failed to retrieve the location
          set({ error: error.message });
        }
      );
    } else {
      set({ error: 'Geolocation is not supported in this browser.' });
    }
  },
}));

export default useLocationStore;
