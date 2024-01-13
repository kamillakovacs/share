import React, { ChangeEvent, FC, memo, useEffect } from "react";
import Select, { ActionMeta } from "react-select";
import classNames from "classnames";
import { useFormikContext, ErrorMessage } from "formik";
import { useTranslation } from "next-i18next";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

import { ReservationWithDetails } from "../lib/validation/validationInterfaces";

import customerStyles from "../styles/customer.module.scss";
import styles from "../styles/main.module.scss";

const Customer: FC = () => {
  const { t } = useTranslation("common");
  const { values, errors, setFieldValue, setFieldTouched } = useFormikContext<ReservationWithDetails>();

  useEffect(() => {

  }, [values.whereYouHeard, setFieldValue]);


  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setFieldTouched(e.target.name);
    setFieldValue(e.target.name, e.target.value);
  };

  const onPhoneNumberInput = (value: any) => {
    setFieldTouched("phoneNumber");
    setFieldValue("phoneNumber", value);
  };

  const setOption = (
    option: { value: string; label: string },
    select: ActionMeta<{ value: string; label: string }>
  ) => {
    setFieldValue(select.name, option);
    setFieldTouched(select.name);
  };

  const whereYouHeardOptions = [
    { value: "webSearch", label: t("customer.webSearch") },
    { value: "friendFamily", label: t("customer.friendOrFamily") },
    { value: "advertisement", label: t("customer.advertisement") },
    { value: "tripAdvisor", label: t("customer.tripAdvisor") },
    { value: "facebook", label: t("customer.facebook") },
    { value: "instagram", label: t("customer.instagram") },
    { value: "hotel", label: t("customer.hotel") }
  ];

  return (
    <section className={customerStyles.customer}>
      <div className={customerStyles.detailTitle}>
        <div
          className={classNames(`${styles.todoitem} ${styles.todoitem__one}`, {
            [styles.todoitem__done]: values.firstName && values.lastName
          })}
        />
        <label>{t("customer.personalInformation")}</label>
      </div>
      <div className={customerStyles.detail}>
        <input
          className={classNames(customerStyles.customer__input, {
            [customerStyles.customer__input__error]: errors.firstName
          })}
          name="firstName"
          placeholder={t("customer.firstName")}
          type="text"
          onChange={onChangeInput}
        />
        <input
          className={classNames(customerStyles.customer__input, {
            [customerStyles.customer__input__error]: errors.lastName
          })}
          name="lastName"
          placeholder={t("customer.lastName")}
          type="text"
          onChange={onChangeInput}
        />
      </div>
      <div className={customerStyles.detailTitle}>
        <div
          className={classNames(`${styles.todoitem} ${styles.todoitem__two}`, {
            [styles.todoitem__done]: values.email && values.phoneNumber
          })}
        />
        <label>{t("customer.contactInformation")}</label>
      </div>
      <div className={customerStyles.detail}>
        <input
          className={classNames(customerStyles.customer__input, {
            [customerStyles.customer__input__error]: errors.email
          })}
          name="email"
          placeholder={t("customer.email")}
          type="email"
          onChange={onChangeInput}
        />
        <PhoneInput
          className={classNames(customerStyles.customer__input, {
            [customerStyles.customer__input__error]: errors.phoneNumber
          })}
          name="phoneNumber"
          placeholder={t("customer.phone")}
          defaultCountry="HU"
          onChange={onPhoneNumberInput}
        />
      </div>
      <div className={customerStyles.detailTitle}>
        <div
          className={classNames(`${styles.todoitem} ${styles.todoitem__three}`, {
            [styles.todoitem__done]: values.whereYouHeard?.value
          })}
        />
        <label>{t("customer.whereDidYouHearAboutUs")}</label>
      </div>
      <div className={customerStyles.detail}>
        <Select
          styles={{
            container: (baseStyles) => ({
              ...baseStyles,
              paddingBottom: "20px"
            }),
            control: (baseStyles) => ({
              ...baseStyles,
              height: "64px",
              backgroundColor: "#343434",
              borderWidth: "1px",
              borderColor: errors && errors.whereYouHeard && errors.whereYouHeard?.value ? "red" : "#707070",
              cursor: "pointer !important",
              margin: "20px 0 0 25px",
              width: "650px",
              fontSize: "22px",
              fontWeight: "200",
              ":focus": { borderColor: "#707070" },
              ":hover": { borderColor: "#707070", boxShadow: "0 0 0 1px #707070" },
            }),
            singleValue: (baseStyles) => ({
              ...baseStyles,
              color: "white",
            }),
            menu: (baseStyles) => ({
              ...baseStyles,
              backgroundColor: "#343434",
              borderRadius: "5px",
              marginLeft: "25px",
              fontSize: "22px",
              color: "white",
              paddingLeft: "10px",
              width: "650px"
            }),
            menuList: (baseStyles) => ({
              ...baseStyles,
              maxHeight: "auto"
            }),
            option: (baseStyles) => ({
              ...baseStyles,
              backgroundColor: "#343434",
              borderRadius: "5px",
              display: "flex",
              alignItems: "center",
              fontWeight: "200",
              cursor: "pointer",
              paddingLeft: "10px"
            }),
          }}
          options={whereYouHeardOptions}
          name="whereYouHeard"
          onChange={setOption}
          value={values.whereYouHeard}
          placeholder={t("customer.select")}
          instanceId="where-you-heard"
          isSearchable={false}
        />
      </div>
    </section>
  );
};

export default memo(Customer);
