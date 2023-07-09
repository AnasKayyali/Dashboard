import { create } from 'zustand'
export const useStore = create(
  (set) => ({
  id: null,
  setId: (id) => {
    set({ id })
  },
  })
);