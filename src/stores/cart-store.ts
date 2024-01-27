import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: Array<object>(),
  }),

  getters: {
    getCart(state) {
      return state.cart;
    },
  },

  actions: {
    addToCart(product: object) {
      this.cart.push(product);
    },

    removeFromCart(product: object) {
      this.cart.splice(
        this.cart.findIndex((element: object) => element.id === product.id),
        1
      );
    },

    clearCart() {
      this.cart = Array<object>();
    },
  },
});
