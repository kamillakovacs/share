import { Formik } from "formik";
import { useRouter } from "next/router";
import React, { FC, memo } from "react";
import firebase from "../lib/firebase";
import "firebase/database";

import Options from "../components/options";
import ReservationDate from "../components/reservationDate";
import Header from "../components/header";

import { Reservation } from "../lib/validation/validationInterfaces";
import { reservation } from "../lib/validation/validationSchemas";

import styles from "../styles/main.module.scss"
import reservationStyles from "../styles/reservation.module.scss"

export interface ReservationData {
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
  whereYouHeard?: string;
  paymentStatus: string;
}

interface Props {
  users: ReservationData[];
  currentReservations: ReservationData;
}

const Main: FC<Props> = ({ users, currentReservations }) => {
  const router = useRouter();
  const initialValues = {
    date: undefined,
    time: undefined,
    numberOfGuests: "1",
    numberOfTubs: "1",
    price: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  };

  const redirectToDetailsPage = (reservationData: ReservationData) => {
    localStorage.setItem("reservation", JSON.stringify(reservationData));
    router.replace("/details");
  };

  const onSubmit = (values: Reservation) => {
    const reservationData: ReservationData = {
      date: values.date.toDateString(),
      time: values.time,
      numberOfGuests: values.numberOfGuests,
      numberOfTubs: values.numberOfTubs,
      price: values.price,
      firstName: "firstName",
      lastName: "lastName",
      phoneNumber: "222222222222",
      email: "email@email.com",
      whereYouHeard: "none",
      paymentStatus: "",
    };

    return redirectToDetailsPage(reservationData);
  };

  return (
    <article className={styles.main}>
      <Header />
      <label className={reservationStyles.reservation__title}>
        <span>Reserve Your Experience</span>
      </label>
      <section className={styles.main__container}>
        
      <div className={styles.navigators}>
        <img src="/assets/checkmark.svg" />
        <div className={styles.verticalLine}/>
        <div className={styles.numberIcon}>2</div>
        {/* <div className={styles.verticalLine2}/> */}
      </div>
        <Formik<Reservation>
          initialValues={initialValues}
          onSubmit={(values) => {
            onSubmit(values);
          }}
          validationSchema={reservation}
          validateOnChange
        >
          {({ values, handleSubmit }) => {
            const currency = parseInt(values.price) / 356.33;

            return (
              <form onSubmit={handleSubmit}>
                <section className={reservationStyles.reservation}>
                  <ReservationDate currentReservations={currentReservations} />
                  <Options />
                  <button className={`${reservationStyles.reservation__button} ${reservationStyles.continue}`} type="submit">
                    Continue
                  </button>
                </section>
                {/* <div className={reservationStyles.reservation__info}>
                  <span className={reservationStyles.reservation__price}>
                    {`Total: ${values.price} Ft /
                    ${parseInt(currency.toString())}
                    EUR`}
                  </span>
                </div> */}
                
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

  const reservations = firebase.database().ref("reservations");

  const currentReservations: ReservationData[] = await reservations
    .once("value")
    .then(function (snapshot) {
      return snapshot.val() || "Anonymous";
    });

  return { props: { users, currentReservations } };
}

export default memo(Main);
