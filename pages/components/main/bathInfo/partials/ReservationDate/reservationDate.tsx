import { useFormikContext } from "formik";
import React, { FC, memo } from "react";
import DatePicker from "react-datepicker";

import { Reservation } from "../../../../../validation/validationInterfaces";

const ReservationDate: FC = () => {
  const { values, setFieldValue } = useFormikContext<Reservation>();
  const selectDate = (date: Date) => {
    setFieldValue("date", date);
  };

  const selectTime = (time: Date) => {
    setFieldValue("time", time);
  };

  return (
    <section className="ReservationDate">
      <label>Select date:</label>
      <div className="ReservationDate__date">
        <DatePicker
          selected={values.date}
          onChange={selectDate}
          placeholderText="Select date..."
          minDate={Date.now()}
        />
      </div>
      <div className="ReservationDate__time">
        <DatePicker
          selected={values.time && values.time}
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
