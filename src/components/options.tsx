import React, { FC, memo, useEffect } from "react";
import Select, { ActionMeta, ValueType } from "react-select";
import classNames from "classnames";
import { useFormikContext } from "formik";

//@ts-ignore
import HottubIcon from "../../public/assets/hottub.svg";
//@ts-ignore
import PeopleIcon from "../../public/assets/people.svg";
import { Reservation } from "../lib/validation/validationInterfaces";

import optionStyles from "../styles/options.module.scss";
import styles from "../styles/main.module.scss";
import { ReservationData } from "../pages";

interface Props {
  currentReservations: ReservationData;
}

const Options: FC<Props> = ({ currentReservations }) => {
  const { values, touched, setFieldValue, setFieldTouched } = useFormikContext<Reservation>();
  const AVAILABLE_TUBS = 3;
  const reservationsSelectedOnDateAndTime = Object.values(currentReservations).filter((res) => {
    if (!values.date) {
      return [];
    }
    let selectedDateAndTime = new Date(
      values.date.getFullYear(),
      values.date.getMonth(),
      values.date.getDate(),
      values.date.getHours()
    );
    let reservationDateAndTime = new Date(res.date);
    let reservationDate = new Date(
      reservationDateAndTime.getFullYear(),
      reservationDateAndTime.getMonth(),
      reservationDateAndTime.getDate(),
      reservationDateAndTime.getHours()
    );
    return reservationDate.toISOString() === selectedDateAndTime.toISOString();
  });

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

  const numberOfAvailableTubs = (): number => {
    let tubsReserved = 0;
    reservationsSelectedOnDateAndTime.forEach((res) => (tubsReserved += parseInt(res.numberOfTubs.value)));
    return AVAILABLE_TUBS - tubsReserved;
  };

  const numberOfGuestsOptions = [
    { value: "1", label: "1 person" },
    { value: "2", label: "2 people" },
    { value: "3", label: "3 people" },
    { value: "4", label: "4 people" },
    { value: "5", label: "5 people" },
    { value: "6", label: "6 people" },
  ];

  const availableNumberOfGuestsOptions = numberOfGuestsOptions.filter(
    (option) => numberOfAvailableTubs() * 2 >= parseInt(option.value)
  );

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

  const availableTubOptions = (
    tubOptions: {
      value: string;
      label: string;
    }[]
  ) => tubOptions.filter((option) => numberOfAvailableTubs() >= parseInt(option.value));

  const getTubOptions = () => {
    if (!values.numberOfGuests) {
      return [];
    } else {
      switch (values.numberOfGuests.value) {
        case "1":
          return availableTubOptions(onePersonTubOptions);
        case "2":
          return availableTubOptions(twoPeopleTubOptions);
        case "3":
          return availableTubOptions(threePeopleTubOptions);
        case "4":
          return availableTubOptions(fourPeopleTubOptions);
        case "5":
          return availableTubOptions(fivePeopleTubOptions);
        case "6":
          return availableTubOptions(sixPeopleTubOptions);
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
    colorIconGreen(select.name);
  };

  const colorIconGreen = (selector: string) =>
    ((document.querySelector(`.${selector}`) as HTMLElement).style.fill = "#00d531");

  const numberOfTubsAvailableText =
    numberOfAvailableTubs() > 0
      ? `(${numberOfAvailableTubs()} ${numberOfAvailableTubs() > 1 ? "tubs" : "tub"} for max ${
          numberOfAvailableTubs() * 2
        } people are available at selected
  time.)`
      : "No tubs are available at selected time.";

  return (
    <>
      <div className={optionStyles.options}>
        <div
          className={classNames(`${styles.todoitem} ${styles.todoitem__two}`, {
            [styles.todoitem__done]:
              values.numberOfGuests && values.numberOfTubs && touched.numberOfGuests && touched.numberOfTubs,
          })}
        />
        <div className={optionStyles.options__tubsLabel}>
          <label>Number of People & Tubs</label>
          {values.date && values.date.getHours() !== 0 && (
            <div className={optionStyles.options__availableTubs}>{numberOfTubsAvailableText}</div>
          )}
        </div>
      </div>

      <div className={optionStyles.options__container}>
        <div className={styles.iconContainer}>
          <PeopleIcon className={classNames(`${optionStyles.options__icon} numberOfGuests`)} />
        </div>

        <Select
          className={optionStyles.select}
          options={availableNumberOfGuestsOptions}
          placeholder={<>{values.numberOfGuests ? values.numberOfGuests.label : "Select guests"}</>}
          name="numberOfGuests"
          onChange={setOption}
          value={values.numberOfGuests}
          instanceId="number-of-guests"
          isSearchable={false}
        />
        <div className={styles.iconContainer}>
          <HottubIcon className={classNames(`${optionStyles.options__icon} numberOfTubs`)} />
        </div>
        <Select
          className={optionStyles.select}
          options={getTubOptions()}
          placeholder={<>{values.numberOfTubs ? values.numberOfTubs.label : "Select tubs"}</>}
          name="numberOfTubs"
          onChange={setOption}
          value={values.numberOfTubs}
          instanceId="number-of-tubs"
          isSearchable={false}
        />
      </div>
    </>
  );
};

export default memo(Options);
