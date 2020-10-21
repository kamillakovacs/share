import { Formik, connect } from "formik";
import React, { FC, memo } from "react";

import firebase from "../lib/firebase";

import Options from "./options";
import ReservationDate from "./reservationDate";
import Customer from "./customer";
import Header from "./header";

import { Reservation } from "../lib/validation/validationInterfaces";
import { reservation } from "../lib/validation/validationSchemas";

const Main = ({ users }) => {
  const initialValues = {
    date: undefined,
    time: undefined,
    numberOfGuestsOptions: { value: "1", label: "1 person" },
    numberOfTubsOptions: undefined,
    price: "",
    additionalTreatments: undefined,
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  };

  // const onSubmit = (values: any) => {
  //   return setReservation(values);
  // };

  return (
    <article className="Main">
      <section className="Main__container">
        <Formik<Reservation>
          initialValues={initialValues}
          onSubmit={() => {}}
          validationSchema={reservation}
          validateOnChange
        >
          {(formikProps) => {
            const currency = parseInt(formikProps.values.price) / 356.33;

            // @ts-ignore
            return (
              <>
                <Header />
                <section className="Reservation">
                  <label className="Reservation__title"></label>

                  <ReservationDate />
                  <Options />
                </section>
                {formikProps.values.numberOfTubsOptions &&
                  formikProps.values.numberOfGuestsOptions &&
                  formikProps.values.date &&
                  formikProps.values.time && (
                    <>
                      <Customer />
                      <span className="Reservation__price">
                        Total: {formikProps.values.price} Ft /
                        {parseInt(currency.toString())} EUR
                      </span>
                    </>
                  )}
              </>
            );
          }}
        </Formik>
      </section>
    </article>
  );
};

export async function getStaticProps() {
  var customers = firebase.database().ref("customers");

  const users = await customers.once("value").then(function (snapshot) {
    return snapshot.val() || "Anonymous";
  });

  return { props: { users } };
}

export default memo(Main);
