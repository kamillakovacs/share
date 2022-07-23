import axios from "axios";
import { ReservationData } from "../lib/interfaces";

import { PaymentStatus } from "../lib/validation/validationInterfaces";

export const makeNewReservation = async (
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

  await axios
    .post("/api/reservation", { reservationData, newCustomer, paymentId, customerAlreadyInDatabase }, { headers })
    .then((res) => console.log(res))
    .catch((e) => console.log(e));
};
