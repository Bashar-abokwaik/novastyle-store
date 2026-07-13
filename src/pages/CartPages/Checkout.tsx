import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { userService } from "../../services/userService";
import { orderService } from "../../services/orderService";
import { useCart } from "../../hooks/useCart";
import { useNavigate } from "react-router-dom";

import Toast from "../../components/UI/Toast/Toast";
import Spinner from "../../components/UI/Spinner/Spinner";

import AddressSection from "../../components/CheckoutComp/AddressSection";
import PaymentMethod from "../../components/CheckoutComp/PaymentMethod";
import OrderSummary from "../../components/CheckoutComp/OrderSummary";
import styles from "./checkout.module.css";

// Define the structure of the response received when fetching user address
interface GetUserAddressResponse {
  message: string;
  address: {
    country: string;
    city: string;
    street: string;
    postalCode: string;
  };
}

export default function Checkout() {
  const navigate = useNavigate();
  // Destructure the clearUserCart function from the useCart hook to clear the cart after placing an order
  const { clearUserCart } = useCart();
  // Create a ref for the toast dialog to control its visibility and manage toast messages and types
  const toastRef = useRef<HTMLDialogElement>(
    null,
  ) as React.RefObject<HTMLDialogElement>;
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // Use React Query to fetch the user's address from the server
   const { data, error, isLoading } = useQuery<GetUserAddressResponse, Error>({
    queryKey: ["user", "address"],
    queryFn: async (): Promise<GetUserAddressResponse> => {
      const response = await userService.getUserAddress();
      return response as GetUserAddressResponse;
    }
  });

  // State to manage the selected payment method and address details
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "visa">("cash");
  const [address, setAddress] = useState({
    country: "",
    city: "",
    street: "",
    postalCode: "",
  });

  // Update the address state when the data from the query changes, ensuring that the address is correctly set if it exists in the response
  useEffect(() => {
    if (
      data &&
      data.address &&
      typeof data.address === "object"
    ) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAddress({
        country: (data.address as Record<string, string>).country || "",
        city: (data.address as Record<string, string>).city || "",
        street: (data.address as Record<string, string>).street || "",
        postalCode:
          (data.address as Record<string, string>).postalCode || "",
      });
    }
  }, [data]);

  // Function to show the toast message for a brief period, indicating success or error after placing an order
  const showToast = () => {
    if (toastRef.current) {
      toastRef.current.showModal();
      setTimeout(() => {
        toastRef.current?.close();
      }, 3000);
    }
  };

  // Function to handle placing an order, which calls the order service and shows a toast message based on the success or failure of the operation
  const handlePlaceOrder = async () => {
    // Validate that all address fields are filled in before attempting to place the order. If any field is empty, show an error toast message and return early.
    if (
      !address.country.trim() ||
      !address.city.trim() ||
      !address.street.trim() ||
      !address.postalCode.trim()
    ) {
      setToastMessage("Please fill in all address fields.");
      setToastType("error");
      showToast();
      return;
    }
    
    try {
      await orderService.placeOrder(address, paymentMethod);
      setToastMessage("Order placed successfully!");
      setToastType("success");
      showToast();
      clearUserCart();
      navigate("/orders/");
    } catch {
      setToastMessage("Failed to place order. Please try again.");
      setToastType("error");
      showToast();
    }
  };

  return (
    <section className={styles.page}>
      <div className={styles.checkoutContainer}>
        <div className={styles.header}>
          <h1>Checkout Page</h1>
          <p>This is where the checkout process will be implemented.</p>
        </div>
        {isLoading && <Spinner />}
        {error && <p>Error loading user data: {error.message}</p>}
        <div className={styles.content}>
          <div className={styles.sections}>
            <OrderSummary />
            <AddressSection address={address} setAddress={setAddress} />
            <PaymentMethod value={paymentMethod} onChange={setPaymentMethod} />
          </div>
          <div className={styles.actions}>
            <button className={styles.placeOrderBtn} onClick={handlePlaceOrder}>
              Place Order
            </button>
          </div>
        </div>
        <Toast ref={toastRef} message={toastMessage} type={toastType} />
      </div>
    </section>
  );
}
