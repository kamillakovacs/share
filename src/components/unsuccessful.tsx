import React, { FC, memo } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import Image from "next/image";

import { ReservationWithDetails } from "../lib/validation/validationInterfaces";

import * as payment from "../api/paymentRequest";
import thanksStyles from "../styles/thanks.module.scss";
import reservationStyles from "../styles/reservation.module.scss";
import detailsStyles from "../styles/details.module.scss";
import barion from "../../public/assets/barion.png";
import ReservationSummary from "./reservationSummary";

interface Props {
  customerAlreadyInDatabase: boolean;
  reservation: ReservationWithDetails;
}

const Unsuccessful: FC<Props> = ({ customerAlreadyInDatabase, reservation }) => {
  const { t } = useTranslation("common");
  const router = useRouter();

  const redirectToStartPayment = async (reservationData: ReservationWithDetails) =>
    payment.useSendPaymentRequest(reservationData, customerAlreadyInDatabase, router);

  const onSubmit = async () => {
    const reservationData: ReservationWithDetails = {
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
      paymentMethod: reservation.paymentMethod,
      canceled: null,
      communication: {
        reservationEmailSent: reservation.communication.reservationEmailSent,
        receiptSent: reservation.communication.receiptSent,
        rescheduleEmailSentCount: reservation.communication.rescheduleEmailSentCount,
        cancelationEmailSent: reservation.communication.cancelationEmailSent
      }
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
      <ReservationSummary reservation={reservation} date={reservation?.date} />

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
