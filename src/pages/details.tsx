import { Formik } from "formik";
import { useRouter } from "next/router";
import React, { FC, memo } from "react";
import firebase from "../lib/firebase";
import "firebase/database";

import Customer from "../components/customer";
import Header from "../components/header";

import { ReservationWithDetails } from "../lib/validation/validationInterfaces";
import { reservation } from "../lib/validation/validationSchemas";

import styles from "../styles/main.module.scss";
import reservationStyles from "../styles/reservation.module.scss";

export interface ReservationDataForSaving {
  date: string;
  time: string;
  numberOfGuests: string;
  numberOfTubs: string;
  price: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  whereYouHeard?: string;
  paymentStatus: string;
  paymentMethod: string;
}

interface Props {
  users: ReservationDataForSaving[];
  currentReservations: ReservationDataForSaving;
}

const Details: FC<Props> = ({ users }) => {
  const router = useRouter();

  const dateAndPackageData = JSON.parse(localStorage.getItem("reservation"));

  const initialValues = {
    date: dateAndPackageData.date,
    time: dateAndPackageData.time,
    numberOfGuests: dateAndPackageData.numberOfGuests,
    numberOfTubs: dateAndPackageData.numberOfTubs,
    price: dateAndPackageData.price,
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    paymentMethod: "",
  };

  const goBack = () => router.replace("/");

  const makeNewReservation = (
    reservationData: ReservationDataForSaving,
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

  const redirectToStartPayment = (reservationData: ReservationDataForSaving) =>
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
        PayerHint: reservationData.email,
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
            Payee: reservationData.email,
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
        await makeNewReservation(reservationData, res.PaymentId);
        router.replace(res.GatewayUrl);
      });

  const onSubmit = (values: ReservationWithDetails) => {
    const reservationData: ReservationDataForSaving = {
      date: dateAndPackageData.date,
      time: dateAndPackageData.time,
      numberOfGuests: dateAndPackageData.numberOfGuests,
      numberOfTubs: dateAndPackageData.numberOfTubs,
      price: dateAndPackageData.price,
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
      email: values.email,
      whereYouHeard: values.whereYouHeard ? values.whereYouHeard.label : "none",
      paymentStatus: "UNPAID",
      paymentMethod: values.paymentMethod,
    };

    if (values.paymentMethod === "card") {
      return redirectToStartPayment(reservationData);
    }
  };

  return (
    <article className={styles.main}>
      <Header />
      <label className={reservationStyles.reservation__title}>
        <span>Your Details</span>
      </label>
      <section className={styles.main__container}>
        <div className={styles.navigators}>
          <div className={styles.verticalLineDetails} />
          <div
            className={`${styles.verticalLineDetails} ${styles.verticalLineDetails2}`}
          />
          <div
            className={`${styles.verticalLineDetails} ${styles.verticalLineDetails3}`}
          />
        </div>
        <Formik<ReservationWithDetails>
          initialValues={initialValues}
          onSubmit={(values) => {
            onSubmit(values);
          }}
          validationSchema={reservation}
          validateOnChange
        >
          {({ values, handleSubmit }) => {
            return (
              <form onSubmit={handleSubmit}>
                <Customer />
                <div className={reservationStyles.reservation__info}>
                  <button
                    className={`${reservationStyles.reservation__button} ${reservationStyles.reservation__back}`}
                    type="button"
                    onClick={goBack}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className={`${reservationStyles.reservation__button} ${reservationStyles.reservation__finish}`}
                  >
                    {values.paymentMethod === "bankTransfer"
                      ? "Complete"
                      : "Finish & Pay"}
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
  const users: ReservationDataForSaving[] = await customers
    .once("value")
    .then(function (snapshot) {
      return snapshot.val() || "Anonymous";
    });

  return { props: { users } };
}

export default memo(Details);
