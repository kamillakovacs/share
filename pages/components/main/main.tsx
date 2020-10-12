import React, { FC, memo } from "react";
import { useRouter } from "next/router";

import BathInfo from "./bathInfo/bathInfo";
import { Formik } from "formik";
import { Reservation } from "../../validation/validationInterfaces";
import { reservation } from "../../validation/validationSchemas";

const Main: FC = () => {
  const router = useRouter();

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
  //   console.log("hi");
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
          {() => {
            return <BathInfo />;
          }}
        </Formik>
      </section>
    </article>
  );
};

export default memo(Main);
