import "firebase/database";
import React, { FC, memo } from "react";
import classnames from "classnames";
import { Formik } from "formik";
import { useRouter } from "next/router";

import firebase from "../lib/firebase";
import { Reservation } from "../lib/validation/validationInterfaces";
import { reservation } from "../lib/validation/validationSchemas";
import { useAppContext } from "../../context/appContext";

import Options from "../components/options";
import ReservationDate from "../components/reservationDate";
import Summary from "../components/summary";
import reservationStyles from "../styles/reservation.module.scss";
import styles from "../styles/main.module.scss";

export interface ReservationData {
  date: Date;
  numberOfGuests: { label: string; value: string };
  numberOfTubs: { label: string; value: string };
  price: string;
  additionalTreatments?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  whereYouHeard?: { label: string; value: string };
  paymentStatus: string;
  paymentMethod: string;
}

interface Props {
  users: ReservationData[];
  currentReservations: ReservationData;
}

const Main: FC<Props> = ({ currentReservations }) => {
  const router = useRouter();
  const [data, setData] = useAppContext();
  const initialValues = {
    date: null,
    numberOfGuests: null,
    numberOfTubs: null,
    price: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    paymentMethod: "",
  };

  const redirectToDetailsPage = (reservationData: ReservationData) => {
    setData(reservationData);
    router.replace("/details");
  };

  const onSubmit = (values: Reservation) => {
    const reservationData: ReservationData = {
      date: values.date,
      numberOfGuests: values.numberOfGuests,
      numberOfTubs: values.numberOfTubs,
      price: values.price,
      firstName: "firstName",
      lastName: "lastName",
      phoneNumber: "222222222222",
      email: "email@email.com",
      whereYouHeard: { value: "none", label: "None" },
      paymentStatus: "",
      paymentMethod: "",
    };

    return redirectToDetailsPage(reservationData);
  };

  return (
    <article className={styles.main}>
      <label className={reservationStyles.reservation__title}>
        <span>Reserve Your Experience</span>
      </label>
      <section className={styles.main__container}>
        <div className={styles.navigators}>
          <div className={styles.verticalLine} />
          <div className={styles.verticalLine2} />
        </div>
        <Formik<Reservation>
          initialValues={initialValues}
          onSubmit={(values) => {
            onSubmit(values);
          }}
          validationSchema={reservation}
          validateOnChange
        >
          {({ errors, dirty, handleSubmit }) => {
            return (
              <form onSubmit={handleSubmit}>
                <section className={reservationStyles.reservation}>
                  <ReservationDate currentReservations={currentReservations} />
                  <Options currentReservations={currentReservations} />
                  <Summary />
                  <button
                    className={classnames(
                      `${reservationStyles.reservation__button} ${reservationStyles.reservation__continue}`,
                      {
                        [reservationStyles.reservation__continue__enabled]: !!dirty && !Object.keys(errors).length,
                      }
                    )}
                    type="submit"
                  >
                    Continue
                  </button>
                </section>
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
    return snapshot.val() || [];
  });

  const reservations = firebase.database().ref("reservations");

  const currentReservations: ReservationData[] = await reservations.once("value").then(function (snapshot) {
    return snapshot.val() || [];
  });

  return { props: { users, currentReservations } };
}

export default memo(Main);
