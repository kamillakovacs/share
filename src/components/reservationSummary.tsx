import { useTranslation } from "react-i18next";
import { FC, memo } from "react";

import detailsStyles from "../styles/details.module.scss";
import { ReservationWithDetails } from "../lib/validation/validationInterfaces";

interface Props {
    reservation: ReservationWithDetails;
    date: string;
  }

const ReservationSummary: FC<Props> = ({ reservation, date }) => {
    const { t } = useTranslation("common");

    return (
        <div className={detailsStyles.details}>
            <div className={detailsStyles.details__row}>
              <div>{t("reservationDetails.location")}</div>
              <div>{t("reservationDetails.shareSpa")}</div>
            </div>
            <div className={detailsStyles.details__row}>
              <div>{t("reservationDetails.tubsReserved")}</div>
              <div>{reservation?.numberOfTubs.label}</div>
            </div>
            <div className={detailsStyles.details__row}>
              <div>{t("reservationDetails.date")}</div>
              <div>{date}</div>
            </div>
            <div className={detailsStyles.details__row}>
              <div>{t("reservationDetails.lengthOfStay")}</div>
              <div>{t("reservationDetails.hourAndFifteenMins")}</div>
            </div>
            <div className={detailsStyles.details__row}>
              <div>{t("reservationDetails.totalPrice")}</div>
              <div>
                {reservation?.price} {t("summary.huf")}
              </div>
            </div>
        </div>
    )
}

export default memo(ReservationSummary);