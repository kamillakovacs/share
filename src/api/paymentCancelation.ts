import axios from "axios";

import * as cancelReservation from "../api/makeReservation";
import { ReservationWithDetails } from "../lib/validation/validationInterfaces";

export const useCancelPaymentRequest = async (
  paymentId: string,
  reservation: ReservationWithDetails,
  price: string,
  language: string
) => {
  const headers = {
    "Content-Type": "application/json"
  };
  const transactionId = reservation?.transactionId;

  const transactionToRefund = {
    TransactionId: transactionId,
    POSTransactionId: transactionId,
    AmountToRefund: parseFloat(price)
  };

  const data = {
    POSKey: process.env.BARION_POS_KEY,
    PaymentId: paymentId,
    TransactionsToRefund: [transactionToRefund]
  };

  return axios
    .post(process.env.BARION_PAYMENT_REFUND_URL, data, {
      headers
    })
    .then(async (res) => {
      console.log(res)
      await axios
        .post("/api/email", { reservation, paymentId, language })
        .then((res) => res.data)
        .catch((e) => {
          console.log("Error sending email confirming cancelation")
          return e;
        });

      await axios
        .post("/api/receipt", { reservation, paymentId })
        .then((res) => res.data)
        .catch((e) => {
          console.log("Error sending cancelation receipt")
          return e;
        });

      await cancelReservation
        .markReservationCanceled(paymentId)
        .then(() => console.log("Reservation has been canceled and refunded"))
        .catch((e) => {
          console.log("Error saving cancelation")
          return e;
        });
    })
    .catch(e => console.log("Error refunding payment:" + e))
};
