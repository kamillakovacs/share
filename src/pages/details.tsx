import { Formik } from "formik";
import { useRouter } from "next/router";
import React, { FC, memo, useEffect } from "react";
import firebase from "../lib/firebase";
import "firebase/database";

import Customer from "../components/customer";
import Header from "../components/header";

import { Reservation } from "../lib/validation/validationInterfaces";
import { reservation } from "../lib/validation/validationSchemas";

import styles from "../styles/main.module.scss"
import reservationStyles from "../styles/reservation.module.scss"

export interface ReservationData {
  date: string;
  time: string;
  experience: string;
  numberOfGuests: string;
  numberOfTubs: string;
  price: string;
  additionalTreatments?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  whereYouHeard?: string;
  paymentStatus: string;
}

interface Props {
  users: ReservationData[];
  currentReservations: ReservationData;
}

const Details: FC<Props> = ({ users }) => {
  const router = useRouter();

  const initialValues = {
    date: undefined,
    time: undefined,
    experience: undefined,
    numberOfGuests: { value: "1", label: "1 person" },
    numberOfTubs: undefined,
    price: "",
    additionalTreatments: undefined,
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  };
  const dateAndPackageData = JSON.parse(localStorage.getItem("reservation"));

  const makeNewReservation = (
    reservationData: ReservationData,
    paymentId: string
  ) => {
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
    const newCustomerId = customers.child("customers").push().key;

    const updates = {};
    updates["/reservations/" + paymentId] = { ...reservationData, paymentId };
    if (!customerAlreadyInDatabase) {
      updates["/customers/" + newCustomerId] = newCustomer;
    }

    return firebase.database().ref().update(updates);
  };

  const redirectToStartPayment = (reservationData: ReservationData) =>
    fetch("https://api.test.barion.com/v2/Payment/Start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        POSKey: "f971a07db8f0442fbad1361987f004bf",
        PaymentType: "Immediate",
        PaymentWindow: "00:30:00",

        GuestCheckout: "True",
        FundingSources: ["All"],

        InitiateRecurrence: "True", //If set to True, the Token will be recorder
        RecurrenceId: "345986-25646-3456346", //Token provided by merchant for subsequent payments

        PaymentRequestId: "payment-25",
        OrderNumber: "order-25",
        PayerHint: "kamilla525@yahoo.com",
        ShippingAddress: {
          Country: "HU",
          City: "Budapest",
          Region: "HU",
          Zip: "1234",
          Street: "13 Etwas Strasse",
          Street2: "",
          FullName: "Kamilla Kovacs",
          Phone: "43259123456789",
        },

        RedirectUrl: "http://localhost:3000/thanks",

        Locale: "hu-HU",
        Currency: "HUF",

        Transactions: [
          {
            POSTransactionId: "tr-25",
            Payee: "kamilla525@yahoo.com",
            Total: parseInt(reservationData.price),
            Items: [
              {
                Name: reservationData.experience,
                Description: reservationData.experience,
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
        await makeNewReservation(reservationData, res.PaymentId);
        router.replace(res.GatewayUrl);
      });

  const onSubmit = (values: Reservation) => {
    const reservationData: ReservationData = {
      date: dateAndPackageData.date,
      time: dateAndPackageData.time,
      experience: dateAndPackageData.experience,
      numberOfGuests: dateAndPackageData.numberOfGuests,
      numberOfTubs: dateAndPackageData.numberOfTubs,
      price: dateAndPackageData.price,
      additionalTreatments: values.additionalTreatments
        ? values.additionalTreatments.label
        : "none",
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
      email: values.email,
      whereYouHeard: values.whereYouHeard ? values.whereYouHeard.label : "none",
      paymentStatus: "UNPAID",
    };

    return redirectToStartPayment(reservationData);
  };

  return (
    <article className={styles.main}>
      <Header />
      <label className={reservationStyles.reservation__title}>
        <span>Your Details</span>
      </label>
      <section className={styles.main__container}>
      <div className={styles.navigators}>
        
        <div className={styles.verticalLineDetails}/>
        <div className={`${styles.verticalLineDetails} ${styles.verticalLineDetails2}`}/>
        <div className={`${styles.verticalLineDetails} ${styles.verticalLineDetails3}`}/>
      </div>
        <Formik<Reservation>
          initialValues={initialValues}
          onSubmit={(values) => {
            onSubmit(values);
          }}
          validationSchema={reservation}
          validateOnChange
        >
          {({ handleSubmit }) => {
            return (
              <form onSubmit={handleSubmit}>
                <Customer />
                <div className={reservationStyles.reservation__info}>
                <button className={`${reservationStyles.reservation__button} ${reservationStyles.reservation__back}`} type="button">
                  Back
                </button>
                <button className={`${reservationStyles.reservation__button} ${reservationStyles.reservation__finish}`} type="submit">
                  Finish & Pay
                </button>
                </div>
              </form>
            );
          }}
        </Formik>
      </section>
    </article>
  );
};

export async function getServerSideProps() {
  const customers = firebase.database().ref("customers");
  const users: ReservationData[] = await customers
    .once("value")
    .then(function (snapshot) {
      return snapshot.val() || "Anonymous";
    });

  //   const reservations = firebase.database().ref("reservations");

  //   const currentReservations: ReservationData[] = await reservations
  //     .once("value")
  //     .then(function (snapshot) {
  //       return snapshot.val() || "Anonymous";
  //     });

  return { props: { users } };
}

export default memo(Details);
