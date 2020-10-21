import React, { ChangeEvent, FC, memo } from "react";
import { FormikProps, useFormikContext } from "formik";

import { Reservation } from "../lib/validation/validationInterfaces";

const Customer: FC = () => {
  const { setFieldValue } = useFormikContext<Reservation>();

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setFieldValue(e.target.name, e.target.value);
  };

  return (
    <section className="Customer">
      <label className="Reservation__title">Customer Information</label>
      <div className="Options">
        <label>First name:</label>
        <input
          className="Customer__input"
          name="firstName"
          onChange={onChangeInput}
        />
      </div>

      <div className="Options">
        <label>Last name:</label>
        <input
          className="Customer__input"
          name="lastName"
          onChange={onChangeInput}
        />
      </div>

      <div className="Options">
        <label>Phone number:</label>
        <input
          className="Customer__input"
          name="phoneNumber"
          onChange={onChangeInput}
        />
      </div>

      <div className="Options">
        <label>Email address:</label>
        <input
          className="Customer__input"
          name="email"
          onChange={onChangeInput}
        />
      </div>
    </section>
  );
};

export default memo(Customer);
