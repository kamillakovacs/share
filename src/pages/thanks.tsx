import React, { FC, memo } from "react";
import Header from "../components/header";
import firebase from "../lib/firebase";
import { useRouter } from "next/router";
import mailgun from "mailgun-js";

interface Props {
  reservations: { [key: string]: { paymentId: string } };
}

const Thanks: FC<Props> = ({ reservations }) => {
  const router = useRouter();
  const specificPaymentId = Object.keys(reservations).find(
    (key) => key === router.query.paymentId
  );

  const sendThankYouEmail = () => {
    const DOMAIN = "sandbox97b9f03d0cf74d1c8fd3d3649ebc702b.mailgun.org";
    const mg = mailgun({
      apiKey: "4e64c3fa2699875a4f16dcc49fe49804-3d0809fb-3771aa30",
      domain: DOMAIN,
    });
    // const path = require('path');
    // var filepath = path.join(__dirname, 'sample.jpg');
    const data = {
      from:
        "Mailgun Sandbox <postmaster@sandbox97b9f03d0cf74d1c8fd3d3649ebc702b.mailgun.org>",
      to: "kamilla525@yahoo.com",
      subject: "Your Reservation at Share Spa",
      text: "Thank you for your reservation at Share Spa in Szarvasko.",
      html: "<html>HTML version of the body</html>",
      // attachment: filepath
    };
    mg.messages().send(data, function (error, body) {
      console.log(body);
      console.log(reservations);
    });
  };

  const setPaymentPaid = () =>
    firebase
      .database()
      .ref("/reservations/" + specificPaymentId)
      .update({ paymentStatus: "PAID" });

  if (specificPaymentId) {
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
