import { useFormikContext } from "formik";
import React, { FC, memo } from "react";

import Options from "./partials/Options";
import ReservationDate from "./partials/ReservationDate";
import Customer from "../customer";
import Header from "../../header";
import { Reservation } from "../../../validation/validationInterfaces";

const BathInfo: FC = () => {
  const { values } = useFormikContext<Reservation>();

  const currency = parseInt(values.price) / 356.33;
  return (
    <>
      <Header />
      <section className="Reservation">
        <label className="Reservation__title">Reservation Information</label>
        <ReservationDate />
        <Options />
      </section>
      {values.numberOfTubsOptions &&
        values.numberOfGuestsOptions &&
        values.date &&
        values.time && (
          <>
            <Customer />
            <span className="Reservation__price">
              Total: {values.price} Ft / {parseInt(currency.toString())} EUR
            </span>
          </>
        )}
    </>
  );
};

export default memo(BathInfo);
