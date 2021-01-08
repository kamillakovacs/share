import { useFormikContext } from "formik";
import React, { FC, memo } from "react";
import DatePicker from "react-datepicker";

import { Reservation } from "../lib/validation/validationInterfaces";
import { ReservationData } from "../pages";
import classNames from "classnames";

interface Props {
  currentReservations: ReservationData;
}

const ReservationDate: FC<Props> = ({ currentReservations }) => {
  const { values, setFieldValue } = useFormikContext<Reservation>();

  const selectDate = (date: Date) => {
    setFieldValue("date", date);
  };

  const selectTime = (time: Date) => {
    setFieldValue("time", time);
  };

  const unavailableDates = Object.values(currentReservations).map(
    (res) => res.date
  );

  return (
    <section className="ReservationDate">
      <label>Select date:</label>
      <div className="ReservationDate__date">
        <DatePicker
          dateFormat={"dd/MM/yyyy"}
          selected={values.date}
          onChange={selectDate}
          placeholderText="Select date..."
          minDate={Date.now()}
        />
      </div>
      <div className="ReservationDate__time">
        <DatePicker
          selected={values.time}
          onChange={selectTime}
          showTimeSelect
          showTimeSelectOnly
          placeholderText="Select time..."
          dateFormat="h:mm aa"
        />
      </div>
    </section>
  );
};

export default memo(ReservationDate);
