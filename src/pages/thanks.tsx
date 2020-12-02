import React, { FC, memo, useEffect } from "react";
import Header from "../components/header";
import firebase from "../lib/firebase";
import { useRouter } from "next/router";

interface Props {
  reservation: { [key: string]: { paymentId: string } };
}

const Thanks: FC<Props> = ({ reservation }) => {
  const router = useRouter();
  const specificPaymentId = Object.keys(reservation).find(
    (key) => key === router.query.paymentId
  );

  const setPaymentPaid = () =>
    firebase
      .database()
      .ref("/reservations/" + specificPaymentId)
      .update({ paymentStatus: "PAID" });

  useEffect(() => {
    if (specificPaymentId) {
      setPaymentPaid();
    }
  });

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
  const reservations = firebase.database().ref("reservations");

  const reservation = await reservations
    .once("value")
    .then(function (snapshot) {
      return snapshot.val() || "Anonymous";
    });

  return { props: { reservation } };
}

export default memo(Thanks);
