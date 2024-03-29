import { useFormikContext } from "formik";
import React, { FC, memo } from "react";
import { ReservationWithDetails } from "../lib/validation/validationInterfaces";
import paymentStyles from "../styles/payment.module.scss";
import customerStyles from "../styles/customer.module.scss";
import styles from "../styles/main.module.scss";

const Payment: FC = () => {
  const { values, setFieldValue } = useFormikContext<ReservationWithDetails>();

  const setPaymentMethod = (e: React.MouseEvent<HTMLButtonElement>) =>
    setFieldValue("paymentMethod", e.currentTarget.name);

  return (
    <div>
      <div className={customerStyles.detailTitle}>
        <div className={`${styles.todoitem} ${styles.todoitem__four}`} />
        <label>Payment Methods</label>
      </div>
      <div className={customerStyles.detail}></div>
      <div>
        <div className="paymentButtonContainer">
          <button
            className={`${paymentStyles.paymentButton} ${paymentStyles.banktransfer}`}
            type="button"
            name="bankTransfer"
            onClick={setPaymentMethod}
          >
            Bank Transfer
          </button>
          <button
            className={`${paymentStyles.paymentButton} ${paymentStyles.barion}`}
            type="button"
            name="card"
            onClick={setPaymentMethod}
          >
            Card Payment
          </button>
        </div>
        <div>
          <div>
            {values.paymentMethod === "bankTransfer" && (
              <div className={paymentStyles.info}>
                Upon clicking Complete, you will receive an email from us with
                bank transfer details.
              </div>
            )}
          </div>
          <div>
            {values.paymentMethod === "card" && (
              <div className={paymentStyles.info}>
                Click on Finish & Pay to complete card payment using Barion.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Payment);
