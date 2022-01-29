import { NextRouter } from "next/router";

import { ReservationDataForSaving } from "../pages/details";
import * as newReservation from "../api/newReservation";

export const useSendPaymentRequest = async (
  reservationData: ReservationDataForSaving,
  users: ReservationDataForSaving[],
  router: NextRouter
) => {
  fetch(process.env.BARION_PAYMENT_REQUEST_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      POSKey: "01b81e7a2ef04864bcc228a4255c88f1",
      PaymentType: "Immediate",
      FundingSources: ["All"],
      TraceId: "",

      PaymentRequestId: `share-payment-request-${
        reservationData.date
      }-${Date.now()}`,
      OrderNumber: "order-25",
      PayerHint: reservationData.email,

      RedirectUrl: "http://localhost:3000/thanks",

      Locale: "hu-HU",
      Currency: "HUF",

      Transactions: [
        {
          POSTransactionId: `share-pos-transaction-${
            reservationData.date
          }-${Date.now()}`,
          Payee: "knkovacs@gmail.com",
          Total: parseInt(reservationData.price),
          Items: [
            {
              Name: reservationData.lastName,
              Description: `Spa reservation for ${reservationData.numberOfGuests}`,
              Quantity: 1,
              Unit: "pcs",
              UnitPrice: parseInt(reservationData.price),
              ItemTotal: parseInt(reservationData.price),
            },
          ],
        },
      ],
    }),
  })
    .then((res) => res.json())
    .then(async (res) => {
      await newReservation.makeNewReservation(
        reservationData,
        res.PaymentId,
        users
      );

      router.replace(res.GatewayUrl);
    });
};
