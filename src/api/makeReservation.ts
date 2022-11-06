import axios from "axios";
import { ReservationData } from "../lib/interfaces";
import { PaymentStatus } from "./interfaces";

export const makeReservation = async (
  reservationData: ReservationData,
  users: ReservationData[],
  paymentId: string,
  transactionId: string
) => {
  const customerAlreadyInDatabase = !!Object.values(users).filter(
    (user) =>
      user.firstName.toLowerCase() === reservationData.firstName.toLowerCase() &&
      user.lastName.toLowerCase() === reservationData.lastName.toLowerCase() &&
      user.phoneNumber.toLowerCase() === reservationData.phoneNumber.toLowerCase() &&
      user.email.toLowerCase() === reservationData.email.toLowerCase()
  ).length;

  const newCustomer = {
    firstName: reservationData.firstName,
    lastName: reservationData.lastName,
    phoneNumber: reservationData.phoneNumber,
    email: reservationData.email
  };

  const headers = {
    "Content-Type": "application/json; charset=utf-8"
  };

  reservationData.paymentStatus = PaymentStatus.Prepared;
  reservationData.transactionId = transactionId;

  const firebaseResponse = await axios
    .post("/api/reservation", { reservationData, newCustomer, paymentId, customerAlreadyInDatabase }, { headers })
    .then((res) => res.data)
    .catch((e) => e);

  return firebaseResponse;
};

export const updateReservationDate = async (date: Date, paymentId: string) => {
  const headers = {
    "Content-Type": "application/json; charset=utf-8"
  };

  const firebaseResponse = await axios
    .post("/api/updateReservationDate", { date, paymentId }, { headers })
    .then((res) => res.data)
    .catch((e) => e);

  return firebaseResponse;
};

export const markReservationCanceled = async (paymentId: string) => {
  const headers = {
    "Content-Type": "application/json; charset=utf-8"
  };

  const firebaseResponse = await axios
    .post("/api/cancelReservation", { paymentId }, { headers })
    .then((res) => res.data)
    .catch((e) => e);

  return firebaseResponse;
};
