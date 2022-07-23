import React, { FC, memo, useEffect } from "react";
import Select, { ActionMeta } from "react-select";
import classNames from "classnames";
import { useFormikContext } from "formik";
import { useTranslation } from "next-i18next";

//@ts-ignore
import HottubIcon from "../../public/assets/hottub.svg";
//@ts-ignore
import PeopleIcon from "../../public/assets/people.svg";
import { Reservation } from "../lib/validation/validationInterfaces";

import optionStyles from "../styles/options.module.scss";
import styles from "../styles/main.module.scss";
import { ReservationDataShort } from "../lib/interfaces";

interface Props {
  currentReservations: ReservationDataShort;
}

const Options: FC<Props> = ({ currentReservations }) => {
  const { values, touched, setFieldValue, setFieldTouched } = useFormikContext<Reservation>();
  const { t } = useTranslation("common");
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
      setFieldValue("numberOfTubs", null);
      resetIconColor(".numberOfTubs");
    }
  }, [values.numberOfGuests]);

  useEffect(() => {
    if (values.numberOfTubs) {
      setFieldValue("price", setPrice());
    }
  }, [values.numberOfTubs, values.numberOfGuests]);

  const numberOfAvailableTubs = (): number => {
    let tubsReserved = 0;
    reservationsSelectedOnDateAndTime.forEach((res) => (tubsReserved += parseInt(res.numberOfTubs?.value)));
    return AVAILABLE_TUBS - tubsReserved;
  };

  const numberOfGuestsOptions = [
    { value: 1, label: t("options.onePerson") },
    { value: 2, label: t("options.twoPeople") },
    { value: 3, label: t("options.threePeople") },
    { value: 4, label: t("options.fourPeople") },
    { value: 5, label: t("options.fivePeople") },
    { value: 6, label: t("options.sixPeople") }
  ];

  const availableNumberOfGuestsOptions = numberOfGuestsOptions.filter(
    (option) => numberOfAvailableTubs() * 2 >= option.value
  );

  const onePersonTubOptions = [{ value: 1, label: t("options.oneTub") }];
  const twoPeopleTubOptions = [
    { value: 1, label: t("options.twoPeopleInOneTub") },
    { value: 2, label: t("options.twoPeopleInTwoTubs") }
  ];
  const threePeopleTubOptions = [
    { value: 2, label: t("options.threePeopleInTwoTubs") },
    { value: 3, label: t("options.threePeopleInThreeTubs") }
  ];
  const fourPeopleTubOptions = [
    { value: 2, label: t("options.fourPeopleInTwoTubs") },
    { value: 3, label: t("options.fourPeopleInThreeTubs") }
  ];
  const fivePeopleTubOptions = [{ value: 3, label: t("options.threeTubs") }];
  const sixPeopleTubOptions = [{ value: 3, label: t("options.threeTubs") }];

  const availableTubOptions = (
    tubOptions: {
      value: number;
      label: string;
    }[]
  ) => tubOptions.filter((option) => numberOfAvailableTubs() >= option.value);

  const getTubOptions = () => {
    if (!values.numberOfGuests) {
      return [];
    } else {
      switch (values.numberOfGuests.value) {
        case 1:
          return availableTubOptions(onePersonTubOptions);
        case 2:
          return availableTubOptions(twoPeopleTubOptions);
        case 3:
          return availableTubOptions(threePeopleTubOptions);
        case 4:
          return availableTubOptions(fourPeopleTubOptions);
        case 5:
          return availableTubOptions(fivePeopleTubOptions);
        case 6:
          return availableTubOptions(sixPeopleTubOptions);
      }
    }
  };

  const setPrice = () => {
    switch (values.numberOfTubs.label) {
      case t("options.oneTub"):
        return 18000;
      case t("options.twoPeopleInOneTub"):
        return 22000;
      case t("options.twoPeopleInTwoTubs"):
        return 32000;
      case t("options.threePeopleInTwoTubs"):
        return 40000;
      case t("options.threePeopleInThreeTubs"):
        return 54000;
      case t("options.fourPeopleInTwoTubs"):
        return 44000;
      case t("options.fourPeopleInThreeTubs"):
        return 58000;
      case t("options.threeTubs"):
        return values.numberOfGuests.value === 5 ? 62000 : 66000;
    }
  };

  const setOption = (
    option: { value: number; label: string },
    select: ActionMeta<{ value: number; label: string }>
  ) => {
    setFieldValue(select.name, option);
    setFieldTouched(select.name);
    colorIconGreen(select.name);
  };

  const colorIconGreen = (selector: string) =>
    ((document.querySelector(`.${selector}`) as HTMLElement).style.fill = "#00d531");

  const resetIconColor = (selector: string) => ((document.querySelector(selector) as HTMLElement).style.fill = "white");

  const numberOfTubsAvailableText =
    numberOfAvailableTubs() > 0
      ? `${t("options.openParentheses")}${numberOfAvailableTubs()} ${
          numberOfAvailableTubs() > 1 ? t("options.tubs") : t("options.tub")
        } ${t("options.forMax")} ${numberOfAvailableTubs() * 2} ${t("options.peopleAtSelectedTime")}`
      : t("options.noTubsAtSelectedTime");

  return (
    <>
      <div className={optionStyles.options}>
        <div
          className={classNames(`${styles.todoitem} ${styles.todoitem__two}`, {
            [styles.todoitem__done]:
              values.numberOfGuests && values.numberOfTubs && touched.numberOfGuests && touched.numberOfTubs
          })}
        />
        <div className={optionStyles.options__tubsLabel}>
          <label>{t("options.numberOfPeopleAndTubs")}</label>
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
          classNamePrefix={optionStyles.select}
          options={availableNumberOfGuestsOptions}
          placeholder={<>{values.numberOfGuests ? values.numberOfGuests.label : t("options.selectGuests")}</>}
          name="numberOfGuests"
          onChange={setOption}
          value={values.numberOfGuests}
          instanceId="number-of-guests"
          isSearchable={false}
          noOptionsMessage={() => t("options.noOptions")}
        />
        <div className={styles.iconContainer}>
          <HottubIcon className={classNames(`${optionStyles.options__icon} numberOfTubs`)} />
        </div>
        <Select
          className={optionStyles.select}
          options={getTubOptions()}
          placeholder={<>{values.numberOfTubs ? values.numberOfTubs.label : t("options.selectTubs")}</>}
          name="numberOfTubs"
          onChange={setOption}
          value={values.numberOfTubs}
          instanceId="number-of-tubs"
          isSearchable={false}
          noOptionsMessage={() => t("options.noOptions")}
        />
      </div>
    </>
  );
};

export default memo(Options);
