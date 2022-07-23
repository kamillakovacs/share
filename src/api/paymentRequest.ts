import axios from "axios";
import { NextRouter } from "next/router";

import * as newReservation from "../api/newReservation";
import { ReservationData } from "../lib/interfaces";
import { BarionPaymentResponseData } from "./interfaces";

export const useSendPaymentRequest = async (
  reservationData: ReservationData,
  users: ReservationData[],
  router: NextRouter
) => {
  const headers = {
    "Content-Type": "application/json"
  };

  const data = {
    POSKey: process.env.BARION_POS_KEY,
    PaymentType: "Immediate",
    FundingSources: ["All"],
    TraceId: "",

    PaymentRequestId: `share-payment-request-${reservationData.date}-${Date.now()}`,
    OrderNumber: "order-25",
    PayerHint: reservationData.email,

    RedirectUrl: process.env.BARION_PAYMENT_REDIRECT_URL,
    CallbackUrl: process.env.BARION_PAYMENT_CALLBACK_URL,

    Locale: "hu-HU",
    Currency: "HUF",

    Transactions: [
      {
        POSTransactionId: `share-pos-transaction-${reservationData.date}-${Date.now()}`,
        Payee: "kamilla525@yahoo.com",
        Total: parseInt(reservationData.price),
        Items: [
          {
            Name: reservationData.lastName,
            Description: `Spa reservation for ${reservationData.numberOfGuests.label}`,
            Quantity: 1,
            Unit: "pcs",
            UnitPrice: parseInt(reservationData.price),
            ItemTotal: parseInt(reservationData.price)
          }
        ]
      }
    ]
  };

  return axios
    .post(process.env.BARION_PAYMENT_REQUEST_URL, data, {
      headers
    })
    .then(async (res: BarionPaymentResponseData) => {
      await res.data.Transactions.forEach(
        async (transaction) =>
          await newReservation.makeNewReservation(reservationData, users, res.data.PaymentId, transaction.TransactionId)
      );
      router.replace(res.data.GatewayUrl);
    });
};
