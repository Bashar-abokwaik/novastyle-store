import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import type { CartResponse } from "../../hooks/useCart";
import { getDiscountedPrice } from "../../utils/discountedPrice";

// Define the initial state of the cart slice, which includes an empty cart with no items. The initial state is structured according to the CartResponse type, ensuring that the cart has a consistent shape throughout the application.
const initialState: CartResponse["cart"] = {
  _id: "",
  userId: "",
  items: [],
};

// Create the cart slice using Redux Toolkit's createSlice function. This slice manages the state of the shopping cart, including actions for setting and clearing the cart items. The reducers update the state based on dispatched actions, allowing for easy management of the cart's contents.
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Define the setCart reducer, which updates the state with the provided cart items. This action is typically dispatched when the cart is refreshed or updated, ensuring that the state reflects the latest cart contents.
    setCart(state, action: PayloadAction<CartResponse["cart"]["items"]>) {
      state.items = action.payload;
    },

    // Define the clearCart reducer, which clears all items from the cart. This action is typically dispatched when the user logs out or completes a purchase, ensuring that the cart is emptied.
    clearCart(state) {
      state.items = [];
    },
  },
});

// Export the setCart and clearCart actions, as well as selectors for accessing cart items, total price, and item count from the Redux store. These exports allow other parts of the application to interact with the cart state managed by this slice.
export const { setCart, clearCart } = cartSlice.actions;

export const selectCartItems = (state: RootState) => state.cart.items;

export const selectCartTotal = (state: RootState) =>
  state.cart.items.reduce((t, i) => {
    return (
      t +
      getDiscountedPrice(
        Number(i.productId.price),
        Number(i.productId.discount ?? 0),
      ) *
        Number(i.quantity)
    );
  }, 0);

export const selectCartCount = (state: RootState) =>
  state.cart.items.reduce((c, i) => c + i.quantity, 0);

export default cartSlice.reducer;
