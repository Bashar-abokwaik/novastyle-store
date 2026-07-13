import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { useCart } from "../../hooks/useCart";

import { getDiscountedPrice } from "../../utils/discountedPrice";

import {
  selectCartItems,
  selectCartTotal,
  selectCartCount,
} from "../../features/cart/cartSlice";

import { Trash, ShoppingBag, ArrowLeft } from "lucide-react";
import type { RootState } from "../../app/store";

import styles from "./Cart.module.css";

export default function Cart() {
  // Destructure cart management functions from the useCart hook
  const {
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearUserCart,
  } = useCart();
  // Get the authentication token from the Redux store
  const token = useSelector((state: RootState) => state.auth.token);

  // Select cart items, total price, and item count from the Redux store
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const cartCount = useSelector(selectCartCount);


  // Handler functions for cart actions
  const handleIncrease = async (productId: string) => {
    if (!token) return;

    await increaseQuantity(productId);
  };

  // Handler function to decrease the quantity of a product in the cart
  const handleDecrease = async (productId: string) => {
    if (!token) return;
    // Get the current quantity of the product in the cart. If the product is not found, default to 1.
    const currentQuantity = cartItems.find(item => item.productId._id === productId)?.quantity ?? 1;
    await decreaseQuantity(productId, currentQuantity);
  };

  // Handler function to remove a product from the cart
  const handleRemove = async (productId: string) => {
    if (!token) return;

    await removeFromCart(productId);
  };

  // Handler function to clear all items from the cart
  const handleClear = async () => {
    if (!token) return;

    await clearUserCart();
  };
  return (
    <div className={styles.cartPage}>
      <div className={styles.cartContainer}>
        <div className={styles.cartHeader}>
          <h1 className={styles.cartTitle}>
            <ShoppingBag size={28} />
            Shopping Cart
          </h1>

          <p className={styles.cartInfo}>
            {cartItems.length === 0
              ? "Your cart is empty."
              : `You have ${cartCount} items in your cart.`}
          </p>
        </div>

        <ul className={styles.cartList}>
          {cartItems.map((item) => (
            <li key={item.productId._id} className={styles.cartItem}>
              <div className={styles.imageWrapper}>
                <img src={item.productId.imageUrl} className={styles.cartItemImage} />
              </div>

              <div className={styles.cartItemDetails}>
                <p className={styles.cartItemTitle}>{item.productId.title}</p>

                <span className={styles.cartItemPrice}>
                  $
                  {(
                    getDiscountedPrice(item.productId.price, item.productId.discount ?? 0) * item.quantity
                  ).toFixed(2)}
                </span>
              </div>

              <div className={styles.cartItemActions}>
                <button
                  className={styles.quantityButton}
                  onClick={() => handleDecrease(item.productId._id)}
                >
                  -
                </button>

                <span>{item.quantity}</span>

                <button
                  className={styles.quantityButton}
                  onClick={() => handleIncrease(item.productId._id)}
                >
                  +
                </button>

                <button
                  className={styles.removeButton}
                  onClick={() => handleRemove(item.productId._id)}
                >
                  <Trash size={18} />
                </button>
              </div>
            </li>
          ))}
        </ul>

        {cartItems.length > 0 && (
          <>
            <div className={styles.summaryCard}>
              <div className={styles.summaryRow}>
                <span>Total Items</span>
                <span>{cartCount}</span>
              </div>

              <div className={styles.summaryRow}>
                <span>Total Price</span>
                <span className={styles.totalPrice}>
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <div className={styles.cartActions}>
              <Link to="/checkout" className={styles.checkoutButton}>
                Checkout
              </Link>

              <button className={styles.clearCartButton} onClick={handleClear}>
                <Trash size={18} />
                Clear
              </button>

              <button
                className={styles.continueShoppingButton}
                onClick={() => window.history.back()}
              >
                <ArrowLeft size={18} />
                Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
