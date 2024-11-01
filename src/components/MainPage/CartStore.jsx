import {create} from 'zustand';

const useCartStore = create((set, get) => ({
  cartItems: [],
  addToCart: (item) => set((state) => ({
    cartItems: [...state.cartItems, item],
  })),
  removeFromCart: (itemID) => set((state) => ({
    cartItems: state.cartItems.filter((item) => item.courseID !== itemID),
  })),
  getCartCount: () => get().cartItems.length, 
}));

export default useCartStore;
