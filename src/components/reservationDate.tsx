import { useFormikContext } from "formik";
import React, { FC, memo } from "react";
import DayPicker from "react-day-picker";

import { Reservation } from "../lib/validation/validationInterfaces";
import { ReservationData } from "../pages";
import classNames from "classnames";

import dateStyles from "../styles/reservationDate.module.scss"
import styles from "../styles/main.module.scss"
import 'react-day-picker/lib/style.css';

interface Props {
  currentReservations: ReservationData;
}

const timeOptions = ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"]

const ReservationDate: FC<Props> = ({ currentReservations }) => {
  const { values, setFieldValue } = useFormikContext<Reservation>();

  const selectDate = (date: Date) => {
    setFieldValue("date", date);
  };

  const selectTime = (e: React.MouseEvent<HTMLButtonElement>) => {
    const previousSelected = document.querySelector(`.${dateStyles.selected}`)
    if (previousSelected) {
      previousSelected.classList.remove(dateStyles.selected)
    }
    e.currentTarget.className += `button ${dateStyles.selected}`

    setFieldValue("time", e.currentTarget.innerText);
  };

  const unavailableDates = Object.values(currentReservations).map(
    (res) => res.date
  );

  return (
    <section className={dateStyles.reservationDate}>
      <div className={dateStyles.reservationDate__label}>
      <div className={classNames(`${styles.todoitem} ${styles.todoitem__one}`, {
        [styles.todoitem__done]: values.date && values.time
      })} />
      
      <label>Date & Time</label>
      </div>
      <div className={dateStyles.reservationDate__calendar}>
      <div className={dateStyles.reservationDate__date}>
      <span className={dateStyles.reservationDate__calendarIcon}/>
        <DayPicker
          selectedDays={values.date}
          onDayClick={selectDate}
          fromMonth={new Date()}
          initialMonth={new Date()}
          firstDayOfWeek={1}
          disabledDays={day => day < (new Date())}
        />
      
      </div>
      <div className={dateStyles.reservationDate__time}>
        <div className={dateStyles.reservationDate__timeTitle}>
          <img src="/assets/clock.svg" />
          <span>Time</span></div>
        <div className={dateStyles.reservationDate__timeOptions}>
        {timeOptions.map((t, idx) => 
          <button  key={idx} type="button" onClick={selectTime} >{t}</button>
        )}
        </div>
      </div>
      </div>
    </section>
  );
};

export default memo(ReservationDate);
