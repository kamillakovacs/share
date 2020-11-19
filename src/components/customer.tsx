import React, { ChangeEvent, FC, memo } from "react";
import { useFormikContext, ErrorMessage } from "formik";

import { Reservation } from "../lib/validation/validationInterfaces";

const Customer: FC = () => {
  const { setFieldValue, setFieldTouched } = useFormikContext<Reservation>();

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "phoneNumber") {
      e.target.value.replace(/\+|-/gi, "");
    }

    setFieldTouched(e.target.name);
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
          type="text"
          onChange={onChangeInput}
        />
      </div>
      <div className="ErrorMessage">
        <ErrorMessage name="firstName" />
      </div>

      <div className="Options">
        <label>Last name:</label>
        <input
          className="Customer__input"
          name="lastName"
          type="text"
          onChange={onChangeInput}
        />
      </div>
      <div className="ErrorMessage">
        <ErrorMessage name="lastName" />
      </div>

      <div className="Options">
        <label>Phone number:</label>
        <input
          className="Customer__input"
          name="phoneNumber"
          onChange={onChangeInput}
          type="tel"
        />
      </div>
      <div className="ErrorMessage">
        <ErrorMessage name="phoneNumber" />
      </div>

      <div className="Options">
        <label>Email address:</label>
        <input
          className="Customer__input"
          name="email"
          type="email"
          onChange={onChangeInput}
        />
      </div>
      <div className="ErrorMessage">
        <ErrorMessage name="email" />
      </div>
    </section>
  );
};

export default memo(Customer);
