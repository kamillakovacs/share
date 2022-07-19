import React, { FC, memo, useEffect } from "react";
import { useFormikContext } from "formik";
import { useTranslation } from "next-i18next";

import { ReservationWithDetails } from "../lib/validation/validationInterfaces";

import thanksStyles from "../styles/summary.module.scss";

interface Props {
  reservation: ReservationWithDetails;
}

const ReservationSummary: FC<Props> = ({ reservation }) => {
  const { t } = useTranslation("common");

  console.log(reservation);

  return (
    <>
      <div className={thanksStyles.container}>
        <div>Reservation details</div>
        <div>
          - Name: {reservation?.firstName} {reservation?.lastName}
        </div>
        <div>
          - Date:{" "}
          {/* {new Intl.DateTimeFormat("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date(reservation?.date))} */}
        </div>
        <div>- Tubs reserved: {reservation?.numberOfTubs.label}</div>
      </div>
      <div className={thanksStyles.container}>
        <div>The Share Spa Experience</div>
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
        <div className={thanksStyles.total}>
          <div>
            {t("summary.total")} <span className={thanksStyles.vat}>{t("summary.vat")} </span>
          </div>
          {reservation?.price && <div>{`${reservation?.price} ${t("summary.huf")} `}</div>}
        </div>
      </div>
    </>
  );
};

export default memo(ReservationSummary);
