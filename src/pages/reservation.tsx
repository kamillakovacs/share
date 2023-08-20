import React, { FC, memo } from "react";
import firebase from "../lib/firebase";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { Reservations, ReservationWithDetails } from "../lib/validation/validationInterfaces";
import ReservationDetails from "../components/reservationDetails";
import Unsuccessful from "../components/unsuccessful";

import thanksStyles from "../styles/thanks.module.scss";
import { PaymentStatus } from "../api/interfaces";
import { ReceiptEmail, ReservationData } from "../lib/interfaces";
import { sendPaymentReceipt } from "../api/sendPaymentReceipt";
import { useTranslation } from "next-i18next";
import { createPaymentReceipt } from "../api/createPaymentReceipt";

interface Props {
  reservations: Reservations;
  users: ReservationData[];
}

const Reservation: FC<Props> = ({ reservations, users }) => {
  const { query } = useRouter();
  const { t, i18n } = useTranslation();
  const paymentId = query.paymentId as string
  const reservation: ReservationWithDetails = reservations[paymentId];
  const email: ReceiptEmail = {
    subject: t("receipt.receiptFromShareSpa"),
    body: t("receipt.receiptEmailBody")
  }

  if (reservation) {
    createPaymentReceipt(reservation, t("receipt.receiptFromShareSpa"), email)
  }

  return (
    <article className={thanksStyles.container}>
      {reservation?.paymentStatus === PaymentStatus.Succeeded && (
        <ReservationDetails reservation={reservation} paymentId={paymentId} />
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
