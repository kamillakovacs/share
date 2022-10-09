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
import { ReservationData } from "../lib/interfaces";

interface Props {
  reservations: Reservations;
  users: ReservationData[];
}

const Reservation: FC<Props> = ({ reservations, users }) => {
  const { query } = useRouter();
  const paymentId = query.paymentId as string
  const reservation: ReservationWithDetails = reservations[paymentId];

  return (
    <article className={thanksStyles.container}>
      {reservation?.paymentStatus === PaymentStatus.Succeeded && (
        <ReservationSummary reservation={reservation} paymentId={paymentId} />
      )}
      {(reservation?.paymentStatus === PaymentStatus.Canceled ||
        reservation?.paymentStatus === PaymentStatus.Expired) && (
        <Unsuccessful reservation={reservation} users={users} />
      )}
    </article>
  );
};

export async function getServerSideProps({ locale }) {
  const res = firebase.database().ref("reservations");
  const customers = firebase.database().ref("customers");

  const reservations = await res.once("value").then(function (snapshot) {
    return snapshot.val() || "Anonymous";
  });

  const users: ReservationData[] = await customers.once("value").then(function (snapshot) {
    return snapshot.val() || "Anonymous";
  });

  return { props: { ...(await serverSideTranslations(locale, ["common"])), reservations, users } };
}

export default memo(Reservation);
