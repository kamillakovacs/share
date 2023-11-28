import React, { FC, memo, useEffect } from "react";
import firebase from "../lib/firebase";
import axios from "axios";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { Reservation as ReservationShort, Reservations, ReservationWithDetails } from "../lib/validation/validationInterfaces";
import ReservationDetails from "../components/reservationDetails";
import Unsuccessful from "../components/unsuccessful";

import thanksStyles from "../styles/thanks.module.scss";
import { PaymentStatus } from "../api/interfaces";
import { ReceiptEmail, ReservationData, ReservationDataShort } from "../lib/interfaces";
import { sendReservationConfirmationEmail } from "./api/email";

interface Props {
  reservations: Reservations;
  users: ReservationData[];
  currentReservations: ReservationDataShort[];
}

const Reservation: FC<Props> = ({ reservations, users, currentReservations }) => {
  const { query } = useRouter();
  const paymentId = query.paymentId as string
  const reservation: ReservationWithDetails = reservations[paymentId];

  useEffect(() => {
    const createAndSendReceipt = async () => await axios
      .post("/api/receipt", { reservation, paymentId })
      .then((res) => res.data)
      .catch((e) => e);

    if (reservation?.paymentStatus === PaymentStatus.Succeeded && !reservation?.communication?.receiptSent) {
      createAndSendReceipt();
    }
  }, [reservation, paymentId])

  return (
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
  );
};

export async function getServerSideProps(router) {
  const res = firebase.database().ref("reservations");
  const customers = firebase.database().ref("customers");
  const paymentId = router.query.paymentId;

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

  const reservation: ReservationWithDetails = reservations[paymentId];

  if (reservation && reservation?.paymentStatus === PaymentStatus.Succeeded) {
    const emailData = {
      name: `${reservation?.firstName} ${reservation?.lastName}`,
      email: reservation?.email,
      date: reservation?.date,
      dateOfPurchase: reservation?.dateOfPurchase,
      numberOfTubs: reservation?.numberOfTubs.label,
      totalPrice: reservation?.price,
      paymentId
    };
    // sendReservationConfirmationEmail(`${reservation.firstName} ${reservation.lastName}`, reservation.email);

    const email: ReceiptEmail = {
      subject: "subject",
      body: "body"
    }
  }

  return { props: { ...(await serverSideTranslations(router.locale, ["common"])), reservations, users, currentReservations } };
}

export default memo(Reservation);
