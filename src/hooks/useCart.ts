import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { cartService } from "../services/cartService";
import { setCart, clearCart } from "../features/cart/cartSlice";
import type { productTemplate } from "../types";

// CartResponse interface defines the structure of the response received when interacting with the cart.
export interface CartResponse {
  message: string;
  cart: {
    _id: string;
    userId: string;
    items: {
      productId: productTemplate;
      quantity: number;
    }[];
  };
}

export function useCart() {
  const dispatch = useDispatch();

  // refreshCart function fetches the current state of the user's cart from the server and updates the Redux store with the latest cart items.
  const refreshCart = useCallback(async () => {
    const response = (await cartService.getCart()) as CartResponse;
    dispatch(setCart(response.cart.items));
  }, [dispatch]);

  // addToCart function adds a specified quantity of a product to the user's cart and updates the Redux store with the latest cart items.
  const addToCart = async (productId: string, quantity: number = 1) => {
    const updated = (await cartService.addItem(
      productId,
      quantity,
    )) as CartResponse;
    dispatch(setCart(updated.cart.items));
  };

  // removeFromCart function removes a product from the user's cart and updates the Redux store with the latest cart items.
  const removeFromCart = async (productId: string) => {
    const updated = (await cartService.removeItem(productId)) as CartResponse;
    dispatch(setCart(updated.cart.items));
  };

  // increaseQuantity function increases the quantity of a specified product in the user's cart and updates the Redux store with the latest cart items.
  const increaseQuantity = async (productId: string) => {
    const updated = (await cartService.increaseQuantity(
      productId,
    )) as CartResponse;
    dispatch(setCart(updated.cart.items));
  };

  // decreaseQuantity function decreases the quantity of a specified product in the user's cart and updates the Redux store with the latest cart items.
  const decreaseQuantity = async (
    productId: string,
    currentQuantity: number,
  ) => {
    if (currentQuantity === 1) {
      await removeFromCart(productId);
      return;
    }

    const updated = (await cartService.decreaseQuantity(
      productId,
    )) as CartResponse;

    dispatch(setCart(updated.cart.items));
  };

  // clearUserCart function clears all items from the user's cart and updates the Redux store to reflect an empty cart.
  const clearUserCart = async () => {
    await cartService.clearCart();
    dispatch(clearCart());
  };

  // Return the cart management functions to be used in components.
  return {
    refreshCart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearUserCart,
  };
}
