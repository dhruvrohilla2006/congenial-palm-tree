import { create } from "zustand";

export const useCartStore = create((set) => ({
  items: [],
  addItem: (food) =>
    set((state) => {
      const existing = state.items.find((it) => it.food._id === food._id);
      if (existing) {
        return {
          items: state.items.map((it) =>
            it.food._id === food._id
              ? { ...it, quantity: it.quantity + 1 }
              : it,
          ),
        };
      }
      return { items: [...state.items, { food, quantity: 1 }] };
    }),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((it) => it.food._id !== id),
    })),
  clear: () => set({ items: [] }),
}));

