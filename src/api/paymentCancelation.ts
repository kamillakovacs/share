import axios from "axios";
import { NextRouter } from "next/router";

import * as newReservation from "../api/newReservation";
import { ReservationData } from "../lib/interfaces";
import { BarionPaymentCancelationResponseData, BarionPaymentConfirmationResponseData } from "./interfaces";

export const useCancelPaymentRequest = async (paymentId: string) => {
  const headers = {
    "Content-Type": "application/json"
  };

  const data = {
    POSKey: process.env.BARION_POS_KEY,
    PaymentId: "Immediate"
  };

  return axios
    .post(process.env.BARION_PAYMENT_CANCELATION_URL, data, {
      headers
    })
    .then(async (res: BarionPaymentCancelationResponseData) => {
      // await newReservation
      //   .makeNewReservation(reservationData, users, res.data.PaymentId, res.data.Transactions[0].TransactionId)
      //   .then(() => router.replace(res.data.GatewayUrl))
      //   .catch((e) => e);
    });
};
