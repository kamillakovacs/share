import { Formik } from "formik";
import React, { FC, memo } from "react";
import firebase from "../lib/firebase";
import "firebase/database";

import Options from "./options";
import ReservationDate from "./reservationDate";
import Customer from "./customer";
import Header from "./header";

import { Reservation } from "../lib/validation/validationInterfaces";
import { reservation } from "../lib/validation/validationSchemas";
import firebaseAdmin from "../lib/firebase-admin";

interface ReservationData {
  date: string;
  time: string;
  numberOfGuests: string;
  numberOfTubs: string;
  price: string;
  additionalTreatments?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

interface Props {
  users: ReservationData[];
}

const Main: FC<Props> = ({ users }) => {
  const initialValues = {
    date: undefined,
    time: undefined,
    numberOfGuests: { value: "1", label: "1 person" },
    numberOfTubs: undefined,
    price: "",
    additionalTreatments: undefined,
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  };

  function makeNewReservation(reservationData: ReservationData) {
    const customerAlreadyInDatabase = !!Object.values(users).filter(
      (user) =>
        user.firstName.toLowerCase() ===
          reservationData.firstName.toLowerCase() &&
        user.lastName.toLowerCase() ===
          reservationData.lastName.toLowerCase() &&
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
    const newReservationKey = customers.child("reservations").push().key;
    const newCustomerId = customers.child("customers").push().key;

    const updates = {};
    updates["/reservations/" + newReservationKey] = reservationData;
    if (!customerAlreadyInDatabase) {
      updates["/customers/" + newCustomerId] = newCustomer;
    }

    return firebase.database().ref().update(updates);
  }

  const onSubmit = (values: Reservation) => {
    console.log("submitting");
    const reservationData: ReservationData = {
      date: values.date.toDateString(),
      time: values.time.toTimeString(),
      numberOfGuests: values.numberOfGuests.label,
      numberOfTubs: values.numberOfTubs.label,
      price: values.price,
      additionalTreatments: values.additionalTreatments
        ? values.additionalTreatments.label
        : "none",
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
      email: values.email,
    };

    return makeNewReservation(reservationData);
  };

  return (
    <article className="Main">
      <section className="Main__container">
        <Formik<Reservation>
          initialValues={initialValues}
          onSubmit={(values) => {
            console.log("here");
            onSubmit(values);
          }}
          validationSchema={reservation}
          validateOnChange
        >
          {({ values, handleSubmit }) => {
            const currency = parseInt(values.price) / 356.33;

            return (
              <form onSubmit={handleSubmit}>
                <Header />
                <section className="Reservation">
                  <label className="Reservation__title">
                    Reservation Information
                  </label>
                  <ReservationDate />
                  <Options />
                </section>
                {values.numberOfTubs &&
                  values.numberOfGuests &&
                  values.date &&
                  values.time && (
                    <>
                      <Customer />
                      <div className="Reservation__info">
                        <span className="Reservation__price">
                          Total: {values.price} Ft /
                          {parseInt(currency.toString())} EUR
                        </span>
                        <button className="Reservation__submit" type="submit">
                          Submit Reservation
                        </button>
                      </div>
                    </>
                  )}
              </form>
            );
          }}
        </Formik>
      </section>
    </article>
  );
};

export async function getStaticProps() {
  const customers = firebaseAdmin.database().ref("customers");
  const users: ReservationData[] = await customers
    .once("value")
    .then(function (snapshot) {
      return snapshot.val() || "Anonymous";
    });

  return { props: { users } };
}

export default memo(Main);
