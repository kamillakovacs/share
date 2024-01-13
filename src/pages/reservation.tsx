import React, { FC, memo, useEffect } from "react";
import firebase from "../lib/firebase";
import axios from "axios";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import { Reservation as ReservationShort, Reservations, ReservationWithDetails } from "../lib/validation/validationInterfaces";
import ReservationDetails from "../components/reservationDetails";
import Unsuccessful from "../components/unsuccessful";

import thanksStyles from "../styles/thanks.module.scss";
import { PaymentStatus } from "../api/interfaces";
import { Action, ReservationData, ReservationDataShort } from "../lib/interfaces";

interface Props {
  reservations: Reservations;
  users: ReservationData[];
  currentReservations: ReservationDataShort[];
}

const Reservation: FC<Props> = ({ reservations, users, currentReservations }) => {
  const { query } = useRouter();
  const { t, i18n } = useTranslation("common");
  const paymentId = query.paymentId as string
  const reservation: ReservationWithDetails = reservations[paymentId];

  useEffect(() => {
    const createAndSendConfirmationEmail = async () => await axios
      .post("/api/email", { reservation, paymentId, language: i18n.language, action: Action.None })
      .then((res) => res.data)
      .catch((e) => console.log(e));

    const createAndSendReceipt = async () => await axios
      .post("/api/receipt", { reservation, paymentId })
      .then((res) => res.data)
      .catch((e) => console.log(e));

    if (reservation?.paymentStatus === PaymentStatus.Succeeded) {
      if (!reservation?.communication.receiptSent) {
        createAndSendReceipt();
      }
      if (!reservation?.communication.reservationEmailSent) {
        createAndSendConfirmationEmail()
      }
    }
  }, [reservation, paymentId, i18n.language])

  return (
    <>
      <div id="modal-root"></div>
      <article className={thanksStyles.container}>
        {reservation?.paymentStatus === PaymentStatus.Succeeded && (
          <ReservationDetails
            reservation={reservation}
            reservations={reservations}
            currentReservations={currentReservations}
          />
        )}
        {(reservation?.paymentStatus === PaymentStatus.Canceled ||
          reservation?.paymentStatus === PaymentStatus.Expired) && (
            <Unsuccessful reservation={reservation} users={users} />
          )}
      </article>
    </>
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

  return { props: { ...(await serverSideTranslations(locale, ["common"])), reservations, users, currentReservations } };
}

export default memo(Reservation);
