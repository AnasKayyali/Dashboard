import { create } from 'zustand'

type store = {
  id:any,
  setId: (id:any) => void
}

export const useStore = create<store>(
  (set) => ({
  id: null,
  setId: (id) => {
    set({ id })
  },
  })
);