import { useFormikContext, ErrorMessage } from "formik";
import React, { ChangeEvent, FC, memo } from "react";
import Select, { ActionMeta, ValueType } from "react-select";

import { Reservation } from "../lib/validation/validationInterfaces";

const Customer: FC = () => {
  const { values, setFieldValue, setFieldTouched } = useFormikContext<
    Reservation
  >();

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "phoneNumber") {
      e.target.value.replace(/\+|-/gi, "");
    }

    setFieldTouched(e.target.name);
    setFieldValue(e.target.name, e.target.value);
  };

  const setOption = (
    option: ValueType<{ value: string; label: string }>,
    select: ActionMeta<{ value: string; label: string }>
  ) => {
    setFieldValue(select.name!, option);
  };

  const whereYouHeardOptions = [
    { value: "webSearch", label: "Web search" },
    { value: "friendFamily", label: "Friend/Family member" },
    { value: "advertisement", label: "Advertisement" },
    { value: "tripAdvisor", label: "Trip Advisor" },
    { value: "facebook", label: "Facebook" },
    { value: "instagram", label: "Instagram" },
    { value: "hotel", label: "Your hotel" },
  ];

  return (
    <section className="Customer">
      <label className="Reservation__title">Your Details</label>
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
          type="tel"
          onChange={onChangeInput}
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

      <div className="Options">
        <label>Where you heard about us:</label>
        <Select
          options={whereYouHeardOptions}
          name="whereYouHeard"
          onChange={setOption}
          value={values.whereYouHeard}
        />
      </div>
    </section>
  );
};

export default memo(Customer);
