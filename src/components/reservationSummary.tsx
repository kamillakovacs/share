import React, { FC, memo } from "react";
import { useTranslation } from "next-i18next";

//@ts-ignore
import CalendarCheckIcon from "../../public/assets/calendar.svg";
//@ts-ignore
import HeartIcon from "../../public/assets/heart.svg";
//@ts-ignore
import StarIcon from "../../public/assets/star.svg";
import { ReservationWithDetails } from "../lib/validation/validationInterfaces";

import detailsStyles from "../styles/details.module.scss";
import thanksStyles from "../styles/thanks.module.scss";
import summaryStyles from "../styles/summary.module.scss";

interface Props {
  reservation: ReservationWithDetails;
}

const ReservationSummary: FC<Props> = ({ reservation }) => {
  const { t } = useTranslation("common");

  return (
    <>
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
            <label>Reservation Details</label>
          </div>
          <div className={detailsStyles.details}>
            <div className={detailsStyles.details__row}>
              <div>Location: </div>
              <div>Share Spa, Szarvaskő, Hungary</div>
            </div>
            <div className={detailsStyles.details__row}>
              <div>Tubs reserved:</div>
              <div>{reservation?.numberOfTubs.label}</div>
            </div>
            <div className={detailsStyles.details__row}>
              <div>Date:</div>
              <div>
                {reservation?.date &&
                  new Intl.DateTimeFormat("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(reservation?.date))}
              </div>
            </div>
            <div className={detailsStyles.details__row}>
              <div>Length of stay:</div>
              <div>1 hour 15 minutes</div>
            </div>
            <div className={detailsStyles.details__row}>
              <div>Total price (incl. VAT):</div>
              <div>{reservation?.price} HUF</div>
            </div>
          </div>

          <div className={thanksStyles.summaryLabel}>
            <div className={thanksStyles.icon}>
              <StarIcon />
            </div>
            <label>{t("summary.yourExperience")}</label>
          </div>
          <div className={detailsStyles.details}>
            <div>{t("summary.infraredSauna")}</div>
            <div>{`${t("summary.soakFor")} ${reservation?.numberOfGuests ? reservation?.numberOfGuests.value : 1} ${
              reservation?.numberOfGuests
                ? parseInt(reservation.numberOfGuests.value) > 1
                  ? t("summary.people")
                  : t("summary.person")
                : t("summary.person")
            } in ${reservation?.numberOfTubs ? reservation?.numberOfTubs.value : "1"} ${
              parseInt(reservation?.numberOfTubs ? reservation?.numberOfTubs.value : "1") > 1
                ? t("summary.tubs")
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
            <label>We're looking forward to seeing you</label>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(ReservationSummary);
