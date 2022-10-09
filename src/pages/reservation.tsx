import React, { FC, memo } from "react";
import firebase from "../lib/firebase";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { Reservations, ReservationWithDetails } from "../lib/validation/validationInterfaces";
import ReservationSummary from "../components/reservationSummary";
import Unsuccessful from "../components/unsuccessful";

import thanksStyles from "../styles/thanks.module.scss";
import { PaymentStatus } from "../api/interfaces";

interface Props {
  reservations: Reservations;
}

const Reservation: FC<Props> = ({ reservations }) => {
  const { query } = useRouter();
  const { t } = useTranslation("common");

  const reservationPaymentId = Object.keys(reservations).find((key) => key === query.paymentId);
  const reservation: ReservationWithDetails = reservations[reservationPaymentId];

  return (
    <article className={thanksStyles.container}>
      {reservation?.paymentStatus === PaymentStatus.Succeeded && <ReservationSummary reservation={reservation} />}
      {(reservation?.paymentStatus === PaymentStatus.Canceled ||
        reservation?.paymentStatus === PaymentStatus.Expired) && <Unsuccessful reservation={reservation} />}
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

export default memo(Reservation);
