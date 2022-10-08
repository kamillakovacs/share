import "firebase/database";
import React, { FC, memo } from "react";
import classnames from "classnames";
import { Formik } from "formik";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import firebase from "../lib/firebase";
import { Reservation } from "../lib/validation/validationInterfaces";
import { reservation } from "../lib/validation/validationSchemas";
import { useAppContext } from "../../context/appContext";

import Options from "../components/options";
import ReservationDate from "../components/reservationDate";
import Summary from "../components/summary";
import reservationStyles from "../styles/reservation.module.scss";
import styles from "../styles/main.module.scss";
import { ReservationData, ReservationDataShort } from "../lib/interfaces";

interface Props {
  currentReservations: ReservationDataShort;
}

const Main: FC<Props> = ({ currentReservations }) => {
  const router = useRouter();
  const [data, setData] = useAppContext();
  const { t } = useTranslation("common");

  const initialValues = {
    date: null,
    numberOfGuests: null,
    numberOfTubs: null,
    price: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    paymentMethod: ""
  };

  const redirectToDetailsPage = (reservationData: ReservationData) => {
    setData(reservationData);
    router.replace("/details");
  };

  const onSubmit = (values: Reservation) => {
    const reservationData: ReservationData = {
      date: values.date,
      dateOfPurchase: new Date(),
      numberOfGuests: values.numberOfGuests,
      numberOfTubs: values.numberOfTubs,
      price: values.price,
      firstName: "firstName",
      lastName: "lastName",
      phoneNumber: "222222222222",
      email: "email@email.com",
      whereYouHeard: { value: "none", label: "None" },
      paymentStatus: null,
      paymentMethod: null
    };

    return redirectToDetailsPage(reservationData);
  };

  return (
    <article className={styles.main}>
      <label className={reservationStyles.reservation__title}>
        <span>{t("index.reserveYourExperience")}</span>
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
                        [reservationStyles.reservation__continue__enabled]: !!dirty && !Object.keys(errors).length
                      }
                    )}
                    type="submit"
                  >
                    {t("index.continue")}
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

export async function getServerSideProps({ locale }) {
  const reservations = firebase.database().ref("reservations");
  const currentReservations: ReservationDataShort[] = await reservations?.once("value").then(function (snapshot) {
    return (
      Object.values(snapshot.val()).map((res: Reservation) => ({
        date: res.date ?? null,
        numberOfGuests: res.numberOfGuests ?? null,
        numberOfTubs: res.numberOfTubs ?? null
      })) || []
    );
  });

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      currentReservations
    }
  };
}

export default memo(Main);
