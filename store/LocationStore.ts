import { create } from 'zustand';

interface LocationState {
  latitude: number;
  longitude: number;
  address: string | null;
  error: string | null;
  getLocation: () => void;
  setLocation: (lat: number, lng: number, address: string | null) => void;
  setAddress: (address: string | null) => void; // Add setAddress function
}

const useLocationStore = create<LocationState>((set) => ({
  latitude: 0,
  longitude: 0,
  address: '',
  error: null,

  getLocation: () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          set({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
          });
        },
        (error) => {
          set({ error: error.message });
        }
      );
    } else {
      set({ error: 'Geolocation is not supported in this browser.' });
    }
  },

  setLocation: (lat, lng, address) => {
    set({ latitude: lat, longitude: lng, address });
  },

  setAddress: (address) => {
    set({ address });
  },
}));

export default useLocationStore;
