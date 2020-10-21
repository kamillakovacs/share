import { Formik } from "formik";
import React, { memo } from "react";
import firebase from "../lib/firebase";
import "firebase/database";

import Options from "./options";
import ReservationDate from "./reservationDate";
import Customer from "./customer";
import Header from "./header";

import { Reservation } from "../lib/validation/validationInterfaces";
import { reservation } from "../lib/validation/validationSchemas";

const Main = () => {
  const initialValues = {
    date: undefined,
    time: undefined,
    numberOfGuests: { value: "1", label: "1 person" },
    numberOfTubs: undefined,
    price: "",
    additionalTreatments: undefined,
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  };

  function writeNewPost(reservationData: Reservation) {
    const newCustomer = {
      firstName: reservationData.firstName,
      lastName: reservationData.lastName,
      phoneNumber: reservationData.phoneNumber,
      email: reservationData.email,
    };

    const customers = firebase.database().ref("customers");
    const newReservationKey = customers.child("reservations").push().key;
    const newCustomerId = customers.child("customers").push().key;

    const updates = {};
    updates["/reservations/" + newReservationKey] = reservationData;
    updates["/customers/" + newCustomerId] = newCustomer;

    return firebase.database().ref().update(updates);
  }

  const onSubmit = (values: any) => {
    return values.additionalTreatments
      ? writeNewPost(values)
      : writeNewPost({
          ...values,
          additionalTreatments: values.additionalTreatments || {
            label: "none",
            value: "none",
          },
        });
  };

  return (
    <article className="Main">
      <section className="Main__container">
        <Formik<Reservation>
          initialValues={initialValues}
          onSubmit={() => {}}
          validationSchema={reservation}
          validateOnChange
        >
          {({ values }) => {
            const currency = parseInt(values.price) / 356.33;
            const submit = () => onSubmit(values);

            return (
              <>
                <Header />
                <section className="Reservation">
                  <label className="Reservation__title"></label>
                  <ReservationDate />
                  <Options />
                </section>
                {values.numberOfTubs &&
                  values.numberOfGuests &&
                  values.date &&
                  values.time && (
                    <>
                      <Customer />
                      <span className="Reservation__price">
                        Total: {values.price} Ft /
                        {parseInt(currency.toString())} EUR
                      </span>
                    </>
                  )}
                <button type="submit" onClick={submit}>
                  Submit Reservation
                </button>
              </>
            );
          }}
        </Formik>
      </section>
    </article>
  );
};

// export async function getStaticProps() {
//   const customers = firebase.database().ref("customers");
//   const users = await customers.once("value").then(function (snapshot) {
//     return snapshot.val() || "Anonymous";
//   });

//   return { props: { users } };
// }

export default memo(Main);
