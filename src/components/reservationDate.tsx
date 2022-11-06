import "react-day-picker/dist/style.css";
import { DayPicker } from "react-day-picker";
import React, { FC, memo, useEffect } from "react";
import classnames from "classnames";
import { useFormikContext } from "formik";
import { useTranslation } from "next-i18next";

import CalendarIcon from "../../public/assets/calendar.svg";
import ClockIcon from "../../public/assets/clock.svg";
import { Reservation } from "../lib/validation/validationInterfaces";
import { ReservationDataShort } from "../lib/interfaces";
import Calendar from "./calendar";

import dateStyles from "../styles/reservationDate.module.scss";
import styles from "../styles/main.module.scss";

interface Props {
  currentReservations: ReservationDataShort[];
}

const timeOptions = ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];
const AVAILABLE_TUBS = 3;

const ReservationDate: FC<Props> = ({ currentReservations }) => {
  const { values, setFieldValue } = useFormikContext<Reservation>();
  const { t } = useTranslation("common");

  return (
    <section className={dateStyles.reservationDate}>
      <div className={dateStyles.reservationDate__label}>
        <div
          className={classnames(`${styles.todoitem} ${styles.todoitem__one}`, {
            [styles.todoitem__done]: values.date && values.date.getHours() !== 0
          })}
        />

        <label>{t("reservationDate.dateAndTime")}</label>
      </div>
      <Calendar currentReservations={currentReservations} />
      {/* <div className={dateStyles.reservationDate__calendar}>
        <div className={dateStyles.reservationDate__date}>
          <div>
            <CalendarIcon className={classnames(`${dateStyles.reservationDate__calendarIcon} calendarIcon`)} />
          </div>
          <DayPicker
            selected={values.date}
            onDayClick={selectDate}
            fromMonth={new Date()}
            weekStartsOn={1}
            disabled={(day) => day <= new Date() || allTubsAreReservedForGivenEntireDay(day)}
            showOutsideDays
            fixedWeeks
          />
        </div>
        {values.date && (
          <div className={dateStyles.reservationDate__time}>
            <div className={dateStyles.reservationDate__timeTitle}>
              <div className={styles.iconContainer}>
                <ClockIcon className={classnames(`${dateStyles.reservationDate__clockIcon} clockIcon`)} />
              </div>
              <span>Time</span>
            </div>
            <div className={classnames(`${dateStyles.reservationDate__timeOptions} reservationDate__timeOptions`)}>
              {timeOptions.map((t, index) => (
                <button
                  key={index}
                  type="button"
                  className={classnames({
                    [dateStyles.reservationDate__timeOptionsDisabled]: allTubsAreReservedForGivenDayAndTime(t)
                  })}
                  onClick={selectTime}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}
      </div> */}
    </section>
  );
};

export default memo(ReservationDate);
