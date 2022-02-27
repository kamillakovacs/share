import { ReservationData } from "../pages";
import axios from "axios";

export const makeNewReservation = (reservationData: ReservationData, paymentId: string, users: ReservationData[]) => {
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
    email: reservationData.email,
  };

  const headers = {
    "Content-Type": "application/json; charset=utf-8",
  };

  axios.post("/api/reservation", { reservationData, newCustomer, paymentId, customerAlreadyInDatabase }, { headers });
};
