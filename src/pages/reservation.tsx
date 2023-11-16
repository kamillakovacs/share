import React, { FC, memo } from "react";
import firebase from "../lib/firebase";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { Reservation as ReservationShort, Reservations, ReservationWithDetails } from "../lib/validation/validationInterfaces";
import ReservationDetails from "../components/reservationDetails";
import Unsuccessful from "../components/unsuccessful";

import thanksStyles from "../styles/thanks.module.scss";
import { PaymentStatus } from "../api/interfaces";
import { ReceiptEmail, ReservationData, ReservationDataShort } from "../lib/interfaces";
import { useTranslation } from "next-i18next";
import { createReceipt } from "../api/createReceipt";
import { sendReservationConfirmationEmail } from "./api/email";

interface Props {
  reservations: Reservations;
  users: ReservationData[];
  currentReservations: ReservationDataShort[];
}

const Reservation: FC<Props> = ({ reservations, users, currentReservations }) => {
  const { query } = useRouter();
  const { t } = useTranslation();
  const paymentId = query.paymentId as string
  const reservation: ReservationWithDetails = reservations[paymentId];
  // const email: ReceiptEmail = {
  //   subject: t("receipt.receiptFromShareSpa"),
  //   body: t("receipt.receiptEmailBody")
  // }

  return (
    <article className={thanksStyles.container}>
      {reservation?.paymentStatus === PaymentStatus.Succeeded && (
        <ReservationDetails
          reservation={reservation}
          paymentId={paymentId}
          reservations={reservations}
          currentReservations={currentReservations}
        />
      )}
      {(reservation?.paymentStatus === PaymentStatus.Canceled ||
        reservation?.paymentStatus === PaymentStatus.Expired) && (
          <Unsuccessful reservation={reservation} users={users} />
        )}
    </article>
  );
};

export async function getServerSideProps(router) {
  const res = firebase.database().ref("reservations");
  const customers = firebase.database().ref("customers");

  const reservations = await res.once("value").then(function (snapshot) {
    return snapshot.val() || "Anonymous";
  });

  const users: ReservationData[] = await customers.once("value").then(function (snapshot) {
    return snapshot.val() || "Anonymous";
  });

  const currentReservations: ReservationDataShort[] = await res?.once("value").then(function (snapshot) {
    return (
      Object.values(snapshot.val())
        .filter((res: ReservationWithDetails) =>
          res.paymentStatus === PaymentStatus.Succeeded && new Date(res.date) > new Date()
        )
        .map((res: ReservationShort) => ({
          date: res.date ?? null,
          numberOfGuests: res.numberOfGuests ?? null,
          numberOfTubs: res.numberOfTubs ?? null
        })) || []
    );
  });

  const reservation: ReservationWithDetails = reservations[router.query.paymentId];

  if (reservation && reservation?.paymentStatus === PaymentStatus.Succeeded) {
    sendReservationConfirmationEmail(`${reservation.firstName} ${reservation.lastName}`, reservation.email);
    // createReceipt(reservation, t("receipt.receiptFromShareSpa"), email)
  }


  return { props: { ...(await serverSideTranslations(router.locale, ["common"])), reservations, users, currentReservations } };
}

export default memo(Reservation);
