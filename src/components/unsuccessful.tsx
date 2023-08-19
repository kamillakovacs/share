import React, { FC, memo } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import Image from "next/image";

import { ReservationWithDetails } from "../lib/validation/validationInterfaces";
import { ReservationData } from "../lib/interfaces";

import * as payment from "../api/paymentRequest";
import thanksStyles from "../styles/thanks.module.scss";
import reservationStyles from "../styles/reservation.module.scss";
import detailsStyles from "../styles/details.module.scss";
import barion from "../../public/assets/barion-card-strip-intl__small.png";
import ReservationSummary from "./reservationSummary";

interface Props {
  reservation: ReservationWithDetails;
  users: ReservationData[];
}

const Unsuccessful: FC<Props> = ({ reservation, users }) => {
  const { t, i18n } = useTranslation("common");
  const router = useRouter();
  const formattedDate = new Intl.DateTimeFormat(i18n.language, {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(reservation.date));

  const redirectToStartPayment = async (reservationData: ReservationData) =>
    payment.useSendPaymentRequest(reservationData, users, router);

  const onSubmit = async () => {
    const reservationData: ReservationData = {
      date: reservation.date,
      dateOfPurchase: new Date(),
      numberOfGuests: reservation.numberOfGuests,
      numberOfTubs: reservation.numberOfTubs,
      price: reservation.price,
      firstName: reservation.firstName,
      lastName: reservation.lastName,
      phoneNumber: reservation.phoneNumber,
      email: reservation.email,
      whereYouHeard: reservation.whereYouHeard ? reservation.whereYouHeard : null,
      paymentStatus: null,
      paymentMethod: reservation.paymentMethod
    };

    return redirectToStartPayment(reservationData);
  };

  return (
    <article className={thanksStyles.container}>
      <label className={thanksStyles.reservation__title}>
        <span>{t("reservationDetails.notSuccessful")}</span>
      </label>
      <div style={{ color: "white", paddingLeft: 30, paddingTop: 10 }}>
      {t("reservationDetails.submitPaymentAgain")}
      </div>
      <ReservationSummary reservation={reservation} date={formattedDate} />

      <div className={detailsStyles.margin}>
        <Image src={barion} alt="barion-logo" className={detailsStyles.barion} />
        <div className={reservationStyles.reservation__info}>
          <button
            type="submit"
            className={`${reservationStyles.reservation__button} ${reservationStyles.reservation__orange}`}
            onClick={onSubmit}
          >
            {t("details.finishAndPay")}
          </button>
        </div>
      </div>
    </article>
  );
};

export default memo(Unsuccessful);
