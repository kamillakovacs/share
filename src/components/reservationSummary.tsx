import { useTranslation } from "react-i18next";
import { FC, memo, useEffect, useState } from "react";

import detailsStyles from "../styles/details.module.scss";
import { ReservationWithDetails } from "../lib/validation/validationInterfaces";

interface Props {
  reservation: ReservationWithDetails;
  date: string;
}

const ReservationSummary: FC<Props> = ({ reservation, date }) => {
  const { t, i18n } = useTranslation("common");
  const [resDate, setResDate] = useState("");

  useEffect(() => {
    if (date) {
      setResDate(
        new Intl.DateTimeFormat(i18n.language, {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }).format(new Date(date))
      );
    }
  }, [setResDate, date, i18n.language]);

  return (
    <div className={detailsStyles.details}>
      <div className={detailsStyles.details__row}>
        <div className={detailsStyles.details__rowLabel}>{t("reservationDetails.location")}:</div>
        <div>{t("reservationDetails.shareSpa")}</div>
      </div>
      <div className={detailsStyles.details__row}>
        <div className={detailsStyles.details__rowLabel}>{t("reservationDetails.tubsReserved")}:</div>
        <div>{reservation?.numberOfTubs?.label}</div>
      </div>
      <div className={detailsStyles.details__row}>
        <div className={detailsStyles.details__rowLabel}>{t("reservationDetails.date")}:</div>
        <div>{resDate}</div>
      </div>
      <div className={detailsStyles.details__row}>
        <div className={detailsStyles.details__rowLabel}>{t("reservationDetails.lengthOfStay")}:</div>
        <div>{t("reservationDetails.hourAndFifteenMins")}</div>
      </div>
    </div>
  )
}

export default memo(ReservationSummary);