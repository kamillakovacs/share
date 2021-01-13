import { useFormikContext, ErrorMessage } from "formik";
import React, { ChangeEvent, FC, memo } from "react";
import Select, { ActionMeta, ValueType } from "react-select";

import { Reservation } from "../lib/validation/validationInterfaces";

import customerStyles from "../styles/customer.module.scss"
import styles from "../styles/main.module.scss"

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
    <section className={customerStyles.customer}>
      <img className={customerStyles.checkmark} src="/assets/checkmark.svg" />
      <label>Personal Information</label>
      <div className={customerStyles.detail}>  
        <input
          className={customerStyles.customer__input}
          name="firstName"
          placeholder="First Name"
          type="text"
          onChange={onChangeInput}
        />
        <div className={customerStyles.ErrorMessage}>
        <ErrorMessage name="firstName" />
        </div>
        <input
          className={customerStyles.customer__input}
          name="lastName"
          placeholder="Last Name"
          type="text"
          onChange={onChangeInput}
        />
        <div className={customerStyles.ErrorMessage}>
          <ErrorMessage name="lastName" />
        </div>
      </div>
      <div className={customerStyles.detailTitle}>
      <div className={customerStyles.numberIcon}>2</div>
      <label>Contact Information</label>
      </div>
      <div className={customerStyles.detail}>
        <input
          className={customerStyles.customer__input}
          name="phoneNumber"
          placeholder="Email address"
          type="tel"
          onChange={onChangeInput}
        />
      <div className={customerStyles.ErrorMessage}>
        <ErrorMessage name="phoneNumber" />
      </div>
        <input
          className={customerStyles.customer__input}
          name="email"
          placeholder="Phone number"
          type="email"
          onChange={onChangeInput}
        />
      </div>
      <div className={customerStyles.ErrorMessage}>
        <ErrorMessage name="email" />
      </div>

      <div className={customerStyles.detailTitle}>
      <div className={customerStyles.numberIcon}>3</div>
      <label>Where did you hear about us?</label>
      </div>
      <div className={customerStyles.detail}>
        <Select
        className={customerStyles.select}
          options={whereYouHeardOptions}
          name="whereYouHeard"
          onChange={setOption}
          value={values.whereYouHeard}
        />
      </div>

      <div className={customerStyles.detailTitle}>
      <div className={customerStyles.numberIcon}>4</div>
      <label>Payment Methods</label>
      </div>
      <div className={customerStyles.detail}>
        <div className="paymentButtonContainer">
        <button className={`${customerStyles.paymentButton} ${customerStyles.banktransfer}`} type="button">
            Bank Transfer Information
        </button>
        <button className={`${customerStyles.paymentButton} ${customerStyles.barion}`} type="button">
          Barion Pay
        </button>
          
        </div>
      </div>

    </section>
  );
};

export default memo(Customer);
