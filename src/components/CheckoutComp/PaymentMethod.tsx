import { CreditCard, Banknote } from "lucide-react";

import styles from "./PaymentMethod.module.css";

// Define the PaymentMethod component, which allows users to select a payment method (cash or visa) and displays relevant input fields for the selected method.
interface PaymentMethodProps {
  value: "cash" | "visa";
  onChange: (method: "cash" | "visa") => void;
}

// The PaymentMethod component renders a card with options for selecting a payment method. It includes radio buttons for "Cash on Delivery" and "Visa (Demo)" payment methods. When the "Visa" option is selected, additional input fields for card number, expiration date, and CVV are displayed.
export default function PaymentMethod({ value, onChange }: PaymentMethodProps) {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Payment Method</h2>

      <label className={`${styles.option} ${value === "cash" ? styles.selected : ""}`}>
        <input
          type="radio"
          name="paymentMethod"
          value="cash"
          checked={value === "cash"}
          onChange={() => onChange("cash")}
        />

        <div className={styles.content}>
          <Banknote size={22} />
          <div>
            <h3>Cash on Delivery</h3>
            <p>Pay when your order arrives.</p>
          </div>
        </div>
      </label>

      <label
        className={`${styles.option} ${value === "visa" ? styles.selected : ""}`}
      >
        <input
          type="radio"
          name="paymentMethod"
          value="visa"
          checked={value === "visa"}
          onChange={() => onChange("visa")}
        />

        <div className={styles.content}>
          <CreditCard size={22} />
          <div>
            <h3>Visa (Demo)</h3>
            <p>Simulated card payment for portfolio purposes.</p>
          </div>
        </div>
      </label>

      {value === "visa" && (
        <div className={styles.visaForm}>
          <input type="text" placeholder="Card Number" maxLength={19} />

          <div className={styles.row}>
            <input type="text" placeholder="MM/YY" maxLength={5} />

            <input type="text" placeholder="CVV" maxLength={3} />
          </div>
        </div>
      )}
    </div>
  );
}
