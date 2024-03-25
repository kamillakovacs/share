import "firebase/database";
import React, { FC, memo, useEffect } from "react";
import classnames from "classnames";
import { Field, Formik } from "formik";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import { useAppContext } from "../../context/appContext";
import * as payment from "../api/paymentRequest";
import firebase from "../lib/firebase";
import { ReservationWithDetails } from "../lib/validation/validationInterfaces";
import { details } from "../lib/validation/validationSchemas";
import { User } from "../lib/interfaces";

import Customer from "../components/customer";
import ReservationSummary from "../components/reservationSummary";

import reservationStyles from "../styles/reservation.module.scss";
import barion from "../../public/assets/barion-card-strip-intl__medium.png";
import styles from "../styles/main.module.scss";
import detailsStyles from "../styles/details.module.scss";
import classNames from "classnames";

interface Props {
  customerAlreadyInDatabase: boolean;
}

const Details: FC<Props> = ({ customerAlreadyInDatabase }) => {
  const router = useRouter();
  const [data] = useAppContext();
  const { t } = useTranslation("common");

  useEffect(() => {
    if (!data.numberOfGuests) {
      router.replace("/");
    }
  });

  const initialValues: ReservationWithDetails = {
    date: data.date,
    numberOfGuests: data.numberOfGuests,
    numberOfTubs: data.numberOfTubs,
    price: data.price,
    firstName: null,
    lastName: null,
    phoneNumber: null,
    email: null,
    paymentMethod: null,
    whereYouHeard: { value: "", label: "" },
    canceled: null,
    uncancelable: false,
    communication: {
      reservationEmailSent: false,
      receiptSent: false,
      rescheduleEmailSentCount: 0,
      cancelationEmailSent: false
    },
    requirements: null,
    termsAndConditions: false
  };

  const goBack = () => router.replace("/");

  const redirectToStartPayment = async (reservationData: ReservationWithDetails) =>
    payment.useSendPaymentRequest(reservationData, customerAlreadyInDatabase, router);

  const onSubmit = async (values: ReservationWithDetails) => {
    const reservationData: ReservationWithDetails = {
      date: data.date,
      dateOfPurchase: new Date(),
      numberOfGuests: data.numberOfGuests,
      numberOfTubs: data.numberOfTubs,
      price: data.price,
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
      email: values.email,
      whereYouHeard: values.whereYouHeard,
      paymentStatus: null,
      paymentMethod: values.paymentMethod,
      canceled: null,
      uncancelable: false,
      communication: {
        reservationEmailSent: false,
        receiptSent: false,
        rescheduleEmailSentCount: 0,
        cancelationEmailSent: false
      },
      requirements: null,
      termsAndConditions: false
    };

    return redirectToStartPayment(reservationData);
  };

  return (
    <article className={styles.main}>
      <label className={reservationStyles.reservation__title}>
        <span>{t("details.yourDetails")}</span>
      </label>
      <section className={styles.main__container}>
        <Formik<ReservationWithDetails>
          initialValues={initialValues}
          onSubmit={async (values) => {
            onSubmit(values);
          }}
          validationSchema={details}
          validateOnChange
        >
          {({ dirty, errors, values, handleSubmit }) => {
            return (
              <form onSubmit={handleSubmit}>
                <Customer />
                <div className={detailsStyles.details__detailTitle}>
                  <div className={`${styles.todoitem} ${styles.todoitem__cashier}`} />
                  <label>{t("reservationDetails.summaryAndCheckout")}</label>
                </div>
                <ReservationSummary
                  reservation={values}
                  date={data.date}
                  price={values.price}
                  paymentStatus={values.paymentStatus}
                />
                <div className={reservationStyles.reservation__barion__container}>
                  <div
                    className={classNames(reservationStyles.reservation__checkbox, {
                      [reservationStyles.reservation__checkbox__error]: errors.termsAndConditions
                    })}
                  >
                    <label>
                      <Field type="checkbox" name="termsAndConditions" />
                      {t("details.iAccept")}
                    </label>
                  </div>
                  <div className={reservationStyles.reservation__checkbox}>
                    <label>
                      <Field type="checkbox" name="newsletter" />
                      {t("details.newsletter")}
                    </label>
                  </div>
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
                  <Image src={barion} alt="barion-logo" />
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
  const users: User[] = await customers.once("value").then(function (snapshot) {
    return snapshot.val() || "Anonymous";
  });

  const customerAlreadyInDatabase = Object.values(users).filter((user) => {
    if (user.firstName) {
      return (
        user.firstName.toLowerCase() === user.firstName.toLowerCase() &&
        user.lastName.toLowerCase() === user.lastName.toLowerCase() &&
        user.phoneNumber.toLowerCase() === user.phoneNumber.toLowerCase() &&
        user.email.toLowerCase() === user.email.toLowerCase()
      );
    }
  }).length;

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      customerAlreadyInDatabase
    }
  };
}

export default memo(Details);
