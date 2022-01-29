import { ReservationDataForSaving } from "../pages/details";
import firebase from "../lib/firebase";
import "firebase/database";

export const makeNewReservation = (
  reservationData: ReservationDataForSaving,
  paymentId: string,
  users: ReservationDataForSaving[]
) => {
  const customerAlreadyInDatabase = !!Object.values(users).filter(
    (user) =>
      user.firstName.toLowerCase() ===
        reservationData.firstName.toLowerCase() &&
      user.lastName.toLowerCase() === reservationData.lastName.toLowerCase() &&
      user.phoneNumber.toLowerCase() ===
        reservationData.phoneNumber.toLowerCase() &&
      user.email.toLowerCase() === reservationData.email.toLowerCase()
  ).length;

  const newCustomer = {
    firstName: reservationData.firstName,
    lastName: reservationData.lastName,
    phoneNumber: reservationData.phoneNumber,
    email: reservationData.email,
  };

  const customers = firebase.database().ref("customers");
  const newCustomerId = customers.child("customers").push().key;
  console.log(reservationData);
  console.log(paymentId);

  const updates = {};
  updates["/reservations/" + paymentId] = { ...reservationData, paymentId };
  if (!customerAlreadyInDatabase) {
    updates["/customers/" + newCustomerId] = newCustomer;
  }

  return firebase.database().ref().update(updates);
};
