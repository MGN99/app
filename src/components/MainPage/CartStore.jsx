import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:8080/graphql';

const useCartStore = create((set, get) => ({
  cartItems: [],
  
  fetchCartItems: async (username) => {
    try {
      const response = await axios.post(API_URL, {
        query: `
          mutation {
            viewCartByUsername(username: "${username}") {
              courseID
            }
          }
        `,
      });
      set({ cartItems: response.data.data.viewCartByUsername || [] });
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  },

  addToCart: (item) => set((state) => ({
    cartItems: [...state.cartItems, item],
  })),

  removeFromCart: (courseID) => set((state) => ({
    cartItems: state.cartItems.filter((item) => item.courseID !== courseID),
  })),

  clearCart: () => set({ cartItems: [] }),
}));

export default useCartStore;
