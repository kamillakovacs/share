import axios from "axios";

import * as cancelReservation from "../api/makeReservation";

export const useCancelPaymentRequest = async (
  paymentId: string,
  transactionId: string,
  price: string
) => {
  const headers = {
    "Content-Type": "application/json"
  };

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
    .then(async () => {
      await cancelReservation
        .markReservationCanceled(paymentId)
        .then(() => console.log("Reservation has been canceled and refunded"))
        .catch((e) => e);
    })
    .catch(e => console.log("Error refunding payment:" + e))
};
