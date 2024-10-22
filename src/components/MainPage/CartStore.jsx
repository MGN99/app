import { create } from 'zustand'; // Cambia esto a una importación nombrada

const useCartStore = create((set) => ({
  cartItems: [],
  addToCart: (course) => set((state) => ({ cartItems: [...state.cartItems, course] })),
  removeFromCart: (courseId) => set((state) => ({
    cartItems: state.cartItems.filter(item => item.courseID !== courseId),
  })),
}));

export default useCartStore; // Continúa exportando como default
