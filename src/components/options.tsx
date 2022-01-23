import { Slider } from "@material-ui/core";
import { useFormikContext } from "formik";
import React, { FC, memo, useEffect } from "react";

import { Reservation } from "../lib/validation/validationInterfaces";

import optionStyles from "../styles/options.module.scss";
import styles from "../styles/main.module.scss";
import classNames from "classnames";

import Select, { ActionMeta, ValueType } from "react-select";

const Options: FC = () => {
  const {
    values,
    touched,
    setFieldValue,
    setFieldTouched,
  } = useFormikContext<Reservation>();

  useEffect(() => {
    if (values.numberOfGuests) {
      setFieldValue("numberOfTubs", getTubOptions());
    }
  }, [values.numberOfGuests]);

  useEffect(() => {
    if (values.numberOfTubs) {
      setFieldValue("price", setPrice());
    }
  }, [values.numberOfTubs, values.numberOfGuests]);

  const numberOfGuestsOptions = [
    { value: "1", label: "1 person" },
    { value: "2", label: "2 people" },
    { value: "3", label: "3 people" },
    { value: "4", label: "4 people" },
    { value: "5", label: "5 people" },
    { value: "6", label: "6 people" },
  ];

  const onePersonTubOptions = [{ value: "1", label: "1 tub" }];
  const twoPeopleTubOptions = [
    { value: "1", label: "2 people in 1 tub" },
    { value: "2", label: "2 people in 2 tubs" },
  ];
  const threePeopleTubOptions = [
    { value: "2", label: "3 people in 2 tubs" },
    { value: "3", label: "3 people in 3 tubs" },
  ];
  const fourPeopleTubOptions = [
    { value: "2", label: "4 people in 2 tubs" },
    { value: "3", label: "4 people in 3 tubs" },
  ];
  const fivePeopleTubOptions = [{ value: "3", label: "3 tubs" }];
  const sixPeopleTubOptions = [{ value: "3", label: "3 tubs" }];

  const getTubOptions = () => {
    if (!values.numberOfGuests) {
      return onePersonTubOptions;
    } else {
      switch (values.numberOfGuests.value) {
        case "1":
          return onePersonTubOptions;
        case "2":
          return twoPeopleTubOptions;
        case "3":
          return threePeopleTubOptions;
        case "4":
          return fourPeopleTubOptions;
        case "5":
          return fivePeopleTubOptions;
        case "6":
          return sixPeopleTubOptions;
      }
    }
  };

  const setPrice = () => {
    switch (values.numberOfTubs.label) {
      case "1 tub":
        return "18 000";
      case "2 people in 1 tub":
        return "22 000";
      case "2 people in 2 tubs":
        return "32 000";
      case "3 people in 2 tubs":
        return "40 000";
      case "3 people in 3 tubs":
        return "54 000";
      case "4 people in 2 tubs":
        return "44 000";
      case "4 people in 3 tubs":
        return "58 000";
      case "3 tubs":
        return values.numberOfGuests.value === "5" ? "62 000" : "66 000";
    }
  };

  const setOption = (
    option: ValueType<{ value: string; label: string }>,
    select: ActionMeta<{ value: string; label: string }>
  ) => {
    setFieldValue(select.name, option);
    setFieldTouched(select.name);
  };

  return (
    <>
      <div className={optionStyles.options}>
        <div
          className={classNames(`${styles.todoitem} ${styles.todoitem__two}`, {
            [styles.todoitem__done]:
              values.numberOfGuests &&
              values.numberOfTubs &&
              touched.numberOfGuests &&
              touched.numberOfTubs,
          })}
        />
        <label>Number of People & Tubs</label>
      </div>
      <div className={optionStyles.options__container}>
        <img src="/assets/people.svg" />
        <Select
          className={optionStyles.select}
          options={numberOfGuestsOptions}
          placeholder={
            <>
              {values.numberOfGuests
                ? values.numberOfGuests.label
                : "Select guests"}
            </>
          }
          name="numberOfGuests"
          onChange={setOption}
          value={values.numberOfGuests}
        />
        <img src="/assets/hottub.svg" />
        <Select
          className={optionStyles.select}
          options={getTubOptions()}
          placeholder={
            <>
              {values.numberOfTubs ? values.numberOfTubs.label : "Select tubs"}
            </>
          }
          name="numberOfTubs"
          onChange={setOption}
          value={values.numberOfTubs}
        />
      </div>
    </>
  );
};

export default memo(Options);
