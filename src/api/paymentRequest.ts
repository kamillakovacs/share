import { NextRouter } from "next/router";

import * as newReservation from "../api/newReservation";
import axios from "axios";
import { ReservationData } from "../pages";

export const useSendPaymentRequest = async (
  reservationData: ReservationData,
  users: ReservationData[],
  router: NextRouter
) => {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
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
            ItemTotal: parseInt(reservationData.price),
          },
        ],
      },
    ],
  };

  return axios
    .post(process.env.BARION_PAYMENT_REQUEST_URL, data, {
      headers,
    })
    .then(async (res: any) => {
      await newReservation.makeNewReservation(reservationData, res.data.PaymentId, users);
      router.replace(res.data.GatewayUrl);
    });
};
