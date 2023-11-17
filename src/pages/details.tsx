import "firebase/database";
import React, { FC, memo, useEffect } from "react";
import classnames from "classnames";
import { Formik } from "formik";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import * as payment from "../api/paymentRequest";
import firebase from "../lib/firebase";
import { ReservationWithDetails } from "../lib/validation/validationInterfaces";
import { reservation } from "../lib/validation/validationSchemas";
import { useAppContext } from "../../context/appContext";

import Customer from "../components/customer";
import reservationStyles from "../styles/reservation.module.scss";
import barion from "../../public/assets/barion-card-strip-intl__medium.png";
import styles from "../styles/main.module.scss";
import detailsStyles from "../styles/details.module.scss";
import { ReservationData } from "../lib/interfaces";
import ReservationSummary from "../components/reservationSummary";

interface Props {
  users: ReservationData[];
}

const Details: FC<Props> = ({ users }) => {
  const router = useRouter();
  const [data, setData] = useAppContext();
  const { t } = useTranslation("common");
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(data.date));

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
    firstName: null,
    lastName: null,
    phoneNumber: null,
    email: null,
    paymentMethod: null,
    canceled: null,
    communication: {
      reservationEmailSent: false,
      rescheduleEmailSentCount: 0,
      cancelationEmailSent: false
    }
  };

  const goBack = () => router.replace("/");

  const redirectToStartPayment = async (reservationData: ReservationData) =>
    payment.useSendPaymentRequest(reservationData, users, router);

  const onSubmit = async (values: ReservationWithDetails) => {
    const reservationData: ReservationData = {
      date: data.date,
      dateOfPurchase: new Date(),
      numberOfGuests: data.numberOfGuests,
      numberOfTubs: data.numberOfTubs,
      price: data.price,
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
      email: values.email,
      whereYouHeard: values.whereYouHeard ? values.whereYouHeard : null,
      paymentStatus: null,
      paymentMethod: values.paymentMethod,
      canceled: null,
      communication: {
        reservationEmailSent: false,
        rescheduleEmailSentCount: 0,
        cancelationEmailSent: false
      }
    };

    return redirectToStartPayment(reservationData);
  };

  return (
    <article className={styles.main}>
      <label className={reservationStyles.reservation__title}>
        <span>{t("details.yourDetails")}</span>
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
          {({ dirty, errors, values, handleSubmit }) => {
            console.log(errors)
            return (
              <form onSubmit={handleSubmit}>
                <Customer />
                <div className={detailsStyles.details__detailTitle}>
                  <div className={`${styles.todoitem} ${styles.todoitem__four}`} />
                  <label>{t("reservationDetails.summaryAndCheckout")}</label>
                </div>
                <ReservationSummary reservation={values} date={formattedDate} />
                <div className={reservationStyles.reservation__barion__container}>
                  <div className={reservationStyles.reservation__info}>
                    <button
                      className={`${reservationStyles.reservation__button} ${reservationStyles.reservation__back}`}
                      type="button"
                      onClick={goBack}
                    >
                      {t("details.back")}
                    </button>
                    <button
                      type="submit"
                      className={classnames(
                        `${reservationStyles.reservation__button} ${reservationStyles.reservation__finish} ${reservationStyles.reservation__margin}`,
                        {
                          [reservationStyles.reservation__finish__enabled]: !!dirty && !Object.keys(errors).length
                        }
                      )}
                    >
                      {t("details.finishAndPay")}
                    </button>
                  </div>
                  <Image
                    src={barion}
                    alt="barion-logo"
                  />
                </div>
              </form>
            );
          }}
        </Formik>
      </section>
    </article>
  );
};

export async function getServerSideProps({ locale }) {
  const customers = firebase.database().ref("customers");
  const users: ReservationData[] = await customers.once("value").then(function (snapshot) {
    return snapshot.val() || "Anonymous";
  });

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      users
    }
  };
}

export default memo(Details);
