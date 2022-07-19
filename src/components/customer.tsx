import React, { ChangeEvent, FC, memo } from "react";
import Select, { ActionMeta, ValueType } from "react-select";
import classNames from "classnames";
import { useFormikContext, ErrorMessage } from "formik";
import { useTranslation } from "next-i18next";

import { ReservationWithDetails } from "../lib/validation/validationInterfaces";

import Payment from "./payment";
import customerStyles from "../styles/customer.module.scss";
import styles from "../styles/main.module.scss";

const Customer: FC = () => {
  const { t } = useTranslation("common");
  const { values, setFieldValue, setFieldTouched } = useFormikContext<ReservationWithDetails>();

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
    { value: "hotel", label: t("customer.hotel") },
  ];

  return (
    <section className={customerStyles.customer}>
      <div className={customerStyles.detailTitle}>
        <div
          className={classNames(`${styles.todoitem} ${styles.todoitem__one}`, {
            [styles.todoitem__done]: values.firstName && values.lastName,
          })}
        />
        <label>{t("customer.personalInformation")}</label>
      </div>
      <div className={customerStyles.detail}>
        <input
          className={customerStyles.customer__input}
          name="firstName"
          placeholder={t("customer.firstName")}
          type="text"
          onChange={onChangeInput}
        />
        <div className={customerStyles.ErrorMessage}>
          <ErrorMessage name="firstName" />
        </div>
        <input
          className={customerStyles.customer__input}
          name="lastName"
          placeholder={t("customer.lastName")}
          type="text"
          onChange={onChangeInput}
        />
        <div className={customerStyles.ErrorMessage}>
          <ErrorMessage name="lastName" />
        </div>
      </div>
      <div className={customerStyles.detailTitle}>
        <div
          className={classNames(`${styles.todoitem} ${styles.todoitem__two}`, {
            [styles.todoitem__done]: values.email && values.phoneNumber,
          })}
        />
        <label>{t("customer.contactInformation")}</label>
      </div>
      <div className={customerStyles.detail}>
        <input
          className={customerStyles.customer__input}
          name="email"
          placeholder={t("customer.email")}
          type="email"
          onChange={onChangeInput}
        />
        <div className={customerStyles.ErrorMessage}>
          <ErrorMessage name="email" />
        </div>
        <input
          className={customerStyles.customer__input}
          name="phoneNumber"
          placeholder={t("customer.phone")}
          type="tel"
          onChange={onChangeInput}
        />
      </div>
      <div className={customerStyles.ErrorMessage}>
        <ErrorMessage name="phoneNumber" />
      </div>
      <div className={customerStyles.detailTitle}>
        <div
          className={classNames(`${styles.todoitem} ${styles.todoitem__three}`, {
            [styles.todoitem__done]: values.whereYouHeard,
          })}
        />
        <label>{t("customer.whereDidYouHearAboutUs")}</label>
      </div>
      <div className={customerStyles.detail}>
        <Select
          className={customerStyles.select}
          options={whereYouHeardOptions}
          name="whereYouHeard"
          onChange={setOption}
          value={values.whereYouHeard}
          placeholder={t("customer.select")}
          instanceId="where-you-heard"
        />
      </div>

      {/* <Payment /> */}
    </section>
  );
};

export default memo(Customer);
