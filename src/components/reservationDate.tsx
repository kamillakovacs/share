import { useFormikContext } from "formik";
import React, { FC, memo } from "react";
import DayPicker from "react-day-picker";

import { Reservation } from "../lib/validation/validationInterfaces";
import { ReservationData } from "../pages";
import classNames from "classnames";

import dateStyles from "../styles/reservationDate.module.scss"
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
    console.log(e.currentTarget.innerText)
    // setFieldValue("time", time);
  };

  const unavailableDates = Object.values(currentReservations).map(
    (res) => res.date
  );

  return (
    <section className={dateStyles.reservationDate}>
      <div className={dateStyles.reservationDate__label}>
        <img src="/assets/checkmark.svg" />
        <label>Date & Time</label>
      </div>
      <div className={dateStyles.reservationDate__calendar}>
      <div className={dateStyles.reservationDate__date}>
        <DayPicker
          selectedDays={values.date}
          onDayClick={selectDate}
          fromMonth={new Date()}
          initialMonth={new Date()}
          firstDayOfWeek={1}
          disabledDays={{daysOfWeek: [0]}}
        />
      
      </div>
      <div className={dateStyles.reservationDate__time}>
        <div className={dateStyles.reservationDate__timeCurrent}>
          <img src="/assets/clock.svg" />
          <span>14:00</span></div>
        <div className={dateStyles.reservationDate__timeOptions}>
        {timeOptions.map((t, idx) => 
          <button key={idx} type="button" onClick={selectTime} >{t}</button>
        )}
        </div>
      </div>
      </div>
    </section>
  );
};

export default memo(ReservationDate);
