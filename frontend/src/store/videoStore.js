import { create } from 'zustand';

export const useVideoStore = create((set) => ({
  isOpen: false,
  activeVideo: null,
  openModal: (video) => set({ isOpen: true, activeVideo: video }),
  closeModal: () => set({ isOpen: false, activeVideo: null }),
}));