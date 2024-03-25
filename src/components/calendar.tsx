import "react-day-picker/dist/style.css";
import { DayPicker } from "react-day-picker";
import React, { FC, memo } from "react";
import classnames from "classnames";
import { useFormikContext } from "formik";
import { hu, enUS } from "date-fns/locale";
import { useTranslation } from "next-i18next";

import CalendarIcon from "../../public/assets/calendar.svg";
import ClockIcon from "../../public/assets/clock.svg";
import { Reservation } from "../lib/validation/validationInterfaces";

import dateStyles from "../styles/reservationDate.module.scss";
import styles from "../styles/main.module.scss";
import { ReservationDataShort } from "../lib/interfaces";

interface Props {
  currentReservations: ReservationDataShort[];
  isExistingReservation?: boolean;
}

const timeOptions = ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];

const Calendar: FC<Props> = ({ currentReservations, isExistingReservation }) => {
  const { values, setFieldValue } = useFormikContext<Reservation>();
  const { t, i18n } = useTranslation();

  const selectDate = (date: Date) => {
    date.setHours(0);
    setFieldValue("date", date);
    if (!isExistingReservation) {
      setFieldValue("numberOfGuests", null);
      setFieldValue("numberOfTubs", null);
      setFieldValue("price", "");
    }
    handleIconColors(".calendarIcon");

    // reset time icon if changing selected date
    if (document.querySelector(".clockIcon")) {
      resetIconColor(".clockIcon");
    }
    // remove selected highlight on time if changing selected date
    if (document.querySelector(".reservationDate__timeOptions .button")) {
      (document.querySelector(".reservationDate__timeOptions .button") as HTMLElement).classList.remove(
        dateStyles.selected,
        "button"
      );
    }
  };

  const selectTime = (e: React.MouseEvent<HTMLButtonElement>) => {
    const previousSelected = document.querySelector(`.${dateStyles.selected}`);
    if (previousSelected) {
      previousSelected.classList.remove(dateStyles.selected, "button");
    }
    if (!allTubsAreReservedForGivenDayAndTime(e.currentTarget.innerText)) {
      e.currentTarget.className += `button ${dateStyles.selected}`;
    }

    const dateTime = values.date;
    dateTime.setHours(parseInt(e.currentTarget.innerText));
    setFieldValue("date", dateTime);
    if (!isExistingReservation) {
      setFieldValue("numberOfGuests", null);
      setFieldValue("numberOfTubs", null);
    }
    handleIconColors(".clockIcon");
  };

  const handleIconColors = (selector: string) => {
    colorIconGreen(selector);
    if (document.querySelector(".numberOfGuests") && document.querySelector(".numberOfTubs")) {
      resetIconColor(".numberOfGuests");
      resetIconColor(".numberOfTubs");
    }
  };

  const colorIconGreen = (selector: string) =>
    document.querySelectorAll(selector).forEach((s) => ((s as HTMLElement).style.fill = "#00d531"));

  const resetIconColor = (selector: string) => ((document.querySelector(selector) as HTMLElement).style.fill = "white");

  const allTubsAreReservedForGivenEntireDay = (day: Date) => {
    if (!currentReservations) {
      return false;
    }

    const hoursReservedOnGivenDay = getReservationsOnDate(day).map((res: ReservationDataShort) =>
      new Date(res.date).getHours()
    );
    const timesReservationOnDay: number[] = hoursReservedOnGivenDay.filter(
      (hour, index) => hoursReservedOnGivenDay?.indexOf(hour) == index
    );
    const allTimesAreReservedOnGivenDay: boolean = [10, 12, 14, 16, 18, 20].every(
      (time) => timesReservationOnDay?.includes(time)
    );

    if (!allTimesAreReservedOnGivenDay) {
      return false;
    }

    return getReservationsOnDate(day).length > 0;
  };

  const getReservationsOnDate = (day: Date) =>
    Object.values(currentReservations).filter((res: ReservationDataShort) => {
      if (res.date === null) {
        return;
      }
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

  const isSixtyDaysFromToday = (day: Date) => day.valueOf() > new Date().setDate(new Date().getDate() + 60);
  const availableDates = (day: Date) =>
    day <= new Date() || allTubsAreReservedForGivenEntireDay(day) || isSixtyDaysFromToday(day);

  const allTubsAreReservedForGivenDayAndTime = (time: string): boolean => {
    if (!currentReservations || !values.date) {
      return false;
    }

    const reservationsOnDateAndTime = Object.values(currentReservations).filter((res) => {
      if (time === null || time === undefined) {
        return;
      }
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

    return reservationsOnDateAndTime.length > 0;
  };

  const getDayPickerLocale = i18n.language === "en-US" ? enUS : hu;

  return (
    <>
      <div className={dateStyles.reservationDate__calendar}>
        <div className={dateStyles.reservationDate__date}>
          <div>
            <CalendarIcon className={classnames(`${dateStyles.reservationDate__calendarIcon} calendarIcon`)} />
          </div>
          <DayPicker
            selected={values.date}
            onDayClick={selectDate}
            fromMonth={new Date()}
            locale={getDayPickerLocale}
            weekStartsOn={1}
            disabled={(day) => availableDates(day)}
            showOutsideDays
            fixedWeeks
            className={dateStyles.reservationDate__datePicker}
          />
        </div>
        {values.date && (
          <div className={dateStyles.reservationDate__time}>
            <div className={dateStyles.reservationDate__timeTitle}>
              <div className={styles.iconContainer}>
                <ClockIcon className={classnames(`${dateStyles.reservationDate__clockIcon} clockIcon`)} />
              </div>
              <span>{t("reservationDate.time")}</span>
            </div>
            <div className={classnames(`${dateStyles.reservationDate__timeOptions} reservationDate__timeOptions`)}>
              {timeOptions.map((time, index) => (
                <button
                  key={index}
                  type="button"
                  className={classnames({
                    [dateStyles.reservationDate__timeOptionsDisabled]: allTubsAreReservedForGivenDayAndTime(time)
                  })}
                  onClick={selectTime}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className={dateStyles.reservationDate__timeResponsive}>
        <div className={dateStyles.reservationDate__timeResponsiveTitle}>
          <div className={styles.iconContainer}>
            <ClockIcon className={classnames(`${dateStyles.reservationDate__clockIcon} clockIcon`)} />
          </div>
          <span>{t("reservationDate.time")}</span>
        </div>
        <div
          className={classnames(`${dateStyles.reservationDate__timeResponsiveOptions} reservationDate__timeOptions`)}
        >
          {timeOptions.map((time, index) => (
            <button
              key={index}
              type="button"
              className={classnames({
                [dateStyles.reservationDate__timeResponsiveOptionsDisabled]: allTubsAreReservedForGivenDayAndTime(time)
              })}
              onClick={selectTime}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default memo(Calendar);
