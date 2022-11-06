import React, { FC, memo, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";

import { ReservationWithDetails } from "../lib/validation/validationInterfaces";

import thanksStyles from "../styles/thanks.module.scss";
import { sendThankYouEmail } from "../api/thankYouEmail";
import detailsStyles from "../styles/details.module.scss";

import CalendarCheckIcon from "../../public/assets/calendar-check.svg";
import HeartIcon from "../../public/assets/heart.svg";
import HottubIcon from "../../public/assets/hottub.svg";

interface Props {
  reservation: ReservationWithDetails;
  paymentId: string;
}

const ReservationSummary: FC<Props> = ({ reservation, paymentId }) => {
  const { t } = useTranslation("common");
  const [date, setDate] = useState("");
  const [dateOfPurchase, setDateOfPurchase] = useState("");

  useEffect(() => {
    if (reservation?.date) {
      setDate(
        new Intl.DateTimeFormat("en-US", {
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
        new Intl.DateTimeFormat("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }).format(new Date(reservation?.dateOfPurchase))
      );
    }
  }, [reservation?.date]);

  if (reservation) {
    const emailData = {
      name: `${reservation?.firstName} ${reservation?.lastName}`,
      date,
      dateOfPurchase,
      numberOfTubs: reservation?.numberOfTubs.label,
      totalPrice: reservation?.price,
      paymentId
    };
    sendThankYouEmail(emailData);
  }

  return (
    <article className={thanksStyles.container}>
      <label className={thanksStyles.reservation__title}>
        <span>{t("thanks.thankYou")}</span>
      </label>
      <div className={thanksStyles.reservation}>
        <div className={thanksStyles.navigators}>
          <div className={thanksStyles.verticalLine} />
          <div className={thanksStyles.verticalLine2} />
        </div>
        <div className={thanksStyles.reservation__summary}>
          <div className={thanksStyles.summaryLabel}>
            <div className={thanksStyles.icon}>
              <CalendarCheckIcon />
            </div>
            <label>{t("reservationSummary.reservationDetails")}</label>
          </div>
          <div className={detailsStyles.details}>
            <div className={detailsStyles.details__row}>
              <div>{t("reservationSummary.location")}</div>
              <div>{t("reservationSummary.shareSpa")}</div>
            </div>
            <div className={detailsStyles.details__row}>
              <div>{t("reservationSummary.tubsReserved")}</div>
              <div>{reservation?.numberOfTubs.label}</div>
            </div>
            <div className={detailsStyles.details__row}>
              <div>{t("reservationSummary.date")}</div>
              <div>{date}</div>
            </div>
            <div className={detailsStyles.details__row}>
              <div>{t("reservationSummary.lengthOfStay")}</div>
              <div>{t("reservationSummary.hourAndFifteenMins")}</div>
            </div>
            <div className={detailsStyles.details__row}>
              <div>{t("reservationSummary.totalPrice")}</div>
              <div>
                {reservation?.price} {t("summary.huf")}
              </div>
            </div>
          </div>

          <div className={thanksStyles.summaryLabel}>
            <div className={thanksStyles.icon}>
              <CalendarCheckIcon />
            </div>
            <label>Billing Details</label>
          </div>
          <div className={detailsStyles.details}>
            <div className={detailsStyles.details__row}>
              <div>Name</div>
              <div>
                {reservation?.firstName} {reservation?.lastName}
              </div>
            </div>
            <div className={detailsStyles.details__row}>
              <div>Email</div>
              <div>{reservation?.email}</div>
            </div>
            <div className={detailsStyles.details__row}>
              <div>Phone</div>
              <div>{reservation?.phoneNumber}</div>
            </div>
            <div className={detailsStyles.details__row}>
              <div>Date of Purchase</div>
              <div>{reservation?.dateOfPurchase}</div>
            </div>
            <div className={detailsStyles.details__row}>
              <div>Total price</div>
              <div>{reservation?.price} HUF</div>
            </div>
            <div className={detailsStyles.details__row}>
              <div>Amount paid</div>
              <div></div>
            </div>
            <div className={detailsStyles.details__row}>
              <div>Remaining balance</div>
              <div></div>
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
            <label>{t("reservationSummary.lookForwardToSeeingYou")}</label>
          </div>
        </div>
      </div>
    </article>
  );
};

export default memo(ReservationSummary);
