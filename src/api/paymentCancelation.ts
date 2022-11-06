import axios from "axios";
import { NextRouter } from "next/router";

import * as cancelReservation from "../api/makeReservation";

export const useCancelPaymentRequest = async (
  paymentId: string,
  transactionId: string,
  price: string,
  router: NextRouter
) => {
  const headers = {
    "Content-Type": "application/json"
  };

  const transactionToRefund = {
    TransactionId: transactionId,
    POSTransactionId: "",
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
        .then(() => router.replace(""))
        .catch((e) => e);
    });
};
