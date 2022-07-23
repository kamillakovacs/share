import React, { FC, memo, useEffect, useState } from "react";
import firebase from "../lib/firebase";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { ReservationWithDetails } from "../lib/validation/validationInterfaces";

import ReservationSummary from "../components/reservationSummary";
import thanksStyles from "../styles/thanks.module.scss";
import { sendThankYouEmail } from "../api/thankYouEmail";

interface Props {
  reservations: ReservationWithDetails;
}

const Thanks: FC<Props> = ({ reservations }) => {
  const { query } = useRouter();
  const { t } = useTranslation("common");
  const [date, setDate] = useState("");
  const [dateOfPurchase, setDateOfPurchase] = useState("");

  const reservationPaymentId = Object.keys(reservations).find((key) => key === query.paymentId);
  const reservation: ReservationWithDetails = Object.values(reservations).find(
    () => reservations[reservationPaymentId]
  );

  useEffect(() => {
    if (reservation?.date) {
      setDate(
        new Intl.DateTimeFormat("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(reservation?.date))
      );
    }

    if (reservation?.dateOfPurchase) {
      setDateOfPurchase(
        new Intl.DateTimeFormat("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(reservation?.dateOfPurchase))
      );
    }
  }, [reservation?.date]);

  if (reservationPaymentId) {
    const emailData = {
      name: `${reservation?.firstName} ${reservation?.lastName}`,
      date,
      dateOfPurchase,
      numberOfTubs: reservation?.numberOfTubs.label,
      totalPrice: reservation?.price,
    };
    // sendThankYouEmail(emailData);
  }

  return (
    <article className={thanksStyles.container}>
      <label className={thanksStyles.reservation__title}>
        <span>{t("thanks.thankYou")}</span>
      </label>
      <ReservationSummary reservation={reservation} />
    </article>
  );
};

export async function getStaticProps({ locale }) {
  const res = firebase.database().ref("reservations");

  const reservations = await res.once("value").then(function (snapshot) {
    return snapshot.val() || "Anonymous";
  });

  return { props: { ...(await serverSideTranslations(locale, ["common"])), reservations } };
}

export default memo(Thanks);
