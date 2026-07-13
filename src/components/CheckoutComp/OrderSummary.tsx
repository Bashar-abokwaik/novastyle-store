import { useSelector } from "react-redux";
import {
  selectCartItems,
  selectCartTotal,
} from "../../features/cart/cartSlice";
import styles from "./orderSummary.module.css";
import { useEffect } from "react";
import { useCart } from "../../hooks/useCart";


export default function OrderSummary() {
  // Access the cart items and total from the Redux store using selectors
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  // Use the custom useCart hook to manage cart actions
  const { refreshCart } = useCart();
  // Use useEffect to refresh the cart when the component mounts, ensuring that the latest cart items are displayed in the order summary
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);
  
  return (
    <div className={styles.orderSummary}>
      <h2 className={styles.heading}>Order Summary</h2>
      <ul className={styles.itemList}>
        {cartItems.map((item) => (
          <li key={item.productId._id} className={styles.item}>
            <span>{item.productId.title}</span>
            <span>
              ${item.productId.price} x {item.quantity}
            </span>
          </li>
        ))}
      </ul>
      <p className={styles.totalPrice}>Total Price: ${cartTotal.toFixed(2)}</p>
    </div>
  );
}
