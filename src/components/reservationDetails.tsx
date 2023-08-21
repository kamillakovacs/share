import React, { FC, memo, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";

import { ReservationWithDetails, Reservations } from "../lib/validation/validationInterfaces";

import thanksStyles from "../styles/thanks.module.scss";
import { sendThankYouEmail } from "../api/thankYouEmail";
import detailsStyles from "../styles/details.module.scss";

import CalendarCheckIcon from "../../public/assets/calendar-check.svg";
import HeartIcon from "../../public/assets/heart.svg";
import HottubIcon from "../../public/assets/hottub.svg";
import ReservationSummary from "./reservationSummary";
import { PaymentStatus } from "../api/interfaces";
import EditReservation from "./editReservation";
import { ReservationDataShort } from "../lib/interfaces";

interface Props {
  reservation: ReservationWithDetails;
  paymentId: string;
  reservations: Reservations;
  currentReservations: ReservationDataShort[];
}

const ReservationDetails: FC<Props> = ({ reservation, paymentId, reservations, currentReservations }) => {
  const { t, i18n } = useTranslation("common");
  const [date, setDate] = useState("");
  const [dateOfPurchase, setDateOfPurchase] = useState("");
  const [thankYouEmailSent, setThankYouEmailSent] = useState(false)


  useEffect(() => {
    if (reservation?.date) {
      setDate(
        new Intl.DateTimeFormat(i18n.language, {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }).format(new Date(reservation?.date))
      );
    }

    if (reservation?.dateOfPurchase) {
      setDateOfPurchase(
        new Intl.DateTimeFormat(i18n.language, {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }).format(new Date(reservation?.dateOfPurchase))
      );
    }
  }, [setDate, setDateOfPurchase, reservation?.date, reservation?.dateOfPurchase, i18n.language]);

  useEffect(() => {
    if (!!date.length && !!dateOfPurchase.length && !thankYouEmailSent) {
      const emailData = {
        name: `${reservation?.firstName} ${reservation?.lastName}`,
        date,
        dateOfPurchase,
        numberOfTubs: reservation?.numberOfTubs.label,
        totalPrice: reservation?.price,
        paymentId
      };
      sendThankYouEmail(emailData);
      setThankYouEmailSent(true)
    }
  }, [thankYouEmailSent, setThankYouEmailSent, reservation, date, dateOfPurchase, paymentId])

  return (
    <article className={thanksStyles.container}>
      <label className={thanksStyles.reservation__title}>
        <span>{t("thanks.thankYou")}</span>
      </label>
      <div className={thanksStyles.reservation}>
        <div className={thanksStyles.navigators}>
          <div className={thanksStyles.verticalLine} />
          <div className={thanksStyles.verticalLine2} />
          <div className={thanksStyles.verticalLine3} />
        </div>
        <div className={thanksStyles.reservation__summary}>
          <div className={thanksStyles.summaryLabel}>
            <div className={thanksStyles.icon}>
              <CalendarCheckIcon />
            </div>
            <label>{t("summary.details")}</label>
          </div>
          <ReservationSummary reservation={reservation} date={date} />

          <div className={thanksStyles.summaryLabel}>
            <div className={thanksStyles.icon}>
              <CalendarCheckIcon />
            </div>
            <label>{t("reservationDetails.billingDetails")}</label>
          </div>
          <div className={detailsStyles.details}>
            <div className={detailsStyles.details__row}>
              <div>{t("customer.name")}:</div>
              <div>
                {reservation?.firstName} {reservation?.lastName}
              </div>
            </div>
            <div className={detailsStyles.details__row}>
              <div>{t("customer.email")}:</div>
              <div>{reservation?.email}</div>
            </div>
            <div className={detailsStyles.details__row}>
              <div>{t("customer.phone")}:</div>
              <div>{reservation?.phoneNumber}</div>
            </div>
            <div className={detailsStyles.details__row}>
              <div>{t("reservationDetails.totalPrice")}:</div>
              <div>{reservation?.price} {t("summary.huf")}</div>
            </div>
            <div className={detailsStyles.details__row}>
              <div>{t("reservationDetails.paymentStatus")}:</div>
              <div>
                {reservation.paymentStatus == PaymentStatus.Succeeded ? 
                    t("reservationDetails.paid") : t("reservationDetails.outstanding")}
              </div>
            </div>
            <div className={detailsStyles.details__row}>
              <div>{t("reservationDetails.dateOfPurchase")}:</div>
              <div>{dateOfPurchase}</div>
            </div>
          </div>

          <div className={thanksStyles.summaryLabel}>
            <div className={thanksStyles.icon}>
              <HottubIcon />
            </div>
            <label>{t("summary.yourExperience")}</label>
          </div>
          <div className={detailsStyles.details}>
            <div>{t("summary.infraredSauna")}</div>
            <div>{`${t("summary.soakFor")} ${reservation?.numberOfGuests ? reservation?.numberOfGuests.value : 1} ${
              reservation?.numberOfGuests
                ? reservation.numberOfGuests.value > 1
                  ? t("summary.people")
                  : t("summary.person")
                : t("summary.person")
            } in ${reservation?.numberOfTubs ? reservation?.numberOfTubs.value : 1} ${
              reservation?.numberOfTubs
                ? reservation?.numberOfTubs.value > 1
                  ? t("summary.tubs")
                  : t("summary.tub")
                : t("summary.tub")
            } ${t("summary.ofBeerBath")} `}</div>
            <div>{t("summary.strawBed")} </div>
            <div>{t("summary.unlimitedBeer")} </div>
            <div>{t("summary.towelsAndRobes")} </div>
            <div>{t("summary.exclusiveUse")} </div>
          </div>

          <div className={thanksStyles.summaryLabel}>
            <div className={thanksStyles.icon}>
              <HeartIcon />
            </div>
            <label>{t("reservationDetails.lookForwardToSeeingYou")}</label>
          </div>
        </div>
      </div>
      <EditReservation reservations={reservations} currentReservations={currentReservations}/>
    </article>
  );
};

export default memo(ReservationDetails);
