import React, { FC, memo } from "react";
import Header from "../components/header";
import firebase from "../lib/firebase";
import { useRouter } from "next/router";
import mailgun from "mailgun-js";

import { ThankYouEmail } from "../components/thankYouEmail";
import email from "../lib/thankYouEmail/thankYouEmail.html";

interface Props {
  reservations: { [key: string]: { paymentId: string } };
}

const Thanks: FC<Props> = ({ reservations }) => {
  const { query } = useRouter();
  const reservationPaymentId = Object.keys(reservations).find((key) => key === query.paymentId);
  const reservation = Object.values(reservations).filter((res) => res.paymentId === reservationPaymentId)[0];
  console.log("reservation", reservation);

  const messageContent =
    "<html><body><div>Thank you for your reservation. " +
    "We look forward to seeing you at Share Spa - Oko-Park</div></body></html>";

  const sendThankYouEmail = () => {
    const mg = mailgun({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
    });
    // const path = require('path');
    // var filepath = path.join(__dirname, 'sample.jpg');
    const data = {
      from: `Mailgun Sandbox <${process.env.MAILGUN_EMAIL_ADDRESS}>`,
      to: "kamilla525@yahoo.com",
      subject: "Your Reservation at Share Spa",
      html: ThankYouEmail,
      // attachment: filepath
    };

    mg.messages().send(data, (_error, body) => {
      console.log("body", body);
      console.log("reservations", reservations);
    });
  };

  const setPaymentPaid = () =>
    firebase
      .database()
      .ref("/reservations/" + reservationPaymentId)
      .update({ paymentStatus: "PAID" });

  if (reservationPaymentId) {
    setPaymentPaid();
    sendThankYouEmail();
  }

  return (
    <article className="Main">
      <Header />
      <section className="Main__container">
        <div className="Thanks">Thank you for your reservation!</div>
      </section>
    </article>
  );
};

export async function getStaticProps() {
  const res = firebase.database().ref("reservations");

  const reservations = await res.once("value").then(function (snapshot) {
    return snapshot.val() || "Anonymous";
  });

  return { props: { reservations } };
}

export default memo(Thanks);
