import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:8080/graphql';

const useCartStore = create((set, get) => ({
  cartItems: [],
  
  fetchCartItems: async (email) => {
    try {
      const response = await axios.post(API_URL, {
        query: `
          mutation {
            viewCartByEmail(email: "${email}") {
              courseID
            }
          }
        `,
      });
      set({ cartItems: response.data.data.viewCartByEmail || [] });
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  },

  addToCartbyEmail: (item) => set((state) => ({
    cartItems: [...state.cartItems, item],
  })),

  removeFromCart: (courseID) => set((state) => ({
    cartItems: state.cartItems.filter((item) => item.courseID !== courseID),
  })),

  clearCart: () => set({ cartItems: [] }),
}));

export default useCartStore;
