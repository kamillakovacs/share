import classnames from "classnames";
import { useFormikContext } from "formik";
import React, { FC, memo } from "react";
import DayPicker from "react-day-picker";
import classNames from "classnames";

import { Reservation } from "../lib/validation/validationInterfaces";
import { ReservationData } from "../pages";

import dateStyles from "../styles/reservationDate.module.scss";
import styles from "../styles/main.module.scss";
import "react-day-picker/lib/style.css";

interface Props {
  currentReservations: ReservationData;
}

const timeOptions = ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];
const AVAILABLE_TUBS = 3;

const ReservationDate: FC<Props> = ({ currentReservations }) => {
  const { values, setFieldValue } = useFormikContext<Reservation>();

  const selectDate = (date: Date) => {
    date.setHours(0);
    setFieldValue("date", date);
  };

  const selectTime = (e: React.MouseEvent<HTMLButtonElement>) => {
    const previousSelected = document.querySelector(`.${dateStyles.selected}`);
    if (previousSelected) {
      previousSelected.classList.remove(dateStyles.selected);
    }
    if (!allTubsAreReservedForGivenDayAndTime(e.currentTarget.innerText)) {
      e.currentTarget.className += `button ${dateStyles.selected}`;
    }

    const dateTime = values.date;
    dateTime.setHours(parseInt(e.currentTarget.innerText));
    setFieldValue("date", dateTime);
  };

  const allTubsAreReservedForGivenDay = (day: Date) => {
    const reservationsOnDate = Object.values(currentReservations).filter((res) => {
      // find if there are reservations on given day
      let givenDay = new Date(day.getFullYear(), day.getMonth(), day.getDate());
      let reservationDateAndTime = new Date(res.date);
      let reservationDate = new Date(
        reservationDateAndTime.getFullYear(),
        reservationDateAndTime.getMonth(),
        reservationDateAndTime.getDate()
      );
      return reservationDate.toISOString() === givenDay.toISOString();
    });
    // find if all tubs are reserved on given day
    let tubsReserved = 0;
    reservationsOnDate.forEach((res) => (tubsReserved += parseInt(res.numberOfTubs.value)));
    return tubsReserved >= AVAILABLE_TUBS;
  };

  const allTubsAreReservedForGivenDayAndTime = (time: string): boolean => {
    const reservationsOnDateAndTime = Object.values(currentReservations).filter((res) => {
      // find if there are reservations on given day and time
      let givenDayAndTime = new Date(
        values.date.getFullYear(),
        values.date.getMonth(),
        values.date.getDate(),
        parseInt(time)
      );
      let reservationDateAndTime = new Date(res.date);
      let reservationDate = new Date(
        reservationDateAndTime.getFullYear(),
        reservationDateAndTime.getMonth(),
        reservationDateAndTime.getDate(),
        reservationDateAndTime.getHours()
      );
      return reservationDate.toISOString() === givenDayAndTime.toISOString();
    });

    // find if all tubs are reserved on given day and time
    let tubsReserved = 0;
    reservationsOnDateAndTime.forEach((res) => (tubsReserved += parseInt(res.numberOfTubs.value)));
    return tubsReserved >= AVAILABLE_TUBS;
  };

  return (
    <section className={dateStyles.reservationDate}>
      <div className={dateStyles.reservationDate__label}>
        <div
          className={classNames(`${styles.todoitem} ${styles.todoitem__one}`, {
            [styles.todoitem__done]: values.date,
          })}
        />

        <label>Date & Time</label>
      </div>
      <div className={dateStyles.reservationDate__calendar}>
        <div className={dateStyles.reservationDate__date}>
          <span className={dateStyles.reservationDate__calendarIcon} />
          <DayPicker
            selectedDays={values.date}
            onDayClick={selectDate}
            fromMonth={new Date()}
            initialMonth={new Date()}
            firstDayOfWeek={1}
            disabledDays={(day) => day < new Date() || allTubsAreReservedForGivenDay(day)}
          />
        </div>
        {values.date && (
          <div className={dateStyles.reservationDate__time}>
            <div className={dateStyles.reservationDate__timeTitle}>
              <img src="/assets/clock.svg" />
              <span>Time</span>
            </div>
            <div className={dateStyles.reservationDate__timeOptions}>
              {timeOptions.map((t, index) => (
                <button
                  key={index}
                  type="button"
                  className={classNames({
                    [dateStyles.reservationDate__timeOptionsDisabled]: allTubsAreReservedForGivenDayAndTime(t),
                  })}
                  onClick={selectTime}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default memo(ReservationDate);
