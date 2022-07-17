import classnames from "classnames";
import { useFormikContext } from "formik";
import React, { FC, memo } from "react";
import DayPicker from "react-day-picker";
import "react-day-picker/lib/style.css";

//@ts-ignore
import ClockIcon from "../../public/assets/clock.svg";
//@ts-ignore
import CalendarIcon from "../../public/assets/calendar.svg";
import { Reservation } from "../lib/validation/validationInterfaces";
import { ReservationData } from "../pages";

import dateStyles from "../styles/reservationDate.module.scss";
import styles from "../styles/main.module.scss";

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
    setFieldValue("numberOfGuests", null);
    setFieldValue("numberOfTubs", null);
    handleIconColors(".calendarIcon");
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
    setFieldValue("numberOfGuests", null);
    setFieldValue("numberOfTubs", null);
    handleIconColors(".clockIcon");
  };

  const handleIconColors = (selector: string) => {
    colorIconGreen(selector);
    resetIconColor(".numberOfGuests");
    resetIconColor(".numberOfTubs");
  };

  const colorIconGreen = (selector: string) =>
    ((document.querySelector(selector) as HTMLElement).style.fill = "#00d531");
  const resetIconColor = (selector: string) => ((document.querySelector(selector) as HTMLElement).style.fill = "white");

  const allTubsAreReservedForGivenEntireDay = (day: Date) => {
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
    const hoursReservedOnGivenDay = reservationsOnDate.map((res) => new Date(res.date).getHours()).sort();
    const allTimesAreReservedOnGivenDay =
      [10, 12, 14, 16, 18, 20].sort().toString() ===
      hoursReservedOnGivenDay.filter((hour, index) => hoursReservedOnGivenDay.indexOf(hour) == -index).toString();

    const areAllTubsReservedAtAllTimesOfGivenDay = () => {
      if (!allTimesAreReservedOnGivenDay) {
        return false;
      }

      let tubsReserved = 0;
      reservationsOnDate.forEach((res) => (tubsReserved += parseInt(res.numberOfTubs.value)));
      return tubsReserved >= AVAILABLE_TUBS;
    };

    return areAllTubsReservedAtAllTimesOfGivenDay();
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
          className={classnames(`${styles.todoitem} ${styles.todoitem__one}`, {
            [styles.todoitem__done]: values.date && values.date.getHours() !== 0,
          })}
        />

        <label>Date & Time</label>
      </div>
      <div className={dateStyles.reservationDate__calendar}>
        <div className={dateStyles.reservationDate__date}>
          <div>
            <CalendarIcon className={classnames(`${dateStyles.reservationDate__calendarIcon} calendarIcon`)} />
          </div>
          <DayPicker
            selectedDays={values.date}
            onDayClick={selectDate}
            fromMonth={new Date()}
            initialMonth={new Date()}
            firstDayOfWeek={1}
            disabledDays={(day) => day < new Date() || allTubsAreReservedForGivenEntireDay(day)}
          />
        </div>
        {values.date && (
          <div className={dateStyles.reservationDate__time}>
            <div className={dateStyles.reservationDate__timeTitle}>
              <div className={styles.iconContainer}>
                <ClockIcon className={classnames(`${dateStyles.reservationDate__clockIcon} clockIcon`)} />
              </div>
              {/* <span className={dateStyles.reservationDate__clockIcon} /> */}
              <span>Time</span>
            </div>
            <div className={dateStyles.reservationDate__timeOptions}>
              {timeOptions.map((t, index) => (
                <button
                  key={index}
                  type="button"
                  className={classnames({
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
