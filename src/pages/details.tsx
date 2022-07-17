import "firebase/database";
import React, { FC, memo, useEffect } from "react";
import { Formik } from "formik";
import { useRouter } from "next/router";

import firebase from "../lib/firebase";
import { ReservationWithDetails } from "../lib/validation/validationInterfaces";
import { reservation } from "../lib/validation/validationSchemas";
import { useAppContext } from "../../context/appContext";

import * as payment from "../api/paymentRequest";
import Customer from "../components/customer";
import Header from "../components/header";
import reservationStyles from "../styles/reservation.module.scss";
import styles from "../styles/main.module.scss";
import { ReservationData } from ".";

interface Props {
  users: ReservationData[];
  currentReservations: ReservationData;
}

const Details: FC<Props> = ({ users }) => {
  const router = useRouter();
  const [data, setData] = useAppContext();

  useEffect(() => {
    if (!data.numberOfGuests) {
      router.replace("/");
    }
  });

  const initialValues = {
    date: data.date,
    numberOfGuests: data.numberOfGuests,
    numberOfTubs: data.numberOfTubs,
    price: data.price,
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    paymentMethod: "",
  };

  const goBack = () => router.replace("/");

  const redirectToStartPayment = async (reservationData: ReservationData) =>
    payment.useSendPaymentRequest(reservationData, users, router);

  const onSubmit = async (values: ReservationWithDetails) => {
    const reservationData: ReservationData = {
      date: data.date,
      numberOfGuests: data.numberOfGuests,
      numberOfTubs: data.numberOfTubs,
      price: data.price,
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
      email: values.email,
      whereYouHeard: values.whereYouHeard ? values.whereYouHeard : null,
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
          <div className={`${styles.verticalLineDetails} ${styles.verticalLineDetails2}`} />
          <div className={`${styles.verticalLineDetails} ${styles.verticalLineDetails3}`} />
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
                    {values.paymentMethod === "bankTransfer" ? "Complete" : "Finish & Pay"}
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
  const users: ReservationData[] = await customers.once("value").then(function (snapshot) {
    return snapshot.val() || "Anonymous";
  });

  return { props: { users } };
}

export default memo(Details);
