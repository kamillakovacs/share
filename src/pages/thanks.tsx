import React, { FC, memo } from "react";
import firebase from "../lib/firebase";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { ReservationWithDetails } from "../lib/validation/validationInterfaces";

import { ThankYouEmail } from "../components/thankYouEmail";
import ReservationSummary from "../components/reservationSummary";
import thanksStyles from "../styles/thanks.module.scss";
import reservationStyles from "../styles/reservation.module.scss";

interface Props {
  reservations: ReservationWithDetails;
}

const Thanks: FC<Props> = ({ reservations }) => {
  const { query } = useRouter();
  const { t } = useTranslation("common");
  const reservationPaymentId = Object.keys(reservations).find((key) => key === query.paymentId);
  const reservation = Object.values(reservations).find(() => reservations[reservationPaymentId]);

  const messageContent =
    "<html><body><div>" + " " + t("thanks.thankYou") + t("thanks.lookForwardToSeeingYou") + "</div></body></html>";

  const sendThankYouEmail = () => {
    // const mg = mailgun({
    //   apiKey: process.env.MAILGUN_API_KEY,
    //   domain: process.env.MAILGUN_DOMAIN,
    // });
    // const path = require('path');
    // var filepath = path.join(__dirname, 'sample.jpg');
    const data = {
      from: `Mailgun Sandbox <${process.env.MAILGUN_EMAIL_ADDRESS}>`,
      to: "kamilla525@yahoo.com",
      subject: t("thanks.yourReservation"),
      html: ThankYouEmail,
      // attachment: filepath
    };

    // mg.messages().send(data, (_error, body) => {
    //   console.log("body", body);
    //   console.log("reservations", reservations);
    // });
  };

  if (reservationPaymentId && reservation.paymentStatus === "Success") {
    sendThankYouEmail();
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
